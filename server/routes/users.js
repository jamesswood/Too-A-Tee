const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, requireEmailVerification } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.getUserByUid(req.user.uid);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User profile does not exist'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve user profile'
    });
  }
});

// Update user profile
router.put('/profile', [
  body('profile.firstName').optional().isString().trim().isLength({ min: 1, max: 50 }),
  body('profile.lastName').optional().isString().trim().isLength({ min: 1, max: 50 }),
  body('profile.phone').optional().isMobilePhone(),
  body('profile.address.street').optional().isString().trim(),
  body('profile.address.city').optional().isString().trim(),
  body('profile.address.state').optional().isString().trim(),
  body('profile.address.zipCode').optional().isString().trim(),
  body('profile.address.country').optional().isString().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Please check your input data',
        details: errors.array()
      });
    }

    const updatedUser = await User.updateProfile(req.user.uid, req.body.profile);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update user profile'
    });
  }
});

// Update user preferences
router.put('/preferences', [
  body('theme').optional().isIn(['light', 'dark']),
  body('notifications').optional().isBoolean(),
  body('language').optional().isIn(['en', 'es', 'fr', 'de'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Please check your input data',
        details: errors.array()
      });
    }

    const updatedUser = await User.updatePreferences(req.user.uid, req.body);

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: updatedUser.preferences
    });
  } catch (error) {
    console.error('Error updating user preferences:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update user preferences'
    });
  }
});

// Get user's designs
router.get('/designs', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const designs = await User.getUserDesigns(req.user.uid, limit, offset);

    res.json({
      success: true,
      data: designs,
      pagination: {
        limit,
        offset,
        count: designs.length
      }
    });
  } catch (error) {
    console.error('Error getting user designs:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve user designs'
    });
  }
});

// Get user's orders
router.get('/orders', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const orders = await User.getUserOrders(req.user.uid, limit, offset);

    res.json({
      success: true,
      data: orders,
      pagination: {
        limit,
        offset,
        count: orders.length
      }
    });
  } catch (error) {
    console.error('Error getting user orders:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve user orders'
    });
  }
});

// Delete user account (requires email verification)
router.delete('/account', requireEmailVerification, async (req, res) => {
  try {
    await User.deleteUser(req.user.uid);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user account:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete user account'
    });
  }
});

module.exports = router; 