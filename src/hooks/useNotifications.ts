import * as Notifications from 'expo-notifications';

// Dummy implementation to avoid breaking the app
// TODO: Fix the actual implementation which has persistent TSC errors.

export const useNotifications = () => {
  console.warn("useNotifications hook is currently disabled due to build errors.");

  return {
    expoPushToken: '',
    notification: null,
    scheduleLocalNotification: async () => null,
    cancelNotification: async () => {},
    cancelAllNotifications: async () => {},
    scheduleJobAlert: async () => null,
    scheduleInterviewReminder: async () => null,
    scheduleTaskComplete: async () => null,
    scheduleWeeklyTip: async () => null,
  };
};

// Keep the handler to avoid breaking other parts of the app if it's set globally
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
