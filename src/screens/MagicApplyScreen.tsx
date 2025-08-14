import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import Input from '../components/common/Input';
import { generateCoverLetter } from '../api/geminiService';
import { storage } from '../storage/mmkv';

interface MagicApplyResult {
  optimizedCV: string;
  coverLetter: string;
  jobTitle: string;
  company: string;
}

const MagicApplyScreen = () => {
  const [jobUrl, setJobUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<MagicApplyResult | null>(null);
  const [activeTab, setActiveTab] = useState<'cv' | 'letter'>('cv');

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const extractJobInfo = (url: string) => {
    // Simulation d'extraction d'infos depuis l'URL
    // Dans une vraie application, on ferait du web scraping ou utiliserait des APIs
    const domain = new URL(url).hostname;
    return {
      title: "Développeur React Native Senior",
      company: domain.includes('linkedin') ? "TechCorp" : 
              domain.includes('indeed') ? "StartupXYZ" : 
              "Entreprise Innovante",
      description: `Nous recherchons un développeur React Native expérimenté pour rejoindre notre équipe dynamique. 
                   Vous travaillerez sur des applications mobiles de haute qualité et participerez à l'architecture technique.`
    };
  };

  const handleMagicApply = async () => {
    if (!jobUrl.trim()) {
      Alert.alert('URL manquante', 'Veuillez entrer l\'URL de l\'offre d\'emploi');
      return;
    }

    if (!validateUrl(jobUrl)) {
      Alert.alert('URL invalide', 'Veuillez entrer une URL valide');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Récupérer le CV existant
      const savedCV = storage.getString('user-cv-1');
      if (!savedCV) {
        Alert.alert('CV manquant', 'Veuillez d\'abord créer votre CV dans l\'éditeur.');
        setIsProcessing(false);
        return;
      }

      const cvData = JSON.parse(savedCV);
      
      // Extraire les infos de l'offre
      const jobInfo = extractJobInfo(jobUrl);
      
      // Générer la lettre de motivation
      const coverLetter = await generateCoverLetter(cvData, jobInfo.description);
      
      // Simuler l'optimisation du CV
      const optimizedCV = generateOptimizedCV(cvData, jobInfo);
      
      setResult({
        optimizedCV,
        coverLetter,
        jobTitle: jobInfo.title,
        company: jobInfo.company,
      });
      
    } catch (error) {
      console.error('Error in Magic Apply:', error);
      Alert.alert('Erreur', 'Une erreur s\'est produite lors de l\'analyse. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  const generateOptimizedCV = (cvData: any, jobInfo: any) => {
    // Simulation d'optimisation du CV basée sur l'offre
    return `# ${cvData.personalInfo.fullName}
## ${cvData.personalInfo.jobTitle || jobInfo.title}

📧 ${cvData.personalInfo.email} | 📱 ${cvData.personalInfo.phone}

### Profil Professionnel
Développeur mobile expérimenté, spécialisé en React Native avec une forte expertise dans la création d'applications performantes et intuitives.

### Expérience Professionnelle
**${cvData.experience.jobTitle}** - ${cvData.experience.company}
${cvData.experience.startDate} - ${cvData.experience.endDate || 'Présent'}

${cvData.experience.description}

### Formation
**${cvData.education.degree}** - ${cvData.education.school}
${cvData.education.startDate} - ${cvData.education.endDate}

### Compétences Clés
${cvData.skills}

*CV optimisé pour le poste : ${jobInfo.title} chez ${jobInfo.company}*`;
  };

  const handleCopy = async (content: string, type: string) => {
    await Clipboard.setStringAsync(content);
    Alert.alert('Copié !', `${type} copié dans le presse-papiers`);
  };

  const handleShare = async (content: string) => {
    // Dans une vraie app, on utiliserait le Share API d'Expo
    Alert.alert('Partager', 'Fonctionnalité de partage en cours de développement');
  };

  const handleReset = () => {
    setJobUrl('');
    setResult(null);
    setActiveTab('cv');
  };

  if (isProcessing) {
    return (
      <ScreenContainer>
        <View className="flex-1 justify-center items-center bg-gradient-to-b from-blue-50 to-indigo-100">
          <View className="items-center space-y-6 p-8">
            {/* Animation de chargement */}
            <View className="relative">
              <ActivityIndicator size="large" color="#3B82F6" />
              <View className="absolute inset-0 animate-pulse">
                <MaterialIcons name="auto-fix-high" size={80} color="#3B82F6" />
              </View>
            </View>
            
            <Text className="text-2xl font-bold text-gray-800 text-center">
              ✨ Magie en cours...
            </Text>
            
            <View className="space-y-2">
              <Text className="text-center text-gray-600">🔍 Analyse de l'offre d'emploi</Text>
              <Text className="text-center text-gray-600">🎯 Optimisation de votre CV</Text>
              <Text className="text-center text-gray-600">✍️ Génération de la lettre de motivation</Text>
            </View>
            
            <Text className="text-center text-gray-500 text-sm px-4">
              Cette opération peut prendre quelques secondes...
            </Text>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  if (result) {
    return (
      <ScreenContainer>
        <View className="flex-1">
          {/* Header */}
          <View className="bg-green-50 border-b border-green-200 p-4">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-lg font-bold text-green-800">
                  ✅ Candidature optimisée !
                </Text>
                <Text className="text-green-600">
                  {result.jobTitle} chez {result.company}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleReset}
                className="bg-green-600 px-3 py-2 rounded-lg"
              >
                <MaterialIcons name="refresh" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Tabs */}
          <View className="flex-row border-b border-gray-200">
            <TouchableOpacity
              onPress={() => setActiveTab('cv')}
              className={`flex-1 py-3 ${
                activeTab === 'cv' ? 'border-b-2 border-blue-500' : ''
              }`}
            >
              <Text className={`text-center font-medium ${
                activeTab === 'cv' ? 'text-blue-600' : 'text-gray-600'
              }`}>
                CV Optimisé
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('letter')}
              className={`flex-1 py-3 ${
                activeTab === 'letter' ? 'border-b-2 border-blue-500' : ''
              }`}
            >
              <Text className={`text-center font-medium ${
                activeTab === 'letter' ? 'text-blue-600' : 'text-gray-600'
              }`}>
                Lettre de Motivation
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView className="flex-1 p-4">
            <View className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
              <Text className="text-gray-800 leading-6">
                {activeTab === 'cv' ? result.optimizedCV : result.coverLetter}
              </Text>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View className="flex-row space-x-3 p-4 bg-gray-50 border-t border-gray-200">
            <TouchableOpacity
              onPress={() => handleCopy(
                activeTab === 'cv' ? result.optimizedCV : result.coverLetter,
                activeTab === 'cv' ? 'CV' : 'Lettre'
              )}
              className="flex-1 bg-blue-500 py-3 rounded-lg flex-row items-center justify-center"
            >
              <MaterialIcons name="content-copy" size={20} color="white" />
              <Text className="text-white font-medium ml-2">Copier</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleShare(
                activeTab === 'cv' ? result.optimizedCV : result.coverLetter
              )}
              className="flex-1 bg-green-500 py-3 rounded-lg flex-row items-center justify-center"
            >
              <MaterialIcons name="share" size={20} color="white" />
              <Text className="text-white font-medium ml-2">Partager</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView className="flex-1 p-4">
        {/* Header */}
        <View className="text-center mb-8">
          <Text className="text-3xl font-bold text-gray-800 mb-2">
            ✨ Magic Apply
          </Text>
          <Text className="text-gray-600 text-center leading-6">
            Collez l'URL d'une offre d'emploi et laissez l'IA optimiser votre CV 
            et générer une lettre de motivation personnalisée
          </Text>
        </View>

        {/* URL Input */}
        <View className="mb-6">
          <Input
            label="URL de l'offre d'emploi"
            placeholder="https://www.linkedin.com/jobs/view/..."
            value={jobUrl}
            onChangeText={setJobUrl}
            multiline={false}
          />
          <Text className="text-xs text-gray-500 mt-1">
            💡 Fonctionne avec LinkedIn, Indeed, Welcome to the Jungle, etc.
          </Text>
        </View>

        {/* Magic Button */}
        <TouchableOpacity
          onPress={handleMagicApply}
          disabled={!jobUrl.trim() || isProcessing}
          className={`py-4 rounded-lg flex-row items-center justify-center ${
            jobUrl.trim() && !isProcessing 
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg' 
              : 'bg-gray-300'
          }`}
        >
          <MaterialIcons 
            name="auto-fix-high" 
            size={24} 
            color={jobUrl.trim() && !isProcessing ? "white" : "#9CA3AF"} 
          />
          <Text className={`font-bold text-lg ml-2 ${
            jobUrl.trim() && !isProcessing ? 'text-white' : 'text-gray-500'
          }`}>
            ✨ Appliquer la magie !
          </Text>
        </TouchableOpacity>

        {/* Features List */}
        <View className="mt-8 space-y-4">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Ce que fait Magic Apply :
          </Text>
          
          <View className="space-y-3">
            <View className="flex-row items-start space-x-3">
              <MaterialIcons name="analytics" size={20} color="#3B82F6" />
              <Text className="flex-1 text-gray-700">
                Analyse l'offre d'emploi pour identifier les mots-clés importants
              </Text>
            </View>
            
            <View className="flex-row items-start space-x-3">
              <MaterialIcons name="tune" size={20} color="#3B82F6" />
              <Text className="flex-1 text-gray-700">
                Optimise votre CV en mettant en avant les compétences pertinentes
              </Text>
            </View>
            
            <View className="flex-row items-start space-x-3">
              <MaterialIcons name="edit" size={20} color="#3B82F6" />
              <Text className="flex-1 text-gray-700">
                Génère une lettre de motivation personnalisée pour le poste
              </Text>
            </View>
            
            <View className="flex-row items-start space-x-3">
              <MaterialIcons name="speed" size={20} color="#3B82F6" />
              <Text className="flex-1 text-gray-700">
                Prêt à copier/coller ou partager en quelques secondes
              </Text>
            </View>
          </View>
        </View>

        {/* Tips */}
        <View className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <Text className="text-yellow-800 font-semibold mb-2">
            💡 Conseils pour de meilleurs résultats :
          </Text>
          <Text className="text-yellow-700 text-sm leading-6">
            • Assurez-vous que votre CV de base est complet dans l'éditeur
            • Utilisez des URLs d'offres détaillées (évitez les redirections)
            • Relisez toujours le contenu généré avant de l'envoyer
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

export default MagicApplyScreen;