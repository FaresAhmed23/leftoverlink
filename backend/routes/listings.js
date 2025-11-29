import express from "express";
import { body, validationResult, query } from "express-validator";
import Listing from "../models/Listing.js";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/listings
// @desc    Get all listings with filters
// @access  Public
router.get(
  "/",
  [
    query("lat")
      .optional()
      .isFloat({ min: -90, max: 90 })
      .withMessage("Invalid latitude"),
    query("lng")
      .optional()
      .isFloat({ min: -180, max: 180 })
      .withMessage("Invalid longitude"),
    query("radius")
      .optional()
      .isFloat({ min: 0.1, max: 100 })
      .withMessage("Radius must be between 0.1 and 100 km"),
    query("category")
      .optional()
      .isIn([
        "prepared_food",
        "baked_goods",
        "produce",
        "packaged_food",
        "beverages",
      ]),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be at least 1"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Invalid query parameters",
          errors: errors.array(),
        });
      }

      const {
        lat,
        lng,
        radius = 10,
        category,
        search,
        limit = 20,
        page = 1,
      } = req.query;
      const skip = (page - 1) * limit;

      let listings;

      if (lat && lng) {
        // Location-based search
        const filters = {};
        if (category) filters.category = category;
        if (search) {
          filters.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { donorName: { $regex: search, $options: "i" } },
          ];
        }

        listings = await Listing.findNearby(
          [parseFloat(lng), parseFloat(lat)],
          radius * 1000, // Convert km to meters
          filters
        )
          .skip(skip)
          .limit(parseInt(limit));
      } else {
        // Regular search without location
        const filters = {
          status: "available",
          expiryTime: { $gt: new Date() },
        };

        if (category) filters.category = category;
        if (search) {
          filters.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { donorName: { $regex: search, $options: "i" } },
          ];
        }

        listings = await Listing.find(filters)
          .populate("donor", "name organization verified")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit));
      }

      // Add computed fields
      const enrichedListings = listings.map((listing) => ({
        ...(listing.toObject ? listing.toObject() : listing),
        timeRemaining: listing.getTimeRemaining
          ? listing.getTimeRemaining()
          : null,
        urgencyLevel: listing.getUrgencyLevel
          ? listing.getUrgencyLevel()
          : null,
        isAvailable: listing.isAvailable ? listing.isAvailable() : true,
      }));

      res.json({
        success: true,
        count: enrichedListings.length,
        data: enrichedListings,
      });
    } catch (error) {
      console.error("Get listings error:", error);
      res.status(500).json({
        success: false,
        message: "Error retrieving listings",
      });
    }
  }
);

// @route   GET /api/listings/:id
// @desc    Get single listing by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate("donor", "name organization verified")
      .populate("claims.user", "name userType");

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    // Increment view count
    listing.views += 1;
    await listing.save();

    res.json({
      success: true,
      data: {
        ...listing.toObject(),
        timeRemaining: listing.getTimeRemaining(),
        urgencyLevel: listing.getUrgencyLevel(),
        isAvailable: listing.isAvailable(),
      },
    });
  } catch (error) {
    console.error("Get listing error:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving listing",
    });
  }
});

// @route   POST /api/listings
// @desc    Create new listing
// @access  Private (donors only)
router.post(
  "/",
  [
    auth,
    // RELAXED VALIDATION RULES:
    body("title")
      .trim()
      .isLength({ min: 3, max: 200 })
      .withMessage("Title must be 3-200 characters"),
    body("description")
      .trim()
      .isLength({ min: 3, max: 1000 })
      .withMessage("Description must be 3-1000 characters"),
    body("category").isIn([
      "prepared_food",
      "baked_goods",
      "produce",
      "packaged_food",
      "beverages",
    ]),
    body("quantity").trim().notEmpty().withMessage("Quantity is required"),
    body("expiryTime").isISO8601().withMessage("Valid expiry time is required"),
    // Ensure coordinates are validated as numeric
    body("location.coordinates")
      .isArray({ min: 2, max: 2 })
      .withMessage("Valid coordinates required"),
    body("location.coordinates.*")
      .isFloat()
      .withMessage("Coordinates must be numbers"),
    // Relaxed address length to 2 characters
    body("location.address")
      .trim()
      .isLength({ min: 2, max: 300 })
      .withMessage("Address must be valid"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // LOG THE ERROR TO CONSOLE SO YOU CAN SEE IT
        console.log("Validation Errors:", errors.array());

        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      // Check if user is a donor
      if (req.user.userType !== "donor") {
        return res.status(403).json({
          success: false,
          message: "Only donors can create food listings",
        });
      }

      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Validate expiry time is in future
      const expiryTime = new Date(req.body.expiryTime);
      if (expiryTime <= new Date()) {
        return res.status(400).json({
          success: false,
          message: "Expiry time must be in the future",
        });
      }

      const listingData = {
        ...req.body,
        // EXPLICITLY SET LOCATION TYPE
        location: {
          ...req.body.location,
          type: "Point",
        },
        donor: user._id,
        donorName: user.organization || user.name,
        expiryTime,
        verified: user.verified,
      };

      const listing = new Listing(listingData);
      await listing.save();

      // Update user stats
      await user.updateStats("foodShared");

      res.status(201).json({
        success: true,
        message: "Listing created successfully",
        data: listing,
      });
    } catch (error) {
      console.error("Create listing error:", error);
      res.status(500).json({
        success: false,
        message: "Error creating listing",
      });
    }
  }
);

// @route   PUT /api/listings/:id
// @desc    Update listing
// @access  Private (owner only)
router.put(
  "/:id",
  [
    auth,
    body("title").optional().trim().isLength({ min: 5, max: 200 }),
    body("description").optional().trim().isLength({ min: 10, max: 1000 }),
    body("quantity").optional().trim().isLength({ min: 1, max: 100 }),
    body("expiryTime").optional().isISO8601(),
    body("pickupInstructions").optional().trim().isLength({ max: 500 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const listing = await Listing.findById(req.params.id);
      if (!listing) {
        return res.status(404).json({
          success: false,
          message: "Listing not found",
        });
      }

      // Check ownership
      if (listing.donor.toString() !== req.user.userId) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to update this listing",
        });
      }

      // Don't allow updates to expired or completed listings
      if (["expired", "completed"].includes(listing.status)) {
        return res.status(400).json({
          success: false,
          message: "Cannot update expired or completed listings",
        });
      }

      const allowedUpdates = [
        "title",
        "description",
        "quantity",
        "expiryTime",
        "pickupInstructions",
        "allergens",
      ];
      const updates = {};

      for (const field of allowedUpdates) {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      }

      // Validate expiry time if being updated
      if (updates.expiryTime) {
        const newExpiryTime = new Date(updates.expiryTime);
        if (newExpiryTime <= new Date()) {
          return res.status(400).json({
            success: false,
            message: "Expiry time must be in the future",
          });
        }
      }

      const updatedListing = await Listing.findByIdAndUpdate(
        req.params.id,
        { $set: updates },
        { new: true, runValidators: true }
      ).populate("donor", "name organization verified");

      res.json({
        success: true,
        message: "Listing updated successfully",
        data: {
          ...updatedListing.toObject(),
          timeRemaining: updatedListing.getTimeRemaining(),
          urgencyLevel: updatedListing.getUrgencyLevel(),
        },
      });
    } catch (error) {
      console.error("Update listing error:", error);
      res.status(500).json({
        success: false,
        message: "Error updating listing",
      });
    }
  }
);

// @route   POST /api/listings/:id/claim
// @desc    Claim a listing
// @access  Private
router.post(
  "/:id/claim",
  [
    auth,
    body("message")
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage("Message cannot exceed 200 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const listing = await Listing.findById(req.params.id);
      if (!listing) {
        return res.status(404).json({
          success: false,
          message: "Listing not found",
        });
      }

      // Check if listing is available
      if (!listing.isAvailable()) {
        return res.status(400).json({
          success: false,
          message: "Listing is no longer available",
        });
      }

      // Check if user is the donor
      if (listing.donor.toString() === req.user.userId) {
        return res.status(400).json({
          success: false,
          message: "Cannot claim your own listing",
        });
      }

      // Check if user has already claimed this listing
      const existingClaim = listing.claims.find(
        (claim) => claim.user.toString() === req.user.userId
      );

      if (existingClaim) {
        return res.status(400).json({
          success: false,
          message: "You have already claimed this listing",
        });
      }

      // Add claim
      listing.claims.push({
        user: req.user.userId,
        message: req.body.message || "",
        status: "pending",
      });

      await listing.save();

      res.json({
        success: true,
        message: "Listing claimed successfully! The donor will be notified.",
      });
    } catch (error) {
      console.error("Claim listing error:", error);
      res.status(500).json({
        success: false,
        message: "Error claiming listing",
      });
    }
  }
);

// @route   DELETE /api/listings/:id
// @desc    Delete listing
// @access  Private (owner only)
router.delete("/:id", auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    // Check ownership
    if (listing.donor.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this listing",
      });
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Listing deleted successfully",
    });
  } catch (error) {
    console.error("Delete listing error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting listing",
    });
  }
});

export default router;
