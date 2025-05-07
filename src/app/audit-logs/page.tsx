
import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { getAuditLogs } from '@/lib/audit-logs';
import type { AuditLog } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Audit Logs',
};

function getActionBadgeVariant(action: string): "default" | "secondary" | "destructive" | "outline" {
    if (action.includes("CREATE") || action.includes("SUCCESS") || action.includes("UPDATE")) return "default";
    if (action.includes("DELETE") || action.includes("FAILED")) return "destructive";
    if (action.includes("LOGIN") || action.includes("LOGOUT") || action.includes("PROFILE")) return "secondary";
    return "outline";
}


export default async function AuditLogsPage() {
  // Fetch audit logs - assuming default page 1, limit 10 for now or fetch all
  // For this example, we'll fetch a reasonable number like 20 for display without pagination yet.
  // Or fetch all and let the component decide on pagination later if needed.
  // The service itself currently returns all logs in dummyAuditLogs, so pagination params are for future use.
  const { logs: auditLogs, total } = await getAuditLogs(1, 20); // Fetch first 20 logs or all if less

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
            Track important user actions and system events. Showing {auditLogs.length} of {total} logs.
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
              {auditLogs.map((log: AuditLog) => (
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
