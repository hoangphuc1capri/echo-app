import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './auth';

export interface AuthUser {
  userId: string;
  email: string;
  role: 'admin' | 'user';
}

export interface AuthResult {
  user: AuthUser;
  token: string;
}

export async function getAuthFromRequest(request: NextRequest): Promise<AuthUser | null> {
  // Try Authorization header first, then cookie
  let token = request.headers.get('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    token = request.cookies.get('auth-token')?.value;
  }

  if (!token) {
    return null;
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return null;
  }

  return {
    userId: payload.userId,
    email: payload.email,
    role: (payload.role as 'admin' | 'user') || 'user',
  };
}

export function requireAuth(handler: (req: NextRequest, user: AuthUser) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const user = await getAuthFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng đăng nhập' },
        { status: 401 }
      );
    }

    return handler(request, user);
  };
}

export function requireAdmin(handler: (req: NextRequest, user: AuthUser) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const user = await getAuthFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng đăng nhập' },
        { status: 401 }
      );
    }

    if (user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Không có quyền truy cập' },
        { status: 403 }
      );
    }

    return handler(request, user);
  };
}
