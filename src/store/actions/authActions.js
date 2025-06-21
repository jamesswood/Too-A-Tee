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
    
    // Listen to auth state changes
    authService.onAuthStateChanged((user) => {
      if (user) {
        dispatch(setUser(user));
      } else {
        dispatch(logout());
      }
    });
  } catch (error) {
    dispatch(setError(error.message));
  }
}; 