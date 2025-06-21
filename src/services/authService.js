import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../config/firebase';

// Register with email and password
export const registerUser = async (email, password) => {
  try {
    console.log('Registering user with Firebase auth');
    const authInstance = auth();
    const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
    console.log('Registration successful:', userCredential);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: error.message };
  }
};

// Login with email and password
export const loginUser = async (email, password) => {
  try {
    console.log('Logging in user with Firebase auth');
    const authInstance = auth();
    const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
    console.log('Login successful:', userCredential);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: error.message };
  }
};

// Logout
export const logoutUser = async () => {
  try {
    console.log('Logging out user with Firebase auth');
    const authInstance = auth();
    await signOut(authInstance);
    console.log('Logout successful');
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: error.message };
  }
};

// Listen to auth state changes
export const onAuthStateChange = (callback) => {
  try {
    console.log('Setting up auth state listener with Firebase auth');
    const authInstance = auth();
    return onAuthStateChanged(authInstance, callback);
  } catch (error) {
    console.error('Auth state change error:', error);
    // Return a dummy unsubscribe function
    return () => {};
  }
}; 