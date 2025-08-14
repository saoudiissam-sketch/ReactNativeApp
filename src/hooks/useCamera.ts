import { useState, useEffect, useRef } from 'react';
import { CameraView, CameraType, FlashMode, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';

export const useCamera = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState<CameraType>('front');
  const [flashMode, setFlashMode] = useState<FlashMode>('off');
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  
  const cameraRef = useRef<CameraView | null>(null);

  useEffect(() => {
    (async () => {
      const { status: mediaLibraryStatus } = await MediaLibrary.requestPermissionsAsync();
      setHasMediaLibraryPermission(mediaLibraryStatus === 'granted');
    })();
  }, []);

  const toggleCameraType = () => {
    setCameraType(current => 
      current === 'back' ? 'front' : 'back'
    );
  };

  const toggleFlash = () => {
    setFlashMode(current => 
      current === 'off' ? 'on' : 'off'
    );
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        
        if (hasMediaLibraryPermission && photo) {
          await MediaLibrary.saveToLibraryAsync(photo.uri);
        }
        
        return photo;
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Erreur', 'Impossible de prendre la photo');
        return null;
      }
    }
    return null;
  };

  const startVideoRecording = async () => {
    if (cameraRef.current && !isRecording) {
      try {
        setIsRecording(true);
        const video = await cameraRef.current.recordAsync({
          maxDuration: 300, // 5 minutes max
        });
        
        if(video) {
          setVideoUri(video.uri);
          if (hasMediaLibraryPermission) {
            await MediaLibrary.saveToLibraryAsync(video.uri);
          }
        }
        
        return video;
      } catch (error) {
        console.error('Error starting video recording:', error);
        Alert.alert('Erreur', 'Impossible de démarrer l\'enregistrement');
        setIsRecording(false);
        return null;
      }
    }
    return null;
  };

  const stopVideoRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  };

  const clearVideo = () => {
    setVideoUri(null);
  };

  return {
    // Permissions
    permission,
    requestPermission,
    hasMediaLibraryPermission,
    
    // Camera settings
    cameraType,
    flashMode,
    toggleCameraType,
    toggleFlash,
    
    // Recording state
    isRecording,
    videoUri,
    
    // Actions
    takePicture,
    startVideoRecording,
    stopVideoRecording,
    clearVideo,
    
    // Ref
    cameraRef,
  };
};
