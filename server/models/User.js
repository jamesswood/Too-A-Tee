const { getFirestore } = require('../config/firebase');
const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');

class User {
  constructor() {
    this.db = getFirestore();
    this.collection = 'users';
  }

  // Create a new user profile
  async createUser(userData) {
    try {
      const { uid, email, name, picture } = userData;
      
      const userProfile = {
        uid,
        email,
        name: name || null,
        picture: picture || null,
        preferences: {
          theme: 'light',
          notifications: true,
          language: 'en'
        },
        profile: {
          firstName: null,
          lastName: null,
          phone: null,
          address: {
            street: null,
            city: null,
            state: null,
            zipCode: null,
            country: null
          }
        },
        stats: {
          designsCreated: 0,
          ordersPlaced: 0,
          totalSpent: 0
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await this.db.collection(this.collection).doc(uid).set(userProfile);
      
      return userProfile;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Get user by UID
  async getUserByUid(uid) {
    try {
      const userDoc = await this.db.collection(this.collection).doc(uid).get();
      
      if (!userDoc.exists) {
        return null;
      }
      
      return { uid, ...userDoc.data() };
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  // Update user profile
  async updateUser(uid, updateData) {
    try {
      const updateObject = {
        ...updateData,
        updatedAt: new Date()
      };

      await this.db.collection(this.collection).doc(uid).update(updateObject);
      
      return await this.getUserByUid(uid);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Update user preferences
  async updatePreferences(uid, preferences) {
    try {
      const updateObject = {
        preferences: {
          ...preferences
        },
        updatedAt: new Date()
      };

      await this.db.collection(this.collection).doc(uid).update(updateObject);
      
      return await this.getUserByUid(uid);
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }

  // Update user profile information
  async updateProfile(uid, profileData) {
    try {
      const updateObject = {
        profile: {
          ...profileData
        },
        updatedAt: new Date()
      };

      await this.db.collection(this.collection).doc(uid).update(updateObject);
      
      return await this.getUserByUid(uid);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  // Increment user stats
  async incrementStats(uid, statType, value = 1) {
    try {
      const statField = `stats.${statType}`;
      await this.db.collection(this.collection).doc(uid).update({
        [statField]: admin.firestore.FieldValue.increment(value),
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error incrementing stats:', error);
      throw error;
    }
  }

  // Delete user account
  async deleteUser(uid) {
    try {
      await this.db.collection(this.collection).doc(uid).delete();
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Get user's designs
  async getUserDesigns(uid, limit = 20, offset = 0) {
    try {
      const designsQuery = await this.db
        .collection('designs')
        .where('userId', '==', uid)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .offset(offset)
        .get();

      return designsQuery.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting user designs:', error);
      throw error;
    }
  }

  // Get user's orders
  async getUserOrders(uid, limit = 20, offset = 0) {
    try {
      const ordersQuery = await this.db
        .collection('orders')
        .where('userId', '==', uid)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .offset(offset)
        .get();

      return ordersQuery.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting user orders:', error);
      throw error;
    }
  }
}

module.exports = new User(); 