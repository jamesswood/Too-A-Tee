const admin = require('firebase-admin');

let firebaseApp = null;
let firestore = null;
let auth = null;
let storage = null;

const initializeFirebase = () => {
  try {
    // Check if Firebase is already initialized
    if (firebaseApp) {
      return { firebaseApp, firestore, auth, storage };
    }

    // Initialize Firebase Admin SDK
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        type: process.env.FIREBASE_TYPE,
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: process.env.FIREBASE_AUTH_URI,
        token_uri: process.env.FIREBASE_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });

    // Initialize Firestore
    firestore = admin.firestore();
    
    // Initialize Auth
    auth = admin.auth();
    
    // Initialize Storage
    storage = admin.storage();

    console.log('✅ Firebase initialized successfully');
    
    return { firebaseApp, firestore, auth, storage };
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    throw error;
  }
};

const getFirestore = () => {
  if (!firestore) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return firestore;
};

const getAuth = () => {
  if (!auth) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return auth;
};

const getStorage = () => {
  if (!storage) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return storage;
};

const getFirebaseApp = () => {
  if (!firebaseApp) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return firebaseApp;
};

module.exports = {
  initializeFirebase,
  getFirestore,
  getAuth,
  getStorage,
  getFirebaseApp
}; 