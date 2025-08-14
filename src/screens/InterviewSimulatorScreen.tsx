
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Voice from '@react-native-voice/voice';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { getInterviewFeedback, InterviewFeedback } from '../api/geminiService';

const questions = [
  "Parlez-moi de vous.",
  "Quels sont vos points forts et vos points faibles ?",
  "Pourquoi souhaitez-vous travailler pour notre entreprise ?",
  "Où vous voyez-vous dans 5 ans ?"
];

const InterviewSimulatorScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [error, setError] = useState('');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);

  useEffect(() => {
    Voice.onSpeechStart = () => setIsRecording(true);
    Voice.onSpeechEnd = () => setIsRecording(false);
    Voice.onSpeechError = (e: any) => setError(e.error?.message);
    Voice.onSpeechResults = (e: any) => setRecognizedText(e.value ? e.value[0] : '');
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startRecording = async () => {
    setRecognizedText('');
    setError('');
    setFeedback(null);
    try {
      await Voice.start('fr-FR');
    } catch (e) { console.error(e); }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
    } catch (e) { console.error(e); }
  };

  const handleGetFeedback = async () => {
    if (!recognizedText) return;
    setIsAnalyzing(true);
    try {
      const result = await getInterviewFeedback(questions[currentQuestionIndex], recognizedText);
      setFeedback(result);
    } catch (e) {
      Alert.alert("Erreur", "Impossible d'obtenir le feedback.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNextQuestion = () => {
    setRecognizedText('');
    setFeedback(null);
    setError('');
    if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
    } else {
        // End of interview
        setIsInterviewStarted(false);
        setCurrentQuestionIndex(0);
    }
  };

  if (!permission) {
    return <ScreenContainer><View style={styles.centered}><Text>Chargement des permissions...</Text></View></ScreenContainer>;
  }

  if (!permission.granted) {
    return (
      <ScreenContainer>
        <View style={styles.centered}>
          <Text style={styles.permissionText}>Nous avons besoin de votre permission pour utiliser la caméra et le microphone.</Text>
          <Button onPress={requestPermission} title="Accorder la permission" />
        </View>
      </ScreenContainer>
    );
  }

  if (!isInterviewStarted) {
    return (
      <ScreenContainer>
        <View style={styles.centered}>
          <Text style={styles.header}>Simulateur d'Entretien</Text>
          <Text style={styles.instructions}>Préparez-vous. Une question s'affichera et vous pourrez enregistrer votre réponse.</Text>
          <Button title="Démarrer l'entretien" onPress={() => setIsInterviewStarted(true)} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <View style={styles.fullScreen}>
      <CameraView style={styles.camera} facing={'front'} />
      <View style={styles.overlay}>
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{questions[currentQuestionIndex]}</Text>
        </View>
        
        <View style={styles.feedbackDisplay}>
            {isAnalyzing && <ActivityIndicator size="large" color="#fff" />}
            {feedback && (
            <View style={styles.feedbackContainer}>
                <Text style={styles.feedbackTitle}>Votre Feedback</Text>
                <View style={styles.feedbackCard}>
                <Text style={styles.feedbackHeader}>Clarté</Text>
                <Text>{feedback.clarity}</Text>
                </View>
                <View style={styles.feedbackCard}>
                <Text style={styles.feedbackHeader}>Pertinence</Text>
                <Text>{feedback.relevance}</Text>
                </View>
                <View style={styles.feedbackCard}>
                <Text style={styles.feedbackHeader}>Suggestions</Text>
                {feedback.suggestions.map((s, i) => <Text key={i}>• {s}</Text>)}
                </View>
            </View>
            )}
        </View>

        <View style={styles.controlsContainer}>
          {!isRecording && recognizedText && !feedback && !isAnalyzing && (
            <Button title="Analyser ma réponse" onPress={handleGetFeedback} />
          )}
          {feedback && (
            <Button title={currentQuestionIndex === questions.length - 1 ? "Terminer" : "Question Suivante"} onPress={handleNextQuestion} />
          )}
          <TouchableOpacity 
              style={[styles.recordButton, isRecording ? styles.recordingButton : {}, (!!feedback || isAnalyzing) && styles.disabledButton]}
              onPress={isRecording ? stopRecording : startRecording}
              disabled={!!feedback || isAnalyzing}
          >
              <Text style={styles.recordButtonText}>{isRecording ? 'Arrêter' : 'Parler'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  permissionText: { fontSize: 18, textAlign: 'center', marginBottom: 20 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  instructions: { fontSize: 16, textAlign: 'center', marginBottom: 30, color: '#555' },
  fullScreen: { flex: 1 },
  camera: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between', padding: 20, paddingTop: 60 },
  questionContainer: { backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: 10, padding: 20 },
  questionText: { color: 'white', fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  controlsContainer: { alignItems: 'center', paddingBottom: 20 },
  recordButton: { backgroundColor: '#007AFF', width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: 'white', marginTop: 10 },
  recordingButton: { backgroundColor: '#FF453A' },
  disabledButton: { backgroundColor: '#999' },
  recordButtonText: { color: 'white', fontSize: 16 },
  feedbackDisplay: { minHeight: 250, justifyContent: 'center' },
  feedbackContainer: { backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 10, padding: 15, marginVertical: 10 },
  feedbackTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  feedbackCard: { marginBottom: 10 },
  feedbackHeader: { fontSize: 16, fontWeight: 'bold' },
});

export default InterviewSimulatorScreen;
