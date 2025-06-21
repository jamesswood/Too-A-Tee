import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useCurrentUser, useDesigns, useFirestoreError } from '../hooks/useFirestore';
import {
  createUserProfile,
  createNewDesign,
  fetchDesigns,
  addDesignToFavorites,
  removeDesignFromFavorites,
  setDesignsList,
  clearError
} from '../store/slices/firestoreSlice';

const FirestoreExample = () => {
  const dispatch = useDispatch();
  const { user, loading: userLoading } = useCurrentUser();
  const { designs, loading: designsLoading, hasMore, loadMore } = useDesigns({ isPublic: true });
  const { error, handleError, clearError: clearFirestoreError } = useFirestoreError();
  
  // Redux state
  const { designsList, loading, errors } = useSelector(state => state.firestore);
  
  // Local state
  const [designTitle, setDesignTitle] = useState('');
  const [designDescription, setDesignDescription] = useState('');
  const [creatingDesign, setCreatingDesign] = useState(false);

  // Create user profile when user logs in
  useEffect(() => {
    if (user && !userLoading) {
      dispatch(createUserProfile({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email,
        photoURL: user.photoURL || ''
      }));
    }
  }, [user, userLoading, dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      clearFirestoreError();
    }
  }, [error, clearFirestoreError]);

  // Create a new design
  const handleCreateDesign = async () => {
    if (!designTitle.trim() || !designDescription.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to create a design');
      return;
    }

    setCreatingDesign(true);
    try {
      const designData = {
        title: designTitle.trim(),
        description: designDescription.trim(),
        isPublic: true,
        category: 'general',
        tags: ['example', 'test'],
        imageUrl: 'https://example.com/placeholder.jpg',
        price: 9.99
      };

      const result = await dispatch(createNewDesign({ designData, userId: user.uid })).unwrap();
      
      if (result) {
        Alert.alert('Success', 'Design created successfully!');
        setDesignTitle('');
        setDesignDescription('');
        
        // Refresh designs list
        dispatch(fetchDesigns({ filters: { isPublic: true }, limitCount: 20 }));
      }
    } catch (error) {
      handleError(error);
    } finally {
      setCreatingDesign(false);
    }
  };

  // Add design to favorites
  const handleAddToFavorites = async (designId) => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to add favorites');
      return;
    }

    try {
      await dispatch(addDesignToFavorites({ userId: user.uid, designId })).unwrap();
      Alert.alert('Success', 'Added to favorites!');
    } catch (error) {
      handleError(error);
    }
  };

  // Remove design from favorites
  const handleRemoveFromFavorites = async (designId) => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to remove favorites');
      return;
    }

    try {
      await dispatch(removeDesignFromFavorites({ userId: user.uid, designId })).unwrap();
      Alert.alert('Success', 'Removed from favorites!');
    } catch (error) {
      handleError(error);
    }
  };

  // Render design item
  const renderDesignItem = ({ item }) => (
    <View style={styles.designItem}>
      <Text style={styles.designTitle}>{item.title}</Text>
      <Text style={styles.designDescription}>{item.description}</Text>
      <Text style={styles.designCreator}>By: {item.creatorId}</Text>
      <Text style={styles.designPrice}>${item.price}</Text>
      
      <View style={styles.designActions}>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => handleAddToFavorites(item.id)}
        >
          <Text style={styles.favoriteButtonText}>❤️ Add to Favorites</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Loading component
  if (userLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading user data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firestore Example</Text>
      
      {/* User Info */}
      {user ? (
        <View style={styles.userInfo}>
          <Text style={styles.userText}>Welcome, {user.displayName || user.email}!</Text>
          <Text style={styles.userText}>UID: {user.uid}</Text>
        </View>
      ) : (
        <Text style={styles.noUserText}>Please log in to use Firestore features</Text>
      )}

      {/* Create Design Form */}
      {user && (
        <View style={styles.createForm}>
          <Text style={styles.sectionTitle}>Create New Design</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Design Title"
            value={designTitle}
            onChangeText={setDesignTitle}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Design Description"
            value={designDescription}
            onChangeText={setDesignDescription}
            multiline
            numberOfLines={3}
          />
          
          <TouchableOpacity
            style={[styles.createButton, creatingDesign && styles.disabledButton]}
            onPress={handleCreateDesign}
            disabled={creatingDesign}
          >
            {creatingDesign ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.createButtonText}>Create Design</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Designs List */}
      <View style={styles.designsSection}>
        <Text style={styles.sectionTitle}>Public Designs</Text>
        
        {designsLoading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <FlatList
            data={designs}
            renderItem={renderDesignItem}
            keyExtractor={(item) => item.id}
            style={styles.designsList}
            onEndReached={loadMore}
            onEndReachedThreshold={0.1}
            ListFooterComponent={
              hasMore ? (
                <TouchableOpacity style={styles.loadMoreButton} onPress={loadMore}>
                  <Text style={styles.loadMoreText}>Load More</Text>
                </TouchableOpacity>
              ) : null
            }
            ListEmptyComponent={
              <Text style={styles.emptyText}>No designs found</Text>
            }
          />
        )}
      </View>

      {/* Error Display */}
      {errors.designs && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {errors.designs}</Text>
          <TouchableOpacity
            style={styles.clearErrorButton}
            onPress={() => dispatch(clearError({ type: 'designs' }))}
          >
            <Text style={styles.clearErrorText}>Clear Error</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  noUserText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  createForm: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: 'white',
  },
  createButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  designsSection: {
    flex: 1,
  },
  designsList: {
    flex: 1,
  },
  designItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  designTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  designDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  designCreator: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  designPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 10,
  },
  designActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  favoriteButton: {
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 6,
  },
  favoriteButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  loadMoreButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  loadMoreText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    marginBottom: 10,
  },
  clearErrorButton: {
    backgroundColor: '#D32F2F',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  clearErrorText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default FirestoreExample; 