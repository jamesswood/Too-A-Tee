import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChange } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe;

    const initializeAuth = () => {
      try {
        console.log('Initializing auth state listener...');
        unsubscribe = onAuthStateChange((user) => {
          console.log('Auth state changed:', user ? `User logged in: ${user.email}` : 'User logged out');
          setUser(user);
          setLoading(false);
          setError(null);
        });
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        console.log('Cleaning up auth state listener...');
        unsubscribe();
      }
    };
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 