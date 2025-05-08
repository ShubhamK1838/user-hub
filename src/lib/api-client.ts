
import { API_BASE_URL } from '@/config';
import { getAuthToken } from './auth-token';
import type { User } from './types';

interface ApiErrorResponse {
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any;
}

async function request<T>(
  endpoint: string,
  method: string = 'GET',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any,
  isFormData: boolean = false
): Promise<T> {
  const headers: HeadersInit = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    if (isFormData) {
      config.body = body as FormData;
    } else {
      config.body = JSON.stringify(body);
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    let errorData: ApiErrorResponse = { message: `HTTP error! status: ${response.status}` };
    try {
      errorData = await response.json();
    } catch (e) {
      // If response is not JSON, use the status text
      errorData.message = response.statusText || errorData.message;
    }
    console.error('API Error:', errorData);
    throw new Error(errorData.message || 'An unknown API error occurred');
  }

  if (response.status === 204) { // No Content
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

// Auth APIs
export const loginUserApi = (data: unknown) => request<any>('/auth/login', 'POST', data);
export const registerUserApi = (data: unknown) => request<any>('/auth/register', 'POST', data);
export const forgotPasswordApi = (data: unknown) => request<any>('/auth/forgot-password', 'POST', data);
export const resetPasswordApi = (data: unknown) => request<any>('/auth/reset-password', 'POST', data);
export const getCurrentUserApi = () => request<{ user: User }>('/auth/me', 'GET');
export const changePasswordApi = (data: unknown) => request<any>('/auth/change-password', 'POST', data);

// User Management APIs
export const getUsersApi = (params: URLSearchParams) => request<any>(`/users?${params.toString()}`, 'GET');
export const getUserByIdApi = (id: string) => request<{ user: User }>(`/users/${id}`, 'GET');
export const createUserApi = (data: unknown) => request<{ user: User }>('/users', 'POST', data);
export const updateUserApi = (id: string, data: unknown) => request<{ user: User }>(`/users/${id}`, 'PUT', data);
export const deleteUserApi = (id: string) => request<any>(`/users/${id}`, 'DELETE');
export const getUniqueRolesApi = () => request<{ roles: string[] }>('/roles/unique', 'GET');

// AI Services API
export const suggestUserRolesApi = (data: { jobTitle: string }) => request<{ suggestedRoles: string[] }>('/ai/suggest-roles', 'POST', data);

// Audit Log API
export const getAuditLogsApi = (params: URLSearchParams) => request<any>(`/audit-logs?${params.toString()}`, 'GET');

// Notification API
export const getNotificationsApi = (params?: URLSearchParams) => request<any>(`/notifications${params ? '?' + params.toString() : ''}`, 'GET');
export const markNotificationAsReadApi = (notificationId: string) => request<any>(`/notifications/${notificationId}/read`, 'PATCH');
export const markAllNotificationsAsReadApi = () => request<any>('/notifications/mark-all-read', 'POST');
export const clearAllNotificationsApi = () => request<any>('/notifications', 'DELETE');


// Settings API
export const updateNotificationPreferencesApi = (data: unknown) => request<any>('/settings/notifications', 'PUT', data);
export const updateLanguagePreferenceApi = (data: unknown) => request<any>('/settings/language', 'PUT', data);

// Support & Feedback API
export const submitContactSupportApi = (formData: FormData) => request<any>('/support/contact', 'POST', formData, true);
export const submitFeedbackApi = (data: unknown) => request<any>('/feedback', 'POST', data);


export default request;
