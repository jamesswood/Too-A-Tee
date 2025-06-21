const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const Design = require('../models/Design');
const User = require('../models/User');

const router = express.Router();

// Create a new design
router.post('/', authenticateToken, [
  body('name').isString().trim().isLength({ min: 1, max: 100 }),
  body('description').optional().isString().trim().isLength({ max: 500 }),
  body('elements').isArray(),
  body('tshirtColor').optional().isString(),
  body('tshirtSize').optional().isString(),
  body('previewImage').optional().isURL(),
  body('isPublic').optional().isBoolean(),
  body('tags').optional().isArray()
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

    const designData = {
      userId: req.user.uid,
      ...req.body
    };

    const newDesign = await Design.createDesign(designData);
    
    // Increment user's designs created stat
    await User.incrementStats(req.user.uid, 'designsCreated');

    res.status(201).json({
      success: true,
      message: 'Design created successfully',
      data: newDesign
    });
  } catch (error) {
    console.error('Error creating design:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create design'
    });
  }
});

// Get design by ID
router.get('/:designId', optionalAuth, async (req, res) => {
  try {
    const { designId } = req.params;
    const design = await Design.getDesignById(designId);
    
    if (!design) {
      return res.status(404).json({
        error: 'Design not found',
        message: 'The requested design does not exist'
      });
    }

    // Check if user can view this design
    if (!design.isPublic && design.userId !== req.user?.uid) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have permission to view this design'
      });
    }

    // Increment view count if user is authenticated
    if (req.user && req.user.uid !== design.userId) {
      await Design.incrementStats(designId, 'views');
    }

    // Check if user liked this design
    let isLiked = false;
    if (req.user) {
      isLiked = await Design.isLikedByUser(designId, req.user.uid);
    }

    res.json({
      success: true,
      data: {
        ...design,
        isLiked
      }
    });
  } catch (error) {
    console.error('Error getting design:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve design'
    });
  }
});

// Update design
router.put('/:designId', authenticateToken, [
  body('name').optional().isString().trim().isLength({ min: 1, max: 100 }),
  body('description').optional().isString().trim().isLength({ max: 500 }),
  body('elements').optional().isArray(),
  body('tshirtColor').optional().isString(),
  body('tshirtSize').optional().isString(),
  body('previewImage').optional().isURL(),
  body('isPublic').optional().isBoolean(),
  body('tags').optional().isArray(),
  body('status').optional().isIn(['draft', 'published', 'archived'])
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

    const { designId } = req.params;
    const design = await Design.getDesignById(designId);
    
    if (!design) {
      return res.status(404).json({
        error: 'Design not found',
        message: 'The requested design does not exist'
      });
    }

    if (design.userId !== req.user.uid) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have permission to update this design'
      });
    }

    const updatedDesign = await Design.updateDesign(designId, req.body);

    res.json({
      success: true,
      message: 'Design updated successfully',
      data: updatedDesign
    });
  } catch (error) {
    console.error('Error updating design:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update design'
    });
  }
});

// Delete design
router.delete('/:designId', authenticateToken, async (req, res) => {
  try {
    const { designId } = req.params;
    
    await Design.deleteDesign(designId, req.user.uid);

    res.json({
      success: true,
      message: 'Design deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting design:', error);
    
    if (error.message === 'Design not found') {
      return res.status(404).json({
        error: 'Design not found',
        message: 'The requested design does not exist'
      });
    }
    
    if (error.message === 'Unauthorized to delete this design') {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have permission to delete this design'
      });
    }

    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete design'
    });
  }
});

// Get user's designs
router.get('/user/my-designs', authenticateToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    const status = req.query.status || null;

    const designs = await Design.getUserDesigns(req.user.uid, limit, offset, status);

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

// Get public designs
router.get('/public/featured', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    const category = req.query.category || null;

    const designs = await Design.getPublicDesigns(limit, offset, category);

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
    console.error('Error getting public designs:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve public designs'
    });
  }
});

// Search designs
router.get('/search', async (req, res) => {
  try {
    const { q: searchTerm } = req.query;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    if (!searchTerm) {
      return res.status(400).json({
        error: 'Search term required',
        message: 'Please provide a search term'
      });
    }

    const designs = await Design.searchDesigns(searchTerm, limit, offset);

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
    console.error('Error searching designs:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to search designs'
    });
  }
});

// Like/unlike design
router.post('/:designId/like', authenticateToken, async (req, res) => {
  try {
    const { designId } = req.params;
    const design = await Design.getDesignById(designId);
    
    if (!design) {
      return res.status(404).json({
        error: 'Design not found',
        message: 'The requested design does not exist'
      });
    }

    if (!design.isPublic && design.userId !== req.user.uid) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have permission to like this design'
      });
    }

    const result = await Design.toggleLike(designId, req.user.uid);

    res.json({
      success: true,
      message: result.liked ? 'Design liked successfully' : 'Design unliked successfully',
      data: result
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to toggle like'
    });
  }
});

// Duplicate design
router.post('/:designId/duplicate', authenticateToken, async (req, res) => {
  try {
    const { designId } = req.params;
    
    const duplicatedDesign = await Design.duplicateDesign(designId, req.user.uid);

    res.status(201).json({
      success: true,
      message: 'Design duplicated successfully',
      data: duplicatedDesign
    });
  } catch (error) {
    console.error('Error duplicating design:', error);
    
    if (error.message === 'Design not found') {
      return res.status(404).json({
        error: 'Design not found',
        message: 'The requested design does not exist'
      });
    }
    
    if (error.message === 'Cannot duplicate private design') {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You cannot duplicate this private design'
      });
    }

    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to duplicate design'
    });
  }
});

// Get design categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Design.getCategories();

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve categories'
    });
  }
});

module.exports = router; 