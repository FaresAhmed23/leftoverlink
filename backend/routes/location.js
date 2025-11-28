import express from 'express'
import { body, validationResult } from 'express-validator'
import User from '../models/User.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// @route   PUT /api/location
// @desc    Update user location
// @access  Private
router.put('/', [
  auth,
  body('coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Coordinates must be an array of [longitude, latitude]'),
  body('coordinates.*')
    .isFloat()
    .withMessage('Coordinates must be valid numbers'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Address cannot exceed 300 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { coordinates, address } = req.body
    const [lng, lat] = coordinates

    // Validate coordinate ranges
    if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates. Longitude must be between -180 and 180, latitude between -90 and 90'
      })
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        $set: {
          'location.coordinates': coordinates,
          'location.address': address || ''
        }
      },
      { new: true }
    )

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      message: 'Location updated successfully',
      location: user.location
    })

  } catch (error) {
    console.error('Update location error:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating location'
    })
  }
})

// @route   GET /api/location/geocode
// @desc    Geocode an address (if Google Maps API is configured)
// @access  Private
router.get('/geocode', auth, async (req, res) => {
  try {
    const { address } = req.query

    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'Address is required'
      })
    }

    // This is a placeholder for Google Maps Geocoding API
    // In a real implementation, you would use the Google Maps API
    if (!process.env.GOOGLE_MAPS_API_KEY) {
      return res.status(501).json({
        success: false,
        message: 'Geocoding service not configured'
      })
    }

    // Example implementation with Google Maps API would go here
    // For now, return a placeholder response
    res.json({
      success: true,
      message: 'Geocoding service not fully implemented',
      data: {
        address,
        coordinates: [0, 0], // [lng, lat]
        formattedAddress: address
      }
    })

  } catch (error) {
    console.error('Geocoding error:', error)
    res.status(500).json({
      success: false,
      message: 'Error geocoding address'
    })
  }
})

// @route   GET /api/location/nearby
// @desc    Get nearby users or listings
// @access  Private
router.get('/nearby', auth, async (req, res) => {
  try {
    const { lat, lng, radius = 10, type = 'users' } = req.query

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      })
    }

    const coordinates = [parseFloat(lng), parseFloat(lat)]
    const maxDistance = parseFloat(radius) * 1000 // Convert km to meters

    if (type === 'users') {
      // Find nearby users
      const nearbyUsers = await User.aggregate([
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
              _id: { $ne: req.user.userId }, // Exclude current user
              isActive: true,
              'location.coordinates': { $ne: [0, 0] } // Exclude users without location
            }
          }
        },
        {
          $project: {
            name: 1,
            userType: 1,
            organization: 1,
            verified: 1,
            distance: 1,
            'location.address': 1
          }
        },
        {
          $limit: 50
        }
      ])

      res.json({
        success: true,
        count: nearbyUsers.length,
        data: nearbyUsers.map(user => ({
          ...user,
          distanceInKm: Math.round(user.distance / 100) / 10 // Convert to km with 1 decimal
        }))
      })

    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid type. Currently only "users" is supported.'
      })
    }

  } catch (error) {
    console.error('Nearby search error:', error)
    res.status(500).json({
      success: false,
      message: 'Error searching nearby locations'
    })
  }
})

export default router