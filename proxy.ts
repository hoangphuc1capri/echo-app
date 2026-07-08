import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminToken } from '@/lib/admin-auth';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin auth routes are always accessible (login page, login API)
  if (
    pathname.startsWith('/admin/login') ||
    pathname.startsWith('/api/admin/login')
  ) {
    return NextResponse.next();
  }

  // Protect all /admin/* pages
  if (pathname.startsWith('/admin/')) {
    const token = request.cookies.get('admin-token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    const payload = await verifyAdminToken(token);
    if (!payload) {
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin-token');
      return response;
    }
  }

  // Protect all /api/admin/* routes (except login)
  if (pathname.startsWith('/api/admin/') && !pathname.startsWith('/api/admin/login')) {
    const token = request.cookies.get('admin-token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Chưa đăng nhập admin' }, { status: 401 });
    }
    const payload = await verifyAdminToken(token);
    if (!payload) {
      const response = NextResponse.json({ success: false, error: 'Token không hợp lệ' }, { status: 401 });
      response.cookies.delete('admin-token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
