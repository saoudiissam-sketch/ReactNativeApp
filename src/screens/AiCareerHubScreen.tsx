
import React from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { AiCareerStackScreenProps } from '../types/navigation';

import { AiCareerStackParamList } from '../types/navigation';

type ToolCard = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
  route: keyof AiCareerStackParamList;
};

const AI_TOOLS: ToolCard[] = [
  {
    id: 'interview-simulator',
    title: 'Simulateur d\'Entretien',
    description: 'Entraînez-vous avec notre IA pour vos entretiens d\'embauche',
    icon: 'videocam',
    color: 'bg-blue-500',
    route: 'InterviewSimulator'
  },
  {
    id: 'magic-apply',
    title: 'Magic Apply',
    description: 'Optimisez automatiquement votre CV pour chaque offre',
    icon: 'auto-fix-high',
    color: 'bg-purple-500',
    route: 'MagicApply'
  },
  {
    id: 'salary-negotiation',
    title: 'Négociation Salariale',
    description: 'Obtenez des conseils personnalisés pour négocier votre salaire',
    icon: 'trending-up',
    color: 'bg-green-500',
    route: 'SalaryNegotiation'
  },
  {
    id: 'cover-letter',
    title: 'Lettres de Motivation',
    description: 'Générez des lettres de motivation personnalisées',
    icon: 'edit',
    color: 'bg-orange-500',
    route: 'CoverLetterGenerator'
  }
];

const AiCareerHubScreen = ({ navigation }: AiCareerStackScreenProps<'AiCareerHub'>) => {
  const handleToolPress = (route: keyof AiCareerStackParamList) => {
    navigation.navigate(route);
  };

  return (
    <ScreenContainer>
      <ScrollView className="flex-1 p-4">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-800 mb-2">
            🤖 Carrière IA
          </Text>
          <Text className="text-gray-600 text-lg leading-6">
            Boostez votre recherche d'emploi avec nos outils d'intelligence artificielle
          </Text>
        </View>

        {/* AI Tools Grid */}
        <View className="space-y-4">
          {AI_TOOLS.map((tool) => (
            <TouchableOpacity
              key={tool.id}
              onPress={() => handleToolPress(tool.route)}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
              activeOpacity={0.7}
            >
              <View className="flex-row items-start">
                <View className={`${tool.color} w-12 h-12 rounded-full items-center justify-center mr-4`}>
                  <MaterialIcons name={tool.icon} size={24} color="white" />
                </View>
                
                <View className="flex-1">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-lg font-semibold text-gray-800">
                      {tool.title}
                    </Text>
                    <MaterialIcons name="arrow-forward-ios" size={16} color="#9CA3AF" />
                  </View>
                  
                  <Text className="text-gray-600 leading-5">
                    {tool.description}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tips Section */}
        <View className="mt-8 p-5 bg-blue-50 rounded-xl border border-blue-100">
          <View className="flex-row items-center mb-3">
            <MaterialIcons name="lightbulb" size={20} color="#3B82F6" />
            <Text className="text-blue-800 font-semibold ml-2">
              Conseils d'utilisation
            </Text>
          </View>
          <Text className="text-blue-700 leading-6">
            • Commencez par le simulateur d'entretien pour vous entraîner{'\n'}
            • Utilisez Magic Apply pour chaque candidature{'\n'}
            • Préparez votre négociation salariale à l'avance{'\n'}
            • Personnalisez toujours vos lettres de motivation
          </Text>
        </View>

        {/* Stats Card */}
        <View className="mt-6 p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
          <Text className="text-purple-800 font-semibold mb-2 text-center">
            ✨ Powered by AI
          </Text>
          <Text className="text-purple-700 text-center text-sm">
            Nos outils utilisent l'intelligence artificielle pour vous donner 
            un avantage concurrentiel sur le marché de l'emploi.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

export default AiCareerHubScreen;
