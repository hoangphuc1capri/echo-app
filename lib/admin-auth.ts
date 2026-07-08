import { SignJWT, jwtVerify, JWTPayload as JoseJWTPayload } from 'jose';
import { cookies } from 'next/headers';

const ADMIN_JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || 'echo-admin-secret-change-in-production'
);

export interface AdminJWTPayload extends JoseJWTPayload {
  email: string;
}

export async function signAdminToken(email: string): Promise<string> {
  return new SignJWT({ email } as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(ADMIN_JWT_SECRET);
}

export async function verifyAdminToken(token: string): Promise<AdminJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, ADMIN_JWT_SECRET);
    return payload as AdminJWTPayload;
  } catch {
    return null;
  }
}

export async function getAdminFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin-token')?.value;
  if (!token) return null;
  return await verifyAdminToken(token);
}

export async function setAdminCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('admin-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8,
    path: '/',
  });
}

export async function removeAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('admin-token');
}

export function validateAdminCredentials(email: string, password: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  return email === adminEmail && password === adminPassword;
}
