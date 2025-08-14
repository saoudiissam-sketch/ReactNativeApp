import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons'; 

// Screens
import DashboardScreen from '../screens/DashboardScreen';
import MyCvsScreen from '../screens/MyCvsScreen';
import JobSearchScreen from '../screens/JobSearchScreen';
import AiCareerHubScreen from '../screens/AiCareerHubScreen';
import InterviewSimulatorScreen from '../screens/InterviewSimulatorScreen';
import SalaryNegotiationScreen from '../screens/SalaryNegotiationScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const AiCareerStack = createStackNavigator();
const MyCvsStack = createStackNavigator();

// Stack pour la gestion des CVs
const MyCvsStackScreen = () => (
  <MyCvsStack.Navigator screenOptions={{ headerShown: false }}>
    <MyCvsStack.Screen name="MyCvsList" component={MyCvsScreen} />
  </MyCvsStack.Navigator>
);

// Stack pour les outils IA
const AiCareerStackScreen = () => (
  <AiCareerStack.Navigator screenOptions={{ headerShown: false }}>
    <AiCareerStack.Screen name="AiCareerHub" component={AiCareerHubScreen} />
    <AiCareerStack.Screen name="InterviewSimulator" component={InterviewSimulatorScreen} />
    <AiCareerStack.Screen name="SalaryNegotiation" component={SalaryNegotiationScreen} />
  </AiCareerStack.Navigator>
);

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Tableau de Bord') {
            iconName = focused ? 'dashboard' : 'dashboard';
          } else if (route.name === 'Mes CVs') {
            iconName = focused ? 'description' : 'description';
          } else if (route.name === 'Recherche') {
            iconName = focused ? 'search' : 'search';
          } else if (route.name === 'Carrière IA') {
            iconName = focused ? 'psychology' : 'psychology';
          } else if (route.name === 'Profil') {
            iconName = focused ? 'person' : 'person';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Tableau de Bord" 
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Accueil'
        }}
      />
      <Tab.Screen 
        name="Mes CVs" 
        component={MyCvsStackScreen}
        options={{
          tabBarLabel: 'CVs'
        }}
      />
      <Tab.Screen 
        name="Recherche" 
        component={JobSearchScreen}
        options={{
          tabBarLabel: 'Jobs'
        }}
      />
      <Tab.Screen 
        name="Carrière IA" 
        component={AiCareerStackScreen}
        options={{
          tabBarLabel: 'IA'
        }}
      />
      <Tab.Screen 
        name="Profil" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil'
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
