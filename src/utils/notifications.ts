/**
 * Checks the current permission status for notifications.
 * @returns Promise<NotificationPermission> - 'granted', 'denied', or 'default'.
 */
export const getNotificationPermissionStatus = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    console.warn('Notifications API not supported in this browser.');
    return 'denied'; // Treat as denied if not supported
  }
  return Notification.permission;
};

/**
 * Requests permission from the user to show notifications.
 * @returns Promise<NotificationPermission> - The permission result ('granted', 'denied', 'default').
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    console.warn('Notifications API not supported.');
    return 'denied';
  }

  const permission = await Notification.requestPermission();
  console.log('Notification permission status:', permission);
  return permission;
};

/**
 * Shows a simple notification if permission is granted.
 * NOTE: This is a basic example. Real reminders would need scheduling.
 * @param title The title of the notification.
 * @param options Notification options (body, icon, etc.).
 */
export const showSimpleNotification = (title: string, options?: NotificationOptions) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    console.log('Cannot show notification - permission not granted or API not supported.');
    return;
  }
  
  // Use service worker registration if available for more persistent notifications
  // navigator.serviceWorker.ready.then((registration) => {
  //   registration.showNotification(title, options);
  // });
  
  // Basic fallback
  new Notification(title, options);
}; 