import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';

// Context
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Navigation
import AppNavigator from './navigation/AppNavigator';
import AuthNavigator from './navigation/AuthNavigator';

// Components
import LoadingScreen from './components/LoadingScreen';

const Stack = createNativeStackNavigator();

const AppContent = () => {
  const { user, loading, error } = useAuth();

  if (loading) {
    return <LoadingScreen message="Initializing..." />;
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 16, textAlign: 'center', color: 'red' }}>
          Error initializing app: {error}
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // User is signed in - show main app
          <Stack.Screen name="App" component={AppNavigator} />
        ) : (
          // User is not signed in - show auth screens
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
