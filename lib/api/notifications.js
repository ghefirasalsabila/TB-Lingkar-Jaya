import { api } from "./core";
import { toParams, unwrap, unwrapPaginated } from "./helpers";

export async function listNotifications(query = {}) {
  const response = await api.get("/notifications", {
    params: toParams(query),
    skipSuccessToast: true,
    skipErrorToast: true,
  });

  return unwrapPaginated(response);
}

export async function markNotificationAsRead(notificationId) {
  const response = await api.patch(`/notifications/${notificationId}/read`, null, {
    skipSuccessToast: true,
    skipErrorToast: true,
  });

  return unwrap(response);
}
