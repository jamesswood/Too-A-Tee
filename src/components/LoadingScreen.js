import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

const LoadingScreen = ({ 
  message = 'Loading...', 
  color = '#007AFF',
  size = 'large',
  showMessage = true 
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {showMessage && (
        <Text style={[styles.message, { color }]}>
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default LoadingScreen; 