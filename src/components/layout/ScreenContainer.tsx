import React from 'react';
import { View, StyleSheet } from 'react-native';

type Props = {
  children: React.ReactNode;
};

export const ScreenContainer: React.FC<Props> = ({ children }) => (
  <View style={styles.container}>{children}</View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
});
