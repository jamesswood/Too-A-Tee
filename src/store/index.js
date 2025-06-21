import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import userReducer from './slices/userSlice';
import designReducer from './slices/designSlice';
import firestoreReducer from './slices/firestoreSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
    design: designReducer,
    firestore: firestoreReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
        // Ignore Firestore timestamp serialization issues
        ignoredPaths: ['firestore'],
      },
    }),
}); 