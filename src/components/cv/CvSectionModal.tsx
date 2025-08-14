import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Input from '../common/Input';

interface CvSectionModalProps {
  visible: boolean;
  title: string;
  data: any;
  onClose: () => void;
  onSave: (data: any) => void;
  fields: {
    key: string;
    label: string;
    type?: 'text' | 'multiline';
    required?: boolean;
  }[];
}

const CvSectionModal: React.FC<CvSectionModalProps> = ({
  visible,
  title,
  data,
  onClose,
  onSave,
  fields,
}) => {
  const [formData, setFormData] = useState(data);

  const handleFieldChange = (key: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#666" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900">{title}</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text className="text-blue-500 font-medium">Sauvegarder</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <ScrollView className="flex-1 p-4">
          {fields.map((field) => (
            <View key={field.key} className="mb-4">
              <Input
                label={field.label}
                value={formData[field.key] || ''}
                onChangeText={(text) => handleFieldChange(field.key, text)}
                multiline={field.type === 'multiline'}
                numberOfLines={field.type === 'multiline' ? 4 : 1}
                required={field.required}
              />
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};

export default CvSectionModal;