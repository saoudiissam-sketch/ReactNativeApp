import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { MainTabScreenProps } from '../types/navigation';

const ProfileScreen = ({ navigation }: MainTabScreenProps<'Profil'>) => (
  <ScreenContainer>
    <View style={styles.container}>
      <Text style={styles.title}>Mon Profil</Text>
      
      <View style={styles.infoCard}>
        <Text style={styles.label}>Nom :</Text>
        <Text style={styles.info}>Jean Dupont (Exemple)</Text>
        <Text style={styles.label}>Email :</Text>
        <Text style={styles.info}>jean.dupont@email.com</Text>
      </View>

      <Button 
        title="Voir mon Portfolio"
        onPress={() => navigation.navigate('Portfolio')}
      />

      {/* D'autres options de profil pourraient être ajoutées ici */}
    </View>
  </ScreenContainer>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 12,
    fontSize: 16,
    color: '#555',
  },
  info: {
    fontSize: 16,
    marginBottom: 8,
  }
});

export default ProfileScreen;
