import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useDispatch } from 'react-redux';

import { colors } from '../utils/colors';
import { fontFamily } from '../utils/fonts';
import Header from '../components/Header';
import { clearCart } from '../store/slices/cartSlice';

const OrderConfirmationScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const handleContinueShopping = () => {
    dispatch(clearCart());
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <Header 
        title="Order Confirmation"
        showBack={false}
      />

      <View style={styles.content}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Text style={styles.successIconText}>✓</Text>
          </View>
          
          <Text style={styles.successTitle}>Order Placed Successfully!</Text>
          <Text style={styles.successSubtitle}>
            Thank you for your order. You will receive a confirmation email shortly.
          </Text>
        </View>

        <View style={styles.orderInfo}>
          <Text style={styles.orderInfoTitle}>Order Details</Text>
          <Text style={styles.orderInfoText}>Order #: ORD-{Date.now().toString().slice(-8)}</Text>
          <Text style={styles.orderInfoText}>Date: {new Date().toLocaleDateString()}</Text>
          <Text style={styles.orderInfoText}>Status: Processing</Text>
        </View>

        <View style={styles.nextSteps}>
          <Text style={styles.nextStepsTitle}>What's Next?</Text>
          <Text style={styles.nextStepsText}>
            • You'll receive an email confirmation with order details{'\n'}
            • We'll notify you when your order ships{'\n'}
            • Track your order in your profile
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.continueButton}
          onPress={handleContinueShopping}
        >
          <Text style={styles.continueButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
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
  successContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successIconText: {
    fontSize: 40,
    fontFamily: fontFamily.bold,
    color: colors.white,
  },
  successTitle: {
    fontSize: 24,
    fontFamily: fontFamily.bold,
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  orderInfo: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    width: '100%',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderInfoTitle: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  orderInfoText: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  nextSteps: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 12,
    marginBottom: 32,
    width: '100%',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nextStepsTitle: {
    fontSize: 18,
    fontFamily: fontFamily.bold,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  nextStepsText: {
    fontSize: 14,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  continueButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fontFamily.bold,
  },
});

export default OrderConfirmationScreen; 