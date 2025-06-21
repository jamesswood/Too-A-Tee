const express = require('express');
const ImageService = require('../services/imageService');

const router = express.Router();

// Configure multer for image uploads
const upload = ImageService.configureMulter();

// Upload single image
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No image provided',
        message: 'Please select an image to upload'
      });
    }

    const uploadResult = await ImageService.uploadImage(req.file, 'uploads', 'anonymous');

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
router.post('/upload-multiple', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: 'No images provided',
        message: 'Please select at least one image to upload'
      });
    }

    const uploadPromises = req.files.map(file => 
      ImageService.uploadImage(file, 'uploads', 'anonymous')
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
router.post('/design', upload.single('image'), async (req, res) => {
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

    const uploadResult = await ImageService.uploadDesignImage(req.file, 'anonymous', designId);

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
router.post('/avatar', upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No avatar provided',
        message: 'Please select an image for your avatar'
      });
    }

    const uploadResult = await ImageService.uploadAvatar(req.file, 'anonymous');

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
router.delete('/:fileName', async (req, res) => {
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
router.get('/metadata/:fileName', async (req, res) => {
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
router.post('/signed-url', async (req, res) => {
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

// Get user's images (simplified for now)
router.get('/my-images', async (req, res) => {
  try {
    // For now, return empty array since we're not tracking users
    res.json({
      success: true,
      data: []
    });
  } catch (error) {
    console.error('Error getting user images:', error);
    res.status(500).json({
      error: 'Failed to get images',
      message: 'Failed to retrieve user images'
    });
  }
});

module.exports = router; 