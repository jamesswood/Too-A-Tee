const { getFirestore } = require('../config/firebase');
const admin = require('firebase-admin');

class Design {
  constructor() {
    this.db = getFirestore();
    this.collection = 'designs';
  }

  // Create a new design
  async createDesign(designData) {
    try {
      const {
        userId,
        name,
        description,
        elements,
        tshirtColor,
        tshirtSize,
        previewImage,
        isPublic = false,
        tags = []
      } = designData;

      const design = {
        userId,
        name,
        description: description || '',
        elements: elements || [],
        tshirtColor: tshirtColor || 'white',
        tshirtSize: tshirtSize || 'M',
        previewImage: previewImage || null,
        isPublic,
        tags,
        likes: 0,
        views: 0,
        downloads: 0,
        status: 'draft', // draft, published, archived
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await this.db.collection(this.collection).add(design);
      
      return {
        id: docRef.id,
        ...design
      };
    } catch (error) {
      console.error('Error creating design:', error);
      throw error;
    }
  }

  // Get design by ID
  async getDesignById(designId) {
    try {
      const designDoc = await this.db.collection(this.collection).doc(designId).get();
      
      if (!designDoc.exists) {
        return null;
      }
      
      return {
        id: designDoc.id,
        ...designDoc.data()
      };
    } catch (error) {
      console.error('Error getting design:', error);
      throw error;
    }
  }

  // Update design
  async updateDesign(designId, updateData) {
    try {
      const updateObject = {
        ...updateData,
        updatedAt: new Date()
      };

      await this.db.collection(this.collection).doc(designId).update(updateObject);
      
      return await this.getDesignById(designId);
    } catch (error) {
      console.error('Error updating design:', error);
      throw error;
    }
  }

  // Delete design
  async deleteDesign(designId, userId) {
    try {
      const design = await this.getDesignById(designId);
      
      if (!design) {
        throw new Error('Design not found');
      }
      
      if (design.userId !== userId) {
        throw new Error('Unauthorized to delete this design');
      }

      await this.db.collection(this.collection).doc(designId).delete();
      
      return true;
    } catch (error) {
      console.error('Error deleting design:', error);
      throw error;
    }
  }

  // Get user's designs
  async getUserDesigns(userId, limit = 20, offset = 0, status = null) {
    try {
      let query = this.db.collection(this.collection)
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc');

      if (status) {
        query = query.where('status', '==', status);
      }

      const designsQuery = await query
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

  // Get public designs
  async getPublicDesigns(limit = 20, offset = 0, category = null) {
    try {
      let query = this.db.collection(this.collection)
        .where('isPublic', '==', true)
        .where('status', '==', 'published')
        .orderBy('createdAt', 'desc');

      if (category) {
        query = query.where('tags', 'array-contains', category);
      }

      const designsQuery = await query
        .limit(limit)
        .offset(offset)
        .get();

      return designsQuery.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting public designs:', error);
      throw error;
    }
  }

  // Search designs
  async searchDesigns(searchTerm, limit = 20, offset = 0) {
    try {
      // Note: Firestore doesn't support full-text search natively
      // This is a simple implementation - for production, consider using Algolia or similar
      const designsQuery = await this.db.collection(this.collection)
        .where('isPublic', '==', true)
        .where('status', '==', 'published')
        .orderBy('name')
        .startAt(searchTerm)
        .endAt(searchTerm + '\uf8ff')
        .limit(limit)
        .offset(offset)
        .get();

      return designsQuery.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error searching designs:', error);
      throw error;
    }
  }

  // Increment design stats
  async incrementStats(designId, statType, value = 1) {
    try {
      const statField = statType; // likes, views, downloads
      await this.db.collection(this.collection).doc(designId).update({
        [statField]: admin.firestore.FieldValue.increment(value),
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error incrementing design stats:', error);
      throw error;
    }
  }

  // Like/unlike design
  async toggleLike(designId, userId) {
    try {
      const likesCollection = this.db.collection('design_likes');
      const likeDoc = likesCollection.doc(`${designId}_${userId}`);
      
      const likeDocSnapshot = await likeDoc.get();
      
      if (likeDocSnapshot.exists) {
        // Unlike
        await likeDoc.delete();
        await this.incrementStats(designId, 'likes', -1);
        return { liked: false };
      } else {
        // Like
        await likeDoc.set({
          designId,
          userId,
          createdAt: new Date()
        });
        await this.incrementStats(designId, 'likes', 1);
        return { liked: true };
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  }

  // Check if user liked design
  async isLikedByUser(designId, userId) {
    try {
      const likeDoc = await this.db.collection('design_likes')
        .doc(`${designId}_${userId}`)
        .get();
      
      return likeDoc.exists;
    } catch (error) {
      console.error('Error checking like status:', error);
      throw error;
    }
  }

  // Get design categories/tags
  async getCategories() {
    try {
      const categoriesQuery = await this.db.collection('categories').get();
      
      return categoriesQuery.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting categories:', error);
      throw error;
    }
  }

  // Duplicate design
  async duplicateDesign(designId, userId) {
    try {
      const originalDesign = await this.getDesignById(designId);
      
      if (!originalDesign) {
        throw new Error('Design not found');
      }
      
      if (!originalDesign.isPublic && originalDesign.userId !== userId) {
        throw new Error('Cannot duplicate private design');
      }

      const newDesign = {
        ...originalDesign,
        userId,
        name: `${originalDesign.name} (Copy)`,
        isPublic: false,
        likes: 0,
        views: 0,
        downloads: 0,
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      delete newDesign.id; // Remove the original ID

      const docRef = await this.db.collection(this.collection).add(newDesign);
      
      return {
        id: docRef.id,
        ...newDesign
      };
    } catch (error) {
      console.error('Error duplicating design:', error);
      throw error;
    }
  }
}

module.exports = new Design(); 