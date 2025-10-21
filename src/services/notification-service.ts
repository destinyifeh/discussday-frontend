import api from '@/lib/client/api';
class NotificationService {
  async getNotificationsRequestAction(
    page = 1,
    limit = 10,
    requestedNote: string,
  ) {
    const params: any = {page, limit, requestedNote};

    const res = await api.get(`/notifications`, {params});
    return res.data?.data;
  }

  async markAllAsReadRequestAction() {
    try {
      const res = await api.patch(`/notifications/mark-all-as-read`);
      return res.data;
    } catch (err: any) {
      throw err?.response?.data ?? err;
    }
  }

  async markAsReadRequestAction(id: string) {
    try {
      const res = await api.patch(`/notifications/mark-as-read/${id}`);
      return res.data;
    } catch (err: any) {
      throw err?.response?.data ?? err;
    }
  }

  async getUnreadNotificationsCounntRequestAction() {
    try {
      const res = await api.get(`/notifications/unread-notifications`);
      return res.data?.unreadData;
    } catch (err: any) {
      throw err?.response?.data ?? err;
    }
  }
}

export const notificationService = new NotificationService();
