
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import Input from '../components/common/Input';
import { Button } from '../components/common/Button';
import { getSalaryNegotiationAdvice } from '../api/geminiService';

const SalaryNegotiationScreen = () => {
  const [jobRole, setJobRole] = useState('');
  const [currentOffer, setCurrentOffer] = useState('');
  const [desiredSalary, setDesiredSalary] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [advice, setAdvice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGetAdvice = async () => {
    if (!jobRole || !currentOffer || !desiredSalary || !experienceYears) {
      Alert.alert('Informations manquantes', 'Veuillez remplir tous les champs pour obtenir des conseils.');
      return;
    }

    setIsLoading(true);
    setAdvice('');
    try {
      const adviceText = await getSalaryNegotiationAdvice(
        jobRole,
        currentOffer,
        desiredSalary,
        experienceYears
      );
      setAdvice(adviceText);
    } catch (e) {
      console.error("Erreur lors de l\'obtention des conseils :", e);
      Alert.alert('Erreur', 'Impossible d\'obtenir des conseils pour le moment.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Coaching Négociation Salariale</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contexte de la Négociation</Text>
          <Input label="Rôle du poste (ex: Développeur Senior)" value={jobRole} onChangeText={setJobRole} />
          <Input label="Offre actuelle (ex: 50000€)" value={currentOffer} onChangeText={setCurrentOffer} keyboardType="numeric" />
          <Input label="Salaire désiré (ex: 55000€)" value={desiredSalary} onChangeText={setDesiredSalary} keyboardType="numeric" />
          <Input label="Années d'expérience" value={experienceYears} onChangeText={setExperienceYears} keyboardType="numeric" />
        </View>

        <Button title="Obtenir des Conseils" onPress={handleGetAdvice} disabled={isLoading} />

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Génération des conseils...</Text>
          </View>
        )}

        {advice && !isLoading && (
          <View style={styles.adviceContainer}>
            <Text style={styles.adviceTitle}>Conseils de Négociation :</Text>
            <Text style={styles.adviceText}>{advice}</Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  loadingContainer: { marginTop: 20, alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16 },
  adviceContainer: { backgroundColor: '#f0f0f0', padding: 15, borderRadius: 10, marginTop: 20 },
  adviceTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  adviceText: { fontSize: 16, lineHeight: 24 },
});

export default SalaryNegotiationScreen;
