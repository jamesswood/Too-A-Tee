import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../utils/colors';
import { fontFamily } from '../utils/fonts';
import Header from '../components/Header';
import { logoutUser } from '../store/actions/authActions';

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(logoutUser());
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <Header 
        title="Profile"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
          </View>
          
          <Text style={styles.userName}>
            {user?.displayName || 'Guest User'}
          </Text>
          <Text style={styles.userEmail}>
            {user?.email || 'guest@example.com'}
          </Text>
        </View>

        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="person-outline" size={20} color={colors.gray} />
            <Text style={styles.menuItemText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.gray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="receipt-outline" size={20} color={colors.gray} />
            <Text style={styles.menuItemText}>Order History</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.gray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="heart-outline" size={20} color={colors.gray} />
            <Text style={styles.menuItemText}>Saved Designs</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.gray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="settings-outline" size={20} color={colors.gray} />
            <Text style={styles.menuItemText}>Settings</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.gray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="help-circle-outline" size={20} color={colors.gray} />
            <Text style={styles.menuItemText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.gray} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={colors.white} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontFamily: fontFamily.bold,
    color: colors.white,
  },
  userName: {
    fontSize: 24,
    fontFamily: fontFamily.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
  },
  menuSection: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    fontFamily: fontFamily.medium,
    color: colors.textPrimary,
    marginLeft: 12,
  },
  logoutButton: {
    backgroundColor: colors.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 32,
  },
  logoutButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fontFamily.bold,
    marginLeft: 8,
  },
});

export default ProfileScreen; 