import type { User } from './types';
import { getUsersServerApi, getUserByIdServerApi, getUniqueRolesServerApi } from './api-client-server';

export async function getUsersServer(
  page: number = 1,
  limit: number = 10,
  searchTerm?: string,
  roleFilter?: string
): Promise<{ users: User[]; total: number; currentPage: number; totalPages: number }> {
  const params = new URLSearchParams();
  params.append('page', String(page));
  params.append('limit', String(limit));
  if (searchTerm) {
    params.append('search', searchTerm);
  }
  if (roleFilter) {
    params.append('role', roleFilter);
  }
  
  const response = await getUsersServerApi(params);
  return {
    users: response.users.map((u: User) => ({ ...u, password: undefined })),
    total: response.total,
    currentPage: response.currentPage,
    totalPages: response.totalPages,
  };
}

export async function getUserByIdServer(id: string): Promise<User | undefined> {
  try {
    const response = await getUserByIdServerApi(id);
    return response.user ? { ...response.user, password: undefined } : undefined;
  } catch (error) {
    console.error(`Failed to get user ${id}:`, error);
    return undefined;
  }
}

export async function getUniqueRolesServer(): Promise<string[]> {
  try {
    const response = await getUniqueRolesServerApi();
    return response.roles.sort();
  } catch (error) {
    console.error('Failed to get unique roles:', error);
    return [];
  }
}