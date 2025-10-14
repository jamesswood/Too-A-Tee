import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { createDesign } from '../services/firestoreService';
import { useAuth } from '../contexts/AuthContext';
import { storage as appStorage } from '../config/firebase';

const CreateDesignScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [privacy, setPrivacy] = useState('public'); // public, followers, private
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };
  
  const handleCreateDesign = async () => {
    if (!image || !title.trim()) {
      Alert.alert('Missing Information', 'Please provide an image and a title for your design.');
      return;
    }

    setUploading(true);

    try {
      // Upload image to Firebase Storage
      const response = await fetch(image);
      const blob = await response.blob();
      const storageRef = ref(appStorage(), `designs/${user.uid}/${Date.now()}`);
      await uploadBytes(storageRef, blob);
      const imageUrl = await getDownloadURL(storageRef);

      // Save design to Firestore
      const designData = {
        creatorId: user.uid,
        imageUrl,
        title,
        description,
        privacy,
      };

      const result = await createDesign(designData);

      if (result.success) {
        Alert.alert('Success!', 'Your T-shirt design has been created.');
        navigation.goBack();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error creating design:", error);
      Alert.alert('Upload Failed', 'There was an error creating your design. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Create a New T-Shirt</Text>

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.imagePickerText}>Tap to select an image</Text>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Description (optional)"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.privacyHeader}>Privacy Setting</Text>
      <View style={styles.privacyContainer}>
        <TouchableOpacity
          style={[styles.privacyButton, privacy === 'public' && styles.privacyButtonActive]}
          onPress={() => setPrivacy('public')}
        >
          <Text style={styles.privacyButtonText}>Public</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.privacyButton, privacy === 'followers' && styles.privacyButtonActive]}
          onPress={() => setPrivacy('followers')}
        >
          <Text style={styles.privacyButtonText}>Followers</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.privacyButton, privacy === 'private' && styles.privacyButtonActive]}
          onPress={() => setPrivacy('private')}
        >
          <Text style={styles.privacyButtonText}>Private</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.createButton, uploading && styles.disabledButton]}
        onPress={handleCreateDesign}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.createButtonText}>Create Design</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    imagePicker: {
        width: '100%',
        height: 200,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 20,
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    imagePickerText: {
        color: '#777',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
    },
    descriptionInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    privacyHeader: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    privacyContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    privacyButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#007AFF',
        borderRadius: 20,
    },
    privacyButtonActive: {
        backgroundColor: '#007AFF',
    },
    privacyButtonText: {
        color: '#007AFF',
    },
    createButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    createButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    }
});

export default CreateDesignScreen; 