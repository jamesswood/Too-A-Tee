import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { Grid } from 'react-native-super-grid';

import { colors } from '../utils/colors';
import { fontFamily } from '../utils/fonts';
import DesignCard from '../components/DesignCard';
import Header from '../components/Header';
import { setCurrentDesign } from '../store/slices/designSlice';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { userDesigns, templates } = useSelector((state) => state.design);
  const { itemCount } = useSelector((state) => state.cart);
  
  const [featuredDesigns, setFeaturedDesigns] = useState([]);

  useEffect(() => {
    // Load featured designs (templates)
    loadFeaturedDesigns();
  }, []);

  const loadFeaturedDesigns = () => {
    // Mock featured designs - in real app, these would come from an API
    const mockFeatured = [
      {
        id: '1',
        title: 'Vintage Rock',
        image: 'https://via.placeholder.com/300x300/FF6B35/FFFFFF?text=Vintage+Rock',
        category: 'Music',
        price: 29.99,
      },
      {
        id: '2',
        title: 'Tech Geek',
        image: 'https://via.placeholder.com/300x300/007AFF/FFFFFF?text=Tech+Geek',
        category: 'Technology',
        price: 29.99,
      },
      {
        id: '3',
        title: 'Nature Lover',
        image: 'https://via.placeholder.com/300x300/34C759/FFFFFF?text=Nature+Lover',
        category: 'Nature',
        price: 29.99,
      },
      {
        id: '4',
        title: 'Abstract Art',
        image: 'https://via.placeholder.com/300x300/AF52DE/FFFFFF?text=Abstract+Art',
        category: 'Art',
        price: 29.99,
      },
    ];
    setFeaturedDesigns(mockFeatured);
  };

  const handleDesignPress = (design) => {
    dispatch(setCurrentDesign(design));
    navigation.navigate('Preview');
  };

  const handleCreateNew = () => {
    navigation.navigate('Design');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <Header 
        title="Too-A-Tee"
        showCart={true}
        cartCount={itemCount}
        onCartPress={() => navigation.navigate('Cart')}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Create Your Perfect T-Shirt</Text>
          <Text style={styles.heroSubtitle}>
            Upload your own design or choose from our amazing templates
          </Text>
          <TouchableOpacity style={styles.createButton} onPress={handleCreateNew}>
            <Ionicons name="create" size={20} color={colors.white} />
            <Text style={styles.createButtonText}>Start Creating</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Designs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Designs</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <Grid
            data={featuredDesigns}
            renderItem={({ item }) => (
              <DesignCard
                design={item}
                onPress={() => handleDesignPress(item)}
              />
            )}
            keyExtractor={(item) => item.id}
            spacing={16}
            itemDimension={160}
          />
        </View>

        {/* Recent Creations */}
        {userDesigns.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Recent Creations</Text>
            </View>
            
            <Grid
              data={userDesigns.slice(0, 4)}
              renderItem={({ item }) => (
                <DesignCard
                  design={item}
                  onPress={() => handleDesignPress(item)}
                />
              )}
              keyExtractor={(item) => item.id}
              spacing={16}
              itemDimension={160}
            />
          </View>
        )}

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse Categories</Text>
          <View style={styles.categoriesGrid}>
            {['Music', 'Technology', 'Nature', 'Art', 'Sports', 'Fashion'].map((category) => (
              <TouchableOpacity key={category} style={styles.categoryCard}>
                <Text style={styles.categoryText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    padding: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontFamily: fontFamily.bold,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    fontFamily: fontFamily.regular,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.9,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  createButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
    marginLeft: 8,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fontFamily.semiBold,
    color: colors.textPrimary,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: fontFamily.medium,
    color: colors.primary,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: colors.lightGray,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 16,
    fontFamily: fontFamily.medium,
    color: colors.textPrimary,
  },
});

export default HomeScreen; 