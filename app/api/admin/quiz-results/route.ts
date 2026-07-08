import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { QuizResult } from '@/models/QuizResult';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '20'));
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    const skip = (page - 1) * limit;

    await connectDB();

    const query: Record<string, unknown> = {};
    if (category) query.category = category;

    let results;
    let total;

    if (search) {
      const { User } = await import('@/models/User');
      const users = await User.find({
        $or: [
          { email: { $regex: search, $options: 'i' } },
          { name: { $regex: search, $options: 'i' } },
        ],
      }).select('_id').lean();
      query.userId = { $in: users.map((u) => u._id) };
    }

    [results, total] = await Promise.all([
      QuizResult.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email')
        .lean(),
      QuizResult.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        results,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Admin quiz results error:', error);
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
        { success: false, error: 'Thiếu result ID' },
        { status: 400 }
      );
    }

    await connectDB();
    await QuizResult.findByIdAndDelete(id);

    return NextResponse.json({ success: true, data: { deleted: id } });
  } catch (error) {
    console.error('Admin delete quiz result error:', error);
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi server' },
      { status: 500 }
    );
  }
}
