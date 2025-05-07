
import type { NotificationMessage } from './types';
import { subDays, subHours, formatISO } from 'date-fns';

// Dummy notification data
const dummyNotifications: NotificationMessage[] = [
  { id: 'notif001', timestamp: subHours(new Date(), 1).toISOString(), title: 'Password Changed', message: 'Your password was successfully changed from a new device.', read: false, type: 'security' },
  { id: 'notif002', timestamp: subDays(new Date(), 1).toISOString(), title: 'New Feature: AI Role Suggestion', message: 'Check out the new AI-powered role suggestion tool in Role Management.', read: false, type: 'announcement' },
  { id: 'notif003', timestamp: subDays(new Date(), 2).toISOString(), title: 'Maintenance Scheduled', message: 'Scheduled maintenance on Sunday at 2 AM UTC. Expect brief downtime.', read: true, type: 'system' },
  { id: 'notif004', timestamp: subDays(new Date(), 3).toISOString(), title: 'Your export is ready', message: 'The user data export you requested is complete and available for download.', read: true, type: 'info' },
  { id: 'notif005', timestamp: subHours(new Date(), 6).toISOString(), title: 'New Login Alert', message: 'A new login to your account was detected from an unrecognized device in London, UK.', read: false, type: 'security'},
  { id: 'notif006', timestamp: subDays(new Date(), 4).toISOString(), title: 'User Role Updated', message: 'Your role has been updated to ROLE_MANAGER by admin@example.com.', read: true, type: 'info' },
];

// Simulate a delay for API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getNotifications(
  // Potentially add pagination/filtering params later
): Promise<{ notifications: NotificationMessage[]; total: number, unreadCount: number }> {
  await delay(200); // Simulate network delay
  const unread = dummyNotifications.filter(n => !n.read).length;
  // Return notifications sorted by timestamp, newest first
  const sortedNotifications = [...dummyNotifications].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return { notifications: sortedNotifications, total: sortedNotifications.length, unreadCount: unread };
}

// Future functions like markAsRead, clearAll etc. could be added here
// export async function markNotificationAsRead(id: string): Promise<boolean> { ... }
// export async function markAllNotificationsAsRead(): Promise<boolean> { ... }
