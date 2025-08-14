import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CVData } from '../../types';

type SectionKey = 'personalInfo' | 'experience' | 'education' | 'skills';

interface CvPreviewProps {
  cvData: CVData;
  onSectionPress: (section: SectionKey) => void;
}

const CvPreview: React.FC<CvPreviewProps> = ({ cvData, onSectionPress }) => {
  const SectionCard = ({ 
    title, 
    onPress, 
    children, 
    isEmpty = false 
  }: { 
    title: string; 
    onPress: () => void; 
    children: React.ReactNode;
    isEmpty?: boolean;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`mb-4 p-4 rounded-lg border ${
        isEmpty ? 'border-dashed border-gray-300 bg-gray-50' : 'border-gray-200 bg-white'
      } shadow-sm`}
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-lg font-semibold text-gray-900">{title}</Text>
        <MaterialIcons name="edit" size={20} color="#666" />
      </View>
      {children}
    </TouchableOpacity>
  );

  return (
    <ScrollView className="flex-1 p-4 bg-gray-50">
      <Text className="text-2xl font-bold text-center mb-6 text-gray-900">
        Aperçu de votre CV
      </Text>

      {/* Personal Info Section */}
      <SectionCard
        title="Informations personnelles"
        onPress={() => onSectionPress('personalInfo')}
        isEmpty={!cvData.personalInfo.fullName}
      >
        {cvData.personalInfo.fullName ? (
          <View>
            <Text className="text-xl font-semibold text-gray-900">
              {cvData.personalInfo.fullName}
            </Text>
            {cvData.personalInfo.jobTitle && (
              <Text className="text-lg text-blue-600 mb-2">
                {cvData.personalInfo.jobTitle}
              </Text>
            )}
            <View className="flex-row items-center mb-1">
              <MaterialIcons name="email" size={16} color="#666" />
              <Text className="ml-2 text-gray-600">{cvData.personalInfo.email}</Text>
            </View>
            {cvData.personalInfo.phone && (
              <View className="flex-row items-center">
                <MaterialIcons name="phone" size={16} color="#666" />
                <Text className="ml-2 text-gray-600">{cvData.personalInfo.phone}</Text>
              </View>
            )}
          </View>
        ) : (
          <Text className="text-gray-500 italic">Appuyez pour ajouter vos informations</Text>
        )}
      </SectionCard>

      {/* Experience Section */}
      <SectionCard
        title="Expérience professionnelle"
        onPress={() => onSectionPress('experience')}
        isEmpty={!cvData.experience.jobTitle}
      >
        {cvData.experience.jobTitle ? (
          <View>
            <Text className="text-lg font-semibold text-gray-900">
              {cvData.experience.jobTitle}
            </Text>
            {cvData.experience.company && (
              <Text className="text-blue-600 mb-1">{cvData.experience.company}</Text>
            )}
            {(cvData.experience.startDate || cvData.experience.endDate) && (
              <Text className="text-gray-500 text-sm mb-2">
                {cvData.experience.startDate} - {cvData.experience.endDate || 'Présent'}
              </Text>
            )}
            {cvData.experience.description && (
              <Text className="text-gray-700">{cvData.experience.description}</Text>
            )}
          </View>
        ) : (
          <Text className="text-gray-500 italic">Appuyez pour ajouter votre expérience</Text>
        )}
      </SectionCard>

      {/* Education Section */}
      <SectionCard
        title="Formation"
        onPress={() => onSectionPress('education')}
        isEmpty={!cvData.education.degree}
      >
        {cvData.education.degree ? (
          <View>
            <Text className="text-lg font-semibold text-gray-900">
              {cvData.education.degree}
            </Text>
            {cvData.education.school && (
              <Text className="text-blue-600 mb-1">{cvData.education.school}</Text>
            )}
            {(cvData.education.startDate || cvData.education.endDate) && (
              <Text className="text-gray-500 text-sm">
                {cvData.education.startDate} - {cvData.education.endDate}
              </Text>
            )}
          </View>
        ) : (
          <Text className="text-gray-500 italic">Appuyez pour ajouter votre formation</Text>
        )}
      </SectionCard>

      {/* Skills Section */}
      <SectionCard
        title="Compétences"
        onPress={() => onSectionPress('skills')}
        isEmpty={!cvData.skills}
      >
        {cvData.skills ? (
          <View>
            <Text className="text-gray-700">{cvData.skills}</Text>
          </View>
        ) : (
          <Text className="text-gray-500 italic">Appuyez pour ajouter vos compétences</Text>
        )}
      </SectionCard>
    </ScrollView>
  );
};

export default CvPreview;