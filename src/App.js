import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { useSelector, useDispatch } from 'react-redux';
import { store } from './store';
import AppNavigator from './navigation/AppNavigator';
import AuthNavigator from './navigation/AuthNavigator';
import LoadingScreen from './components/LoadingScreen';
import { checkAuthState } from './store/actions/authActions';

const AppContent = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(checkAuthState());
  }, [dispatch]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
