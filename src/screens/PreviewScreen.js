import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useSelector } from 'react-redux';

import { colors } from '../utils/colors';
import { fontFamily } from '../utils/fonts';
import Header from '../components/Header';

const PreviewScreen = ({ navigation }) => {
  const { currentDesign } = useSelector((state) => state.design);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <Header 
        title="Preview Design"
        showBack={true}
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <Text style={styles.title}>T-Shirt Preview</Text>
        <Text style={styles.subtitle}>
          {currentDesign ? currentDesign.title : 'No design selected'}
        </Text>
        
        <View style={styles.previewContainer}>
          <Text style={styles.previewText}>
            T-shirt preview will be implemented here
          </Text>
        </View>
      </View>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: fontFamily.bold,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
    marginBottom: 32,
  },
  previewContainer: {
    width: '100%',
    height: 300,
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewText: {
    fontSize: 16,
    fontFamily: fontFamily.medium,
    color: colors.textSecondary,
  },
});

export default PreviewScreen; 