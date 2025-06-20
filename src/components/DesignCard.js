import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../utils/colors';
import { fontFamily } from '../utils/fonts';

const DesignCard = ({ design, onPress, showPrice = true }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: design.image }}
          style={styles.image}
          resizeMode="cover"
        />
        {showPrice && (
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${design.price}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {design.title}
        </Text>
        {design.category && (
          <Text style={styles.category} numberOfLines={1}>
            {design.category}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 120,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  priceContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  price: {
    color: colors.white,
    fontSize: 12,
    fontFamily: fontFamily.semiBold,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontFamily: fontFamily.semiBold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
  },
});

export default DesignCard; 