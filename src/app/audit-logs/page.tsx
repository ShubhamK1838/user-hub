
import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, subDays, subHours } from 'date-fns';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

export const metadata: Metadata = {
  title: 'Audit Logs',
};

// Dummy audit log data
const auditLogs = [
  { id: 'log001', timestamp: subHours(new Date(), 2).toISOString(), user: 'john.doe@example.com', action: 'LOGIN_SUCCESS', details: 'IP: 192.168.1.100', entity: 'User' },
  { id: 'log002', timestamp: subHours(new Date(), 1).toISOString(), user: 'admin@example.com', action: 'USER_UPDATE', details: 'Updated roles for user: alice.smith@example.com', entity: 'User' },
  { id: 'log003', timestamp: subDays(new Date(), 1).toISOString(), user: 'alice.smith@example.com', action: 'PASSWORD_CHANGE', details: 'Password changed successfully', entity: 'User' },
  { id: 'log004', timestamp: subDays(new Date(), 2).toISOString(), user: 'bob.johnson@example.com', action: 'LOGIN_FAILED', details: 'IP: 203.0.113.45, Reason: Invalid credentials', entity: 'User' },
  { id: 'log005', timestamp: subDays(new Date(), 2).toISOString(), user: 'system', action: 'ROLE_CREATE', details: 'Created new role: ROLE_MARKETING', entity: 'Role' },
];

function getActionBadgeVariant(action: string): "default" | "secondary" | "destructive" | "outline" {
    if (action.includes("CREATE") || action.includes("UPDATE") || action.includes("SUCCESS")) return "default";
    if (action.includes("DELETE") || action.includes("FAILED")) return "destructive";
    if (action.includes("LOGIN") || action.includes("LOGOUT")) return "secondary";
    return "outline";
}


export default function AuditLogsPage() {
  return (
    <div className="space-y-6">
      <Breadcrumbs segments={[{ label: 'Audit Logs' }]} />
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <FileText className="mr-3 h-8 w-8 text-primary" />
            Audit Logs
            </h1>
            <p className="text-muted-foreground">
            Track important user actions and system events.
            </p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" disabled><Filter className="mr-2 h-4 w-4" />Filter Logs (Coming Soon)</Button>
            <Button variant="outline" disabled><Download className="mr-2 h-4 w-4" />Export Logs (Coming Soon)</Button>
        </div>
      </div>
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>A log of recent actions performed within the application.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-xs whitespace-nowrap">
                    {format(new Date(log.timestamp), 'MMM d, yyyy, HH:mm:ss')}
                  </TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>
                    <Badge variant={getActionBadgeVariant(log.action)} className="text-xs">
                        {log.action.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{log.entity}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{log.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {auditLogs.length === 0 && <p className="text-center py-8 text-muted-foreground">No audit logs available.</p>}
        </CardContent>
      </Card>
      <p className="text-center text-sm text-muted-foreground">
        This is a simplified audit log display. Full implementation would include robust filtering, pagination, and detailed views.
      </p>
    </div>
  );
}
