import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDesignsWithCreators } from '../hooks/useFirestore';
import LoadingScreen from '../components/LoadingScreen';

const DesignCard = ({ post }) => {
  const { creator, imageUrl, name } = post;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Image 
          style={styles.cardAvatar}
          source={{ uri: creator?.photoURL || 'https://via.placeholder.com/40' }}
        />
        <Text style={styles.cardUsername}>{creator?.displayName || 'Anonymous'}</Text>
      </View>
      <Image source={{ uri: imageUrl }} style={styles.cardImage} />
      <View style={styles.cardActions}>
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={28} style={styles.actionIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="chatbubble-outline" size={28} style={styles.actionIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="paper-plane-outline" size={28} style={styles.actionIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardLikes}>0 likes</Text>
        <Text>
          <Text style={styles.cardUsername}>{creator?.displayName || 'Anonymous'} </Text>
          <Text style={styles.cardDescription}>{name}</Text>
        </Text>
      </View>
    </View>
  );
}

const HomeScreen = ({ navigation }) => {
  const { posts, loading, error } = useDesignsWithCreators();

  console.log('HomeScreen - posts:', posts.length, 'loading:', loading, 'error:', error);

  if (loading) {
    return <LoadingScreen message="Loading Feed..." />;
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Too-A-Tee</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Create')}>
            <Ionicons name="add-circle-outline" size={28} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading feed: {error}</Text>
          <Text style={styles.errorSubtext}>Please check your internet connection and try again.</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
       <View style={styles.header}>
        <Text style={styles.headerTitle}>Too-A-Tee</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Create')}>
            <Ionicons name="add-circle-outline" size={28} color="#000" />
        </TouchableOpacity>
      </View>
      {posts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No designs yet</Text>
          <Text style={styles.emptySubtext}>Create your first T-shirt design!</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          renderItem={({ item }) => <DesignCard post={item} />}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    // A custom font could be used here
  },
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  cardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  cardUsername: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  cardImage: {
    width: '100%',
    height: 400, // Or calculate aspect ratio
  },
  cardActions: {
    flexDirection: 'row',
    padding: 12,
  },
  actionIcon: {
    marginRight: 16,
  },
  cardInfo: {
    paddingHorizontal: 12,
  },
  cardLikes: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default HomeScreen; 