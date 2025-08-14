import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { storage } from '../storage/mmkv';

interface CVQuestion {
  id: string;
  question: string;
  field: string;
  section: 'personalInfo' | 'experience' | 'education' | 'skills';
}

const CV_QUESTIONS: CVQuestion[] = [
  { id: '1', question: 'Quel est votre nom complet ?', field: 'fullName', section: 'personalInfo' },
  { id: '2', question: 'Quel est votre titre professionnel ou poste recherché ?', field: 'jobTitle', section: 'personalInfo' },
  { id: '3', question: 'Quelle est votre adresse email ?', field: 'email', section: 'personalInfo' },
  { id: '4', question: 'Quel est votre numéro de téléphone ?', field: 'phone', section: 'personalInfo' },
  { id: '5', question: 'Décrivez votre expérience professionnelle la plus récente. Quel était votre poste ?', field: 'jobTitle', section: 'experience' },
  { id: '6', question: 'Dans quelle entreprise avez-vous travaillé ?', field: 'company', section: 'experience' },
  { id: '7', question: 'Décrivez vos principales responsabilités et réalisations dans ce poste.', field: 'description', section: 'experience' },
  { id: '8', question: 'Quel est votre niveau d\'études le plus élevé ou diplôme obtenu ?', field: 'degree', section: 'education' },
  { id: '9', question: 'Dans quel établissement avez-vous étudié ?', field: 'school', section: 'education' },
  { id: '10', question: 'Quelles sont vos principales compétences ? Listez vos compétences techniques et soft skills.', field: 'skills', section: 'skills' },
];

const VoiceCvCreatorScreen = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [cvData, setCvData] = useState({
    personalInfo: { fullName: '', jobTitle: '', email: '', phone: '' },
    experience: { jobTitle: '', company: '', startDate: '', endDate: '', description: '' },
    education: { degree: '', school: '', startDate: '', endDate: '' },
    skills: '',
  });
  
  const { 
    isRecording, 
    result, 
    error, 
    isAvailable, 
    startRecording, 
    stopRecording, 
    clearResult 
  } = useSpeechToText();

  const currentQuestion = CV_QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === CV_QUESTIONS.length - 1;

  useEffect(() => {
    if (!isAvailable) {
      Alert.alert(
        'Fonctionnalité indisponible',
        'La reconnaissance vocale n\'est pas disponible sur cet appareil. Vous pouvez créer votre CV via l\'éditeur classique.',
        [{ text: 'OK' }]
      );
    }
  }, [isAvailable]);

  const handleRecordPress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      clearResult();
      startRecording();
    }
  };

  const handleAcceptAnswer = () => {
    if (!result.trim()) {
      Alert.alert('Aucune réponse', 'Veuillez enregistrer une réponse avant de continuer.');
      return;
    }

    // Sauvegarder la réponse dans cvData
    const updatedCvData = { ...cvData };
    if (currentQuestion.section === 'skills') {
      updatedCvData[currentQuestion.section] = result;
    } else {
      updatedCvData[currentQuestion.section] = {
        ...updatedCvData[currentQuestion.section],
        [currentQuestion.field]: result,
      };
    }
    setCvData(updatedCvData);

    // Nettoyer et passer à la question suivante
    clearResult();
    
    if (isLastQuestion) {
      handleFinish(updatedCvData);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    clearResult();
    if (isLastQuestion) {
      handleFinish(cvData);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      clearResult();
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleFinish = (finalCvData: any) => {
    try {
      storage.set('user-cv-voice', JSON.stringify(finalCvData));
      Alert.alert(
        'CV créé !',
        'Votre CV a été créé avec succès via la reconnaissance vocale. Vous pouvez maintenant l\'éditer ou l\'exporter.',
        [{ text: 'OK' }]
      );
      // Navigation vers l'écran d'édition ou retour au tableau de bord
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder votre CV.');
    }
  };

  return (
    <ScreenContainer>
      <ScrollView className="flex-1 px-4 py-6">
        {/* Progress Bar */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} sur {CV_QUESTIONS.length}
            </Text>
            <Text className="text-sm text-gray-600">
              {Math.round(((currentQuestionIndex + 1) / CV_QUESTIONS.length) * 100)}%
            </Text>
          </View>
          <View className="h-2 bg-gray-200 rounded-full">
            <View 
              className="h-full bg-blue-500 rounded-full"
              style={{ 
                width: `${((currentQuestionIndex + 1) / CV_QUESTIONS.length) * 100}%` 
              }}
            />
          </View>
        </View>

        {/* Question */}
        <View className="mb-8">
          <Text className="text-2xl font-bold text-gray-800 text-center mb-4">
            {currentQuestion.question}
          </Text>
        </View>

        {/* Microphone Button */}
        <View className="items-center mb-8">
          <TouchableOpacity
            onPress={handleRecordPress}
            disabled={!isAvailable}
            className={`w-32 h-32 rounded-full items-center justify-center ${
              isRecording 
                ? 'bg-red-500 shadow-lg shadow-red-500/50' 
                : isAvailable 
                  ? 'bg-blue-500 shadow-lg shadow-blue-500/30'
                  : 'bg-gray-400'
            }`}
          >
            <MaterialIcons 
              name={isRecording ? 'stop' : 'mic'} 
              size={60} 
              color="white" 
            />
          </TouchableOpacity>
          
          <Text className="text-center mt-4 text-lg font-medium text-gray-700">
            {isRecording 
              ? 'Appuyez pour arrêter'
              : isAvailable 
                ? 'Appuyez pour parler'
                : 'Microphone indisponible'
            }
          </Text>
        </View>

        {/* Error Display */}
        {error && (
          <View className="bg-red-100 border border-red-400 rounded-lg p-4 mb-4">
            <Text className="text-red-700 text-center">{error}</Text>
          </View>
        )}

        {/* Result Display */}
        {result && (
          <View className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <Text className="text-gray-700 mb-2">Votre réponse :</Text>
            <Text className="text-gray-900 text-lg">{result}</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View className="flex-row justify-between space-x-3">
          {/* Previous Button */}
          <TouchableOpacity
            onPress={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`flex-1 py-3 rounded-lg border ${
              currentQuestionIndex === 0 
                ? 'border-gray-300 bg-gray-100'
                : 'border-gray-400 bg-white'
            }`}
          >
            <Text className={`text-center font-medium ${
              currentQuestionIndex === 0 ? 'text-gray-400' : 'text-gray-700'
            }`}>
              Précédent
            </Text>
          </TouchableOpacity>

          {/* Skip Button */}
          <TouchableOpacity
            onPress={handleSkip}
            className="flex-1 py-3 rounded-lg border border-gray-400 bg-white"
          >
            <Text className="text-center font-medium text-gray-700">
              Passer
            </Text>
          </TouchableOpacity>

          {/* Accept/Finish Button */}
          <TouchableOpacity
            onPress={handleAcceptAnswer}
            disabled={!result.trim()}
            className={`flex-1 py-3 rounded-lg ${
              result.trim() 
                ? 'bg-blue-500' 
                : 'bg-gray-300'
            }`}
          >
            <Text className={`text-center font-medium ${
              result.trim() ? 'text-white' : 'text-gray-500'
            }`}>
              {isLastQuestion ? 'Terminer' : 'Valider'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tips */}
        <View className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <Text className="text-blue-800 text-sm">
            💡 <Text className="font-medium">Conseils :</Text> Parlez clairement et distinctement. 
            Vous pouvez ré-enregistrer votre réponse autant de fois que nécessaire.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

export default VoiceCvCreatorScreen;