
import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { APP_VERSION } from '@/lib/constants';
import { ThemeToggle } from './_components/theme-toggle';
import { LanguageSelector } from './_components/language-selector';
import { NotificationSettings } from './_components/notification-settings';

export const metadata: Metadata = {
  title: 'Settings',
};

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and application settings.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the look and feel of the application.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="theme-toggle" className="text-base">Theme</Label>
            <ThemeToggle />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="language-selector" className="text-base">Language</Label>
            <LanguageSelector />
          </div>
        </CardContent>
      </Card>
      
      <NotificationSettings />

      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>Manage your account security options.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Password reset, account locking, and two-factor authentication are managed through your profile or by administrators.</p>
             <Button variant="outline" disabled>Manage Login Sessions (Coming Soon)</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Application Version: {APP_VERSION}</p>
        </CardContent>
      </Card>
    </div>
  );
}
