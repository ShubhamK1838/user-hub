
"use client";

import { useEffect, useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, CheckCheck, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, clearAllNotifications } from '@/lib/notifications';
import type { NotificationMessage } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';


export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await getNotifications(); // Assuming default params for now
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to load notifications.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Notifications | User Hub";
    fetchNotifications();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMarkAsRead = async (id: string) => {
    startTransition(async () => {
      const result = await markNotificationAsRead(id);
      if (result) {
        toast({ title: 'Success', description: 'Notification marked as read.' });
        fetchNotifications(); // Refresh list
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to mark notification as read.' });
      }
    });
  };

  const handleMarkAllRead = async () => {
    startTransition(async () => {
      const result = await markAllNotificationsAsRead();
      if (result?.success) {
        toast({ title: 'Success', description: result.message });
        fetchNotifications();
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result?.message || 'Failed to mark all as read.' });
      }
    });
  };

  const handleClearAll = async () => {
     startTransition(async () => {
      const result = await clearAllNotifications();
      if (result?.success) {
        toast({ title: 'Success', description: result.message });
        fetchNotifications();
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result?.message || 'Failed to clear notifications.' });
      }
    });
  };


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
                {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}.` : 'No new notifications.'}
            </p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" onClick={handleMarkAllRead} disabled={isPending || unreadCount === 0}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <CheckCheck className="mr-2 h-4 w-4" />Mark All as Read
            </Button>
            <Button variant="destructive" onClick={handleClearAll} disabled={isPending || notifications.length === 0}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Trash2 className="mr-2 h-4 w-4" />Clear All
            </Button>
        </div>
      </div>
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>Stay updated with important events and alerts.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
             <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
          ) : notifications.length > 0 ? (
            <ul className="space-y-4">
              {notifications.map((notification: NotificationMessage) => (
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
                    <Button size="sm" variant="link" className="p-0 h-auto mt-2 text-primary" onClick={() => handleMarkAsRead(notification.id)} disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Mark as read
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center py-8 text-muted-foreground">You have no notifications.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
