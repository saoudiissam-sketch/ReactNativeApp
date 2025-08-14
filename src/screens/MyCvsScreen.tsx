
import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Alert, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { Button } from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAppStore } from '../store/appStore';
import { CV } from '../types';

import { MyCvsStackScreenProps } from '../types/navigation';

const MyCvsScreen = ({ navigation }: MyCvsStackScreenProps<'MyCvsList'>) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCvName, setNewCvName] = useState('');
  
  // Utiliser le store Zustand
  const { 
    cvs, 
    loadCVs, 
    addCV, 
    deleteCV, 
    duplicateCV, 
    setCurrentCV,
    isLoading, 
    error,
    clearError 
  } = useAppStore();

  // Charger les CVs quand l'écran est focalisé
  useFocusEffect(
    React.useCallback(() => {
      loadCVs();
    }, [loadCVs])
  );

  const createNewCv = async (method: 'voice' | 'editor' | 'template') => {
    if (method === 'template' && newCvName.trim()) {
      try {
        const cvId = await addCV({
          name: newCvName,
          data: {
            personalInfo: { fullName: newCvName, jobTitle: '', email: '', phone: '' },
            experience: { jobTitle: '', company: '', startDate: '', endDate: '', description: '' },
            education: { degree: '', school: '', startDate: '', endDate: '' },
            skills: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        });
        
        setShowCreateModal(false);
        setNewCvName('');
        Alert.alert('CV créé !', `Votre nouveau CV "${newCvName}" a été créé avec succès.`);
      } catch (error) {
        Alert.alert('Erreur', 'Impossible de créer le CV');
      }
    } else {
      setShowCreateModal(false);
      if (method === 'voice') {
        navigation.navigate('VoiceCvCreator');
      } else if (method === 'editor') {
        navigation.navigate('CvCreator');
      }
    }
  };

  const handleDuplicateCV = async (cv: any) => {
    try {
      await duplicateCV(cv.id);
      Alert.alert('CV dupliqué !', 'Une copie de votre CV a été créée.');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de dupliquer le CV');
    }
  };

  const handleDeleteCV = (cvId: string, cvName: string) => {
    Alert.alert(
      'Supprimer le CV',
      `Êtes-vous sûr de vouloir supprimer "${cvName}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCV(cvId);
              Alert.alert('CV supprimé', 'Le CV a été supprimé avec succès.');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer le CV');
            }
          }
        }
      ]
    );
  };

  const handleEditCV = (cv: any) => {
    setCurrentCV(cv.id);
    navigation.navigate('CvCreator', { cvId: cv.id });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <ScreenContainer>
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
          <Text className="text-2xl font-bold text-gray-800">Mes CVs</Text>
          <TouchableOpacity
            onPress={() => setShowCreateModal(true)}
            className="bg-blue-500 w-12 h-12 rounded-full items-center justify-center shadow-lg"
          >
            <MaterialIcons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-4">
          {isLoading ? (
            <LoadingSpinner 
              text="Chargement de vos CVs..." 
              fullScreen={false}
            />
          ) : cvs.length === 0 ? (
            <View className="flex-1 justify-center items-center py-20">
              <MaterialIcons name="description" size={64} color="#ccc" />
              <Text className="text-gray-500 text-center mt-4 mb-6 text-lg">
                Vous n'avez pas encore créé de CV
              </Text>
              <Text className="text-gray-400 text-center mb-8 px-8">
                Créez votre premier CV pour commencer à postuler aux offres d'emploi
              </Text>
              <Button 
                title="Créer mon premier CV" 
                onPress={() => setShowCreateModal(true)} 
              />
            </View>
          ) : (
            <View className="space-y-4">
              {cvs.map((cv: CV) => (
                <View key={cv.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-gray-800 mb-1">
                        {cv.name}
                      </Text>
                      <Text className="text-gray-600 mb-2">
                        {cv.data.personalInfo?.jobTitle || 'Titre non défini'}
                      </Text>
                      <View className="flex-row items-center space-x-4">
                        <Text className="text-xs text-gray-500">
                          Créé le {formatDate(cv.data.createdAt)}
                        </Text>
                        <Text className="text-xs text-gray-500">
                          Modifié le {formatDate(cv.data.updatedAt)}
                        </Text>
                      </View>
                    </View>
                    
                    <View className="flex-row space-x-2">
                      <TouchableOpacity 
                        onPress={() => handleEditCV(cv)}
                        className="bg-blue-100 p-2 rounded-lg"
                      >
                        <MaterialIcons name="edit" size={20} color="#3B82F6" />
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        onPress={() => handleDuplicateCV(cv)}
                        className="bg-green-100 p-2 rounded-lg"
                      >
                        <MaterialIcons name="content-copy" size={20} color="#059669" />
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        onPress={() => handleDeleteCV(cv.id, cv.name)}
                        className="bg-red-100 p-2 rounded-lg"
                      >
                        <MaterialIcons name="delete" size={20} color="#DC2626" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  {/* Quick Stats */}
                  <View className="flex-row justify-between mt-3 pt-3 border-t border-gray-100">
                    <View className="items-center">
                      <Text className="text-xs text-gray-500">Expériences</Text>
                      <Text className="font-medium text-gray-800">
                        {cv.data.experience?.company ? '1+' : '0'}
                      </Text>
                    </View>
                    <View className="items-center">
                      <Text className="text-xs text-gray-500">Formation</Text>
                      <Text className="font-medium text-gray-800">
                        {cv.data.education?.degree ? '1+' : '0'}
                      </Text>
                    </View>
                    <View className="items-center">
                      <Text className="text-xs text-gray-500">Compétences</Text>
                      <Text className="font-medium text-gray-800">
                        {cv.data.skills ? cv.data.skills.split(',').length : '0'}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Create CV Modal */}
        <Modal
          visible={showCreateModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowCreateModal(false)}
        >
          <View className="flex-1 bg-white">
            <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
              <Text className="text-lg font-semibold">Nouveau CV</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView className="flex-1 p-6">
              <Text className="text-2xl font-bold text-center mb-2">
                Comment souhaitez-vous créer votre CV ?
              </Text>
              <Text className="text-gray-600 text-center mb-8">
                Choisissez la méthode qui vous convient le mieux
              </Text>

              <View className="space-y-4">
                {/* Voice Creation */}
                <TouchableOpacity
                  onPress={() => createNewCv('voice')}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                >
                  <View className="flex-row items-center">
                    <View className="bg-blue-500 w-12 h-12 rounded-full items-center justify-center mr-4">
                      <MaterialIcons name="mic" size={24} color="white" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-blue-800">
                        Création vocale
                      </Text>
                      <Text className="text-blue-600 text-sm">
                        Répondez aux questions à voix haute
                      </Text>
                    </View>
                    <MaterialIcons name="arrow-forward" size={20} color="#3B82F6" />
                  </View>
                </TouchableOpacity>

                {/* Classic Editor */}
                <TouchableOpacity
                  onPress={() => createNewCv('editor')}
                  className="bg-green-50 border border-green-200 rounded-lg p-4"
                >
                  <View className="flex-row items-center">
                    <View className="bg-green-500 w-12 h-12 rounded-full items-center justify-center mr-4">
                      <MaterialIcons name="edit" size={24} color="white" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-green-800">
                        Éditeur classique
                      </Text>
                      <Text className="text-green-600 text-sm">
                        Remplissez les champs étape par étape
                      </Text>
                    </View>
                    <MaterialIcons name="arrow-forward" size={20} color="#059669" />
                  </View>
                </TouchableOpacity>

                {/* Template Creation */}
                <View className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <View className="flex-row items-center mb-3">
                    <View className="bg-purple-500 w-12 h-12 rounded-full items-center justify-center mr-4">
                      <MaterialIcons name="content-copy" size={24} color="white" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-purple-800">
                        CV vide
                      </Text>
                      <Text className="text-purple-600 text-sm">
                        Créez un CV vide que vous remplirez plus tard
                      </Text>
                    </View>
                  </View>
                  
                  <Input
                    label="Nom du CV"
                    placeholder="Ex: CV Marketing, CV Développeur..."
                    value={newCvName}
                    onChangeText={setNewCvName}
                  />
                  
                  <TouchableOpacity
                    onPress={() => createNewCv('template')}
                    disabled={!newCvName.trim()}
                    className={`mt-3 py-2 rounded-lg ${
                      newCvName.trim() ? 'bg-purple-500' : 'bg-gray-300'
                    }`}
                  >
                    <Text className={`text-center font-medium ${
                      newCvName.trim() ? 'text-white' : 'text-gray-500'
                    }`}>
                      Créer CV vide
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </View>
    </ScreenContainer>
  );
};

export default MyCvsScreen;
