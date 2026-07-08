import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { QuizResult } from '@/models/QuizResult';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '20'));
    const search = (searchParams.get('search') || '').trim();

    await connectDB();

    const filter: Record<string, unknown> = {};
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
}

export async function DELETE(request: NextRequest) {
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id || !/^[a-f0-9]{24}$/i.test(id)) {
      return NextResponse.json({ success: false, error: 'ID không hợp lệ' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy user' }, { status: 404 });
    }
    await QuizResult.deleteMany({ userId: id });

    return NextResponse.json({ success: true, data: { deleted: id } });
  } catch (error) {
    console.error('[admin/users DELETE]', error);
    return NextResponse.json({ success: false, error: 'Lỗi server' }, { status: 500 });
  }
}
