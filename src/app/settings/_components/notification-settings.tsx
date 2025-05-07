
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } // Import useState and useEffect
from 'react';
import { Loader2 } from 'lucide-react';

interface NotificationPreferences {
  systemAlerts: boolean;
  newLogins: boolean;
  passwordChanges: boolean;
  roleUpdates: boolean;
}

export function NotificationSettings() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  // Initialize state for preferences using useState
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    systemAlerts: true,
    newLogins: false,
    passwordChanges: true,
    roleUpdates: true,
  });
  const [mounted, setMounted] = useState(false); // To avoid hydration mismatch

  useEffect(() => {
    setMounted(true);
    // In a real app, load preferences from user settings
    // For now, we use the default state.
  }, []);

  const handlePreferenceChange = (key: keyof NotificationPreferences, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In a real app, save preferences to backend
    toast({
      title: "Preferences Saved",
      description: "Your notification settings have been updated.",
    });
    setIsSaving(false);
  };

  if (!mounted) { // Render nothing or a loader on the server to prevent hydration mismatch
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

