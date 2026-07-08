import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { signToken } from '@/lib/auth';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@echo.vn';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng nhập email và mật khẩu' },
        { status: 400 }
      );
    }

    // Admin login (uses env credentials, no DB needed)
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = await signToken({
        userId: 'admin',
        email: ADMIN_EMAIL,
        role: 'admin',
      });
      return NextResponse.json({
        success: true,
        isAdmin: true,
        data: {
          token,
          user: { _id: 'admin', email: ADMIN_EMAIL, name: 'Quản trị viên', role: 'admin' },
        },
      });
    }

    // Regular user login
    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { success: false, error: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      );
    }

    const token = await signToken({
      userId: user._id.toString(),
      email: user.email,
    });

    return NextResponse.json({
      success: true,
      isAdmin: false,
      data: {
        token,
        user: { _id: user._id, email: user.email, name: user.name || '' },
      },
    });
  } catch (error) {
    console.error('[login]', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi server, thử lại sau' },
      { status: 500 }
    );
  }
}
