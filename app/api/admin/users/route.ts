import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { QuizResult } from '@/models/QuizResult';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '20'));
    const search = searchParams.get('search') || '';
    const skip = (page - 1) * limit;

    await connectDB();

    const query = search
      ? {
          $or: [
            { email: { $regex: search, $options: 'i' } },
            { name: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-password')
        .lean(),
      User.countDocuments(query),
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
    console.error('Admin users error:', error);
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi server' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Thiếu user ID' },
        { status: 400 }
      );
    }

    await connectDB();
    await User.findByIdAndDelete(id);
    await QuizResult.deleteMany({ userId: id });

    return NextResponse.json({ success: true, data: { deleted: id } });
  } catch (error) {
    console.error('Admin delete user error:', error);
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi server' },
      { status: 500 }
    );
  }
}
