import { API_BASE_URL } from '@/config';
import { cookies } from 'next/headers';
import type { User } from './types';

const TOKEN_KEY = 'authToken';

interface ApiErrorResponse {
  message: string;
  details?: any;
}

async function serverRequest<T>(
  endpoint: string,
  method: string = 'GET',
  body?: any,
  isFormData: boolean = false
): Promise<T> {
  const headers: HeadersInit = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  // Get token from server-side cookies
  const cookieStore = cookies();
  const token = cookieStore.get(TOKEN_KEY)?.value;
  
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
      errorData.message = response.statusText || errorData.message;
    }
    console.error('API Error:', errorData);
    throw new Error(errorData.message || 'An unknown API error occurred');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

// Server-side API functions
export const getUsersServerApi = (params: URLSearchParams) => 
  serverRequest<any>(`/users?${params.toString()}`, 'GET');

export const getUserByIdServerApi = (id: string) => 
  serverRequest<{ user: User }>(`/users/${id}`, 'GET');

export const getUniqueRolesServerApi = () => 
  serverRequest<{ roles: string[] }>('/roles/unique', 'GET');