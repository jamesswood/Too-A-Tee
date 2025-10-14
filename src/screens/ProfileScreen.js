import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useUserDesigns } from '../hooks/useFirestore';
import { logoutUser } from '../services/authService';
import LoadingScreen from '../components/LoadingScreen';

const { width } = Dimensions.get('window');
const numColumns = 3;
const itemSize = width / numColumns;

const ProfileScreen = ({ navigation }) => {
  const { user } = useAuth();
  // For now, this shows the current user's profile. We can adapt it for other users later.
  const { designs, loading: designsLoading } = useUserDesigns(user?.uid);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => logoutUser(),
      },
    ]);
  };

  const renderHeader = () => (
    <>
      <View style={styles.profileInfoContainer}>
        <Image
          style={styles.avatar}
          source={{ uri: user?.photoURL || 'https://via.placeholder.com/150' }}
        />
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{designs.length}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>
      </View>
      <Text style={styles.displayName}>{user?.displayName || user?.email}</Text>
      {/* Bio would go here */}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => alert('Edit Profile clicked!')}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  if (designsLoading) {
    return <LoadingScreen message="Loading Profile..." />;
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={designs}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.gridItem}>
            <Image source={{ uri: item.imageUrl }} style={styles.gridImage} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: 'gray',
  },
  displayName: {
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  button: {
    backgroundColor: '#efefef',
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    fontWeight: 'bold',
  },
  gridItem: {
    width: itemSize,
    height: itemSize,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
});

export default ProfileScreen; 