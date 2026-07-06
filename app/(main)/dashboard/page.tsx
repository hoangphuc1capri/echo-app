'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, Mail, MessageCircle, Sparkles, Brain, Clock, Trophy, ChevronRight, Zap, Target, Star, Crown, Flame, Award, Target as TargetIcon, TrendingUp, Users, Calendar, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import TreeVisualization from '@/components/quiz/TreeVisualization';
import { CategoryInfo } from '@/types';

interface QuizHistoryItem {
  _id: string;
  score: number;
  percentage: number;
  category: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null);
  const [latestResult, setLatestResult] = useState<{
    score: number;
    percentage: number;
    category: CategoryInfo;
  } | null>(null);
  const [history, setHistory] = useState<QuizHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Chào buổi sáng');
    else if (hour < 18) setGreeting('Chào buổi chiều');
    else setGreeting('Chào buổi tối');
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth-token');
      const userData = localStorage.getItem('user');

      if (!token || !userData) {
        router.push('/auth');
        return;
      }

      setUser(JSON.parse(userData));

      const storedResult = localStorage.getItem('quiz-result');
      if (storedResult) {
        setLatestResult(JSON.parse(storedResult));
      }
    };

    checkAuth();
    fetchHistory();
  }, [router]);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('/api/quiz', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setHistory(data.data.results || []);
        }
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Vừa xong';
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffHours < 48) return 'Hôm qua';
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  const categoryBadgeMap: Record<string, 'seed' | 'walker' | 'supported' | 'borrowed' | 'prisoner'> = {
    'seed_keeper': 'seed',
    'walker': 'walker',
    'supported': 'supported',
    'borrowed_mind': 'borrowed',
    'echo_prisoner': 'prisoner',
  };

  const categoryColors: Record<string, string> = {
    'seed_keeper': '#059669',
    'walker': '#D97706',
    'supported': '#2563EB',
    'borrowed_mind': '#DC2626',
    'echo_prisoner': '#9333EA',
  };

  const getCategoryName = (id: string) => {
    const names: Record<string, string> = {
      'seed_keeper': 'Người giữ lửa',
      'walker': 'Người đi trên cầu',
      'supported': 'Người thích hỗ trợ',
      'borrowed_mind': 'Người mượn trí',
      'echo_prisoner': 'Người tù của tiếng vọng',
    };
    return names[id] || id;
  };

  const totalTests = history.length || 1;
  const avgScore = latestResult?.score || 0;
  const avgDependence = latestResult?.percentage || 0;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-[var(--echo-ink)]">
              {greeting}, {user?.name || user?.email.split('@')[0]}
            </h1>
            <p className="text-[var(--echo-ink-muted)] mt-1">
              Hành trình khám phá bản thân của bạn tiếp tục
            </p>
          </div>
          <Button onClick={() => router.push('/quiz')}>
            <Sparkles className="w-4 h-4" />
            Khảo sát ngay
          </Button>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
      >
        <Card className="text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full" />
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-2">
            <TargetIcon className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-[var(--echo-ink)]">{totalTests}</div>
          <div className="text-xs text-[var(--echo-ink-muted)]">Lần test</div>
        </Card>
        
        <Card className="text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-bl-full" />
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mx-auto mb-2">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-[var(--echo-ink)]">{avgScore}</div>
          <div className="text-xs text-[var(--echo-ink-muted)]">Điểm TB</div>
        </Card>
        
        <Card className="text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-amber-500/10 to-transparent rounded-bl-full" />
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mx-auto mb-2">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-[var(--echo-ink)]">{avgDependence}%</div>
          <div className="text-xs text-[var(--echo-ink-muted)]">Phụ thuộc</div>
        </Card>
        
        <Card className="text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full" />
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-2">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-[var(--echo-ink)]">#{4}</div>
          <div className="text-xs text-[var(--echo-ink-muted)]">Xếp hạng</div>
        </Card>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h2 className="font-display font-semibold text-[var(--echo-ink)] mb-3">Hành động nhanh</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Card hoverable className="cursor-pointer group" onClick={() => router.push('/quiz')}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--echo-wood)] to-[var(--echo-wood-dark)] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[var(--echo-ink)]">Khảo sát mới</h3>
                    <p className="text-xs text-[var(--echo-ink-muted)]">20 câu hỏi • 10 phút</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[var(--echo-ink-muted)] group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>

              <Card hoverable className="cursor-pointer group" onClick={() => router.push('/letter')}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[var(--echo-ink)]">Thư cá nhân</h3>
                    <p className="text-xs text-[var(--echo-ink-muted)]">Xem lời nhắn</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[var(--echo-ink-muted)] group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>

              <Card hoverable className="cursor-pointer group" onClick={() => router.push('/anonymous-room')}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[var(--echo-ink)]">Phòng gọi</h3>
                    <p className="text-xs text-[var(--echo-ink-muted)]">Kết nối ẩn danh</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[var(--echo-ink-muted)] group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </div>
          </motion.div>

          {/* Latest Result */}
          {latestResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display font-bold text-[var(--echo-ink)] flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-500" />
                    Kết quả gần nhất
                  </h2>
                  <Badge variant={categoryBadgeMap[latestResult.category.id] || 'default'} dot />
                </div>
                
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-shrink-0">
                    <TreeVisualization
                      branches={Math.floor((80 - latestResult.score) / 10)}
                      leaves={8 - Math.floor((80 - latestResult.score) / 10)}
                      totalQuestions={20}
                      currentQuestion={20}
                    />
                  </div>

                  <div className="flex-grow w-full">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-blue-50 rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-blue-600">{latestResult.score}</div>
                        <div className="text-xs text-blue-500">Điểm</div>
                      </div>
                      <div className="bg-amber-50 rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-amber-600">{latestResult.percentage}%</div>
                        <div className="text-xs text-amber-500">Phụ thuộc</div>
                      </div>
                    </div>
                    <p className="text-sm text-[var(--echo-ink-muted)] italic mb-4">
                      "{latestResult.category.description}"
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => router.push('/letter')}>
                        <Mail className="w-4 h-4" />
                        Xem thư
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => router.push('/quiz')}>
                        <RefreshCw className="w-4 h-4" />
                        Test lại
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-[var(--echo-ink)] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[var(--echo-wood)]" />
                Lịch sử khảo sát
              </h2>
            </div>

            {isLoading ? (
              <Card className="text-center py-12">
                <div className="animate-pulse">
                  <div className="w-12 h-12 rounded-full bg-[var(--echo-parchment)] mx-auto mb-4" />
                </div>
              </Card>
            ) : history.length === 0 ? (
              <Card className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[var(--echo-cream)] flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-[var(--echo-ink-muted)]" />
                </div>
                <p className="text-[var(--echo-ink-muted)] mb-4">Bạn chưa có kết quả nào</p>
                <Button onClick={() => router.push('/quiz')}>
                  <Sparkles className="w-4 h-4" />
                  Bắt đầu ngay
                </Button>
              </Card>
            ) : (
              <div className="space-y-3">
                {history.slice(0, 5).map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card hoverable className="cursor-pointer" onClick={() => router.push('/results')}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md"
                            style={{ backgroundColor: categoryColors[item.category] || '#5C4033' }}
                          >
                            {item.score}
                          </div>
                          <div>
                            <Badge variant={categoryBadgeMap[item.category] || 'default'} />
                            <div className="flex items-center gap-2 mt-1.5 text-xs text-[var(--echo-ink-muted)]">
                              <Calendar className="w-3 h-3" />
                              {formatTimeAgo(item.createdAt)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div 
                            className="text-xl font-bold"
                            style={{ color: categoryColors[item.category] || '#D97706' }}
                          >
                            {item.percentage}%
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Daily Tip */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-[var(--echo-ink)] mb-1">Mẹo hôm nay</h3>
                  <p className="text-sm text-[var(--echo-ink-muted)]">
                    Trước khi hỏi AI, hãy thử tự suy nghĩ 2-3 phút. Đôi khi câu trả lời đã nằm trong đầu bạn!
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-5 h-5 text-amber-500" />
                <h3 className="font-display font-bold text-[var(--echo-ink)]">Thành tựu</h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: '🎯', label: 'Test đầu', unlocked: history.length > 0 },
                  { icon: '🔥', label: '3 lần test', unlocked: history.length >= 3 },
                  { icon: '💎', label: 'Dưới 20%', unlocked: latestResult && latestResult.percentage < 20 },
                  { icon: '🌱', label: 'Người giữ lửa', unlocked: latestResult?.category.id === 'seed_keeper' },
                  { icon: '⭐', label: 'Top 10', unlocked: true },
                  { icon: '🏆', label: 'Vô địch', unlocked: false },
                ].map((achievement, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className={`
                      flex flex-col items-center p-3 rounded-xl text-center transition-all
                      ${achievement.unlocked ? 'bg-white shadow-sm' : 'bg-[var(--echo-cream)]/50 opacity-50'}
                    `}
                  >
                    <span className="text-2xl mb-1">{achievement.icon}</span>
                    <span className="text-[10px] text-[var(--echo-ink-muted)]">{achievement.label}</span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Progress */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-[var(--echo-wood)]" />
                <h3 className="font-display font-bold text-[var(--echo-ink)]">Tiến độ</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[var(--echo-ink-muted)]">Hoàn thành khảo sát</span>
                    <span className="font-medium">{Math.min(totalTests, 10)}/10</span>
                  </div>
                  <div className="h-2 bg-[var(--echo-parchment)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all"
                      style={{ width: `${Math.min(totalTests * 10, 100)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[var(--echo-ink-muted)]">Giảm phụ thuộc AI</span>
                    <span className="font-medium">{latestResult ? 100 - latestResult.percentage : 0}%</span>
                  </div>
                  <div className="h-2 bg-[var(--echo-parchment)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all"
                      style={{ width: `${latestResult ? 100 - latestResult.percentage : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Community Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-purple-500" />
                <h3 className="font-display font-semibold text-[var(--echo-ink)]">Cộng đồng</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-white/60 rounded-lg p-3">
                  <div className="text-xl font-bold text-purple-600">1,234</div>
                  <div className="text-xs text-purple-500">Người dùng</div>
                </div>
                <div className="bg-white/60 rounded-lg p-3">
                  <div className="text-xl font-bold text-purple-600">5,678</div>
                  <div className="text-xs text-purple-500">Lượt test</div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
