import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useState } from 'react';
import { Alert } from 'react-native';

export const useDocumentPicker = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerResult | null>(null);

  const pickDocument = async (options?: {
    types?: string[];
    multiple?: boolean;
    copyToCacheDirectory?: boolean;
  }) => {
    try {
      setIsLoading(true);
      
      const result = await DocumentPicker.getDocumentAsync({
        type: options?.types || ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        multiple: options?.multiple || false,
        copyToCacheDirectory: options?.copyToCacheDirectory !== false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedFile(result);
        return result;
      }
      
      return null;
    } catch (error) {
      console.error('Erreur lors de la sélection du document:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner le document');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const pickCV = async () => {
    return await pickDocument({
      types: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      multiple: false,
    });
  };

  const pickImage = async () => {
    return await pickDocument({
      types: ['image/*'],
      multiple: false,
    });
  };

  const pickMultipleFiles = async () => {
    return await pickDocument({
      multiple: true,
    });
  };

  const readFileContent = async (uri: string) => {
    try {
      const content = await FileSystem.readAsStringAsync(uri);
      return content;
    } catch (error) {
      console.error('Erreur lecture fichier:', error);
      Alert.alert('Erreur', 'Impossible de lire le contenu du fichier');
      return null;
    }
  };

  const getFileInfo = async (uri: string) => {
    try {
      const info = await FileSystem.getInfoAsync(uri);
      return info;
    } catch (error) {
      console.error('Erreur info fichier:', error);
      return null;
    }
  };

  const copyToDocumentsDirectory = async (sourceUri: string, fileName: string) => {
    try {
      const documentsDirectory = FileSystem.documentDirectory;
      const destUri = `${documentsDirectory}${fileName}`;
      
      await FileSystem.copyAsync({
        from: sourceUri,
        to: destUri,
      });
      
      return destUri;
    } catch (error) {
      console.error('Erreur copie fichier:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder le fichier');
      return null;
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
  };

  return {
    pickDocument,
    pickCV,
    pickImage,
    pickMultipleFiles,
    readFileContent,
    getFileInfo,
    copyToDocumentsDirectory,
    clearSelection,
    isLoading,
    selectedFile,
  };
};
