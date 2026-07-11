import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect admin routes
  const isAdminPage = pathname.startsWith('/admin');
  const isAdminApi = pathname.startsWith('/api/admin');
  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  // Try Authorization header first (for API calls), then cookie (for pages)
  const authHeader = request.headers.get('authorization');
  const cookieToken = request.cookies.get('auth-token')?.value;
  const token = authHeader?.replace('Bearer ', '') || cookieToken;
  
  const payload = token ? await verifyToken(token) : null;
  const isAdmin = payload?.role === 'admin';

  // Invalid token -> clear cookie
  if (token && !payload) {
    const r = isAdminApi
      ? NextResponse.json({ success: false, error: 'Token không hợp lệ' }, { status: 401 })
      : NextResponse.redirect(new URL('/auth', request.url));
    r.cookies.delete('auth-token');
    return r;
  }

  // No token OR not admin
  if (!isAdmin) {
    if (isAdminApi) {
      return NextResponse.json({ success: false, error: 'Cần quyền admin' }, { status: 403 });
    }
    // For pages: send to /auth with return URL
    const url = new URL('/auth', request.url);
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
