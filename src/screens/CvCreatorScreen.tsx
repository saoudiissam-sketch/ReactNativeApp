import React, { useState, useEffect } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import CvPreview from '../components/cv/CvPreview';
import CvSectionModal from '../components/cv/CvSectionModal';
import { storage } from '../storage/mmkv';
import { useDocumentPicker } from '../hooks/useDocumentPicker';

const CV_STORAGE_KEY = 'user-cv-1';

const initialCvData = {
  personalInfo: { fullName: '', jobTitle: '', email: '', phone: '' },
  experience: { jobTitle: '', company: '', startDate: '', endDate: '', description: '' },
  education: { degree: '', school: '', startDate: '', endDate: '' },
  skills: '',
  createdAt: '',
  updatedAt: '',
};

const SECTION_CONFIGS = {
  personalInfo: {
    title: 'Informations personnelles',
    fields: [
      { key: 'fullName', label: 'Nom complet', required: true },
      { key: 'jobTitle', label: 'Titre du poste', required: true },
      { key: 'email', label: 'Email', required: true },
      { key: 'phone', label: 'Téléphone' },
    ],
  },
  experience: {
    title: 'Expérience professionnelle',
    fields: [
      { key: 'jobTitle', label: 'Poste occupé', required: true },
      { key: 'company', label: 'Entreprise', required: true },
      { key: 'startDate', label: 'Date de début' },
      { key: 'endDate', label: 'Date de fin' },
      { key: 'description', label: 'Description', type: 'multiline' },
    ],
  },
  education: {
    title: 'Formation',
    fields: [
      { key: 'degree', label: 'Diplôme', required: true },
      { key: 'school', label: 'École/Université', required: true },
      { key: 'startDate', label: 'Date de début' },
      { key: 'endDate', label: 'Date de fin' },
    ],
  },
  skills: {
    title: 'Compétences',
    fields: [
      { key: 'skills', label: 'Listez vos compétences (séparées par des virgules)', type: 'multiline' },
    ],
  },
};

type SectionKey = keyof typeof SECTION_CONFIGS;

const CvCreatorScreen = () => {
  const [cvData, setCvData] = useState(initialCvData);
  const [currentSection, setCurrentSection] = useState<SectionKey | null>(null);
  const { pickCV, isLoading } = useDocumentPicker();

  useEffect(() => {
    const loadedData = storage.getString(CV_STORAGE_KEY);
    if (loadedData) {
      try {
        const parsedData = JSON.parse(loadedData);
        setCvData(parsedData);
        console.log('CV loaded from local storage.');
      } catch (error) {
        console.error('Error parsing CV data:', error);
      }
    }
  }, []);

  const handleSectionSave = (sectionKey: SectionKey, data: any) => {
    const updatedCvData = {
      ...cvData,
      [sectionKey]: sectionKey === 'skills' ? data.skills : data,
    };
    
    setCvData(updatedCvData);
    
    try {
      storage.set(CV_STORAGE_KEY, JSON.stringify(updatedCvData));
      console.log('CV section saved to local storage.');
    } catch (error) {
      console.error('Error saving CV section:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder cette section.');
    }
  };

  const handleImportCV = async () => {
    const result = await pickCV();
    if (result && result.assets && result.assets[0]) {
      const file = result.assets[0];
      Alert.alert(
        'CV importé',
        `Le fichier ${file.name} a été importé. La reconnaissance de texte sera disponible dans une prochaine version.`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleExportCV = () => {
    Alert.alert(
      'Exporter le CV',
      'Fonctionnalité d\'export en cours de développement.',
      [{ text: 'OK' }]
    );
  };

  const getSectionData = (sectionKey: SectionKey) => {
    if (sectionKey === 'skills') {
      return { skills: cvData.skills };
    }
    return cvData[sectionKey];
  };

  return (
    <ScreenContainer>
      {/* Header with Actions */}
      <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-900">Éditeur de CV</Text>
        <View className="flex-row space-x-3">
          <TouchableOpacity
            onPress={handleImportCV}
            disabled={isLoading}
            className="flex-row items-center bg-gray-100 px-3 py-2 rounded-lg"
          >
            <MaterialIcons 
              name="upload-file" 
              size={20} 
              color={isLoading ? "#999" : "#666"} 
            />
            <Text className="ml-1 text-gray-700 text-sm">Importer</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleExportCV}
            className="flex-row items-center bg-blue-500 px-3 py-2 rounded-lg"
          >
            <MaterialIcons name="download" size={20} color="white" />
            <Text className="ml-1 text-white text-sm">Exporter</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CV Preview */}
      <CvPreview
        cvData={cvData}
        onSectionPress={(section) => setCurrentSection(section)}
      />

      {/* Section Modals */}
      {currentSection && (
        <CvSectionModal
          visible={currentSection !== null}
          title={SECTION_CONFIGS[currentSection]?.title || ''}
          data={getSectionData(currentSection)}
          fields={SECTION_CONFIGS[currentSection]?.fields || []}
          onClose={() => setCurrentSection(null)}
          onSave={(data) => handleSectionSave(currentSection, data)}
        />
      )}
    </ScreenContainer>
  );
};

export default CvCreatorScreen;
