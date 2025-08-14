import { Alert } from 'react-native';

// Types d'erreurs personnalisées
export class AppError extends Error {
  code: string;
  statusCode?: number;
  context?: any;

  constructor(message: string, code: string, statusCode?: number, context?: any) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.context = context;
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Erreur de connexion réseau', context?: any) {
    super(message, 'NETWORK_ERROR', 0, context);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Données invalides', context?: any) {
    super(message, 'VALIDATION_ERROR', 400, context);
    this.name = 'ValidationError';
  }
}

export class StorageError extends AppError {
  constructor(message: string = 'Erreur de stockage', context?: any) {
    super(message, 'STORAGE_ERROR', 500, context);
    this.name = 'StorageError';
  }
}

export class PermissionError extends AppError {
  constructor(message: string = 'Permission refusée', context?: any) {
    super(message, 'PERMISSION_ERROR', 403, context);
    this.name = 'PermissionError';
  }
}

export class CameraError extends AppError {
  constructor(message: string = 'Erreur de caméra', context?: any) {
    super(message, 'CAMERA_ERROR', 500, context);
    this.name = 'CameraError';
  }
}

export class SpeechError extends AppError {
  constructor(message: string = 'Erreur de reconnaissance vocale', context?: any) {
    super(message, 'SPEECH_ERROR', 500, context);
    this.name = 'SpeechError';
  }
}

export class AIServiceError extends AppError {
  constructor(message: string = 'Service IA indisponible', context?: any) {
    super(message, 'AI_SERVICE_ERROR', 503, context);
    this.name = 'AIServiceError';
  }
}

// Messages d'erreur personnalisés
const ERROR_MESSAGES: { [key: string]: string } = {
  NETWORK_ERROR: 'Vérifiez votre connexion internet et réessayez.',
  VALIDATION_ERROR: 'Les données saisies ne sont pas valides.',
  STORAGE_ERROR: 'Impossible d\'accéder au stockage local.',
  PERMISSION_ERROR: 'Permission requise pour cette fonctionnalité.',
  CAMERA_ERROR: 'Impossible d\'accéder à la caméra.',
  SPEECH_ERROR: 'Reconnaissance vocale indisponible.',
  AI_SERVICE_ERROR: 'Service IA temporairement indisponible.',
  CV_NOT_FOUND: 'CV introuvable.',
  CV_CREATION_FAILED: 'Échec de la création du CV.',
  CV_UPDATE_FAILED: 'Échec de la mise à jour du CV.',
  CV_DELETE_FAILED: 'Échec de la suppression du CV.',
  INVALID_URL: 'URL invalide ou non supportée.',
  FILE_UPLOAD_FAILED: 'Échec du téléchargement du fichier.',
  UNKNOWN_ERROR: 'Une erreur inattendue s\'est produite.'
};

// Logger pour les erreurs
export const logError = (error: Error, context?: any) => {
  console.group('🚨 Error Log');
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
  if (error instanceof AppError) {
    console.error('Code:', error.code);
    console.error('Status:', error.statusCode);
    console.error('Context:', error.context);
  }
  if (context) {
    console.error('Additional Context:', context);
  }
  console.groupEnd();

  // En production, envoyer vers un service de monitoring
  if (__DEV__ === false) {
    // Crashlytics, Sentry, etc.
    // crashlytics().recordError(error);
  }
};

// Gestionnaire d'erreur principal
export const handleError = (
  error: unknown, 
  showAlert: boolean = true,
  customTitle?: string,
  customMessage?: string
) => {
  let title = customTitle || 'Erreur';
  let message = customMessage || 'Une erreur s\'est produite.';
  let shouldShowRetry = false;

  if (error instanceof AppError) {
    logError(error);
    
    switch (error.code) {
      case 'NETWORK_ERROR':
        title = 'Connexion';
        message = ERROR_MESSAGES.NETWORK_ERROR;
        shouldShowRetry = true;
        break;
      case 'VALIDATION_ERROR':
        title = 'Données invalides';
        message = error.message || ERROR_MESSAGES.VALIDATION_ERROR;
        break;
      case 'STORAGE_ERROR':
        title = 'Stockage';
        message = ERROR_MESSAGES.STORAGE_ERROR;
        break;
      case 'PERMISSION_ERROR':
        title = 'Permission requise';
        message = error.message || ERROR_MESSAGES.PERMISSION_ERROR;
        break;
      case 'CAMERA_ERROR':
        title = 'Caméra';
        message = ERROR_MESSAGES.CAMERA_ERROR;
        break;
      case 'SPEECH_ERROR':
        title = 'Reconnaissance vocale';
        message = ERROR_MESSAGES.SPEECH_ERROR;
        break;
      case 'AI_SERVICE_ERROR':
        title = 'Service IA';
        message = ERROR_MESSAGES.AI_SERVICE_ERROR;
        shouldShowRetry = true;
        break;
      default:
        message = error.message || ERROR_MESSAGES.UNKNOWN_ERROR;
    }
  } else if (error instanceof Error) {
    logError(error);
    message = error.message;
  } else {
    console.error('Unknown error:', error);
    message = ERROR_MESSAGES.UNKNOWN_ERROR;
  }

  if (showAlert) {
    const buttons = shouldShowRetry 
      ? [
          { text: 'Annuler', style: 'cancel' as const },
          { text: 'Réessayer', onPress: () => {/* Retry logic could be passed as callback */} }
        ]
      : [{ text: 'OK' }];

    Alert.alert(title, message, buttons);
  }

  return { title, message, shouldShowRetry };
};

// Wrapper pour les fonctions async avec gestion d'erreur
export const withErrorHandling = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  errorHandler?: (error: unknown) => void
) => {
  return async (...args: T): Promise<R | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      if (errorHandler) {
        errorHandler(error);
      } else {
        handleError(error);
      }
      return null;
    }
  };
};

// Helpers pour créer des erreurs spécifiques
export const createNetworkError = (context?: any) => 
  new NetworkError('Vérifiez votre connexion internet', context);

export const createValidationError = (field: string, message: string, context?: any) => 
  new ValidationError(`${field}: ${message}`, context);

export const createStorageError = (operation: string, context?: any) => 
  new StorageError(`Erreur lors de ${operation}`, context);

export const createPermissionError = (permission: string, context?: any) => 
  new PermissionError(`Permission ${permission} requise`, context);

export const createCameraError = (operation: string, context?: any) => 
  new CameraError(`Erreur caméra: ${operation}`, context);

export const createSpeechError = (operation: string, context?: any) => 
  new SpeechError(`Erreur vocale: ${operation}`, context);

export const createAIServiceError = (service: string, context?: any) => 
  new AIServiceError(`Service ${service} indisponible`, context);

// Utilitaire pour retry automatique
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (i === maxRetries) {
        throw lastError;
      }
      
      // Délai exponentiel
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
  
  throw lastError!;
};

// Gestionnaire global pour les promesses non catchées
export const setupGlobalErrorHandling = () => {
  // En développement, React Native affiche déjà les erreurs
  if (__DEV__) {
    return;
  }

  // Configuration pour la production
  const defaultHandler = ErrorUtils.getGlobalHandler();
  
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    logError(error, { isFatal });
    
    if (isFatal) {
      // Erreur fatale - l'app va crash
      console.error('FATAL ERROR - App will crash:', error);
    }
    
    // Appeler le handler par défaut
    defaultHandler(error, isFatal);
  });
};