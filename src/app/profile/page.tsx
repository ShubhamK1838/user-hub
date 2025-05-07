
import type { Metadata } from 'next';
import { getCurrentUser } from '@/lib/users';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Edit, KeyRound, ShieldCheck } from 'lucide-react';
import { ProfileForm } from './_components/profile-form';
import { ChangePasswordForm } from './_components/change-password-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: 'My Profile',
};

export default async function ProfilePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    // This should ideally redirect to login, but for now, show not found.
    // In a real app with auth, this page would be protected.
    notFound(); 
  }
  
  const initials = `${currentUser.firstName?.[0] ?? ""}${currentUser.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary">
              <AvatarImage src={`https://picsum.photos/seed/${currentUser.id}/64/64`} alt={`${currentUser.firstName} ${currentUser.lastName}`} data-ai-hint="profile avatar" />
              <AvatarFallback className="text-xl">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{`${currentUser.firstName} ${currentUser.lastName}`}</h1>
              <p className="text-muted-foreground">{currentUser.email}</p>
            </div>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="profile"><Edit className="mr-2 h-4 w-4" />Edit Profile</TabsTrigger>
          <TabsTrigger value="security"><KeyRound className="mr-2 h-4 w-4" />Security</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details.</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm user={currentUser} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChangePasswordForm userId={currentUser.id} />
            </CardContent>
          </Card>
          {/* Placeholder for 2FA settings */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
              <CardDescription>Enhance your account security.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Two-factor authentication adds an extra layer of security to your account by requiring more than just a password to log in.
              </p>
              <Button disabled>Enable 2FA (Coming Soon)</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
