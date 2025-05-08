
import type { NotificationMessage } from './types';
import { 
  getNotificationsApi,
  markNotificationAsReadApi,
  markAllNotificationsAsReadApi,
  clearAllNotificationsApi
} from './api-client';

export async function getNotifications(
  status?: 'unread' | 'all',
  page?: number,
  limit?: number
): Promise<{ notifications: NotificationMessage[]; total: number; unreadCount: number }> {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (page) params.append('page', String(page));
  if (limit) params.append('limit', String(limit));

  try {
    const response = await getNotificationsApi(params);
    return {
      notifications: response.notifications,
      total: response.total,
      unreadCount: response.unreadCount,
    };
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    return { notifications: [], total: 0, unreadCount: 0 };
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<NotificationMessage | null> {
  try {
    const response = await markNotificationAsReadApi(notificationId);
    return response.notification;
  } catch (error) {
    console.error(`Failed to mark notification ${notificationId} as read:`, error);
    return null;
  }
}

export async function markAllNotificationsAsRead(): Promise<{ success: boolean; message: string; unreadCountAfter: number } | null> {
  try {
    return await markAllNotificationsAsReadApi();
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
    return null;
  }
}

export async function clearAllNotifications(): Promise<{ success: boolean; message: string } | null> {
  try {
    return await clearAllNotificationsApi();
  } catch (error) {
    console.error('Failed to clear all notifications:', error);
    return null;
  }
}
