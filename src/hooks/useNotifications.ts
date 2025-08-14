import * as Notifications from 'expo-notifications';
import { useState, useEffect, useRef } from 'react';
import { Platform, Alert } from 'react-native';
import Constants from 'expo-constants';

// Configuration des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState<string>('');
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setExpoPushToken(token);
      }
    });

    // Listener pour les notifications reçues
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // Listener pour les interactions avec les notifications
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const registerForPushNotificationsAsync = async (): Promise<string | null> => {
    let token: string | null = null;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      Alert.alert('Permission refusée', 'Vous ne recevrez pas de notifications push');
      return null;
    }
    
    try {
      const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
      if (!projectId) {
        throw new Error('Project ID not found');
      }
      
      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log('Expo push token:', token);
    } catch (e) {
      console.error('Error getting push token:', e);
    }

    return token;
  };

  const scheduleLocalNotification = async (
    title: string, 
    body: string, 
    trigger?: Notifications.NotificationTriggerInput
  ) => {
    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: { timestamp: Date.now() },
        },
        trigger: trigger || null,
      });
      return id;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  };

  const cancelNotification = async (notificationId: string) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  };

  const cancelAllNotifications = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  };

  // Notifications spécifiques à l'app
  const scheduleJobAlert = async (jobTitle: string, company: string) => {
    return await scheduleLocalNotification(
      '🎯 Nouvelle opportunité !',
      `Un poste "${jobTitle}" chez ${company} correspond à votre profil`,
      {
        seconds: 5, // Test immédiat
      }
    );
  };

  const scheduleInterviewReminder = async (company: string, date: Date) => {
    return await scheduleLocalNotification(
      '📅 Rappel d\'entretien',
      `N'oubliez pas votre entretien chez ${company} aujourd'hui !`,
      {
        date: new Date(date.getTime() - 2 * 60 * 60 * 1000), // 2h avant
      }
    );
  };

  const scheduleTaskComplete = async (taskType: string) => {
    return await scheduleLocalNotification(
      '✅ Tâche terminée !',
      `Votre ${taskType} a été traité avec succès`
    );
  };

  const scheduleWeeklyTip = async () => {
    const tips = [
      'Mettez à jour votre CV régulièrement avec vos nouvelles compétences',
      'Pratiquez vos réponses d\'entretien avec notre simulateur',
      'Explorez les nouvelles offres d\'emploi qui correspondent à votre profil',
      'Utilisez Magic Apply pour postuler plus efficacement',
    ];
    
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    
    return await scheduleLocalNotification(
      '💡 Conseil carrière',
      randomTip,
      {
        weekday: 1, // Lundi
        hour: 9,
        minute: 0,
        repeats: true,
      }
    );
  };

  return {
    expoPushToken,
    notification,
    scheduleLocalNotification,
    cancelNotification,
    cancelAllNotifications,
    // Notifications spécialisées
    scheduleJobAlert,
    scheduleInterviewReminder,
    scheduleTaskComplete,
    scheduleWeeklyTip,
  };
};
