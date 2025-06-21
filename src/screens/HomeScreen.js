import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { logoutUser } from '../services/authService';
import LoadingScreen from '../components/LoadingScreen';

const HomeScreen = () => {
  const { user, loading } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            const result = await logoutUser();
            if (!result.success) {
              Alert.alert('Logout Failed', result.error);
            }
            // No need to navigate, AuthContext will handle it.
          },
        },
      ]
    );
  };

  if (loading) {
    return <LoadingScreen message="Loading Home..." />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Too-A-Tee!</Text>
      <Text style={styles.subtitle}>
        You are successfully logged in as:
      </Text>
      <Text style={styles.emailText}>{user?.email}</Text>
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    color: '#666',
  },
  emailText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#333',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen; 