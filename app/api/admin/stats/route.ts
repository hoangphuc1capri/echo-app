import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { QuizResult } from '@/models/QuizResult';

export async function GET() {
  try {
    await connectDB();

    const [
      totalUsers,
      totalQuizzes,
      todayUsers,
      todayQuizzes,
      categoryDistribution,
      recentQuizzes,
    ] = await Promise.all([
      User.countDocuments(),
      QuizResult.countDocuments(),
      User.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      }),
      QuizResult.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      }),
      QuizResult.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      QuizResult.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('userId', 'name email')
        .select('score percentage category createdAt'),
    ]);

    const avgScore = await QuizResult.aggregate([
      { $group: { _id: null, avg: { $avg: '$score' } } },
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalQuizzes,
        todayUsers,
        todayQuizzes,
        categoryDistribution: categoryDistribution.map((c) => ({
          category: c._id,
          count: c.count,
        })),
        avgScore: avgScore[0]?.avg ? Math.round(avgScore[0].avg * 10) / 10 : 0,
        recentQuizzes,
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi server' },
      { status: 500 }
    );
  }
}
