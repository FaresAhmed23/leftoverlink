import mongoose from 'mongoose'

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    enum: ['prepared_food', 'baked_goods', 'produce', 'packaged_food', 'beverages'],
    required: [true, 'Category is required']
  },
  quantity: {
    type: String,
    required: [true, 'Quantity is required'],
    trim: true,
    maxlength: [100, 'Quantity cannot exceed 100 characters']
  },
  expiryTime: {
    type: Date,
    required: [true, 'Expiry time is required'],
    validate: {
      validator: function(value) {
        return value > new Date()
      },
      message: 'Expiry time must be in the future'
    }
  },
  allergens: [{
    type: String,
    enum: ['gluten', 'dairy', 'nuts', 'eggs', 'soy', 'shellfish', 'fish', 'sesame']
  }],
  pickupInstructions: {
    type: String,
    trim: true,
    maxlength: [500, 'Pickup instructions cannot exceed 500 characters']
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function(coords) {
          return coords.length === 2 && 
                 coords[0] >= -180 && coords[0] <= 180 && 
                 coords[1] >= -90 && coords[1] <= 90
        },
        message: 'Invalid coordinates'
      }
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
      maxlength: [300, 'Address cannot exceed 300 characters']
    }
  },
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  donorName: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['available', 'claimed', 'completed', 'expired'],
    default: 'available'
  },
  claims: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    claimedAt: {
      type: Date,
      default: Date.now
    },
    message: {
      type: String,
      trim: true,
      maxlength: [200, 'Message cannot exceed 200 characters']
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed'],
      default: 'pending'
    }
  }],
  images: [{
    url: String,
    publicId: String
  }],
  verified: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
})

// Create geospatial index for location-based queries
listingSchema.index({ location: '2dsphere' })
listingSchema.index({ status: 1, expiryTime: 1 })
listingSchema.index({ donor: 1, createdAt: -1 })
listingSchema.index({ category: 1, status: 1 })

// Automatically expire listings
listingSchema.index({ expiryTime: 1 }, { expireAfterSeconds: 0 })

// Pre-save middleware to update status based on expiry
listingSchema.pre('save', function(next) {
  if (this.expiryTime < new Date() && this.status === 'available') {
    this.status = 'expired'
  }
  next()
})

// Method to check if listing is available
listingSchema.methods.isAvailable = function() {
  return this.status === 'available' && this.expiryTime > new Date()
}

// Method to calculate time remaining
listingSchema.methods.getTimeRemaining = function() {
  const now = new Date()
  const diff = this.expiryTime - now
  
  if (diff <= 0) return 'Expired'
  
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours > 0) return `${hours}h ${minutes}m remaining`
  return `${minutes}m remaining`
}

// Method to get urgency level
listingSchema.methods.getUrgencyLevel = function() {
  const now = new Date()
  const diff = this.expiryTime - now
  const hours = diff / (1000 * 60 * 60)
  
  if (hours < 1) return 'urgent'
  if (hours < 3) return 'moderate'
  return 'good'
}

// Static method to find nearby listings
listingSchema.statics.findNearby = function(coordinates, maxDistance = 10000, filters = {}) {
  return this.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: coordinates
        },
        distanceField: 'distance',
        maxDistance: maxDistance,
        spherical: true,
        query: {
          status: 'available',
          expiryTime: { $gt: new Date() },
          ...filters
        }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'donor',
        foreignField: '_id',
        as: 'donorInfo',
        pipeline: [
          { $project: { name: 1, organization: 1, verified: 1 } }
        ]
      }
    },
    {
      $addFields: {
        donorInfo: { $arrayElemAt: ['$donorInfo', 0] },
        distanceInMiles: { $round: [{ $divide: ['$distance', 1609.34] }, 1] }
      }
    },
    {
      $sort: { distance: 1, expiryTime: 1 }
    }
  ])
}

const Listing = mongoose.model('Listing', listingSchema)

export default Listing