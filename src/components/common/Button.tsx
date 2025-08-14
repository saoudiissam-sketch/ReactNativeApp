import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type ButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

export const Button: React.FC<ButtonProps> = ({ title, onPress, disabled }) => (
  <TouchableOpacity 
    style={[styles.button, disabled && styles.disabledButton]} 
    onPress={onPress}
    disabled={disabled}
  >
    <Text style={[styles.text, disabled && styles.disabledText]}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
    opacity: 0.6,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledText: {
    color: '#d1d5db',
  },
});
