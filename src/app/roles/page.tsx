
import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getUsers, getUniqueRoles } from '@/lib/users';
import type { User } from '@/lib/types';
import { ALL_ROLES } from '@/lib/types';
import { ShieldCheck, UserPlus, Edit, Trash2, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { RoleActions } from './_components/role-actions';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

export const metadata: Metadata = {
  title: 'Role Management',
};

interface RoleWithUserCount {
  name: string;
  userCount: number;
  description: string; // Simple description for now
}

const roleDescriptions: Record<string, string> = {
  ROLE_USER: "Standard access to application features.",
  ROLE_ADMIN: "Full control over the application, including user and role management.",
  ROLE_MANAGER: "Can manage teams and projects, oversee user activity within their scope.",
  ROLE_EDITOR: "Can create and modify content within the application.",
  ROLE_GUEST: "Limited access, typically for viewing public information.",
  ROLE_SUPPORT: "Access to support tools and user information for troubleshooting.",
  ROLE_AUDITOR: "Read-only access to logs and system configurations for auditing purposes.",
};

export default async function RolesPage() {
  const { users } = await getUsers(1, 10000); // Fetch all users to count roles

  const rolesWithCounts: RoleWithUserCount[] = ALL_ROLES.map(roleName => {
    const count = users.filter(user => user.roles.split(',').map(r => r.trim()).includes(roleName)).length;
    return {
      name: roleName,
      userCount: count,
      description: roleDescriptions[roleName] || "Custom role with specific permissions."
    };
  });

  return (
    <div className="space-y-6">
      <Breadcrumbs segments={[{ label: 'Role Management' }]} />
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <ShieldCheck className="mr-3 h-8 w-8 text-primary" />
            Role Management
            </h1>
            <p className="text-muted-foreground">
            Manage user roles and their associated permissions across the application.
            </p>
        </div>
        <Button disabled> {/* Add Role functionality to be implemented */}
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Role (Coming Soon)
        </Button>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Available Roles</CardTitle>
          <CardDescription>
            View and manage all user roles defined in the system. 
            Use <Link href="/roles/suggest" className="text-primary hover:underline">AI Role Suggestion</Link> for new role ideas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-center">Users</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rolesWithCounts.map((role) => (
                <TableRow key={role.name}>
                  <TableCell>
                    <Badge variant="outline" className="font-semibold text-base px-3 py-1">
                      {role.name.replace('ROLE_', '').replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{role.description}</TableCell>
                  <TableCell className="text-center text-lg font-medium">{role.userCount}</TableCell>
                  <TableCell className="text-right">
                    <RoleActions roleName={role.name} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
