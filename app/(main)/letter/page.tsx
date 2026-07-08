'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, ArrowLeft, Heart, Lightbulb, MessageCircle, 
  BookOpen, Calendar, Sparkles, Feather, Star, 
  MapPin, Clock, ChevronRight, Send, RefreshCw,
  Bot, Zap, Brain, Sparkle, GraduationCap
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface CategoryInfo {
  id: string;
  name: string;
  nameVi: string;
  subtitle: string;
  description: string;
  color: string;
  letter: string;
  tips: string[];
}

interface QuizResult {
  _id: string;
  score: number;
  percentage: number;
  category: CategoryInfo;
  createdAt: string;
}

// Category config với đầy đủ thông tin
const categoryConfig: Record<string, { 
  icon: React.ElementType; 
  gradient: string;
  bgGradient: string;
  accentColor: string;
  description: string;
}> = {
  'seed_keeper': { 
    icon: Brain,
    gradient: 'from-emerald-500 to-teal-600',
    bgGradient: 'bg-gradient-to-br from-emerald-50 to-teal-50',
    accentColor: 'text-emerald-600',
    description: 'Tư duy độc lập cao'
  },
  'walker': { 
    icon: Zap,
    gradient: 'from-blue-500 to-cyan-600',
    bgGradient: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    accentColor: 'text-blue-600',
    description: 'Cân bằng tự lập & AI'
  },
  'supported': { 
    icon: GraduationCap,
    gradient: 'from-amber-500 to-orange-600',
    bgGradient: 'bg-gradient-to-br from-amber-50 to-orange-50',
    accentColor: 'text-amber-600',
    description: 'Cần sự hỗ trợ từ AI'
  },
  'hidden_dependent': { 
    icon: Star,
    gradient: 'from-purple-500 to-violet-600',
    bgGradient: 'bg-gradient-to-br from-purple-50 to-violet-50',
    accentColor: 'text-purple-600',
    description: 'Phụ thuộc AI tiềm ẩn'
  },
  'ai_living': { 
    icon: Bot,
    gradient: 'from-rose-500 to-red-600',
    bgGradient: 'bg-gradient-to-br from-rose-50 to-red-50',
    accentColor: 'text-rose-600',
    description: 'Phụ thuộc nhiều vào AI'
  },
};

// Helper để lấy variant cho Badge
const getBadgeVariant = (categoryId: string): 'seed' | 'walker' | 'supported' | 'borrowed' | 'prisoner' => {
  if (categoryId.includes('seed')) return 'seed';
  if (categoryId.includes('walker')) return 'walker';
  if (categoryId.includes('supported')) return 'supported';
  if (categoryId.includes('hidden')) return 'borrowed';
  return 'prisoner';
};

export default function LetterPage() {
  const router = useRouter();
  const [results, setResults] = useState<QuizResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpening, setIsOpening] = useState(false);
  const [openingId, setOpeningId] = useState<string | null>(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('/api/quiz', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (data.success && data.data.results) {
        // Sắp xếp theo ngày mới nhất
        const sorted = data.data.results.sort((a: QuizResult, b: QuizResult) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setResults(sorted);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEnvelope = (result: QuizResult) => {
    if (isOpening) return;
    
    setOpeningId(result._id);
    setIsOpening(true);
    
    // Animation độ dài 2.5s
    setTimeout(() => {
      setSelectedResult(result);
      setIsOpening(false);
      setOpeningId(null);
    }, 2500);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays < 7) return `${diffDays} ngày trước`;
    
    return date.toLocaleDateString('vi-VN', { 
      day: 'numeric', 
      month: 'short'
    });
  };

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      weekday: 'long',
      day: 'numeric', 
      month: 'long', 
      year: 'numeric'
    });
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'buổi sáng';
    if (hour < 18) return 'buổi chiều';
    return 'buổi tối';
  };

  // ===== LETTER DETAIL VIEW =====
  if (selectedResult) {
    const { category } = selectedResult;
    const config = categoryConfig[category.id] || categoryConfig['seed_keeper'];
    const IconComponent = config.icon;

    return (
      <motion.div 
        className="min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button 
            onClick={() => setSelectedResult(null)}
            className="flex items-center gap-2 text-[var(--echo-wood)] hover:text-[var(--echo-ink)] transition-colors mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-ui">Quay lại hộp thư</span>
          </button>
          
          <div className="flex items-center gap-4">
            <motion.div 
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg`}
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 12 }}
            >
              <IconComponent className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-[var(--echo-ink)]">
                {category.nameVi}
              </h1>
              <p className="text-sm text-[var(--echo-ink-muted)] font-ui flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatFullDate(selectedResult.createdAt)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Letter Paper */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className="relative">
            {/* Decorative Background */}
            <div className={`absolute inset-0 ${config.bgGradient} rounded-3xl transform rotate-1 opacity-50`} />
            
            <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-[var(--echo-parchment)]">
              
              {/* Letter Header */}
              <div className={`relative py-12 px-8 text-center bg-gradient-to-b ${config.bgGradient}`}>
                {/* Decorative top */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.gradient}`} />
                
                {/* Badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12, delay: 0.1 }}
                  className="mb-4"
                >
                  <Badge 
                    variant={getBadgeVariant(selectedResult.category?.id || '')} 
                    size="lg" 
                  />
                </motion.div>
                
                <motion.h2 
                  className="text-2xl md:text-3xl font-display font-bold text-[var(--echo-wood)] mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  {category.nameVi}
                </motion.h2>
                
                <motion.p 
                  className="text-[var(--echo-ink-muted)] font-ui"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {category.subtitle}
                </motion.p>

                {/* Score */}
                <motion.div 
                  className="mt-6 inline-flex items-center gap-3 px-5 py-2.5 bg-white/80 backdrop-blur rounded-full shadow-sm"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
                    <Sparkle className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <span className="font-ui font-semibold text-[var(--echo-ink)]">
                      {selectedResult.percentage}% Phụ thuộc AI
                    </span>
                    <span className="text-[var(--echo-ink-muted)] text-sm ml-2">
                      ({selectedResult.score} điểm)
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Letter Body */}
              <motion.div 
                className="p-8 md:p-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {/* Letter Content */}
                <div className="relative">
                  <div className="absolute -top-6 -left-4 text-[120px] text-[#C9A227]/5 font-serif leading-none select-none">
                    "
                  </div>
                  
                  <div className="relative bg-[var(--echo-cream)]/30 rounded-2xl p-6 md:p-8 border border-[var(--echo-parchment)]">
                    <div className="prose prose-lg max-w-none">
                      <p className="font-serif text-[var(--echo-ink)] leading-relaxed text-lg whitespace-pre-line">
                        {category.letter}
                      </p>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-12 -right-4 text-[120px] text-[#C9A227]/5 font-serif leading-none select-none">
                    "
                  </div>
                </div>

                {/* Tips Section */}
                {category.tips && category.tips.length > 0 && (
                  <motion.div 
                    className="mt-10 p-6 bg-[var(--echo-cream)]/50 rounded-2xl border border-[var(--echo-parchment)]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h3 className="font-display font-bold text-[var(--echo-wood)] mb-4 flex items-center gap-2">
                      <Lightbulb className={`w-5 h-5 ${config.accentColor}`} />
                      Gợi ý cho bạn
                    </h3>
                    <ul className="space-y-3">
                      {category.tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className={`w-6 h-6 rounded-full ${config.bgGradient} ${config.accentColor} flex items-center justify-center text-xs font-bold mt-0.5`}>
                            {index + 1}
                          </span>
                          <span className="text-[var(--echo-ink)] font-ui">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {/* Signature */}
                <motion.div 
                  className="mt-10 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="inline-flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full ${config.bgGradient} flex items-center justify-center mb-3`}>
                      <Feather className={`w-6 h-6 ${config.accentColor}`} />
                    </div>
                    <p className="font-serif text-[var(--echo-ink-muted)] italic">
                      Gửi tới bạn với yêu thương,
                    </p>
                    <p className="font-display font-bold text-[var(--echo-wood)] mt-2 text-lg">
                      🌱 ECHO
                    </p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Bottom Decorative */}
              <div className={`h-1 bg-gradient-to-r ${config.gradient}`} />
            </div>
          </div>

          {/* Action Buttons */}
          <motion.div 
            className="mt-8 flex justify-center gap-4 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Button
              variant="outline"
              onClick={() => setSelectedResult(null)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại hộp thư
            </Button>
            <Button
              variant="primary"
              onClick={() => router.push('/quiz')}
              className="flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Làm khảo sát mới
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  // ===== LOADING STATE =====
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          className="text-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <Mail className="w-16 h-16 text-[#C9A227] mx-auto mb-4" />
          </motion.div>
          <p className="text-[var(--echo-ink-muted)] font-ui text-lg">Đang mở hộp thư...</p>
        </motion.div>
      </div>
    );
  }

  // ===== EMPTY STATE =====
  if (results.length === 0) {
    return (
      <motion.div 
        className="min-h-screen flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="max-w-md w-full text-center">
          {/* Animated Illustration */}
          <motion.div 
            className="w-48 h-48 mx-auto mb-8 relative"
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          >
            <div className="absolute inset-0 bg-[#C9A227]/20 rounded-full blur-3xl" />
            <div className="relative w-full h-full bg-gradient-to-br from-[#FAF6F0] to-[#F5EDE0] rounded-full flex items-center justify-center border-4 border-[#C9A227]/20">
              <Mail className="w-20 h-20 text-[#C9A227]" />
            </div>
            {/* Floating elements */}
            <motion.div 
              className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center"
              animate={{ rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
            >
              <Sparkle className="w-4 h-4 text-[#C9A227]" />
            </motion.div>
          </motion.div>

          <motion.h1 
            className="text-3xl font-display font-bold text-[var(--echo-ink)] mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Hộp thư trống
          </motion.h1>
          
          <motion.p 
            className="text-[var(--echo-ink-muted)] font-ui mb-8 leading-relaxed text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Chào buổi {getTimeOfDay()}! 
            <br />
            <span className="text-[var(--echo-wood)]">Bạn chưa có bức thư nào</span> trong hộp thư.
            <br />
            Hãy bắt đầu hành trình khám phá bản thân ngay hôm nay!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              variant="primary"
              size="lg"
              onClick={() => router.push('/quiz')}
              className="flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transition-shadow"
            >
              <Send className="w-5 h-5" />
              Bắt đầu khảo sát
            </Button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // ===== MAIN LETTER LIST VIEW =====
  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-display font-bold text-[var(--echo-ink)] flex items-center gap-3">
          <motion.div 
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
          >
            <Mail className="w-6 h-6 text-white" />
          </motion.div>
          Hộp thư của tôi
        </h1>
        <p className="text-[var(--echo-ink-muted)] mt-2 font-ui">
          Bạn có <span className="text-[var(--echo-wood)] font-semibold">{results.length}</span> bức thư đang chờ được đọc
        </p>
      </motion.div>

      {/* Letter Envelopes Grid */}
      <motion.div 
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {results.map((result, index) => {
          const config = categoryConfig[result.category.id] || categoryConfig['seed_keeper'];
          const IconComponent = config.icon;
          const isCurrentlyOpening = openingId === result._id;

          return (
            <motion.div
              key={result._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              {/* Envelope Card */}
              <motion.div 
                className={`
                  relative cursor-pointer group
                  ${isCurrentlyOpening ? 'pointer-events-none' : ''}
                `}
                onClick={() => !isCurrentlyOpening && handleOpenEnvelope(result)}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Card Background */}
                <div className={`
                  relative bg-white rounded-2xl overflow-hidden shadow-md
                  group-hover:shadow-2xl transition-all duration-300
                  border border-transparent group-hover:border-[var(--echo-parchment)]
                  ${isCurrentlyOpening ? 'ring-4 ring-[#C9A227]/30 scale-[0.98]' : ''}
                `}>
                  {/* Top Color Strip */}
                  <div className={`h-1.5 bg-gradient-to-r ${config.gradient}`} />
                  
                  <div className="p-6">
                    {/* Date & Badge Row */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs px-2.5 py-1 bg-[#FAF6F0] rounded-full text-[var(--echo-wood)] font-ui flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(result.createdAt)}
                      </span>
                      <Badge variant={getBadgeVariant(result.category.id)} />
                    </div>

                    {/* Icon & Title */}
                    <div className="flex items-center gap-4 mb-4">
                      <motion.div 
                        className={`
                          w-14 h-14 rounded-xl bg-gradient-to-br ${config.gradient} 
                          flex items-center justify-center shadow-md
                          group-hover:scale-110 transition-transform duration-300
                        `}
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                      >
                        <IconComponent className="w-7 h-7 text-white" />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-bold text-[var(--echo-ink)] text-lg truncate">
                          {result.category.nameVi}
                        </h3>
                        <p className="text-sm text-[var(--echo-ink-muted)] font-ui truncate">
                          {result.category.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Score & Description */}
                    <div className={`
                      p-4 rounded-xl ${config.bgGradient} mb-4
                    `}>
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkle className={`w-4 h-4 ${config.accentColor}`} />
                        <span className={`text-sm font-semibold ${config.accentColor}`}>
                          {result.percentage}% Phụ thuộc AI
                        </span>
                      </div>
                      <p className="text-xs text-[var(--echo-ink-muted)] font-ui">
                        {config.description}
                      </p>
                    </div>

                    {/* Read Button */}
                    <motion.div 
                      className={`
                        flex items-center justify-between pt-4 border-t border-[var(--echo-parchment)]
                      `}
                    >
                      <span className="text-sm font-ui text-[var(--echo-ink-muted)]">
                        Xem chi tiết
                      </span>
                      <span className={`
                        inline-flex items-center gap-1 text-sm font-ui font-medium
                        ${isCurrentlyOpening ? 'text-[#C9A227]' : 'text-[var(--echo-wood)] group-hover:text-[#C9A227]'}
                        transition-colors
                      `}>
                        {isCurrentlyOpening ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Đang mở...
                          </>
                        ) : (
                          <>
                            Đọc thư
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </span>
                    </motion.div>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className={`
                  absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 
                  transition-opacity duration-300 pointer-events-none
                  bg-gradient-to-br ${config.gradient} -z-10 blur-xl
                `} style={{ transform: 'scale(0.95)' }} />
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Bottom CTA */}
      <motion.div 
        className="mt-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="inline-flex items-center gap-4 px-6 py-4 bg-[#FAF6F0] rounded-2xl shadow-sm">
          <div className="w-12 h-12 rounded-full bg-[#C9A227]/20 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-[#C9A227]" />
          </div>
          <div className="text-left">
            <p className="font-ui font-medium text-[var(--echo-ink)]">
              Tiếp tục khám phá bản thân
            </p>
            <p className="text-sm text-[var(--echo-ink-muted)]">
              Làm khảo sát để nhận thêm insights
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => router.push('/quiz')}
            className="flex items-center gap-2 ml-4"
          >
            <BookOpen className="w-4 h-4" />
            Khảo sát mới
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
