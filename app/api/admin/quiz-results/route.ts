import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { QuizResult } from '@/models/QuizResult';
import { User } from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(200, parseInt(searchParams.get('limit') || '20'));
    const category = (searchParams.get('category') || '').trim();
    const search = (searchParams.get('search') || '').trim();

    await connectDB();

    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;

    if (search) {
      const matched = await User.find({
        $or: [
          { email: { $regex: search, $options: 'i' } },
          { name: { $regex: search, $options: 'i' } },
        ],
      })
        .select('_id')
        .lean();
      filter.userId = { $in: matched.map((u) => u._id) };
    }

    const [results, total] = await Promise.all([
      QuizResult.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('userId', 'name email')
        .lean(),
      QuizResult.countDocuments(filter),
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
    console.error('[admin/quiz-results GET]', error);
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
    const r = await QuizResult.findByIdAndDelete(id);
    if (!r) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { deleted: id } });
  } catch (error) {
    console.error('[admin/quiz-results DELETE]', error);
    return NextResponse.json({ success: false, error: 'Lỗi server' }, { status: 500 });
  }
}
