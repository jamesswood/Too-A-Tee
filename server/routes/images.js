const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const ImageService = require('../services/imageService');

const router = express.Router();

// Configure multer for image uploads
const upload = ImageService.configureMulter();

// Upload single image
router.post('/upload', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No image provided',
        message: 'Please select an image to upload'
      });
    }

    const uploadResult = await ImageService.uploadImage(req.file, 'uploads', req.user.uid);

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: uploadResult
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({
      error: 'Upload failed',
      message: 'Failed to upload image'
    });
  }
});

// Upload multiple images
router.post('/upload-multiple', authenticateToken, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: 'No images provided',
        message: 'Please select at least one image to upload'
      });
    }

    const uploadPromises = req.files.map(file => 
      ImageService.uploadImage(file, 'uploads', req.user.uid)
    );

    const uploadResults = await Promise.all(uploadPromises);

    res.status(201).json({
      success: true,
      message: `${uploadResults.length} images uploaded successfully`,
      data: uploadResults
    });
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    res.status(500).json({
      error: 'Upload failed',
      message: 'Failed to upload images'
    });
  }
});

// Upload design image
router.post('/design', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No image provided',
        message: 'Please select an image to upload'
      });
    }

    const { designId } = req.body;
    if (!designId) {
      return res.status(400).json({
        error: 'Design ID required',
        message: 'Please provide a design ID'
      });
    }

    const uploadResult = await ImageService.uploadDesignImage(req.file, req.user.uid, designId);

    res.status(201).json({
      success: true,
      message: 'Design image uploaded successfully',
      data: uploadResult
    });
  } catch (error) {
    console.error('Error uploading design image:', error);
    res.status(500).json({
      error: 'Upload failed',
      message: 'Failed to upload design image'
    });
  }
});

// Upload user avatar
router.post('/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No avatar provided',
        message: 'Please select an image for your avatar'
      });
    }

    const uploadResult = await ImageService.uploadAvatar(req.file, req.user.uid);

    res.status(201).json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: uploadResult
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({
      error: 'Upload failed',
      message: 'Failed to upload avatar'
    });
  }
});

// Delete image
router.delete('/:fileName', authenticateToken, async (req, res) => {
  try {
    const { fileName } = req.params;
    
    // Decode the fileName from URL
    const decodedFileName = decodeURIComponent(fileName);
    
    const result = await ImageService.deleteImage(decodedFileName);

    res.json({
      success: true,
      message: 'Image deleted successfully',
      data: result
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({
      error: 'Delete failed',
      message: 'Failed to delete image'
    });
  }
});

// Get image metadata
router.get('/metadata/:fileName', authenticateToken, async (req, res) => {
  try {
    const { fileName } = req.params;
    const decodedFileName = decodeURIComponent(fileName);
    
    const metadata = await ImageService.getImageMetadata(decodedFileName);

    res.json({
      success: true,
      data: metadata
    });
  } catch (error) {
    console.error('Error getting image metadata:', error);
    res.status(500).json({
      error: 'Failed to get metadata',
      message: 'Failed to retrieve image metadata'
    });
  }
});

// Generate signed URL for private images
router.post('/signed-url', authenticateToken, async (req, res) => {
  try {
    const { fileName, expirationMinutes = 60 } = req.body;
    
    if (!fileName) {
      return res.status(400).json({
        error: 'File name required',
        message: 'Please provide a file name'
      });
    }

    const signedUrl = await ImageService.generateSignedUrl(fileName, expirationMinutes);

    res.json({
      success: true,
      data: {
        signedUrl,
        expiresIn: expirationMinutes
      }
    });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    res.status(500).json({
      error: 'Failed to generate signed URL',
      message: 'Failed to generate signed URL for image'
    });
  }
});

// List user's images
router.get('/my-images', authenticateToken, async (req, res) => {
  try {
    const { folder = 'uploads', limit = 50 } = req.query;
    const userFolder = `${folder}/${req.user.uid}`;
    
    const images = await ImageService.listImages(userFolder, parseInt(limit));

    res.json({
      success: true,
      data: images,
      pagination: {
        limit: parseInt(limit),
        count: images.length
      }
    });
  } catch (error) {
    console.error('Error listing user images:', error);
    res.status(500).json({
      error: 'Failed to list images',
      message: 'Failed to retrieve user images'
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        message: 'File size must be less than 10MB'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Too many files',
        message: 'Maximum 10 files allowed per upload'
      });
    }
  }
  
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({
      error: 'Invalid file type',
      message: 'Only image files (JPEG, PNG, GIF, WebP) are allowed'
    });
  }

  next(error);
});

module.exports = router; 