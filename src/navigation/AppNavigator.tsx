
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabNavigator';

// Import des écrans supplémentaires
import CvCreatorScreen from '../screens/CvCreatorScreen';
import VoiceCvCreatorScreen from '../screens/VoiceCvCreatorScreen';
import MagicApplyScreen from '../screens/MagicApplyScreen';
import CoverLetterGeneratorScreen from '../screens/CoverLetterGeneratorScreen';
import PortfolioScreen from '../screens/PortfolioScreen';

const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    {/* Navigation principale avec tabs */}
    <Stack.Screen name="Main" component={BottomTabNavigator} />
    
    {/* Écrans de création et édition de CV */}
    <Stack.Screen 
      name="CvCreator" 
      component={CvCreatorScreen}
      options={{
        headerShown: true,
        title: 'Éditeur de CV',
        headerBackTitleVisible: false,
      }}
    />
    
    <Stack.Screen 
      name="VoiceCvCreator" 
      component={VoiceCvCreatorScreen}
      options={{
        headerShown: true,
        title: 'Création vocale',
        headerBackTitleVisible: false,
      }}
    />
    
    {/* Écrans des outils IA */}
    <Stack.Screen 
      name="MagicApply" 
      component={MagicApplyScreen}
      options={{
        headerShown: true,
        title: 'Magic Apply',
        headerBackTitleVisible: false,
      }}
    />
    
    <Stack.Screen 
      name="CoverLetterGenerator" 
      component={CoverLetterGeneratorScreen}
      options={{
        headerShown: true,
        title: 'Générateur de lettres',
        headerBackTitleVisible: false,
      }}
    />
    
    {/* Écrans supplémentaires */}
    <Stack.Screen 
      name="Portfolio" 
      component={PortfolioScreen}
      options={{
        headerShown: true,
        title: 'Portfolio',
        headerBackTitleVisible: false,
      }}
    />
  </Stack.Navigator>
);

export default AppNavigator;

