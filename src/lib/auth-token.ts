
'use client';

import Cookies from 'js-cookie';

const TOKEN_KEY = 'authToken';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') {
    // For server-side, this won't work directly. Middleware handles cookie check.
    return null;
  }
  // Prefer localStorage for client-side reads if available, fallback to cookie
  const lsToken = localStorage.getItem(TOKEN_KEY);
  if (lsToken) return lsToken;
  return Cookies.get(TOKEN_KEY) || null;
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem(TOKEN_KEY, token);
  Cookies.set(TOKEN_KEY, token, { 
    expires: 7, // Cookie expires in 7 days
    path: '/', 
    // secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    // sameSite: 'lax' 
  });
}

export function clearAuthToken(): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.removeItem(TOKEN_KEY);
  Cookies.remove(TOKEN_KEY, { path: '/' });
}
