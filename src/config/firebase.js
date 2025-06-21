import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore, enableNetwork, disableNetwork } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Firebase configuration
const firebaseConfig = {
  apiKey: Constants.expoConfig.extra.firebaseApiKey,
  authDomain: Constants.expoConfig.extra.firebaseAuthDomain,
  projectId: Constants.expoConfig.extra.firebaseProjectId,
  storageBucket: Constants.expoConfig.extra.firebaseStorageBucket,
  messagingSenderId: Constants.expoConfig.extra.firebaseMessagingSenderId,
  appId: Constants.expoConfig.extra.firebaseAppId,
  measurementId: Constants.expoConfig.extra.firebaseMeasurementId,
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize services with lazy loading
let authInstance = null;
let dbInstance = null;
let storageInstance = null;

// Lazy initialization functions
const getAuthInstance = () => {
  if (!authInstance) {
    try {
      authInstance = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
      console.log('Firebase Auth initialized successfully with persistence.');
    } catch (error) {
      if (error.code === 'auth/already-initialized') {
        authInstance = getAuth(app);
      } else {
        console.error('Auth initialization error:', error);
        throw error;
      }
    }
  }
  return authInstance;
};

const getDbInstance = () => {
  if (!dbInstance) {
    try {
      dbInstance = getFirestore(app);
      console.log('Firestore initialized successfully');
    } catch (error) {
      console.error('Firestore initialization error:', error);
      throw error;
    }
  }
  return dbInstance;
};

const getStorageInstance = () => {
  if (!storageInstance) {
    try {
      storageInstance = getStorage(app);
      console.log('Firebase Storage initialized successfully');
    } catch (error) {
      console.error('Storage initialization error:', error);
      throw error;
    }
  }
  return storageInstance;
};

// Network status management
export const enableFirestoreNetwork = () => enableNetwork(getDbInstance());
export const disableFirestoreNetwork = () => disableNetwork(getDbInstance());

// Export lazy getters
export const auth = getAuthInstance;
export const db = getDbInstance;
export const storage = getStorageInstance;

// Export the app instance
export default app; 