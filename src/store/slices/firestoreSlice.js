import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createUser,
  getUser,
  updateUser,
  createDesign,
  getDesigns,
  updateDesign,
  deleteDesign,
  createOrder,
  getOrders,
  updateOrderStatus,
  addToFavorites,
  removeFromFavorites,
  getFavorites
} from '../../services/firestoreService';

// ==================== ASYNC THUNKS ====================

// User operations
export const createUserProfile = createAsyncThunk(
  'firestore/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      const result = await createUser(userData);
      if (result.success) {
        return result.data;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUser = createAsyncThunk(
  'firestore/fetchUser',
  async (uid, { rejectWithValue }) => {
    try {
      const result = await getUser(uid);
      if (result.success) {
        return result.data;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'firestore/updateUser',
  async ({ uid, updates }, { rejectWithValue }) => {
    try {
      const result = await updateUser(uid, updates);
      if (result.success) {
        return { uid, updates: result.data };
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Design operations
export const createNewDesign = createAsyncThunk(
  'firestore/createDesign',
  async ({ designData, userId }, { rejectWithValue }) => {
    try {
      const result = await createDesign(designData, userId);
      if (result.success) {
        return result.data;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDesigns = createAsyncThunk(
  'firestore/fetchDesigns',
  async ({ filters, limitCount, lastDoc }, { rejectWithValue }) => {
    try {
      const result = await getDesigns(filters, limitCount, lastDoc);
      if (result.success) {
        return result.data;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateDesignData = createAsyncThunk(
  'firestore/updateDesign',
  async ({ designId, updates }, { rejectWithValue }) => {
    try {
      const result = await updateDesign(designId, updates);
      if (result.success) {
        return { designId, updates: result.data };
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteDesignData = createAsyncThunk(
  'firestore/deleteDesign',
  async (designId, { rejectWithValue }) => {
    try {
      const result = await deleteDesign(designId);
      if (result.success) {
        return designId;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Order operations
export const createNewOrder = createAsyncThunk(
  'firestore/createOrder',
  async ({ orderData, userId }, { rejectWithValue }) => {
    try {
      const result = await createOrder(orderData, userId);
      if (result.success) {
        return result.data;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'firestore/fetchOrders',
  async ({ userId, userRole }, { rejectWithValue }) => {
    try {
      const result = await getOrders(userId, userRole);
      if (result.success) {
        return { orders: result.data, userRole };
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateOrderData = createAsyncThunk(
  'firestore/updateOrder',
  async ({ orderId, status, additionalData }, { rejectWithValue }) => {
    try {
      const result = await updateOrderStatus(orderId, status, additionalData);
      if (result.success) {
        return { orderId, updates: result.data };
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Favorites operations
export const addDesignToFavorites = createAsyncThunk(
  'firestore/addToFavorites',
  async ({ userId, designId }, { rejectWithValue }) => {
    try {
      const result = await addToFavorites(userId, designId);
      if (result.success) {
        return result.data;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeDesignFromFavorites = createAsyncThunk(
  'firestore/removeFromFavorites',
  async ({ userId, designId }, { rejectWithValue }) => {
    try {
      const result = await removeFromFavorites(userId, designId);
      if (result.success) {
        return { userId, designId };
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserFavorites = createAsyncThunk(
  'firestore/fetchFavorites',
  async (userId, { rejectWithValue }) => {
    try {
      const result = await getFavorites(userId);
      if (result.success) {
        return result.data;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ==================== SLICE ====================

const initialState = {
  // Users
  users: {},
  currentUser: null,
  
  // Designs
  designs: {},
  designsList: [],
  userDesigns: {},
  publicDesigns: [],
  
  // Orders
  orders: {},
  userOrders: [],
  sellerOrders: [],
  
  // Favorites
  favorites: {},
  userFavorites: [],
  
  // Loading states
  loading: {
    users: false,
    designs: false,
    orders: false,
    favorites: false
  },
  
  // Error states
  errors: {
    users: null,
    designs: null,
    orders: null,
    favorites: null
  }
};

const firestoreSlice = createSlice({
  name: 'firestore',
  initialState,
  reducers: {
    // Real-time updates
    setUserData: (state, action) => {
      const { uid, userData } = action.payload;
      state.users[uid] = userData;
      if (uid === state.currentUser?.uid) {
        state.currentUser = userData;
      }
    },
    
    setDesignData: (state, action) => {
      const { designId, designData } = action.payload;
      state.designs[designId] = designData;
    },
    
    setDesignsList: (state, action) => {
      state.designsList = action.payload;
    },
    
    setUserDesigns: (state, action) => {
      const { userId, designs } = action.payload;
      state.userDesigns[userId] = designs;
    },
    
    setPublicDesigns: (state, action) => {
      state.publicDesigns = action.payload;
    },
    
    setOrderData: (state, action) => {
      const { orderId, orderData } = action.payload;
      state.orders[orderId] = orderData;
    },
    
    setUserOrders: (state, action) => {
      state.userOrders = action.payload;
    },
    
    setSellerOrders: (state, action) => {
      state.sellerOrders = action.payload;
    },
    
    setFavoritesData: (state, action) => {
      const { userId, favorites } = action.payload;
      state.favorites[userId] = favorites;
    },
    
    setUserFavorites: (state, action) => {
      state.userFavorites = action.payload;
    },
    
    // Clear data
    clearUserData: (state, action) => {
      const uid = action.payload;
      delete state.users[uid];
      if (state.currentUser?.uid === uid) {
        state.currentUser = null;
      }
    },
    
    clearDesignData: (state, action) => {
      const designId = action.payload;
      delete state.designs[designId];
    },
    
    clearOrderData: (state, action) => {
      const orderId = action.payload;
      delete state.orders[orderId];
    },
    
    clearFavoritesData: (state, action) => {
      const userId = action.payload;
      delete state.favorites[userId];
    },
    
    // Clear errors
    clearError: (state, action) => {
      const { type } = action.payload;
      state.errors[type] = null;
    },
    
    // Clear all data
    clearAllData: (state) => {
      state.users = {};
      state.designs = {};
      state.orders = {};
      state.favorites = {};
      state.designsList = [];
      state.userDesigns = {};
      state.publicDesigns = [];
      state.userOrders = [];
      state.sellerOrders = [];
      state.userFavorites = [];
    }
  },
  extraReducers: (builder) => {
    // User operations
    builder
      .addCase(createUserProfile.pending, (state) => {
        state.loading.users = true;
        state.errors.users = null;
      })
      .addCase(createUserProfile.fulfilled, (state, action) => {
        state.loading.users = false;
        state.users[action.payload.uid] = action.payload;
        state.currentUser = action.payload;
      })
      .addCase(createUserProfile.rejected, (state, action) => {
        state.loading.users = false;
        state.errors.users = action.payload;
      })
      
      .addCase(fetchUser.pending, (state) => {
        state.loading.users = true;
        state.errors.users = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading.users = false;
        state.users[action.payload.uid] = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading.users = false;
        state.errors.users = action.payload;
      })
      
      .addCase(updateUserProfile.pending, (state) => {
        state.loading.users = true;
        state.errors.users = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading.users = false;
        state.users[action.payload.uid] = {
          ...state.users[action.payload.uid],
          ...action.payload.updates
        };
        if (state.currentUser?.uid === action.payload.uid) {
          state.currentUser = {
            ...state.currentUser,
            ...action.payload.updates
          };
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading.users = false;
        state.errors.users = action.payload;
      });
    
    // Design operations
    builder
      .addCase(createNewDesign.pending, (state) => {
        state.loading.designs = true;
        state.errors.designs = null;
      })
      .addCase(createNewDesign.fulfilled, (state, action) => {
        state.loading.designs = false;
        state.designs[action.payload.id] = action.payload;
        state.designsList.unshift(action.payload);
      })
      .addCase(createNewDesign.rejected, (state, action) => {
        state.loading.designs = false;
        state.errors.designs = action.payload;
      })
      
      .addCase(fetchDesigns.pending, (state) => {
        state.loading.designs = true;
        state.errors.designs = null;
      })
      .addCase(fetchDesigns.fulfilled, (state, action) => {
        state.loading.designs = false;
        action.payload.designs.forEach(design => {
          state.designs[design.id] = design;
        });
        state.designsList = action.payload.designs;
      })
      .addCase(fetchDesigns.rejected, (state, action) => {
        state.loading.designs = false;
        state.errors.designs = action.payload;
      })
      
      .addCase(updateDesignData.pending, (state) => {
        state.loading.designs = true;
        state.errors.designs = null;
      })
      .addCase(updateDesignData.fulfilled, (state, action) => {
        state.loading.designs = false;
        state.designs[action.payload.designId] = {
          ...state.designs[action.payload.designId],
          ...action.payload.updates
        };
      })
      .addCase(updateDesignData.rejected, (state, action) => {
        state.loading.designs = false;
        state.errors.designs = action.payload;
      })
      
      .addCase(deleteDesignData.pending, (state) => {
        state.loading.designs = true;
        state.errors.designs = null;
      })
      .addCase(deleteDesignData.fulfilled, (state, action) => {
        state.loading.designs = false;
        delete state.designs[action.payload];
        state.designsList = state.designsList.filter(design => design.id !== action.payload);
      })
      .addCase(deleteDesignData.rejected, (state, action) => {
        state.loading.designs = false;
        state.errors.designs = action.payload;
      });
    
    // Order operations
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.loading.orders = true;
        state.errors.orders = null;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.loading.orders = false;
        state.orders[action.payload.id] = action.payload;
        state.userOrders.unshift(action.payload);
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.loading.orders = false;
        state.errors.orders = action.payload;
      })
      
      .addCase(fetchOrders.pending, (state) => {
        state.loading.orders = true;
        state.errors.orders = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading.orders = false;
        action.payload.orders.forEach(order => {
          state.orders[order.id] = order;
        });
        if (action.payload.userRole === 'seller') {
          state.sellerOrders = action.payload.orders;
        } else {
          state.userOrders = action.payload.orders;
        }
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading.orders = false;
        state.errors.orders = action.payload;
      })
      
      .addCase(updateOrderData.pending, (state) => {
        state.loading.orders = true;
        state.errors.orders = null;
      })
      .addCase(updateOrderData.fulfilled, (state, action) => {
        state.loading.orders = false;
        state.orders[action.payload.orderId] = {
          ...state.orders[action.payload.orderId],
          ...action.payload.updates
        };
      })
      .addCase(updateOrderData.rejected, (state, action) => {
        state.loading.orders = false;
        state.errors.orders = action.payload;
      });
    
    // Favorites operations
    builder
      .addCase(addDesignToFavorites.pending, (state) => {
        state.loading.favorites = true;
        state.errors.favorites = null;
      })
      .addCase(addDesignToFavorites.fulfilled, (state, action) => {
        state.loading.favorites = false;
        state.userFavorites.push(action.payload);
      })
      .addCase(addDesignToFavorites.rejected, (state, action) => {
        state.loading.favorites = false;
        state.errors.favorites = action.payload;
      })
      
      .addCase(removeDesignFromFavorites.pending, (state) => {
        state.loading.favorites = true;
        state.errors.favorites = null;
      })
      .addCase(removeDesignFromFavorites.fulfilled, (state, action) => {
        state.loading.favorites = false;
        state.userFavorites = state.userFavorites.filter(
          fav => !(fav.userId === action.payload.userId && fav.designId === action.payload.designId)
        );
      })
      .addCase(removeDesignFromFavorites.rejected, (state, action) => {
        state.loading.favorites = false;
        state.errors.favorites = action.payload;
      })
      
      .addCase(fetchUserFavorites.pending, (state) => {
        state.loading.favorites = true;
        state.errors.favorites = null;
      })
      .addCase(fetchUserFavorites.fulfilled, (state, action) => {
        state.loading.favorites = false;
        state.userFavorites = action.payload;
      })
      .addCase(fetchUserFavorites.rejected, (state, action) => {
        state.loading.favorites = false;
        state.errors.favorites = action.payload;
      });
  }
});

export const {
  setUserData,
  setDesignData,
  setDesignsList,
  setUserDesigns,
  setPublicDesigns,
  setOrderData,
  setUserOrders,
  setSellerOrders,
  setFavoritesData,
  setUserFavorites,
  clearUserData,
  clearDesignData,
  clearOrderData,
  clearFavoritesData,
  clearError,
  clearAllData
} = firestoreSlice.actions;

export default firestoreSlice.reducer; 