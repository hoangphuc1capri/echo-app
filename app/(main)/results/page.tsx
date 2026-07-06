'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Home, RotateCcw, Brain, Sparkles, Trophy, TrendingUp, ChevronRight, Star, Target, Lightbulb } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import TreeVisualization from '@/components/quiz/TreeVisualization';
import { CategoryInfo } from '@/types';

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<{
    score: number;
    percentage: number;
    category: CategoryInfo;
  } | null>(null);

  useEffect(() => {
    const storedResult = localStorage.getItem('quiz-result');
    if (!storedResult) {
      router.push('/quiz');
      return;
    }
    setResult(JSON.parse(storedResult));
  }, [router]);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse font-ui text-[var(--echo-ink-muted)]">Đang tải kết quả...</div>
      </div>
    );
  }

  const { score, percentage, category } = result;
  const branches = Math.floor((80 - score) / 10);
  const leaves = 8 - branches;

  const categoryBadgeMap: Record<string, 'seed' | 'walker' | 'supported' | 'borrowed' | 'prisoner'> = {
    'seed_keeper': 'seed',
    'walker': 'walker',
    'supported': 'supported',
    'borrowed_mind': 'borrowed',
    'echo_prisoner': 'prisoner',
  };

  const getTreeMessage = () => {
    if (percentage <= 20) return { emoji: '🌳', title: 'Cây xanh tốt!', message: 'Bạn đang giữ được lửa tư duy. Tiếp tục phát huy!', color: '#059669' };
    if (percentage <= 40) return { emoji: '🌲', title: 'Cây khỏe mạnh!', message: 'Bạn có sự cân bằng tốt.', color: '#059669' };
    if (percentage <= 60) return { emoji: '🌿', title: 'Cây đang phát triển', message: 'Cân bằng là chìa khóa.', color: '#D97706' };
    if (percentage <= 80) return { emoji: '🌾', title: 'Cây cần chăm sóc', message: 'Hãy đòi lại bộ não của bạn!', color: '#D97706' };
    return { emoji: '🌵', title: 'Cây cần giúp đỡ', message: 'Mọi hành trình đều bắt đầu từ bước nhỏ.', color: '#DC2626' };
  };

  const treeInfo = getTreeMessage();

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 text-sm text-[var(--echo-ink-muted)]">
          <a href="/dashboard" className="hover:text-[var(--echo-wood)]">Trang chủ</a>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[var(--echo-ink)]">Kết quả</span>
        </div>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <div className="text-6xl mb-4">{treeInfo.emoji}</div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-[var(--echo-ink)] mb-2">
          {treeInfo.title}
        </h1>
        <p className="text-[var(--echo-ink-muted)]">
          {treeInfo.message}
        </p>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Main Result */}
        <div className="lg:col-span-2 space-y-6">
          {/* Score Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-4"
          >
            <Card className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-blue-600">{score}</div>
              <div className="text-xs text-[var(--echo-ink-muted)] mt-1">/ 80 điểm</div>
            </Card>

            <Card className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-amber-600">{percentage}%</div>
              <div className="text-xs text-[var(--echo-ink-muted)] mt-1">Phụ thuộc AI</div>
            </Card>

            <Card className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div className="flex justify-center mt-1">
                <Badge variant={categoryBadgeMap[category.id] || 'default'} />
              </div>
              <div className="text-xs text-[var(--echo-ink-muted)] mt-1">Nhóm của bạn</div>
            </Card>
          </motion.div>

          {/* Category Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="text-center">
              <h2 className="text-2xl font-display font-bold text-[var(--echo-ink)] mb-3">
                {category.name}
              </h2>
              <p className="text-lg text-[var(--echo-ink-light)] italic leading-relaxed mb-4">
                "{category.description}"
              </p>
            </Card>
          </motion.div>

          {/* Tree Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="text-center">
              <h3 className="font-display font-semibold text-[var(--echo-ink)] mb-6 flex items-center justify-center gap-2">
                <Brain className="w-5 h-5 text-[var(--echo-wood)]" />
                Cây tư duy của bạn
              </h3>
              <div className="max-w-[260px] mx-auto">
                <TreeVisualization
                  branches={branches}
                  leaves={leaves}
                  totalQuestions={20}
                  currentQuestion={20}
                />
              </div>
              <div className="flex items-center justify-center gap-6 mt-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-[var(--echo-ink-muted)]">Cành: {branches}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-[var(--echo-ink-muted)]">Lá: {leaves}</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Button onClick={() => router.push('/letter')} className="flex-1">
              <Mail className="w-5 h-5" />
              Nhận thư cá nhân
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="secondary" onClick={() => router.push('/dashboard')}>
              <Home className="w-5 h-5" />
              Về Dashboard
            </Button>
            <Button variant="ghost" onClick={() => router.push('/quiz')}>
              <RotateCcw className="w-5 h-5" />
              Làm lại
            </Button>
          </motion.div>
        </div>

        {/* Right - Details */}
        <div className="space-y-6">
          {/* Category Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <h3 className="font-display font-bold text-[var(--echo-ink)] mb-4">Chi tiết</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[var(--echo-cream)] rounded-xl">
                  <span className="text-sm text-[var(--echo-ink-muted)]">Nhóm</span>
                  <Badge variant={categoryBadgeMap[category.id] || 'default'} />
                </div>
                <div className="flex items-center justify-between p-3 bg-[var(--echo-cream)] rounded-xl">
                  <span className="text-sm text-[var(--echo-ink-muted)]">Phụ thuộc</span>
                  <span className="text-sm font-medium text-amber-600">{percentage}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[var(--echo-cream)] rounded-xl">
                  <span className="text-sm text-[var(--echo-ink-muted)]">Cành (độc lập)</span>
                  <span className="text-sm font-medium text-emerald-600">{branches}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[var(--echo-cream)] rounded-xl">
                  <span className="text-sm text-[var(--echo-ink-muted)]">Lá (hỗ trợ)</span>
                  <span className="text-sm font-medium text-amber-600">{leaves}</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-emerald-600" />
                <h3 className="font-display font-semibold text-[var(--echo-ink)]">Gợi ý</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm text-[var(--echo-ink-light)]">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  Thử tự trả lời trước khi hỏi AI
                </li>
                <li className="flex items-start gap-2 text-sm text-[var(--echo-ink-light)]">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  Viết nhật ký học tập mỗi ngày
                </li>
                <li className="flex items-start gap-2 text-sm text-[var(--echo-ink-light)]">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  Đặt câu hỏi "tại sao" thay vì "làm gì"
                </li>
              </ul>
            </Card>
          </motion.div>

          {/* Quote */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center py-4"
          >
            <p className="text-[var(--echo-ink-muted)] italic text-sm">
              "Mỗi cái cây không lớn lên nhờ vay ánh sáng từ nơi khác."
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
