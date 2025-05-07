
import type { Metadata } from 'next';
import { UserForm } from '../_components/user-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

export const metadata: Metadata = {
  title: 'Create User',
};

export default function CreateUserPage() {
  return (
    <div className="space-y-6">
       <Breadcrumbs
        segments={[
          { label: 'Users', href: '/users' },
          { label: 'Create User' },
        ]}
      />
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Create New User</CardTitle>
          <CardDescription>Fill in the details below to add a new user to the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <UserForm />
        </CardContent>
      </Card>
    </div>
  );
}
