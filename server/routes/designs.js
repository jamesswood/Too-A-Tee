const express = require('express');
const { body, validationResult } = require('express-validator');
const Design = require('../models/Design');

const router = express.Router();

// Create a new design
router.post('/', [
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
      userId: 'anonymous',
      ...req.body
    };

    const newDesign = await Design.createDesign(designData);

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
router.get('/:designId', async (req, res) => {
  try {
    const { designId } = req.params;
    const design = await Design.getDesignById(designId);
    
    if (!design) {
      return res.status(404).json({
        error: 'Design not found',
        message: 'The requested design does not exist'
      });
    }

    // For now, only show public designs
    if (!design.isPublic) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'This design is private'
      });
    }

    res.json({
      success: true,
      data: {
        ...design,
        isLiked: false
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
router.put('/:designId', [
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

    // For now, allow updates to anonymous designs
    if (design.userId !== 'anonymous') {
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
router.delete('/:designId', async (req, res) => {
  try {
    const { designId } = req.params;
    
    await Design.deleteDesign(designId, 'anonymous');

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

// Get user's designs (simplified for now)
router.get('/user/my-designs', async (req, res) => {
  try {
    // For now, return empty array since we're not tracking users
    res.json({
      success: true,
      data: [],
      pagination: {
        limit: 20,
        offset: 0,
        total: 0
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

// Get all public designs
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'desc';
    const category = req.query.category || null;
    const search = req.query.search || null;

    const designs = await Design.getPublicDesigns(limit, offset, sortBy, sortOrder, category, search);

    res.json({
      success: true,
      data: designs,
      pagination: {
        limit,
        offset,
        total: designs.length
      }
    });
  } catch (error) {
    console.error('Error getting designs:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve designs'
    });
  }
});

// Like a design (simplified for now)
router.post('/:designId/like', async (req, res) => {
  try {
    const { designId } = req.params;
    
    // For now, just return success without actually liking
    res.json({
      success: true,
      message: 'Design liked successfully'
    });
  } catch (error) {
    console.error('Error liking design:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to like design'
    });
  }
});

// Duplicate a design
router.post('/:designId/duplicate', async (req, res) => {
  try {
    const { designId } = req.params;
    const originalDesign = await Design.getDesignById(designId);
    
    if (!originalDesign) {
      return res.status(404).json({
        error: 'Design not found',
        message: 'The requested design does not exist'
      });
    }

    if (!originalDesign.isPublic) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Cannot duplicate private design'
      });
    }

    const duplicatedDesign = await Design.duplicateDesign(designId, 'anonymous');

    res.status(201).json({
      success: true,
      message: 'Design duplicated successfully',
      data: duplicatedDesign
    });
  } catch (error) {
    console.error('Error duplicating design:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to duplicate design'
    });
  }
});

module.exports = router; 