import React from 'react';
import { View, Text } from 'react-native';
import { ScreenContainer } from '../components/layout/ScreenContainer';

const VoiceCvCreatorScreen = () => {
  return (
    <ScreenContainer>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, color: '#888', textAlign: 'center', padding: 20 }}>
          La fonctionnalité de création de CV par la voix est temporairement désactivée pour maintenance.
        </Text>
      </View>
    </ScreenContainer>
  );
};

export default VoiceCvCreatorScreen;