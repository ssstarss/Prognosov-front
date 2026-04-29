import { useEffect, useMemo, useRef, useState } from 'react';
import { NotificationPayload, subscribeNotifications } from './notificationBus';
import './notifications.scss';

type ToastItem = NotificationPayload & {
  isVisible: boolean;
  isLeaving: boolean;
};

const CLOSE_ANIMATION_MS = 450;
const AUTO_CLOSE_MS = 10000;

function ErrorToast({
  item,
  onClose,
}: {
  item: ToastItem;
  onClose: (id: number) => void;
}) {
  const closeStartedRef = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (closeStartedRef.current) return;
      closeStartedRef.current = true;
      onClose(item.id);
    }, AUTO_CLOSE_MS);
    return () => {
      window.clearTimeout(timer);
    };
  }, [item.id, onClose]);

  const className = useMemo(() => {
    let stateClass = '';
    if (item.isVisible) stateClass = 'errorToast--visible';
    if (item.isLeaving) stateClass = 'errorToast--leaving';
    return `errorToast ${stateClass}`.trim();
  }, [item.isVisible, item.isLeaving]);

  return (
    <div
      className={className}
      onClick={() => {
        if (closeStartedRef.current) return;
        closeStartedRef.current = true;
        onClose(item.id);
      }}
      role="alert"
      aria-live="assertive"
    >
      {item.message}
    </div>
  );
}

export default function ErrorNotifications() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    return subscribeNotifications((payload) => {
      setItems((prev) => [...prev, { ...payload, isVisible: false, isLeaving: false }]);
      window.requestAnimationFrame(() => {
        setItems((prev) => prev.map((item) => (item.id === payload.id ? { ...item, isVisible: true } : item)));
      });
    });
  }, []);

  const startClose = (id: number) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, isLeaving: true, isVisible: false } : item)));
    window.setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }, CLOSE_ANIMATION_MS);
  };

  return (
    <div className="errorNotificationsHost">
      {items.map((item) => (
        <ErrorToast key={item.id} item={item} onClose={startClose} />
      ))}
    </div>
  );
}
