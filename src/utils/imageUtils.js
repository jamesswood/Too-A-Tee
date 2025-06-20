import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

export const imageUtils = {
  // Resize image to fit T-shirt design
  resizeForDesign: async (imageUri, maxWidth = 400, maxHeight = 400) => {
    try {
      const result = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: maxWidth, height: maxHeight } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.PNG }
      );
      return result.uri;
    } catch (error) {
      console.error('Error resizing image:', error);
      throw error;
    }
  },

  // Convert image to base64
  toBase64: async (imageUri) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.error('Error converting to base64:', error);
      throw error;
    }
  },

  // Generate thumbnail
  generateThumbnail: async (imageUri, size = 100) => {
    try {
      const result = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: size, height: size } }],
        { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
      );
      return result.uri;
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      throw error;
    }
  },

  // Remove background (placeholder for AI integration)
  removeBackground: async (imageUri) => {
    try {
      // This would integrate with an AI service like Remove.bg or similar
      // For now, return the original image
      console.log('Background removal would be implemented here');
      return imageUri;
    } catch (error) {
      console.error('Error removing background:', error);
      throw error;
    }
  },

  // Validate image file
  validateImage: (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload a JPEG, PNG, or WebP image.');
    }

    if (file.size > maxSize) {
      throw new Error('File size too large. Please upload an image smaller than 10MB.');
    }

    return true;
  },

  // Get image dimensions
  getImageDimensions: (imageUri) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = reject;
      img.src = imageUri;
    });
  },

  // Create design preview
  createDesignPreview: async (designImageUri, tshirtColor = '#FFFFFF') => {
    try {
      // This would create a composite image of the design on a T-shirt
      // For now, return the design image
      return designImageUri;
    } catch (error) {
      console.error('Error creating design preview:', error);
      throw error;
    }
  },
}; 