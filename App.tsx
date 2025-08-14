
import 'react-native-gesture-handler'; // Doit être en haut
import './global.css'; // Configuration NativeWind
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { setupGlobalErrorHandling } from './src/utils/errorHandler';

export default function App() {
  useEffect(() => {
    // Configuration de la gestion d'erreurs globale
    setupGlobalErrorHandling();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style="auto" />
        <AppNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

