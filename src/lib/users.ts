
import type { User } from './types';
import {
  getUsersApi,
  getUserByIdApi,
  createUserApi,
  updateUserApi,
  deleteUserApi,
  getCurrentUserApi as getCurrentUserFromApi,
  getUniqueRolesApi as getUniqueRolesFromApi,
  changePasswordApi
} from './api-client';

export async function getUsers(
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
  
  const response = await getUsersApi(params);
  return {
    users: response.users.map((u: User) => ({ ...u, password: undefined })),
    total: response.total,
    currentPage: response.currentPage,
    totalPages: response.totalPages,
  };
}

export async function getUserById(id: string): Promise<User | undefined> {
  try {
    const response = await getUserByIdApi(id);
    return response.user ? { ...response.user, password: undefined } : undefined;
  } catch (error) {
    console.error(`Failed to get user ${id}:`, error);
    return undefined;
  }
}

export async function createUser(userData: Omit<User, 'id' | 'createdDate' | 'updatedDate' | 'lastLoginDate'>): Promise<User> {
  const response = await createUserApi(userData);
  return { ...response.user, password: undefined };
}

export async function updateUser(id: string, updates: Partial<Omit<User, 'id' | 'createdDate' | 'password' | 'updatedDate' | 'lastLoginDate'>>): Promise<User | undefined> {
  try {
    const response = await updateUserApi(id, updates);
    return response.user ? { ...response.user, password: undefined } : undefined;
  } catch (error) {
    console.error(`Failed to update user ${id}:`, error);
    return undefined;
  }
}

export async function deleteUser(id: string): Promise<boolean> {
  try {
    await deleteUserApi(id);
    return true;
  } catch (error) {
    console.error(`Failed to delete user ${id}:`, error);
    return false;
  }
}

export async function getCurrentUser(): Promise<User | undefined> {
  try {
    const response = await getCurrentUserFromApi();
    return response.user ? { ...response.user, password: undefined } : undefined;
  } catch (error) {
    // If not authorized (e.g. no token or invalid token), this will likely fail.
    // console.error('Failed to get current user:', error);
    return undefined;
  }
}

export async function getUniqueRoles(): Promise<string[]> {
  try {
    const response = await getUniqueRolesFromApi();
    return response.roles.sort();
  } catch (error) {
    console.error('Failed to get unique roles:', error);
    return [];
  }
}

export async function changePassword(userId: string, currentPassword?: string, newPassword?: string): Promise<{ success: boolean; message: string }> {
   // The API expects userId to be inferred from the auth token for /api/auth/change-password
   // For an admin changing another user's password, a different endpoint or logic would be needed.
   // Assuming this is for the authenticated user changing their own password.
  try {
    const response = await changePasswordApi({ currentPassword, newPassword });
    return response; // API should return { success: boolean, message: string }
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to change password." };
  }
}
