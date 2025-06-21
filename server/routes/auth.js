const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Create user profile after Firebase authentication
router.post('/create-profile', authenticateToken, async (req, res) => {
  try {
    // Check if user profile already exists
    const existingUser = await User.getUserByUid(req.user.uid);
    
    if (existingUser) {
      return res.status(400).json({
        error: 'Profile already exists',
        message: 'User profile has already been created'
      });
    }

    // Create new user profile
    const userData = {
      uid: req.user.uid,
      email: req.user.email,
      name: req.user.name,
      picture: req.user.picture
    };

    const newUser = await User.createUser(userData);

    res.status(201).json({
      success: true,
      message: 'User profile created successfully',
      data: newUser
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create user profile'
    });
  }
});

// Get current user info (for checking if profile exists)
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.getUserByUid(req.user.uid);
    
    res.json({
      success: true,
      data: {
        uid: req.user.uid,
        email: req.user.email,
        emailVerified: req.user.emailVerified,
        name: req.user.name,
        picture: req.user.picture,
        profileExists: !!user,
        profile: user
      }
    });
  } catch (error) {
    console.error('Error getting user info:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve user information'
    });
  }
});

// Verify email verification status
router.get('/verify-email', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        emailVerified: req.user.emailVerified,
        email: req.user.email
      }
    });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to verify email status'
    });
  }
});

// Logout (client-side token removal)
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // Note: Firebase handles token invalidation on the client side
    // This endpoint is mainly for logging purposes
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process logout'
    });
  }
});

// Refresh token (if needed for custom token management)
router.post('/refresh-token', authenticateToken, async (req, res) => {
  try {
    // Firebase handles token refresh automatically
    // This endpoint can be used for custom token management if needed
    
    res.json({
      success: true,
      message: 'Token is valid',
      data: {
        uid: req.user.uid,
        email: req.user.email
      }
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to refresh token'
    });
  }
});

module.exports = router; 