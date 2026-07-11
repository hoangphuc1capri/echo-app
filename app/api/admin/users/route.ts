import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { requireAdmin, AuthUser } from '@/lib/auth-server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { QuizResult } from '@/models/QuizResult';

const GET = requireAdmin(async (request: NextRequest, _user: AuthUser) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '20'));
    const search = (searchParams.get('search') || '').trim();

    await connectDB();

    const filter: Record<string, unknown> = { role: { $ne: 'admin' } };
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        users,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('[admin/users GET]', error);
    return NextResponse.json({ success: false, error: 'Lỗi server' }, { status: 500 });
  }
});

const POST = requireAdmin(async (request: NextRequest, _user: AuthUser) => {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email và mật khẩu là bắt buộc' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Mật khẩu phải có ít nhất 6 ký tự' },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email đã được sử dụng' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name || '',
      role: 'admin',
    });

    return NextResponse.json({
      success: true,
      data: {
        user: {
          _id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
      },
    });
  } catch (error) {
    console.error('[admin/users POST]', error);
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi server' },
      { status: 500 }
    );
  }
});

const DELETE = requireAdmin(async (request: NextRequest, _user: AuthUser) => {
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id || !/^[a-f0-9]{24}$/i.test(id)) {
      return NextResponse.json({ success: false, error: 'ID không hợp lệ' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(id);
    if (user?.role === 'admin') {
      return NextResponse.json({ success: false, error: 'Không thể xóa tài khoản admin' }, { status: 403 });
    }

    await User.findByIdAndDelete(id);
    await QuizResult.deleteMany({ userId: id });

    return NextResponse.json({ success: true, data: { deleted: id } });
  } catch (error) {
    console.error('[admin/users DELETE]', error);
    return NextResponse.json({ success: false, error: 'Lỗi server' }, { status: 500 });
  }
});

export { GET, POST, DELETE };
