import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../config/firebase';

class AuthService {
  // Register new user
  async register(email, password, name) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update user profile with name
      await updateProfile(user, {
        displayName: name
      });

      return {
        user: {
          uid: user.uid,
          email: user.email,
          displayName: name,
          photoURL: user.photoURL
        }
      };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Login user
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      return {
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        }
      };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Logout user
  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  }

  // Listen to auth state changes
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        callback({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        });
      } else {
        callback(null);
      }
    });
  }

  // Handle Firebase auth errors
  handleAuthError(error) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return new Error('An account with this email already exists.');
      case 'auth/invalid-email':
        return new Error('Please enter a valid email address.');
      case 'auth/weak-password':
        return new Error('Password should be at least 6 characters long.');
      case 'auth/user-not-found':
        return new Error('No account found with this email address.');
      case 'auth/wrong-password':
        return new Error('Incorrect password.');
      case 'auth/too-many-requests':
        return new Error('Too many failed attempts. Please try again later.');
      case 'auth/network-request-failed':
        return new Error('Network error. Please check your connection.');
      default:
        return new Error('An error occurred. Please try again.');
    }
  }
}

export default new AuthService(); 