import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { listNotifications, markNotificationAsRead } from "../../lib/api/notifications";

const POLL_INTERVAL_MS = 30000;
const LOW_STOCK_TYPE = "LOW_STOCK";

function isPageVisible() {
  if (typeof document === "undefined") {
    return true;
  }

  return document.visibilityState === "visible";
}

async function markNotificationsAsRead(notificationIds) {
  await Promise.all(
    notificationIds.map((notificationId) =>
      markNotificationAsRead(notificationId).catch(() => null),
    ),
  );
}

export function useDashboardLiveLowStockNotifications(enabled = true) {
  const initializedRef = useRef(false);
  const loadingRef = useRef(false);
  const seenNotificationIdsRef = useRef(new Set());

  useEffect(() => {
    if (!enabled) {
      initializedRef.current = false;
      seenNotificationIdsRef.current = new Set();
      return undefined;
    }

    let disposed = false;

    async function pollNotifications() {
      if (disposed || loadingRef.current || !isPageVisible()) {
        return;
      }

      loadingRef.current = true;

      try {
        const response = await listNotifications({
          page: 1,
          limit: 20,
          unreadOnly: true,
        });

        if (disposed) {
          return;
        }

        const lowStockNotifications = (response.data || []).filter(
          (notification) => notification.type === LOW_STOCK_TYPE,
        );
        const unseenNotifications = lowStockNotifications.filter(
          (notification) => !seenNotificationIdsRef.current.has(notification.id),
        );

        lowStockNotifications.forEach((notification) => {
          seenNotificationIdsRef.current.add(notification.id);
        });

        if (!initializedRef.current) {
          initializedRef.current = true;

          if (lowStockNotifications.length > 0) {
            await markNotificationsAsRead(lowStockNotifications.map((notification) => notification.id));
          }

          return;
        }

        if (unseenNotifications.length === 0) {
          return;
        }

        const sortedNotifications = [...unseenNotifications].sort(
          (left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
        );

        for (const notification of sortedNotifications) {
          toast.warning(notification.title, {
            description: notification.message,
            duration: 8000,
          });
        }

        await markNotificationsAsRead(sortedNotifications.map((notification) => notification.id));
      } catch {
        // Notifikasi realtime bersifat tambahan. Gagal polling tidak perlu mengganggu UI utama.
      } finally {
        loadingRef.current = false;
      }
    }

    function handleVisibilityChange() {
      if (isPageVisible()) {
        void pollNotifications();
      }
    }

    void pollNotifications();
    const intervalId = window.setInterval(() => {
      void pollNotifications();
    }, POLL_INTERVAL_MS);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      disposed = true;
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enabled]);
}
