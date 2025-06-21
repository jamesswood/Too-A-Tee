import { setUser, setLoading, setError, logout } from '../slices/userSlice';
import authService from '../../services/authService';

// Login action
export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const result = await authService.login(email, password);
    dispatch(setUser(result.user));
    return result;
  } catch (error) {
    dispatch(setError(error.message));
    throw error;
  }
};

// Register action
export const registerUser = (email, password, name) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const result = await authService.register(email, password, name);
    dispatch(setUser(result.user));
    return result;
  } catch (error) {
    dispatch(setError(error.message));
    throw error;
  }
};

// Logout action
export const logoutUser = () => async (dispatch) => {
  try {
    await authService.logout();
    dispatch(logout());
  } catch (error) {
    dispatch(setError(error.message));
    throw error;
  }
};

// Check auth state
export const checkAuthState = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    // Add a small delay to ensure Firebase is fully initialized
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Listen to auth state changes
    authService.onAuthStateChanged((user) => {
      console.log('Auth state changed in action:', user ? 'User logged in' : 'User logged out');
      if (user) {
        dispatch(setUser(user));
      } else {
        dispatch(logout());
      }
    });
  } catch (error) {
    console.error('Error checking auth state:', error);
    dispatch(setError(error.message));
  }
}; 