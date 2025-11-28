import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  userType: {
    type: String,
    enum: ['donor', 'recipient', 'charity'],
    required: [true, 'User type is required']
  },
  organization: {
    type: String,
    trim: true,
    maxlength: [200, 'Organization name cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    },
    address: {
      type: String,
      trim: true
    }
  },
  preferences: {
    dietary: [{
      type: String,
      enum: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free', 'halal', 'kosher']
    }],
    notifications: {
      type: Boolean,
      default: true
    },
    maxDistance: {
      type: Number,
      default: 5,
      min: 1,
      max: 25
    }
  },
  stats: {
    foodShared: {
      type: Number,
      default: 0
    },
    foodReceived: {
      type: Number,
      default: 0
    },
    co2Saved: {
      type: Number,
      default: 0
    },
    mealsProvided: {
      type: Number,
      default: 0
    }
  },
  verified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
})

// Create geospatial index for location-based queries
userSchema.index({ location: '2dsphere' })

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next()
  }
  
  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

// Update stats method
userSchema.methods.updateStats = async function(type, value = 1) {
  if (this.stats[type] !== undefined) {
    this.stats[type] += value
    await this.save()
  }
}

const User = mongoose.model('User', userSchema)

export default User