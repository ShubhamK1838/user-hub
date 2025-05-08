
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { updateNotificationPreferencesApi } from '@/lib/api-client'; // Import API client

interface NotificationPreferences {
  systemAlerts: boolean;
  newLogins: boolean;
  passwordChanges: boolean;
  roleUpdates: boolean;
}

export function NotificationSettings() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    systemAlerts: true,
    newLogins: false,
    passwordChanges: true,
    roleUpdates: true,
  });
  const [mounted, setMounted] = useState(false); 

  useEffect(() => {
    setMounted(true);
    // TODO: In a real app, load preferences from user settings via API
    // e.g. const loadedPrefs = await getNotificationPreferencesApi(); setPreferences(loadedPrefs);
  }, []);

  const handlePreferenceChange = (key: keyof NotificationPreferences, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const response = await updateNotificationPreferencesApi(preferences);
      toast({
        title: "Preferences Saved",
        description: response.message || "Your notification settings have been updated.",
      });
      // Optionally update local state if API returns new state: setPreferences(response.preferences);
    } catch (error: any) {
       toast({
        variant: "destructive",
        title: "Save Failed",
        description: error.message || "Could not save your notification preferences.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!mounted) { 
    return (
        <Card>
            <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive notifications from the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="h-10 bg-muted rounded-md animate-pulse w-full"></div>
                <div className="h-10 bg-muted rounded-md animate-pulse w-full"></div>
                <div className="h-10 bg-muted rounded-md animate-pulse w-full"></div>
                <div className="h-10 bg-muted rounded-md animate-pulse w-full"></div>
                 <div className="flex justify-end pt-2">
                    <Button disabled className="w-32">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                    </Button>
                 </div>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Manage how you receive notifications from the application.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <Label htmlFor="system-alerts" className="text-sm font-medium">System Alerts</Label>
            <p className="text-xs text-muted-foreground">
              Receive important system-wide notifications.
            </p>
          </div>
          <Switch
            id="system-alerts"
            checked={preferences.systemAlerts}
            onCheckedChange={(value) => handlePreferenceChange('systemAlerts', value)}
            aria-label="Toggle system alerts"
          />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <Label htmlFor="new-logins" className="text-sm font-medium">New Login Notifications</Label>
            <p className="text-xs text-muted-foreground">
              Get notified about new logins to your account from unrecognized devices.
            </p>
          </div>
          <Switch
            id="new-logins"
            checked={preferences.newLogins}
            onCheckedChange={(value) => handlePreferenceChange('newLogins', value)}
            aria-label="Toggle new login notifications"
          />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <Label htmlFor="password-changes" className="text-sm font-medium">Password Change Alerts</Label>
             <p className="text-xs text-muted-foreground">
              Receive alerts when your password is changed.
            </p>
          </div>
          <Switch
            id="password-changes"
            checked={preferences.passwordChanges}
            onCheckedChange={(value) => handlePreferenceChange('passwordChanges', value)}
            aria-label="Toggle password change alerts"
          />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <Label htmlFor="role-updates" className="text-sm font-medium">Role Update Notifications</Label>
            <p className="text-xs text-muted-foreground">
              Get notified if your user roles or permissions are modified.
            </p>
          </div>
          <Switch
            id="role-updates"
            checked={preferences.roleUpdates}
            onCheckedChange={(value) => handlePreferenceChange('roleUpdates', value)}
            aria-label="Toggle role update notifications"
          />
        </div>
        <div className="flex justify-end pt-2">
          <Button onClick={handleSaveChanges} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
