import React, { useState, useCallback } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { useAppStore } from '../store/appStore';
import { MainTabScreenProps } from '../types/navigation';

const DashboardScreen = ({ navigation }: MainTabScreenProps<'Tableau de Bord'>) => {
  const { cvs, loadCVs } = useAppStore();
  const [greeting, setGreeting] = useState('');

  // Générer un salut contextuel
  useFocusEffect(
    useCallback(() => {
      loadCVs();
      
      const hour = new Date().getHours();
      if (hour < 12) {
        setGreeting('Bonjour');
      } else if (hour < 18) {
        setGreeting('Bon après-midi');
      } else {
        setGreeting('Bonsoir');
      }
    }, [loadCVs])
  );

  const quickActions = [
    {
      id: 'create-cv',
      title: 'Créer un CV',
      description: 'Commencer un nouveau CV',
      icon: 'add-circle' as keyof typeof MaterialIcons.glyphMap,
      color: 'bg-blue-500',
      onPress: () => navigation.navigate('Mes CVs')
    },
    {
      id: 'magic-apply',
      title: 'Magic Apply',
      description: 'Candidature intelligente',
      icon: 'auto-fix-high' as keyof typeof MaterialIcons.glyphMap,
      color: 'bg-purple-500',
      onPress: () => navigation.navigate('MagicApply')
    },
    {
      id: 'interview',
      title: 'Simulateur d\'Entretien',
      description: 'S\'entraîner avec l\'IA',
      icon: 'videocam' as keyof typeof MaterialIcons.glyphMap,
      color: 'bg-green-500',
      onPress: () => navigation.navigate('Carrière IA')
    },
    {
      id: 'search',
      title: 'Recherche d\'Emploi',
      description: 'Trouver des opportunités',
      icon: 'search' as keyof typeof MaterialIcons.glyphMap,
      color: 'bg-orange-500',
      onPress: () => navigation.navigate('Recherche')
    }
  ];

  return (
    <ScreenContainer>
      <ScrollView className="flex-1 p-4">
        {/* Welcome Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-800 mb-1">
            {greeting} ! 👋
          </Text>
          <Text className="text-gray-600 text-lg">
            Prêt à booster votre carrière aujourd'hui ?
          </Text>
        </View>

        {/* Stats Cards */}
        <View className="flex-row space-x-4 mb-8">
          <View className="flex-1 bg-blue-500 p-4 rounded-xl">
            <Text className="text-white text-3xl font-bold">
              {cvs.length}
            </Text>
            <Text className="text-blue-100">
              CV{cvs.length > 1 ? 's' : ''} créé{cvs.length > 1 ? 's' : ''}
            </Text>
          </View>
          
          <View className="flex-1 bg-green-500 p-4 rounded-xl">
            <Text className="text-white text-3xl font-bold">
              {cvs.filter(cv => 
                new Date(cv.data.updatedAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
              ).length}
            </Text>
            <Text className="text-green-100">
              Mis à jour cette semaine
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Actions rapides
          </Text>
          
          <View className="space-y-3">
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                onPress={action.onPress}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                activeOpacity={0.7}
              >
                <View className="flex-row items-center">
                  <View className={`${action.color} w-12 h-12 rounded-full items-center justify-center mr-4`}>
                    <MaterialIcons name={action.icon} size={24} color="white" />
                  </View>
                  
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-800">
                      {action.title}
                    </Text>
                    <Text className="text-gray-600">
                      {action.description}
                    </Text>
                  </View>
                  
                  <MaterialIcons name="arrow-forward-ios" size={16} color="#9CA3AF" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent CVs */}
        {cvs.length > 0 && (
          <View className="mb-8">
            <Text className="text-xl font-bold text-gray-800 mb-4">
              CVs récents
            </Text>
            
            {cvs.slice(0, 3).map((cv) => (
              <TouchableOpacity
                key={cv.id}
                onPress={() => navigation.navigate('CvCreator', { cvId: cv.id })}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3"
              >
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-lg font-semibold text-gray-800">
                      {cv.name}
                    </Text>
                    <Text className="text-gray-600">
                      Modifié le {new Date(cv.data.updatedAt).toLocaleDateString('fr-FR')}
                    </Text>
                  </View>
                  <MaterialIcons name="description" size={24} color="#3B82F6" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Tips Section */}
        <View className="p-5 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
          <View className="flex-row items-center mb-3">
            <MaterialIcons name="tips-and-updates" size={20} color="#F59E0B" />
            <Text className="text-orange-800 font-semibold ml-2">
              Conseil du jour
            </Text>
          </View>
          <Text className="text-orange-700 leading-6">
            Utilisez Magic Apply pour adapter automatiquement votre CV à chaque offre d'emploi. 
            Cela augmente vos chances de passer les premiers filtres de recrutement !
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

export default DashboardScreen;
