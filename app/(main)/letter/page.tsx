'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, ArrowLeft, Heart, Lightbulb, MessageCircle, 
  BookOpen, Calendar, Sparkles, Feather, Star, 
  MapPin, Clock, ChevronRight, Send, RefreshCw
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface QuizResult {
  _id: string;
  score: number;
  percentage: number;
  category: {
    id: string;
    name: string;
    subtitle: string;
    description: string;
    color: string;
  };
  createdAt: string;
}

const categoryConfig: Record<string, { icon: React.ElementType; gradient: string; pattern: string }> = {
  'seed_keeper': { 
    icon: Heart, 
    gradient: 'from-emerald-500 to-teal-600',
    pattern: '🌱'
  },
  'walker': { 
    icon: Lightbulb, 
    gradient: 'from-blue-500 to-indigo-600',
    pattern: '🚶'
  },
  'supported': { 
    icon: MessageCircle, 
    gradient: 'from-amber-500 to-orange-600',
    pattern: '🤝'
  },
  'borrowed_mind': { 
    icon: Star, 
    gradient: 'from-purple-500 to-violet-600',
    pattern: '💭'
  },
  'echo_prisoner': { 
    icon: MapPin, 
    gradient: 'from-rose-500 to-red-600',
    pattern: '⛓️'
  },
};

export default function LetterPage() {
  const router = useRouter();
  const [results, setResults] = useState<QuizResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openingEnvelope, setOpeningEnvelope] = useState<string | null>(null);

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
        setResults(data.data.results);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEnvelope = (result: QuizResult) => {
    setOpeningEnvelope(result._id);
    setTimeout(() => {
      setOpeningEnvelope(null);
      setSelectedResult(result);
    }, 2000);
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
      month: 'short', 
      year: 'numeric'
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

  // Letter Detail View
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
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg`}>
              <IconComponent className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-[var(--echo-ink)]">
                {category.name}
              </h1>
              <p className="text-sm text-[var(--echo-ink-muted)] font-ui flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatFullDate(selectedResult.createdAt)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Letter Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          {/* Letter Paper */}
          <div className="relative">
            {/* Decorative Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#C9A227]/5 to-transparent rounded-3xl transform rotate-1" />
            
            <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden">
              {/* Top Decorative Border */}
              <div className={`h-2 bg-gradient-to-r ${config.gradient}`} />
              
              {/* Letter Header */}
              <div className="p-8 md:p-12 text-center border-b border-[#EDE4D3]">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12 }}
                  className="inline-block mb-4"
                >
                  <Badge variant={(selectedResult.category?.id || '').includes('seed') ? 'seed' : 
                    (selectedResult.category?.id || '').includes('walker') ? 'walker' :
                    (selectedResult.category?.id || '').includes('supported') ? 'supported' :
                    (selectedResult.category?.id || '').includes('borrowed') ? 'borrowed' : 'prisoner'} 
                    size="lg" 
                  />
                </motion.div>
                
                <motion.h2 
                  className="text-3xl md:text-4xl font-display font-bold text-[var(--echo-wood)] mb-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {category.name}
                </motion.h2>
                
                <motion.p 
                  className="text-[var(--echo-ink-muted)] font-ui text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {category.subtitle}
                </motion.p>

                {/* Score Badge */}
                <motion.div 
                  className="mt-6 inline-flex items-center gap-3 px-4 py-2 bg-[#FAF6F0] rounded-full"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Sparkles className="w-5 h-5 text-[#C9A227]" />
                  <span className="font-ui font-medium text-[var(--echo-ink)]">
                    Điểm Tự Chủ: {selectedResult.percentage}%
                  </span>
                  <span className="text-[var(--echo-ink-muted)]">•</span>
                  <span className="font-ui text-[var(--echo-ink-muted)]">
                    {selectedResult.score} điểm
                  </span>
                </motion.div>
              </div>

              {/* Letter Body */}
              <motion.div 
                className="p-8 md:p-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {/* Letter Content Box */}
                <div className="relative">
                  {/* Decorative Quotation */}
                  <div className="absolute -top-4 -left-2 text-8xl text-[#C9A227]/10 font-serif leading-none">
                    "
                  </div>
                  
                  <div className="bg-gradient-to-br from-[#FAF6F0] to-white rounded-2xl p-6 md:p-8 relative">
                    <div className="prose prose-lg max-w-none">
                      <p className="font-serif text-[var(--echo-ink)] leading-relaxed text-lg whitespace-pre-line">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Decorative Quotation End */}
                  <div className="absolute -bottom-8 -right-2 text-8xl text-[#C9A227]/10 font-serif leading-none">
                    "
                  </div>
                </div>

                {/* Signature */}
                <motion.div 
                  className="mt-12 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="inline-flex flex-col items-center">
                    <Feather className="w-6 h-6 text-[#C9A227] mb-2" />
                    <p className="font-serif text-[var(--echo-ink-muted)] italic">
                      Gửi tới bạn với yêu thương,
                    </p>
                    <p className="font-display font-bold text-[var(--echo-wood)] mt-1">
                      ECHO
                    </p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Bottom Decorative Border */}
              <div className={`h-2 bg-gradient-to-r ${config.gradient}`} />
            </div>
          </div>

          {/* Action Buttons */}
          <motion.div 
            className="mt-8 flex justify-center gap-4 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              variant="outline"
              onClick={() => setSelectedResult(null)}
              className="flex items-center gap-2"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
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

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          className="text-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <Mail className="w-12 h-12 text-[#C9A227] mx-auto mb-4" />
          <p className="text-[var(--echo-ink-muted)] font-ui">Đang mở hộp thư...</p>
        </motion.div>
      </div>
    );
  }

  // Empty State
  if (results.length === 0) {
    return (
      <motion.div 
        className="min-h-screen flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="max-w-md w-full text-center">
          {/* Illustration */}
          <motion.div 
            className="w-40 h-40 mx-auto mb-8 relative"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <div className="absolute inset-0 bg-[#C9A227]/10 rounded-full blur-3xl" />
            <div className="relative w-full h-full bg-gradient-to-br from-[#FAF6F0] to-[#F5EDE0] rounded-full flex items-center justify-center">
              <Mail className="w-16 h-16 text-[#C9A227]" />
            </div>
          </motion.div>

          <motion.h1 
            className="text-2xl font-display font-bold text-[var(--echo-ink)] mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Hộp thư trống
          </motion.h1>
          
          <motion.p 
            className="text-[var(--echo-ink-muted)] font-ui mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Chào buổi {getTimeOfDay()}! 
            <br />
            Bạn chưa có bức thư nào trong hộp thư.
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
              className="flex items-center gap-2 mx-auto"
            >
              <Send className="w-5 h-5" />
              Bắt đầu khảo sát
            </Button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Main Letter List View
  return (
    <div className="min-h-screen">
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
          Bạn có {results.length} bức thư đang chờ được đọc
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
          const isOpening = openingEnvelope === result._id;

          return (
            <motion.div
              key={result._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Envelope Card */}
              <div 
                className={`
                  relative cursor-pointer group
                  ${isOpening ? 'pointer-events-none' : ''}
                `}
                onClick={() => !isOpening && handleOpenEnvelope(result)}
              >
                {/* Card Background */}
                <div className={`
                  relative bg-white rounded-2xl overflow-hidden shadow-md
                  group-hover:shadow-xl transition-all duration-300
                  group-hover:-translate-y-2
                  ${isOpening ? 'scale-95 opacity-80' : ''}
                `}>
                  {/* Top Color Strip */}
                  <div className={`h-1.5 bg-gradient-to-r ${config.gradient}`} />
                  
                  <div className="p-6">
                    {/* Date & Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs px-2.5 py-1 bg-[#FAF6F0] rounded-full text-[var(--echo-wood)] font-ui flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(result.createdAt)}
                      </span>
                      <Badge 
                        variant={(result.category?.id || '').includes('seed') ? 'seed' : 
                          (result.category?.id || '').includes('walker') ? 'walker' :
                          (result.category?.id || '').includes('supported') ? 'supported' :
                          (result.category?.id || '').includes('borrowed') ? 'borrowed' : 'prisoner'} 
                      />
                    </div>

                    {/* Icon & Title */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`
                        w-14 h-14 rounded-xl bg-gradient-to-br ${config.gradient} 
                        flex items-center justify-center shadow-md
                        group-hover:scale-110 transition-transform duration-300
                      `}>
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-bold text-[var(--echo-ink)] text-lg truncate">
                          {result.category.name}
                        </h3>
                        <p className="text-sm text-[var(--echo-ink-muted)] font-ui truncate">
                          {result.category.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Score Preview */}
                    <div className="flex items-center justify-between pt-4 border-t border-[#EDE4D3]">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#C9A227]" />
                        <span className="text-sm font-ui text-[var(--echo-ink)]">
                          {result.percentage}% Tự Chủ
                        </span>
                      </div>
                      
                      {/* Read Button */}
                      <span className={`
                        inline-flex items-center gap-1 text-sm font-ui
                        ${isOpening ? 'text-[#C9A227]' : 'text-[var(--echo-wood)] group-hover:text-[#C9A227]'}
                        transition-colors
                      `}>
                        {isOpening ? (
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
                    </div>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className={`
                  absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 
                  transition-opacity duration-300 pointer-events-none
                  bg-gradient-to-br ${config.gradient} -z-10 blur-xl
                `} style={{ transform: 'scale(0.95)' }} />
              </div>
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
        <div className="inline-flex items-center gap-3 px-6 py-4 bg-[#FAF6F0] rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-[#C9A227]/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#C9A227]" />
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
