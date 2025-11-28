import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, authorization denied'
      })
    }

    // Extract token
    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Check if user still exists
    const user = await User.findById(decoded.userId)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found, authorization denied'
      })
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account deactivated, authorization denied'
      })
    }

    // Add user info to request
    req.user = {
      userId: decoded.userId,
      userType: user.userType,
      verified: user.verified
    }

    next()

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token, authorization denied'
      })
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired, authorization denied'
      })
    }

    console.error('Auth middleware error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    })
  }
}

export default auth