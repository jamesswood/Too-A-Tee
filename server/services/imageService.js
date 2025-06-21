const { getStorage } = require('../config/firebase');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

class ImageService {
  constructor() {
    this.storage = getStorage();
    this.bucket = this.storage.bucket();
  }

  // Configure multer for image upload
  configureMulter() {
    const storage = multer.memoryStorage();
    
    return multer({
      storage: storage,
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
      fileFilter: (req, file, cb) => {
        // Check file type
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
          return cb(null, true);
        } else {
          cb(new Error('Only image files are allowed!'));
        }
      }
    });
  }

  // Upload image to Firebase Storage
  async uploadImage(file, folder = 'uploads', userId = null) {
    try {
      const timestamp = Date.now();
      const fileName = `${folder}/${userId || 'anonymous'}/${timestamp}_${file.originalname}`;
      
      const fileUpload = this.bucket.file(fileName);
      
      const blobStream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
          metadata: {
            originalName: file.originalname,
            uploadedBy: userId,
            uploadedAt: new Date().toISOString()
          }
        },
        resumable: false
      });

      return new Promise((resolve, reject) => {
        blobStream.on('error', (error) => {
          console.error('Upload error:', error);
          reject(error);
        });

        blobStream.on('finish', async () => {
          try {
            // Make the file publicly accessible
            await fileUpload.makePublic();
            
            // Get the public URL
            const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${fileName}`;
            
            resolve({
              url: publicUrl,
              fileName: fileName,
              originalName: file.originalname,
              size: file.size,
              mimetype: file.mimetype,
              uploadedAt: new Date().toISOString()
            });
          } catch (error) {
            reject(error);
          }
        });

        blobStream.end(file.buffer);
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  // Upload design image
  async uploadDesignImage(file, userId, designId) {
    try {
      const folder = `designs/${userId}/${designId}`;
      return await this.uploadImage(file, folder, userId);
    } catch (error) {
      console.error('Error uploading design image:', error);
      throw error;
    }
  }

  // Upload user avatar
  async uploadAvatar(file, userId) {
    try {
      const folder = `avatars/${userId}`;
      return await this.uploadImage(file, folder, userId);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  }

  // Delete image from Firebase Storage
  async deleteImage(fileName) {
    try {
      const file = this.bucket.file(fileName);
      await file.delete();
      
      return {
        success: true,
        message: 'Image deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  // Get image metadata
  async getImageMetadata(fileName) {
    try {
      const file = this.bucket.file(fileName);
      const [metadata] = await file.getMetadata();
      
      return {
        name: metadata.name,
        size: metadata.size,
        contentType: metadata.contentType,
        timeCreated: metadata.timeCreated,
        updated: metadata.updated,
        metadata: metadata.metadata || {}
      };
    } catch (error) {
      console.error('Error getting image metadata:', error);
      throw error;
    }
  }

  // Generate signed URL for private images
  async generateSignedUrl(fileName, expirationMinutes = 60) {
    try {
      const file = this.bucket.file(fileName);
      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + expirationMinutes * 60 * 1000
      });
      
      return signedUrl;
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw error;
    }
  }

  // List images in a folder
  async listImages(folder, limit = 50) {
    try {
      const [files] = await this.bucket.getFiles({
        prefix: folder,
        maxResults: limit
      });
      
      return files.map(file => ({
        name: file.name,
        size: file.metadata.size,
        contentType: file.metadata.contentType,
        timeCreated: file.metadata.timeCreated,
        updated: file.metadata.updated
      }));
    } catch (error) {
      console.error('Error listing images:', error);
      throw error;
    }
  }
}

module.exports = new ImageService(); 