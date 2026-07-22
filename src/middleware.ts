import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { canAccessRoute } from './lib/rbac';
import { UserRole } from './types/auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes: landing page (/) and login page (/login)
  const isPublic = pathname === '/' || pathname.startsWith('/login');

  // Get mock session cookie
  const sid = request.cookies.get('app_sid')?.value;
  const isLoggedIn = !!sid;

  // Unauthenticated + accessing secured route (/dashboard/...) -> redirect to /login
  if (!isLoggedIn && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Authenticated + accessing login page -> redirect to dashboard
  if (isLoggedIn && pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Authenticated + accessing secured route -> perform route guard RBAC check
  if (isLoggedIn && pathname.startsWith('/dashboard')) {
    const role = request.cookies.get('app_role')?.value as UserRole | undefined;
    if (!role) {
      // If session exists but role cookie is missing, redirect to login page
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('app_sid');
      return response;
    }

    const hasAccess = canAccessRoute(role, pathname);
    if (!hasAccess) {
      return NextResponse.redirect(new URL('/dashboard/access-denied', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Skip api routes, static files, images, and favicon
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico)$).*)'],
};
