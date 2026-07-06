import { NextResponse } from 'next/server';

const achievements = [
  {
    id: 'first_test',
    icon: '🎯',
    title: 'Test đầu tiên',
    description: 'Hoàn thành khảo sát đầu tiên',
    requirement: 'Hoàn thành 1 lần khảo sát',
    unlocked: false,
  },
  {
    id: 'three_tests',
    icon: '🔥',
    title: 'Ba lần thử',
    description: 'Hoàn thành 3 lần khảo sát',
    requirement: 'Hoàn thành 3 lần khảo sát',
    unlocked: false,
  },
  {
    id: 'ten_tests',
    icon: '💪',
    title: 'Người kiên trì',
    description: 'Hoàn thành 10 lần khảo sát',
    requirement: 'Hoàn thành 10 lần khảo sát',
    unlocked: false,
  },
  {
    id: 'low_dependence',
    icon: '💎',
    title: 'Giọng kim cương',
    description: 'Đạt dưới 20% phụ thuộc AI',
    requirement: 'Phụ thuộc dưới 20%',
    unlocked: false,
  },
  {
    id: 'very_low_dependence',
    icon: '🏆',
    title: 'Vô địch độc lập',
    description: 'Đạt dưới 10% phụ thuộc AI',
    requirement: 'Phụ thuộc dưới 10%',
    unlocked: false,
  },
  {
    id: 'seed_keeper',
    icon: '🌱',
    title: 'Người giữ lửa',
    description: 'Được xếp vào nhóm Người giữ lửa',
    requirement: 'Đạt nhóm Seed Keeper',
    unlocked: false,
  },
  {
    id: 'top_10',
    icon: '⭐',
    title: 'Top 10',
    description: 'Lọt vào top 10 bảng xếp hạng',
    requirement: 'Xếp hạng top 10',
    unlocked: false,
  },
  {
    id: 'top_5',
    icon: '🌟',
    title: 'Top 5',
    description: 'Lọt vào top 5 bảng xếp hạng',
    requirement: 'Xếp hạng top 5',
    unlocked: false,
  },
  {
    id: 'champion',
    icon: '👑',
    title: 'Vô địch',
    description: 'Đứng đầu bảng xếp hạng',
    requirement: 'Xếp hạng #1',
    unlocked: false,
  },
  {
    id: 'improver',
    icon: '📈',
    title: 'Người cải thiện',
    description: 'Cải thiện điểm số 10 lần',
    requirement: 'Cải thiện 10 lần',
    unlocked: false,
  },
  {
    id: 'daily_user',
    icon: '📅',
    title: 'Đều đặn',
    description: 'Sử dụng ECHO 7 ngày liên tiếp',
    requirement: '7 ngày liên tiếp',
    unlocked: false,
  },
  {
    id: 'weekly_user',
    icon: '🌙',
    title: 'Người bền bỉ',
    description: 'Sử dụng ECHO 30 ngày trong tháng',
    requirement: '30 ngày/tháng',
    unlocked: false,
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  // In real app, fetch user achievements from database
  // For now, return all achievements with unlocked status based on mock data
  const userAchievements = achievements.map(achievement => ({
    ...achievement,
    unlocked: Math.random() > 0.7, // Mock: random unlock status
  }));
  
  const unlockedCount = userAchievements.filter(a => a.unlocked).length;
  
  return NextResponse.json({
    success: true,
    data: {
      achievements: userAchievements,
      total: achievements.length,
      unlocked: unlockedCount,
      progress: Math.round((unlockedCount / achievements.length) * 100),
    },
  });
}
