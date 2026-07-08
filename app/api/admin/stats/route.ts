import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { QuizResult } from '@/models/QuizResult';

function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfWeek(date = new Date()) {
  const d = startOfDay(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d;
}

function startOfMonth(date = new Date()) {
  const d = new Date(date);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function GET() {
  try {
    await connectDB();

    const now = new Date();
    const todayStart = startOfDay(now);
    const weekStart = startOfWeek(now);
    const monthStart = startOfMonth(now);

    const [
      totalUsers,
      totalQuizzes,
      usersWithQuizzes,
      todayUsers,
      todayQuizzes,
      weekUsers,
      weekQuizzes,
      monthUsers,
      monthQuizzes,
      categoryAgg,
      avgAgg,
      quizzesByDayAgg,
      topUsersAgg,
      usersByDayAgg,
    ] = await Promise.all([
      // Counts
      User.countDocuments(),
      QuizResult.countDocuments(),

      // Users who took at least 1 quiz
      User.countDocuments({
        _id: { $in: await QuizResult.distinct('userId') },
      }),

      // Today
      User.countDocuments({ createdAt: { $gte: todayStart } }),
      QuizResult.countDocuments({ createdAt: { $gte: todayStart } }),

      // This week
      User.countDocuments({ createdAt: { $gte: weekStart } }),
      QuizResult.countDocuments({ createdAt: { $gte: weekStart } }),

      // This month
      User.countDocuments({ createdAt: { $gte: monthStart } }),
      QuizResult.countDocuments({ createdAt: { $gte: monthStart } }),

      // Category distribution
      QuizResult.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),

      // Averages
      QuizResult.aggregate([{ $group: { _id: null, avgScore: { $avg: '$score' }, avgPct: { $avg: '$percentage' } } }]),

      // Quizzes per day — last 30 days
      QuizResult.aggregate([
        {
          $match: { createdAt: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            },
            count: { $sum: 1 },
            avgScore: { $avg: '$score' },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // Top 5 most active users (most quizzes)
      QuizResult.aggregate([
        { $group: { _id: '$userId', quizCount: { $sum: 1 }, lastQuiz: { $max: '$createdAt' } } },
        { $sort: { quizCount: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 1,
            quizCount: 1,
            lastQuiz: 1,
            name: { $ifNull: ['$user.name', '$user.email', 'Người dùng đã xóa'] },
            email: { $ifNull: ['$user.email', '—'] },
          },
        },
      ]),

      // Users registered per day — last 30 days
      User.aggregate([
        {
          $match: { createdAt: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const completionRate = totalUsers > 0
      ? Math.round((usersWithQuizzes / totalUsers) * 100)
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        // Overview
        totalUsers,
        totalQuizzes,
        usersWithQuizzes,
        completionRate,
        avgScore: avgAgg[0]?.avgScore
          ? Math.round(avgAgg[0].avgScore * 10) / 10
          : 0,
        avgPercentage: avgAgg[0]?.avgPct
          ? Math.round(avgAgg[0].avgPct * 10) / 10
          : 0,
        // Period breakdowns
        today: { users: todayUsers, quizzes: todayQuizzes },
        week: { users: weekUsers, quizzes: weekQuizzes },
        month: { users: monthUsers, quizzes: monthQuizzes },
        // Category
        categoryDistribution: categoryAgg.map((c) => ({
          category: c._id,
          count: c.count,
        })),
        // Charts
        quizzesByDay: quizzesByDayAgg,
        usersByDay: usersByDayAgg,
        // Top users
        topUsers: topUsersAgg,
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
