import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { QuizResult } from '@/models/QuizResult';

function startOf(d: Date, unit: 'day' | 'week' | 'month') {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  if (unit === 'week') {
    const day = x.getDay();
    const diff = x.getDate() - day + (day === 0 ? -6 : 1);
    x.setDate(diff);
  } else if (unit === 'month') {
    x.setDate(1);
  }
  return x;
}

const GET = requireAdmin(async () => {
  try {
    await connectDB();

    const now = new Date();
    const dayStart = startOf(now, 'day');
    const weekStart = startOf(now, 'week');
    const monthStart = startOf(now, 'month');
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      totalQuizzes,
      usersWithQuiz,
      dayUsers,
      dayQuizzes,
      weekUsers,
      weekQuizzes,
      monthUsers,
      monthQuizzes,
      categoryAgg,
      scoreAgg,
      quizzesByDayAgg,
      topUsersAgg,
    ] = await Promise.all([
      User.countDocuments({ role: { $ne: 'admin' } }),
      QuizResult.countDocuments(),
      User.countDocuments({ _id: { $in: await QuizResult.distinct('userId') } }),
      User.countDocuments({ createdAt: { $gte: dayStart }, role: { $ne: 'admin' } }),
      QuizResult.countDocuments({ createdAt: { $gte: dayStart } }),
      User.countDocuments({ createdAt: { $gte: weekStart }, role: { $ne: 'admin' } }),
      QuizResult.countDocuments({ createdAt: { $gte: weekStart } }),
      User.countDocuments({ createdAt: { $gte: monthStart }, role: { $ne: 'admin' } }),
      QuizResult.countDocuments({ createdAt: { $gte: monthStart } }),
      QuizResult.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      QuizResult.aggregate([
        { $group: { _id: null, avgScore: { $avg: '$score' }, avgPct: { $avg: '$percentage' } } },
      ]),
      QuizResult.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      QuizResult.aggregate([
        { $group: { _id: '$userId', count: { $sum: 1 }, lastAt: { $max: '$createdAt' } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
        {
          $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'u' },
        },
        { $unwind: { path: '$u', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 1,
            count: 1,
            lastAt: 1,
            name: { $ifNull: ['$u.name', '$u.email', '—'] },
            email: { $ifNull: ['$u.email', '—'] },
          },
        },
      ]),
    ]);

    const avg = scoreAgg[0] || { avgScore: 0, avgPct: 0 };
    const completionRate = totalUsers > 0
      ? Math.round((usersWithQuiz / totalUsers) * 100)
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        totals: {
          users: totalUsers,
          quizzes: totalQuizzes,
          usersWithQuiz,
          completionRate,
          avgScore: Math.round((avg.avgScore || 0) * 10) / 10,
          avgPercentage: Math.round((avg.avgPct || 0) * 10) / 10,
        },
        periods: {
          day: { users: dayUsers, quizzes: dayQuizzes },
          week: { users: weekUsers, quizzes: weekQuizzes },
          month: { users: monthUsers, quizzes: monthQuizzes },
        },
        categories: categoryAgg.map((c) => ({ category: c._id, count: c.count })),
        quizzesByDay: quizzesByDayAgg,
        topUsers: topUsersAgg,
      },
    });
  } catch (error) {
    console.error('[admin/stats]', error);
    return NextResponse.json(
      { success: false, error: 'Lỗi server' },
      { status: 500 }
    );
  }
});

export { GET };
