import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  runTransaction
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  DESIGNS: 'designs',
  ORDERS: 'orders',
  CATEGORIES: 'categories',
  FAVORITES: 'favorites',
  TEMPLATES: 'templates'
};

// Error handling utility
const handleFirestoreError = (error, operation) => {
  console.error(`Firestore ${operation} error:`, error);
  return {
    success: false,
    error: error.message,
    code: error.code
  };
};

// Success response utility
const successResponse = (data) => ({
  success: true,
  data
});

// ==================== USER OPERATIONS ====================

export const createUser = async (userData) => {
  try {
    const { uid, email, displayName, photoURL } = userData;
    const dbInstance = db();
    
    const userDoc = {
      uid,
      email,
      displayName: displayName || '',
      photoURL: photoURL || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true,
      role: 'user',
      profile: {
        bio: '',
        location: '',
        website: '',
        socialLinks: {}
      },
      stats: {
        designsCreated: 0,
        designsSold: 0,
        totalEarnings: 0,
        followers: 0,
        following: 0
      }
    };

    await setDoc(doc(dbInstance, COLLECTIONS.USERS, uid), userDoc);
    return successResponse(userDoc);
  } catch (error) {
    return handleFirestoreError(error, 'createUser');
  }
};

export const getUser = async (uid) => {
  try {
    const dbInstance = db();
    const userDoc = await getDoc(doc(dbInstance, COLLECTIONS.USERS, uid));
    if (userDoc.exists()) {
      return successResponse({ id: userDoc.id, ...userDoc.data() });
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    return handleFirestoreError(error, 'getUser');
  }
};

export const updateUser = async (uid, updates) => {
  try {
    const dbInstance = db();
    const userRef = doc(dbInstance, COLLECTIONS.USERS, uid);
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(userRef, updateData);
    return successResponse(updateData);
  } catch (error) {
    return handleFirestoreError(error, 'updateUser');
  }
};

export const deleteUser = async (uid) => {
  try {
    const dbInstance = db();
    await deleteDoc(doc(dbInstance, COLLECTIONS.USERS, uid));
    return successResponse({ message: 'User deleted successfully' });
  } catch (error) {
    return handleFirestoreError(error, 'deleteUser');
  }
};

// ==================== DESIGN OPERATIONS ====================

export const createDesign = async (designData, userId) => {
  try {
    const dbInstance = db();
    const designDoc = {
      ...designData,
      creatorId: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true,
      isPublic: designData.isPublic || false,
      stats: {
        views: 0,
        likes: 0,
        shares: 0,
        purchases: 0
      },
      tags: designData.tags || [],
      category: designData.category || 'general'
    };

    const docRef = await addDoc(collection(dbInstance, COLLECTIONS.DESIGNS), designDoc);
    return successResponse({ id: docRef.id, ...designDoc });
  } catch (error) {
    return handleFirestoreError(error, 'createDesign');
  }
};

export const getDesign = async (designId) => {
  try {
    const dbInstance = db();
    const designDoc = await getDoc(doc(dbInstance, COLLECTIONS.DESIGNS, designId));
    if (designDoc.exists()) {
      return successResponse({ id: designDoc.id, ...designDoc.data() });
    } else {
      return { success: false, error: 'Design not found' };
    }
  } catch (error) {
    return handleFirestoreError(error, 'getDesign');
  }
};

export const getDesigns = async (filters = {}, limitCount = 20, lastDoc = null) => {
  try {
    const dbInstance = db();
    let q = collection(dbInstance, COLLECTIONS.DESIGNS);
    
    // Apply filters
    if (filters.creatorId) {
      q = query(q, where('creatorId', '==', filters.creatorId));
    }
    if (filters.isPublic !== undefined) {
      q = query(q, where('isPublic', '==', filters.isPublic));
    }
    if (filters.category) {
      q = query(q, where('category', '==', filters.category));
    }
    if (filters.isActive !== undefined) {
      q = query(q, where('isActive', '==', filters.isActive));
    }
    
    // Apply ordering
    q = query(q, orderBy('createdAt', 'desc'), limit(limitCount));
    
    // Apply pagination
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }
    
    const querySnapshot = await getDocs(q);
    const designs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return successResponse({
      designs,
      lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
      hasMore: querySnapshot.docs.length === limitCount
    });
  } catch (error) {
    return handleFirestoreError(error, 'getDesigns');
  }
};

export const updateDesign = async (designId, updates) => {
  try {
    const dbInstance = db();
    const designRef = doc(dbInstance, COLLECTIONS.DESIGNS, designId);
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(designRef, updateData);
    return successResponse(updateData);
  } catch (error) {
    return handleFirestoreError(error, 'updateDesign');
  }
};

export const deleteDesign = async (designId) => {
  try {
    const dbInstance = db();
    await deleteDoc(doc(dbInstance, COLLECTIONS.DESIGNS, designId));
    return successResponse({ message: 'Design deleted successfully' });
  } catch (error) {
    return handleFirestoreError(error, 'deleteDesign');
  }
};

// ==================== ORDER OPERATIONS ====================

export const createOrder = async (orderData, userId) => {
  try {
    const dbInstance = db();
    const orderDoc = {
      ...orderData,
      buyerId: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'pending',
      paymentStatus: 'pending',
      items: orderData.items || [],
      total: orderData.total || 0,
      shippingAddress: orderData.shippingAddress || {},
      trackingInfo: {}
    };

    const docRef = await addDoc(collection(dbInstance, COLLECTIONS.ORDERS), orderDoc);
    return successResponse({ id: docRef.id, ...orderDoc });
  } catch (error) {
    return handleFirestoreError(error, 'createOrder');
  }
};

export const getOrder = async (orderId) => {
  try {
    const dbInstance = db();
    const orderDoc = await getDoc(doc(dbInstance, COLLECTIONS.ORDERS, orderId));
    if (orderDoc.exists()) {
      return successResponse({ id: orderDoc.id, ...orderDoc.data() });
    } else {
      return { success: false, error: 'Order not found' };
    }
  } catch (error) {
    return handleFirestoreError(error, 'getOrder');
  }
};

export const getOrders = async (userId, userRole = 'buyer') => {
  try {
    const dbInstance = db();
    const field = userRole === 'seller' ? 'sellerId' : 'buyerId';
    const q = query(
      collection(dbInstance, COLLECTIONS.ORDERS),
      where(field, '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const orders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return successResponse(orders);
  } catch (error) {
    return handleFirestoreError(error, 'getOrders');
  }
};

export const updateOrderStatus = async (orderId, status, additionalData = {}) => {
  try {
    const dbInstance = db();
    const orderRef = doc(dbInstance, COLLECTIONS.ORDERS, orderId);
    const updateData = {
      status,
      updatedAt: serverTimestamp(),
      ...additionalData
    };
    
    await updateDoc(orderRef, updateData);
    return successResponse(updateData);
  } catch (error) {
    return handleFirestoreError(error, 'updateOrderStatus');
  }
};

// ==================== FAVORITES OPERATIONS ====================

export const addToFavorites = async (userId, designId) => {
  try {
    const dbInstance = db();
    const favoriteDoc = {
      userId,
      designId,
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(dbInstance, COLLECTIONS.FAVORITES), favoriteDoc);
    return successResponse({ id: docRef.id, ...favoriteDoc });
  } catch (error) {
    return handleFirestoreError(error, 'addToFavorites');
  }
};

export const removeFromFavorites = async (userId, designId) => {
  try {
    const dbInstance = db();
    const q = query(
      collection(dbInstance, COLLECTIONS.FAVORITES),
      where('userId', '==', userId),
      where('designId', '==', designId)
    );
    
    const querySnapshot = await getDocs(q);
    const batch = writeBatch(dbInstance);
    
    querySnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    return successResponse({ message: 'Removed from favorites' });
  } catch (error) {
    return handleFirestoreError(error, 'removeFromFavorites');
  }
};

export const getFavorites = async (userId) => {
  try {
    const dbInstance = db();
    const q = query(
      collection(dbInstance, COLLECTIONS.FAVORITES),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const favorites = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return successResponse(favorites);
  } catch (error) {
    return handleFirestoreError(error, 'getFavorites');
  }
};

// ==================== REAL-TIME LISTENERS ====================

export const subscribeToUser = (uid, callback) => {
  const dbInstance = db();
  return onSnapshot(doc(dbInstance, COLLECTIONS.USERS, uid), (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() });
    } else {
      callback(null);
    }
  });
};

export const subscribeToDesigns = (filters = {}, callback) => {
  const dbInstance = db();
  let q = collection(dbInstance, COLLECTIONS.DESIGNS);
  
  if (filters.creatorId) {
    q = query(q, where('creatorId', '==', filters.creatorId));
  }
  if (filters.isPublic !== undefined) {
    q = query(q, where('isPublic', '==', filters.isPublic));
  }
  
  q = query(q, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (querySnapshot) => {
    const designs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(designs);
  });
};

export const subscribeToOrders = (userId, userRole = 'buyer', callback) => {
  const dbInstance = db();
  const field = userRole === 'seller' ? 'sellerId' : 'buyerId';
  const q = query(
    collection(dbInstance, COLLECTIONS.ORDERS),
    where(field, '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const orders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(orders);
  });
};

// ==================== BATCH OPERATIONS ====================

export const batchUpdateDesigns = async (updates) => {
  try {
    const dbInstance = db();
    const batch = writeBatch(dbInstance);
    
    updates.forEach(({ designId, updates: designUpdates }) => {
      const designRef = doc(dbInstance, COLLECTIONS.DESIGNS, designId);
      batch.update(designRef, {
        ...designUpdates,
        updatedAt: serverTimestamp()
      });
    });
    
    await batch.commit();
    return successResponse({ message: 'Batch update completed' });
  } catch (error) {
    return handleFirestoreError(error, 'batchUpdateDesigns');
  }
};

// ==================== TRANSACTION OPERATIONS ====================

export const purchaseDesign = async (designId, userId, orderData) => {
  try {
    const dbInstance = db();
    const result = await runTransaction(dbInstance, async (transaction) => {
      // Get design document
      const designRef = doc(dbInstance, COLLECTIONS.DESIGNS, designId);
      const designDoc = await transaction.get(designRef);
      
      if (!designDoc.exists()) {
        throw new Error('Design not found');
      }
      
      const designData = designDoc.data();
      
      // Create order
      const orderRef = doc(collection(dbInstance, COLLECTIONS.ORDERS));
      const orderDoc = {
        ...orderData,
        buyerId: userId,
        sellerId: designData.creatorId,
        designId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'pending',
        paymentStatus: 'pending'
      };
      
      transaction.set(orderRef, orderDoc);
      
      // Update design stats
      transaction.update(designRef, {
        'stats.purchases': (designData.stats?.purchases || 0) + 1,
        updatedAt: serverTimestamp()
      });
      
      return { orderId: orderRef.id, orderData: orderDoc };
    });
    
    return successResponse(result);
  } catch (error) {
    return handleFirestoreError(error, 'purchaseDesign');
  }
}; 