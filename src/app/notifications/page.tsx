
import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format, subDays, subHours } from 'date-fns';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

export const metadata: Metadata = {
  title: 'Notifications',
};

// Dummy notification data
const notifications = [
  { id: 'notif001', timestamp: subHours(new Date(), 1).toISOString(), title: 'Password Changed', message: 'Your password was successfully changed from a new device.', read: false, type: 'security' },
  { id: 'notif002', timestamp: subDays(new Date(), 1).toISOString(), title: 'New Feature: AI Role Suggestion', message: 'Check out the new AI-powered role suggestion tool in Role Management.', read: false, type: 'announcement' },
  { id: 'notif003', timestamp: subDays(new Date(), 2).toISOString(), title: 'Maintenance Scheduled', message: 'Scheduled maintenance on Sunday at 2 AM UTC. Expect brief downtime.', read: true, type: 'system' },
  { id: 'notif004', timestamp: subDays(new Date(), 3).toISOString(), title: 'Your export is ready', message: 'The user data export you requested is complete and available for download.', read: true, type: 'info' },
];


export default function NotificationsPage() {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <Breadcrumbs segments={[{ label: 'Notifications' }]} />
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
             <h1 className="text-3xl font-bold tracking-tight flex items-center">
                <Bell className="mr-3 h-8 w-8 text-primary" />
                Notifications
            </h1>
            <p className="text-muted-foreground">
                {unreadCount > 0 ? `You have ${unreadCount} unread notifications.` : 'No new notifications.'}
            </p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" disabled><CheckCheck className="mr-2 h-4 w-4" />Mark All as Read (Coming Soon)</Button>
            <Button variant="destructive" disabled><Trash2 className="mr-2 h-4 w-4" />Clear All (Coming Soon)</Button>
        </div>
      </div>
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>Stay updated with important events and alerts.</CardDescription>
        </CardHeader>
        <CardContent>
          {notifications.length > 0 ? (
            <ul className="space-y-4">
              {notifications.map((notification) => (
                <li key={notification.id} className={`p-4 rounded-lg border ${notification.read ? 'bg-card' : 'bg-primary/5 border-primary/20'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={`font-semibold ${!notification.read ? 'text-primary' : ''}`}>{notification.title}</h3>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {format(new Date(notification.timestamp), 'MMM d, HH:mm')}
                    </span>
                  </div>
                  {!notification.read && (
                    <Button size="sm" variant="link" className="p-0 h-auto mt-2 text-primary" disabled>Mark as read</Button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center py-8 text-muted-foreground">You have no notifications.</p>
          )}
        </CardContent>
      </Card>
       <p className="text-center text-sm text-muted-foreground">
        This is a simplified notification system. Full implementation would include real-time updates and user-specific notifications.
      </p>
    </div>
  );
}
