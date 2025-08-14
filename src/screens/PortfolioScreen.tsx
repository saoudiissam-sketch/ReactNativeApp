
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Share, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { storage } from '../storage/mmkv';

const CV_STORAGE_KEY = 'user-cv-1';

const PortfolioScreen = () => {
  const [cvData, setCvData] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const savedCv = storage.getString(CV_STORAGE_KEY);
      if (savedCv) {
        setCvData(JSON.parse(savedCv));
      }
    }, [])
  );

  const generatePortfolioText = () => {
    if (!cvData) return '';
    return `
      PORTFOLIO
      ====================

      ${cvData.personalInfo.fullName.toUpperCase()}
      ${cvData.personalInfo.jobTitle}

      --------------------
      CONTACT
      --------------------
      - Email: ${cvData.personalInfo.email}
      - Téléphone: ${cvData.personalInfo.phone}

      --------------------
      EXPÉRIENCE
      --------------------
      **${cvData.experience.jobTitle}** chez ${cvData.experience.company}
      (${cvData.experience.startDate} - ${cvData.experience.endDate})
      *${cvData.experience.description}*

      --------------------
      FORMATION
      --------------------
      **${cvData.education.degree}** - ${cvData.education.school}
      (${cvData.education.startDate} - ${cvData.education.endDate})

      --------------------
      COMPÉTENCES CLÉS
      --------------------
      ${cvData.skills.split(',').map(s => `- ${s.trim()}`).join('\n')}
    `;
  };

  const onShare = async () => {
    try {
      const portfolioText = generatePortfolioText();
      await Share.share({
        message: portfolioText,
        title: `Portfolio de ${cvData.personalInfo.fullName}`
      });
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  if (!cvData) {
    return (
      <ScreenContainer>
        <Text style={styles.infoText}>Veuillez d'abord créer un CV pour générer un portfolio.</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView>
        <View style={styles.headerContainer}>
            <Text style={styles.name}>{cvData.personalInfo.fullName}</Text>
            <Text style={styles.jobTitle}>{cvData.personalInfo.jobTitle}</Text>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Expérience Professionnelle</Text>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>{cvData.experience.jobTitle}</Text>
                <Text style={styles.cardSubtitle}>{cvData.experience.company}</Text>
                <Text style={styles.cardDate}>{cvData.experience.startDate} - {cvData.experience.endDate}</Text>
                <Text style={styles.cardDescription}>{cvData.experience.description}</Text>
            </View>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Formation</Text>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>{cvData.education.degree}</Text>
                <Text style={styles.cardSubtitle}>{cvData.education.school}</Text>
                <Text style={styles.cardDate}>{cvData.education.startDate} - {cvData.education.endDate}</Text>
            </View>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Compétences</Text>
            <View style={styles.skillsContainer}>
                {cvData.skills.split(',').map((skill, index) => (
                    <View key={index} style={styles.skillBadge}><Text style={styles.skillText}>{skill.trim()}</Text></View>
                ))}
            </View>
        </View>

        <Button title="Partager mon Portfolio" onPress={onShare} />
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
    headerContainer: { padding: 20, alignItems: 'center', backgroundColor: '#007AFF', marginBottom: 20 },
    name: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
    jobTitle: { fontSize: 18, color: '#fff', marginTop: 5 },
    section: { marginBottom: 20, paddingHorizontal: 10 },
    sectionTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: '#333' },
    card: { backgroundColor: '#fff', padding: 15, borderRadius: 10 },
    cardTitle: { fontSize: 18, fontWeight: 'bold' },
    cardSubtitle: { fontSize: 16, color: '#555', marginVertical: 3 },
    cardDate: { fontSize: 14, color: '#888', fontStyle: 'italic', marginBottom: 8 },
    cardDescription: { fontSize: 14, lineHeight: 20 },
    skillsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
    skillBadge: { backgroundColor: '#EFEFF4', paddingVertical: 5, paddingHorizontal: 12, borderRadius: 15, marginRight: 10, marginBottom: 10 },
    skillText: { fontSize: 14 },
    infoText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#888' },
});

export default PortfolioScreen;
