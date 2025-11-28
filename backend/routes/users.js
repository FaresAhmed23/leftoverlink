import express from 'express'
import User from '../models/User.js'
import Listing from '../models/Listing.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Get detailed statistics
    const userListings = await Listing.countDocuments({ donor: user._id })
    const activeListing = await Listing.countDocuments({ 
      donor: user._id, 
      status: 'available' 
    })
    const completedListings = await Listing.countDocuments({ 
      donor: user._id, 
      status: 'completed' 
    })

    // Get claims made by this user
    const claimsMade = await Listing.countDocuments({ 
      'claims.user': user._id 
    })

    res.json({
      success: true,
      data: {
        ...user.stats,
        totalListings: userListings,
        activeListings: activeListing,
        completedListings: completedListings,
        claimsMade: claimsMade,
        memberSince: user.createdAt
      }
    })

  } catch (error) {
    console.error('Get stats error:', error)
    res.status(500).json({
      success: false,
      message: 'Error retrieving statistics'
    })
  }
})

// @route   GET /api/users/listings
// @desc    Get current user's listings
// @access  Private
router.get('/listings', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query
    const skip = (page - 1) * limit

    const filter = { donor: req.user.userId }
    if (status) {
      filter.status = status
    }

    const listings = await Listing.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('claims.user', 'name userType')

    const total = await Listing.countDocuments(filter)

    // Add computed fields
    const enrichedListings = listings.map(listing => ({
      ...listing.toObject(),
      timeRemaining: listing.getTimeRemaining(),
      urgencyLevel: listing.getUrgencyLevel(),
      isAvailable: listing.isAvailable(),
      claimsCount: listing.claims.length
    }))

    res.json({
      success: true,
      count: enrichedListings.length,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: enrichedListings
    })

  } catch (error) {
    console.error('Get user listings error:', error)
    res.status(500).json({
      success: false,
      message: 'Error retrieving your listings'
    })
  }
})

// @route   GET /api/users/claims
// @desc    Get current user's claims
// @access  Private
router.get('/claims', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query
    const skip = (page - 1) * limit

    const matchStage = {
      'claims.user': req.user.userId
    }

    if (status) {
      matchStage['claims.status'] = status
    }

    const listings = await Listing.aggregate([
      { $match: matchStage },
      { $unwind: '$claims' },
      { $match: { 'claims.user': req.user.userId } },
      {
        $lookup: {
          from: 'users',
          localField: 'donor',
          foreignField: '_id',
          as: 'donorInfo',
          pipeline: [{ $project: { name: 1, organization: 1, verified: 1 } }]
        }
      },
      {
        $addFields: {
          donorInfo: { $arrayElemAt: ['$donorInfo', 0] }
        }
      },
      { $sort: { 'claims.claimedAt': -1 } },
      { $skip: skip },
      { $limit: parseInt(limit) }
    ])

    res.json({
      success: true,
      count: listings.length,
      data: listings.map(item => ({
        listingId: item._id,
        title: item.title,
        description: item.description,
        category: item.category,
        location: item.location,
        donorInfo: item.donorInfo,
        claim: item.claims,
        listingStatus: item.status,
        expiryTime: item.expiryTime
      }))
    })

  } catch (error) {
    console.error('Get user claims error:', error)
    res.status(500).json({
      success: false,
      message: 'Error retrieving your claims'
    })
  }
})

export default router