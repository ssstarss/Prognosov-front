export type NotificationLevel = 'error';

export interface NotificationPayload {
  id: number;
  level: NotificationLevel;
  message: string;
}

type NotificationListener = (payload: NotificationPayload) => void;

let nextNotificationId = 1;
const listeners = new Set<NotificationListener>();

export const subscribeNotifications = (listener: NotificationListener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const emit = (level: NotificationLevel, message: string) => {
  const payload: NotificationPayload = {
    id: nextNotificationId++,
    level,
    message,
  };
  listeners.forEach((listener) => listener(payload));
};

export const notifyError = (message: string) => {
  emit('error', message);
};
