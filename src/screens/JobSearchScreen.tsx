import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Modal, TextInput, TouchableOpacity, Alert } from 'react-native';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { JobApplication, ApplicationStatus } from '../types';
import { storage } from '../storage/mmkv';

const APPLICATIONS_KEY = 'tracked-applications';

const JobSearchScreen = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newAppData, setNewAppData] = useState({ companyName: '', jobTitle: '', dateApplied: new Date().toLocaleDateString('fr-CA') });

  useEffect(() => {
    const savedApps = storage.getString(APPLICATIONS_KEY);
    if (savedApps) {
      setApplications(JSON.parse(savedApps));
    }
  }, []);

  const handleSaveApplication = () => {
    if (!newAppData.companyName || !newAppData.jobTitle) {
      Alert.alert('Erreur', 'Veuillez remplir le nom de l\'entreprise et l\'intitulé du poste.');
      return;
    }
    const newApplication: JobApplication = {
      id: Date.now().toString(),
      status: 'Applied',
      ...newAppData,
    };
    const updatedApplications = [...applications, newApplication];
    setApplications(updatedApplications);
    storage.set(APPLICATIONS_KEY, JSON.stringify(updatedApplications));
    setIsModalVisible(false);
    setNewAppData({ companyName: '', jobTitle: '', dateApplied: new Date().toLocaleDateString('fr-CA') });
  };

  const renderStatus = (status: ApplicationStatus) => {
    const style = [styles.status, styles[`status${status}`]];
    return <Text style={style}>{status}</Text>;
  };

  return (
    <ScreenContainer>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Mes Candidatures</Text>
        <Button title="Ajouter" onPress={() => setIsModalVisible(true)} />
      </View>

      <FlatList
        data={applications}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.jobTitle}>{item.jobTitle}</Text>
                {renderStatus(item.status)}
            </View>
            <Text style={styles.companyName}>{item.companyName}</Text>
            <Text style={styles.date}>Postulé le : {item.dateApplied}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Aucune candidature suivie pour le moment.</Text>}
      />

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ajouter une Candidature</Text>
            <TextInput placeholder="Nom de l'entreprise" style={styles.input} onChangeText={text => setNewAppData(d => ({ ...d, companyName: text }))} />
            <TextInput placeholder="Intitulé du poste" style={styles.input} onChangeText={text => setNewAppData(d => ({ ...d, jobTitle: text }))} />
            <TextInput placeholder="Date (AAAA-MM-JJ)" value={newAppData.dateApplied} style={styles.input} onChangeText={text => setNewAppData(d => ({ ...d, dateApplied: text }))} />
            <View style={styles.modalButtons}>
              <Button title="Annuler" onPress={() => setIsModalVisible(false)} color="#FF453A" />
              <Button title="Sauvegarder" onPress={handleSaveApplication} />
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingHorizontal: 10 },
  title: { fontSize: 28, fontWeight: 'bold' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginVertical: 8, marginHorizontal: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  jobTitle: { fontSize: 18, fontWeight: 'bold', flexShrink: 1, paddingRight: 10 },
  companyName: { fontSize: 16, color: '#555', marginVertical: 5 },
  date: { fontSize: 14, color: '#888' },
  status: { paddingVertical: 3, paddingHorizontal: 8, borderRadius: 10, color: '#fff', fontSize: 12, fontWeight: 'bold', overflow: 'hidden' },
  statusApplied: { backgroundColor: '#007AFF' },
  statusInterviewing: { backgroundColor: '#FF9500' },
  statusOffer: { backgroundColor: '#34C759' },
  statusRejected: { backgroundColor: '#FF3B30' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#888' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '90%', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 15 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
});

export default JobSearchScreen;
