import { NextResponse } from 'next/server';

const leaderboardData = [
  { id: 1, name: 'Minh Đức', avatar: '👑', score: 8, category: 'seed_keeper', trend: 'up', tests: 12, lastTest: '2026-06-28' },
  { id: 2, name: 'Thu Hà', avatar: '🌟', score: 12, category: 'walker', trend: 'down', tests: 8, lastTest: '2026-06-27' },
  { id: 3, name: 'Anh Tuấn', avatar: '🎯', score: 18, category: 'walker', trend: 'same', tests: 15, lastTest: '2026-06-29' },
  { id: 4, name: 'Lan Chi', avatar: '🌸', score: 22, category: 'supported', trend: 'up', tests: 6, lastTest: '2026-06-26' },
  { id: 5, name: 'Hoàng Nam', avatar: '🌿', score: 25, category: 'supported', trend: 'same', tests: 10, lastTest: '2026-06-25' },
  { id: 6, name: 'Phương Linh', avatar: '🌻', score: 28, category: 'borrowed_mind', trend: 'down', tests: 20, lastTest: '2026-06-28' },
  { id: 7, name: 'Minh Khoa', avatar: '🚀', score: 32, category: 'borrowed_mind', trend: 'up', tests: 18, lastTest: '2026-06-27' },
  { id: 8, name: 'Hồng Anh', avatar: '🦋', score: 35, category: 'borrowed_mind', trend: 'same', tests: 22, lastTest: '2026-06-26' },
  { id: 9, name: 'Văn Đức', avatar: '⚡', score: 38, category: 'borrowed_mind', trend: 'up', tests: 25, lastTest: '2026-06-29' },
  { id: 10, name: 'Thanh Hà', avatar: '💫', score: 42, category: 'echo_prisoner', trend: 'down', tests: 30, lastTest: '2026-06-28' },
  { id: 11, name: 'Kim Oanh', avatar: '🌺', score: 45, category: 'echo_prisoner', trend: 'same', tests: 35, lastTest: '2026-06-27' },
  { id: 12, name: 'Bảo Long', avatar: '🦅', score: 48, category: 'echo_prisoner', trend: 'up', tests: 40, lastTest: '2026-06-29' },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter') || 'all';
  const limit = parseInt(searchParams.get('limit') || '10');
  
  let filteredData = [...leaderboardData];
  
  if (filter === 'week') {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    filteredData = filteredData.filter(item => new Date(item.lastTest) >= weekAgo);
  } else if (filter === 'month') {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    filteredData = filteredData.filter(item => new Date(item.lastTest) >= monthAgo);
  }
  
  filteredData = filteredData.slice(0, limit);
  
  return NextResponse.json({
    success: true,
    data: {
      entries: filteredData,
      total: leaderboardData.length,
      filter,
    },
  });
}
