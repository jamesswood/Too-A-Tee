import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../utils/colors';
import { fontFamily } from '../utils/fonts';
import Header from '../components/Header';
import { setCurrentDesign, updateDesignSettings } from '../store/slices/designSlice';
import { imageUtils } from '../utils/imageUtils';

const DesignScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { settings } = useSelector((state) => state.design);
  const [selectedImage, setSelectedImage] = useState(null);
  const [processing, setProcessing] = useState(false);

  const pickImage = async (source = 'gallery') => {
    try {
      let result;
      
      if (source === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Camera permission is required to take photos.');
          return;
        }
        
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Photo library permission is required to select images.');
          return;
        }
        
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setSelectedImage(imageUri);
        
        // Process the image
        await processImage(imageUri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const processImage = async (imageUri) => {
    setProcessing(true);
    try {
      // Resize image for design
      const resizedImage = await imageUtils.resizeForDesign(imageUri);
      
      // Create design object
      const design = {
        id: Date.now().toString(),
        title: 'Custom Design',
        image: resizedImage,
        originalImage: imageUri,
        category: 'Custom',
        price: 29.99,
        createdAt: new Date().toISOString(),
      };
      
      dispatch(setCurrentDesign(design));
    } catch (error) {
      console.error('Error processing image:', error);
      Alert.alert('Error', 'Failed to process image. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleBackgroundRemoval = async () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select an image first.');
      return;
    }

    setProcessing(true);
    try {
      const processedImage = await imageUtils.removeBackground(selectedImage);
      setSelectedImage(processedImage);
      dispatch(updateDesignSettings({ backgroundRemoval: !settings.backgroundRemoval }));
    } catch (error) {
      console.error('Error removing background:', error);
      Alert.alert('Error', 'Failed to remove background. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handlePreview = () => {
    if (!selectedImage) {
      Alert.alert('No Design', 'Please create or select a design first.');
      return;
    }
    navigation.navigate('Preview');
  };

  const handleAIGeneration = () => {
    Alert.alert(
      'AI Generation',
      'This feature will integrate with AI services like OpenAI or Replicate for image generation.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Learn More', onPress: () => console.log('AI generation info') },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <Header 
        title="Create Design"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Image Preview */}
        <View style={styles.imageSection}>
          {selectedImage ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
              {processing && (
                <View style={styles.processingOverlay}>
                  <Text style={styles.processingText}>Processing...</Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.placeholderContainer}>
              <Ionicons name="image-outline" size={64} color={colors.gray} />
              <Text style={styles.placeholderText}>No image selected</Text>
            </View>
          )}
        </View>

        {/* Upload Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload Image</Text>
          <View style={styles.uploadButtons}>
            <TouchableOpacity 
              style={styles.uploadButton} 
              onPress={() => pickImage('gallery')}
              disabled={processing}
            >
              <Ionicons name="images-outline" size={24} color={colors.primary} />
              <Text style={styles.uploadButtonText}>Gallery</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.uploadButton} 
              onPress={() => pickImage('camera')}
              disabled={processing}
            >
              <Ionicons name="camera-outline" size={24} color={colors.primary} />
              <Text style={styles.uploadButtonText}>Camera</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Generation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Generation</Text>
          <TouchableOpacity 
            style={styles.aiButton} 
            onPress={handleAIGeneration}
            disabled={processing}
          >
            <Ionicons name="sparkles-outline" size={24} color={colors.secondary} />
            <Text style={styles.aiButtonText}>Generate with AI</Text>
          </TouchableOpacity>
        </View>

        {/* Design Options */}
        {selectedImage && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Design Options</Text>
            
            <TouchableOpacity 
              style={[
                styles.optionButton,
                settings.backgroundRemoval && styles.optionButtonActive
              ]} 
              onPress={handleBackgroundRemoval}
              disabled={processing}
            >
              <Ionicons 
                name={settings.backgroundRemoval ? "checkmark-circle" : "remove-circle-outline"} 
                size={24} 
                color={settings.backgroundRemoval ? colors.success : colors.gray} 
              />
              <Text style={[
                styles.optionButtonText,
                settings.backgroundRemoval && styles.optionButtonTextActive
              ]}>
                Remove Background
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Preview Button */}
        {selectedImage && (
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.previewButton} 
              onPress={handlePreview}
              disabled={processing}
            >
              <Ionicons name="eye-outline" size={20} color={colors.white} />
              <Text style={styles.previewButtonText}>Preview Design</Text>
            </TouchableOpacity>
          </View>
        )}
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
  imageSection: {
    padding: 20,
    alignItems: 'center',
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  processingText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fontFamily.medium,
  },
  placeholderContainer: {
    width: 200,
    height: 200,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.lightGray,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundSecondary,
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 16,
    fontFamily: fontFamily.medium,
    color: colors.gray,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fontFamily.semiBold,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  uploadButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  uploadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundSecondary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  uploadButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: fontFamily.medium,
    color: colors.primary,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundSecondary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  aiButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: fontFamily.medium,
    color: colors.secondary,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  optionButtonActive: {
    backgroundColor: colors.success + '20',
  },
  optionButtonText: {
    marginLeft: 12,
    fontSize: 16,
    fontFamily: fontFamily.medium,
    color: colors.textPrimary,
  },
  optionButtonTextActive: {
    color: colors.success,
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  previewButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
    color: colors.white,
  },
});

export default DesignScreen; 