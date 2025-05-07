
import type { AuditLog } from './types';
import { subDays, subHours, formatISO } from 'date-fns';

// Dummy audit log data
const dummyAuditLogs: AuditLog[] = [
  { id: 'log001', timestamp: subHours(new Date(), 2).toISOString(), user: 'john.doe@example.com', action: 'LOGIN_SUCCESS', details: 'IP: 192.168.1.100', entity: 'User' },
  { id: 'log002', timestamp: subHours(new Date(), 1).toISOString(), user: 'admin@example.com', action: 'USER_UPDATE', details: 'Updated roles for user: alice.smith@example.com', entity: 'User' },
  { id: 'log003', timestamp: subDays(new Date(), 1).toISOString(), user: 'alice.smith@example.com', action: 'PASSWORD_CHANGE', details: 'Password changed successfully', entity: 'User' },
  { id: 'log004', timestamp: subDays(new Date(), 2).toISOString(), user: 'bob.johnson@example.com', action: 'LOGIN_FAILED', details: 'IP: 203.0.113.45, Reason: Invalid credentials', entity: 'User' },
  { id: 'log005', timestamp: subDays(new Date(), 2).toISOString(), user: 'system', action: 'ROLE_CREATE', details: 'Created new role: ROLE_MARKETING', entity: 'Role' },
  { id: 'log006', timestamp: subDays(new Date(), 3).toISOString(), user: 'admin@example.com', action: 'USER_DELETE', details: 'Deleted user: temp.user@example.com', entity: 'User' },
  { id: 'log007', timestamp: subHours(new Date(), 5).toISOString(), user: 'john.doe@example.com', action: 'PROFILE_UPDATE', details: 'Updated job title', entity: 'User' },
  { id: 'log008', timestamp: subDays(new Date(), 1).toISOString(), user: 'system', action: 'SYSTEM_BACKUP', details: 'Automated system backup completed successfully', entity: 'System' },
];

// Simulate a delay for API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getAuditLogs(
  page: number = 1,
  limit: number = 10
  // searchTerm?: string, // Placeholder for future filtering
  // filterParams?: Record<string, any> // Placeholder for future filtering
): Promise<{ logs: AuditLog[]; total: number }> {
  await delay(250); // Simulate network delay

  // Basic pagination (can be expanded with filtering)
  const total = dummyAuditLogs.length;
  const paginatedLogs = dummyAuditLogs.slice((page - 1) * limit, page * limit);
  
  return { logs: paginatedLogs, total };
}
