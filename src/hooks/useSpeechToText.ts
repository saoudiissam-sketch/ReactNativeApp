import React, { useEffect, useState, useCallback } from 'react';
import Voice from '@react-native-voice/voice';
import { Alert } from 'react-native';
import { handleError, createSpeechError } from '../utils/errorHandler';

export const useSpeechToText = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    // Vérifier si la reconnaissance vocale est disponible
    Voice.isAvailable()
      .then((available) => setIsAvailable(available))
      .catch((e) => {
        console.error('Erreur vérification disponibilité Voice:', e);
        setIsAvailable(false);
      });

    // Configuration des callbacks
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
      // Nettoyage
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = () => {
    setIsRecording(true);
    setError(null);
  };

  const onSpeechEnd = () => {
    setIsRecording(false);
  };

  const onSpeechResults = (e: any) => {
    if (e.value && e.value.length > 0) {
      setResult(e.value[0]);
    }
  };

  const onSpeechError = React.useCallback((e: any) => {
    console.error('Erreur reconnaissance vocale:', e);
    setError(e.error?.message || 'Erreur reconnaissance vocale');
    setIsRecording(false);
  }, []);

  const startRecording = useCallback(async () => {
    if (!isAvailable) {
      const error = createSpeechError('Reconnaissance vocale indisponible');
      handleError(error);
      return;
    }

    try {
      setResult('');
      setError(null);
      await Voice.start('fr-FR'); // Français par défaut, peut être configuré
    } catch (e) {
      const error = createSpeechError('Impossible de démarrer l\'enregistrement', e);
      handleError(error, false);
      setError('Impossible de démarrer l\'enregistrement');
    }
  }, [isAvailable]);

  const stopRecording = useCallback(async () => {
    try {
      await Voice.stop();
    } catch (e) {
      const error = createSpeechError('Impossible d\'arrêter l\'enregistrement', e);
      handleError(error, false);
      console.error('Erreur arrêt enregistrement:', e);
    }
  }, []);

  const clearResult = () => {
    setResult('');
    setError(null);
  };

  return {
    isRecording,
    result,
    error,
    isAvailable,
    startRecording,
    stopRecording,
    clearResult,
    // Aliases pour compatibilité
    start: startRecording,
    stop: stopRecording,
  };
};
