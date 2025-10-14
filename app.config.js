import 'dotenv/config';

// Log to verify that the environment variables are loaded
console.log('Firebase API Key loaded:', process.env.FIREBASE_API_KEY ? 'Yes' : 'No');

export default {
  "expo": {
    "name": "Too-A-Tee",
    "slug": "too-a-tee",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "light",
    "splash": {
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.tooatee.app",
      "infoPlist": {
        "NSCameraUsageDescription": "This app needs access to camera to take photos for T-shirt designs.",
        "NSPhotoLibraryUsageDescription": "This app needs access to photo library to select images for T-shirt designs.",
        "NSPhotoLibraryAddUsageDescription": "This app needs access to save designed T-shirts to your photo library."
      }
    },
    "android": {
      "package": "com.tooatee.app",
      "permissions": [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "INTERNET"
      ]
    },
    "plugins": [
      [
        "expo-image-picker",
        {
          "photosPermission": "The app accesses your photos to let you share them with your friends."
        }
      ],
      [
        "expo-camera",
        {
          "cameraPermission": "Allow Too-A-Tee to access your camera to take photos for T-shirt designs."
        }
      ],
      [
        "expo-media-library",
        {
          "photosPermission": "Allow Too-A-Tee to access your photos to save designed T-shirts.",
          "savePhotosPermission": "Allow Too-A-Tee to save designed T-shirts to your photo library.",
          "isAccessMediaLocationEnabled": true
        }
      ]
    ],
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      },
      "firebaseApiKey": process.env.FIREBASE_API_KEY,
      "firebaseAuthDomain": process.env.FIREBASE_AUTH_DOMAIN,
      "firebaseProjectId": process.env.FIREBASE_PROJECT_ID,
      "firebaseStorageBucket": process.env.FIREBASE_STORAGE_BUCKET,
      "firebaseMessagingSenderId": process.env.FIREBASE_MESSAGING_SENDER_ID,
      "firebaseAppId": process.env.FIREBASE_APP_ID,
      "firebaseMeasurementId": process.env.FIREBASE_MEASUREMENT_ID
    }
  }
} 