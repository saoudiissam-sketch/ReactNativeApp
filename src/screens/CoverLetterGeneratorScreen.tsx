
import React, { useState } from 'react';
import { ScrollView, View, Text, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import Input from '../components/common/Input';
import { Button } from '../components/common/Button';
import { storage } from '../storage/mmkv'; // Import du stockage
import { generateCoverLetter } from '../api/geminiService'; // Import du service IA

const CV_STORAGE_KEY = 'user-cv-1';

const CoverLetterGeneratorScreen = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      Alert.alert('Erreur', 'Veuillez coller une description de poste.');
      return;
    }

    // 1. Récupérer le CV depuis le stockage
    const savedCv = storage.getString(CV_STORAGE_KEY);
    if (!savedCv) {
      Alert.alert('CV manquant', 'Veuillez d\'abord créer et sauvegarder un CV avant de générer une lettre de motivation.');
      return;
    }

    try {
      const cvData = JSON.parse(savedCv);
      setIsLoading(true);
      setGeneratedLetter('');

      // 2. Appeler le service IA avec les données
      const letter = await generateCoverLetter(cvData, jobDescription);
      
      // 3. Afficher le résultat
      setGeneratedLetter(letter);

    } catch (error) {
      console.error("Erreur lors de la génération de la lettre :", error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la communication avec le service IA.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <Text style={styles.header}>Générateur de Lettre de Motivation</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Collez l'offre d'emploi</Text>
          <Input
            label="Description du poste"
            value={jobDescription}
            onChangeText={setJobDescription}
            multiline
            numberOfLines={10}
            placeholder="Collez ici l'intégralité de l'annonce..."
          />
        </View>

        <Button title="Générer la Lettre" onPress={handleGenerate} disabled={isLoading} />

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Génération en cours...</Text>
          </View>
        )}

        {generatedLetter && !isLoading && (
          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>2. Résultat</Text>
            <Text style={styles.letterText}>{generatedLetter}</Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 15,
    color: '#444',
  },
  loadingContainer: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  resultSection: {
    marginTop: 30,
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  letterText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});

export default CoverLetterGeneratorScreen;
