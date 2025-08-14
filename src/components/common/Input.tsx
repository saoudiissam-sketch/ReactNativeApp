
import React, { memo } from 'react';
import { TextInput, View, Text } from 'react-native';

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  required?: boolean;
  error?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
}

const Input: React.FC<InputProps> = memo(({ 
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  multiline,
  numberOfLines,
  required,
  error,
  keyboardType
}) => {
  return (
    <View className="w-full mb-4">
      <Text className="text-base font-medium text-gray-700 mb-2">
        {label}
        {required && <Text className="text-red-500"> *</Text>}
      </Text>
      <TextInput
        className={`border rounded-lg p-3 bg-white text-base ${
          error ? 'border-red-400' : 'border-gray-300'
        } ${multiline ? 'min-h-20' : 'h-12'}`}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
        textAlignVertical={multiline ? 'top' : 'center'}
        keyboardType={keyboardType}
      />
      {error && (
        <Text className="text-red-500 text-sm mt-1">{error}</Text>
      )}
    </View>
  );
});

Input.displayName = 'Input';

export default Input;
