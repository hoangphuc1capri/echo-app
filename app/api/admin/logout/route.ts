import { NextResponse } from 'next/server';
import { removeAdminCookie } from '@/lib/admin-auth';

export async function POST() {
  const response = NextResponse.json({ success: true });
  removeAdminCookie();
  response.cookies.delete('admin-token');
  return response;
}
