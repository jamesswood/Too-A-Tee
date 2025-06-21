import { useState, useEffect, useCallback } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase';
import {
  subscribeToUser,
  subscribeToDesigns,
  subscribeToOrders,
  getUser,
  getDesigns,
  getOrders
} from '../services/firestoreService';

// ==================== USER HOOKS ====================

export const useUser = (uid) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!uid) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToUser(uid, (userData) => {
      setUser(userData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid]);

  return { user, loading, error };
};

export const useCurrentUser = () => {
  const [user, loading, error] = useAuthState(auth());
  
  const [userData, setUserData] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUserData(null);
      setUserLoading(false);
      return;
    }

    setUserLoading(true);
    const unsubscribe = subscribeToUser(user.uid, (data) => {
      setUserData(data);
      setUserLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return {
    user: userData,
    loading: loading || userLoading,
    error
  };
};

// ==================== DESIGN HOOKS ====================

export const useDesign = (designId) => {
  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!designId) {
      setDesign(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const fetchDesign = async () => {
      try {
        const result = await getDesign(designId);
        if (result.success) {
          setDesign(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDesign();
  }, [designId]);

  return { design, loading, error };
};

export const useDesigns = (filters = {}, limitCount = 20) => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);

  const fetchDesigns = useCallback(async (isInitial = false) => {
    try {
      setLoading(true);
      setError(null);

      const result = await getDesigns(filters, limitCount, isInitial ? null : lastDoc);
      
      if (result.success) {
        if (isInitial) {
          setDesigns(result.data.designs);
        } else {
          setDesigns(prev => [...prev, ...result.data.designs]);
        }
        setLastDoc(result.data.lastDoc);
        setHasMore(result.data.hasMore);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, limitCount, lastDoc]);

  useEffect(() => {
    fetchDesigns(true);
  }, [filters]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchDesigns(false);
    }
  }, [loading, hasMore, fetchDesigns]);

  const refresh = useCallback(() => {
    setLastDoc(null);
    setHasMore(true);
    fetchDesigns(true);
  }, [fetchDesigns]);

  return {
    designs,
    loading,
    error,
    hasMore,
    loadMore,
    refresh
  };
};

export const useUserDesigns = (userId) => {
  return useDesigns({ creatorId: userId });
};

export const usePublicDesigns = () => {
  return useDesigns({ isPublic: true, isActive: true });
};

// ==================== ORDER HOOKS ====================

export const useOrder = (orderId) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) {
      setOrder(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const fetchOrder = async () => {
      try {
        const result = await getOrder(orderId);
        if (result.success) {
          setOrder(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  return { order, loading, error };
};

export const useOrders = (userId, userRole = 'buyer') => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToOrders(userId, userRole, (ordersData) => {
      setOrders(ordersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId, userRole]);

  return { orders, loading, error };
};

export const useUserOrders = (userId) => {
  return useOrders(userId, 'buyer');
};

export const useSellerOrders = (userId) => {
  return useOrders(userId, 'seller');
};

// ==================== REAL-TIME DESIGN SUBSCRIPTION ====================

export const useRealtimeDesigns = (filters = {}) => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToDesigns(filters, (designsData) => {
      setDesigns(designsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [JSON.stringify(filters)]);

  return { designs, loading, error };
};

// ==================== UTILITY HOOKS ====================

export const useFirestoreError = () => {
  const [error, setError] = useState(null);

  const handleError = useCallback((err) => {
    console.error('Firestore error:', err);
    setError(err.message || 'An error occurred');
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
};

export const useFirestoreLoading = () => {
  const [loading, setLoading] = useState(false);

  const withLoading = useCallback(async (asyncFunction) => {
    setLoading(true);
    try {
      const result = await asyncFunction();
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, withLoading };
};

// ==================== COMBINED HOOKS ====================

export const useUserProfile = (uid) => {
  const { user, loading, error } = useUser(uid);
  const { orders: userOrders } = useUserOrders(uid);
  const { designs: userDesigns } = useUserDesigns(uid);

  return {
    user,
    orders: userOrders,
    designs: userDesigns,
    loading,
    error
  };
};

export const useDesignWithCreator = (designId) => {
  const { design, loading: designLoading, error: designError } = useDesign(designId);
  const { user: creator, loading: creatorLoading } = useUser(design?.creatorId);

  return {
    design,
    creator,
    loading: designLoading || creatorLoading,
    error: designError
  };
}; 