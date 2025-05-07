
import type { Metadata } from 'next';
import { notFound }
from 'next/navigation';
import { getUserById } from '@/lib/users';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { CheckCircle, XCircle, CalendarDays, UserCog, ShieldCheck, Edit, ArrowLeft } from 'lucide-react';
import type { UserStatus } from '@/lib/types';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

interface UserDetailPageProps {
  params: {
    userId: string;
  };
}

export async function generateMetadata({ params }: UserDetailPageProps): Promise<Metadata> {
  const user = await getUserById(params.userId);
  return {
    title: user ? `User: ${user.firstName} ${user.lastName}` : 'User Not Found',
  };
}

function getUserStatus(user: import('@/lib/types').User): UserStatus {
  return user.enabled && user.accountNonLocked && user.accountNonExpired ? 'Active' : 'Disabled';
}

function DetailItem({ label, value, icon: Icon }: { label: string; value: string | React.ReactNode; icon?: React.ElementType }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-border last:border-b-0">
      <dt className="w-full sm:w-1/3 text-sm font-medium text-muted-foreground flex items-center">
        {Icon && <Icon className="mr-2 h-4 w-4 text-primary" />}
        {label}
      </dt>
      <dd className="w-full sm:w-2/3 mt-1 text-sm text-foreground sm:mt-0">{value}</dd>
    </div>
  );
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const user = await getUserById(params.userId);

  if (!user) {
    notFound();
  }

  const status = getUserStatus(user);
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="space-y-6">
      <Breadcrumbs
        segments={[
          { label: 'Users', href: '/users' },
          { label: user ? `${user.firstName} ${user.lastName}` : params.userId },
        ]}
      />
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-primary">
              <AvatarImage src={`https://picsum.photos/seed/${user.id}/80/80`} alt={`${user.firstName} ${user.lastName}`} data-ai-hint="profile picture" />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-3xl">{`${user.firstName} ${user.lastName}`}</CardTitle>
              <CardDescription className="text-base">{user.email}</CardDescription>
              {user.jobTitle && <p className="text-sm text-muted-foreground">{user.jobTitle}</p>}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="outline" asChild>
              <Link href="/users">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to List
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/users/${user.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit User
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <dl className="divide-y divide-border">
            <DetailItem 
              label="Status" 
              value={
                <Badge variant={status === 'Active' ? 'default' : 'destructive'} className="text-sm">
                  {status === 'Active' ? <CheckCircle className="mr-1 h-4 w-4" /> : <XCircle className="mr-1 h-4 w-4" />}
                  {status}
                </Badge>
              } 
              icon={UserCog}
            />
            <DetailItem 
              label="Roles" 
              value={
                <div className="flex flex-wrap gap-1">
                  {user.roles.split(',').map(r => r.trim()).filter(Boolean).map(role => (
                    <Badge key={role} variant="secondary" className="text-xs">
                      {role.replace('ROLE_', '').replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              }
              icon={ShieldCheck}
            />
            <DetailItem label="Created Date" value={format(parseISO(user.createdDate), 'PPP p')} icon={CalendarDays} />
            <DetailItem label="Last Updated" value={format(parseISO(user.updatedDate), 'PPP p')} icon={CalendarDays} />
            <DetailItem label="Last Login" value={user.lastLoginDate ? format(parseISO(user.lastLoginDate), 'PPP p') : 'Never'} icon={CalendarDays} />
            
            <DetailItem 
              label="Account Non Expired" 
              value={user.accountNonExpired ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
            />
            <DetailItem 
              label="Account Non Locked" 
              value={user.accountNonLocked ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
            />
            <DetailItem 
              label="Credentials Non Expired" 
              value={user.credentialsNonExpired ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
            />
            <DetailItem 
              label="Enabled" 
              value={user.enabled ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
            />
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
