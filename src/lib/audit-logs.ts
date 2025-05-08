
import type { AuditLog } from './types';
import { getAuditLogsApi } from './api-client';

export async function getAuditLogs(
  page: number = 1,
  limit: number = 10
): Promise<{ logs: AuditLog[]; total: number; currentPage: number; totalPages: number }> {
  const params = new URLSearchParams();
  params.append('page', String(page));
  params.append('limit', String(limit));
  
  try {
    const response = await getAuditLogsApi(params);
    return {
      logs: response.logs,
      total: response.total,
      currentPage: response.currentPage,
      totalPages: response.totalPages,
    };
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    return { logs: [], total: 0, currentPage: 1, totalPages: 1 };
  }
}
