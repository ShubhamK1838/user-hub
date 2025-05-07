
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { getUsers, getUniqueRoles } from '@/lib/users';
import { ITEMS_PER_PAGE } from '@/lib/constants';
import type { User, UserStatus } from '@/lib/types';
import { format } from 'date-fns';
import { Eye, Edit, Trash2, UserPlus, Filter, Download, Search as SearchIcon } from 'lucide-react';
import { PaginationControls } from './_components/pagination-controls';
import { UserActions } from './_components/user-actions';
import { SearchBar } from './_components/search-bar';
import { ExportUsersButton } from './_components/export-users-button';

export const metadata: Metadata = {
  title: 'User Management',
};

interface UsersPageProps {
  searchParams: {
    page?: string;
    search?: string;
    role?: string;
  };
}

function getUserStatus(user: User): UserStatus {
  return user.enabled && user.accountNonLocked && user.accountNonExpired ? 'Active' : 'Disabled';
}

function getStatusVariant(status: UserStatus): "default" | "secondary" | "destructive" {
  switch (status) {
    case 'Active':
      return 'default'; // Or a custom 'success' variant if available
    case 'Disabled':
      return 'destructive';
    default:
      return 'secondary';
  }
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const currentPage = Number(searchParams.page) || 1;
  const searchTerm = searchParams.search || '';
  const roleFilter = searchParams.role || '';

  const { users, total } = await getUsers(currentPage, ITEMS_PER_PAGE, searchTerm, roleFilter);
  const uniqueRoles = await getUniqueRoles();
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/users/create">
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Create User
            </Button>
          </Link>
          <ExportUsersButton users={users} />
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <SearchBar initialSearchTerm={searchTerm} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filter by Role {roleFilter && `(${roleFilter.replace('ROLE_', '')})`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
                checked={!roleFilter}
                onCheckedChange={() => {
                  const params = new URLSearchParams(searchParams);
                  params.delete('role');
                  params.set('page', '1');
                  window.location.search = params.toString();
                }}
              >
                All Roles
              </DropdownMenuCheckboxItem>
            {uniqueRoles.map((role) => (
              <DropdownMenuCheckboxItem
                key={role}
                checked={roleFilter === role}
                onCheckedChange={() => {
                  const params = new URLSearchParams(searchParams);
                  if (roleFilter === role) {
                    params.delete('role');
                  } else {
                    params.set('role', role);
                  }
                  params.set('page', '1');
                  window.location.search = params.toString();
                }}
              >
                {role.replace('ROLE_', '').replace('_', ' ')}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card className="shadow-md">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length > 0 ? (
                users.map((user) => {
                  const status = getUserStatus(user);
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="font-medium">{`${user.firstName} ${user.lastName}`}</div>
                        <div className="text-sm text-muted-foreground md:hidden">{user.email}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.roles.split(',').map(role => role.trim()).filter(r => r).map((role) => (
                            <Badge key={role} variant="secondary" className="text-xs">
                              {role.replace('ROLE_', '').replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(status)}>{status}</Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {format(new Date(user.createdDate), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <UserActions userId={user.id} />
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          searchParams={searchParams}
        />
      )}
    </div>
  );
}

// Minimal Card components for structure, full component would be in ui/card.tsx
const Card = ({ className, children }: {className?: string, children: React.ReactNode}) => <div className={`rounded-lg border bg-card text-card-foreground ${className}`}>{children}</div>;
const CardContent = ({ className, children }: {className?: string, children: React.ReactNode}) => <div className={`p-6 ${className}`}>{children}</div>;
