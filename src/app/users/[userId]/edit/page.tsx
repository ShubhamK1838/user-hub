
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { UserForm } from '../../_components/user-form';
import { getUserById } from '@/lib/users';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

interface EditUserPageProps {
  params: {
    userId: string;
  };
}

export async function generateMetadata({ params }: EditUserPageProps): Promise<Metadata> {
  const user = await getUserById(params.userId);
  return {
    title: user ? `Edit User: ${user.firstName} ${user.lastName}` : 'User Not Found',
  };
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const user = await getUserById(params.userId);

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
       <Breadcrumbs
        segments={[
          { label: 'Users', href: '/users' },
          { label: user ? `${user.firstName} ${user.lastName}` : params.userId, href: `/users/${params.userId}` },
          { label: 'Edit' },
        ]}
      />
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Edit User: {user.firstName} {user.lastName}</CardTitle>
          <CardDescription>Update the user's details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <UserForm existingUser={user} />
        </CardContent>
      </Card>
    </div>
  );
}
