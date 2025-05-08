
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];
const PROTECTED_ROUTES_DEFAULT_REDIRECT = '/dashboard'; // Redirect to this page if authenticated and tries to access auth routes
const LOGIN_PAGE_REDIRECT = '/login'; // Redirect to this page if not authenticated and tries to access protected routes

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get('authToken')?.value; // Assuming token is stored in a cookie named 'authToken'

  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));

  if (authToken) {
    // If authenticated and trying to access an auth route, redirect to dashboard
    if (isAuthRoute) {
      return NextResponse.redirect(new URL(PROTECTED_ROUTES_DEFAULT_REDIRECT, request.url));
    }
    // If authenticated and accessing any other route, allow
    return NextResponse.next();
  } else {
    // If not authenticated and trying to access a protected route (not an auth route and not public like '/')
    if (!isAuthRoute && pathname !== '/') { // Allow access to root '/' for potential landing page
      return NextResponse.redirect(new URL(LOGIN_PAGE_REDIRECT, request.url));
    }
    // If not authenticated and accessing an auth route or public root, allow
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets (public assets folder)
     * - images (public images folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|assets|images).*)',
  ],
};
