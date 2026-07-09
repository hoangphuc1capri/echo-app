import { NextRequest, NextResponse } from 'next/server';
import { getAuthFromRequest } from '@/lib/auth-server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthFromRequest(request);
    
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng đăng nhập' },
        { status: 401 }
      );
    }

    await connectDB();
    const user = await User.findById(authUser.userId).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Người dùng không tồn tại' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi server' },
      { status: 500 }
    );
  }
}
