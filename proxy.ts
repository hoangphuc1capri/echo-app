import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Routes that require authentication
const protectedRoutes = ['/quiz', '/dashboard', '/results', '/letter', '/settings', '/leaderboard'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminPage = pathname.startsWith('/admin');
  const isAdminApi = pathname.startsWith('/api/admin');

  // Try Authorization header first (for API calls), then cookie (for pages)
  const authHeader = request.headers.get('authorization');
  const cookieToken = request.cookies.get('auth-token')?.value;
  const token = authHeader?.replace('Bearer ', '') || cookieToken;

  const payload = token ? await verifyToken(token) : null;
  const isAdmin = payload?.role === 'admin';
  const isAuthenticated = !!payload;

  // Invalid token -> clear cookie
  if (token && !payload) {
    const r = (isAdminApi || isProtectedRoute)
      ? NextResponse.json({ success: false, error: 'Token không hợp lệ' }, { status: 401 })
      : NextResponse.redirect(new URL('/auth', request.url));
    r.cookies.delete('auth-token');
    return r;
  }

  // For protected routes: require authentication
  if (isProtectedRoute && !isAuthenticated) {
    const url = new URL('/auth', request.url);
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  // Admin routes: require admin role
  if (isAdminPage || isAdminApi) {
    if (!isAdmin) {
      if (isAdminApi) {
        return NextResponse.json({ success: false, error: 'Cần quyền admin' }, { status: 403 });
      }
      const url = new URL('/auth', request.url);
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/quiz/:path*', '/dashboard/:path*', '/results/:path*', '/letter/:path*', '/settings/:path*', '/leaderboard/:path*'],
};
