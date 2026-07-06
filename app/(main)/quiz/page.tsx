'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, AlertCircle, Sparkles, Home, Check } from 'lucide-react';
import { quizQuestions } from '@/lib/quiz-data';
import TreeVisualization from '@/components/quiz/TreeVisualization';
import Button from '@/components/ui/Button';

export default function QuizPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(20).fill(null));
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showIntro, setShowIntro] = useState(true);

  const branches = answers.filter(a => a !== null && a >= 3).length;
  const leaves = answers.filter(a => a !== null && a <= 2).length;
  const answeredCount = answers.filter(a => a !== null).length;
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      router.push('/auth');
    }
  }, [router]);

  const handleSelectAnswer = useCallback((score: number) => {
    setSelectedAnswer(score);
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentQuestion] = score;
      return newAnswers;
    });
    setError('');
  }, [currentQuestion]);

  const handleNext = useCallback(() => {
    if (selectedAnswer === null) {
      setError('Vui lòng chọn một đáp án');
      return;
    }
    setError('');
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(answers[currentQuestion + 1]);
    }
  }, [selectedAnswer, currentQuestion, answers]);

  const handlePrev = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setSelectedAnswer(answers[currentQuestion - 1]);
      setError('');
    }
  }, [currentQuestion, answers]);

  const handleSubmit = async () => {
    if (answers.includes(null)) {
      setError('Vui lòng trả lời tất cả các câu hỏi');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ answers }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Đã xảy ra lỗi');
        setIsSubmitting(false);
        return;
      }

      // Save result to quiz-results array (for letter page)
      const newResult = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        ...data.data.result
      };
      
      const existingResults = JSON.parse(localStorage.getItem('quiz-results') || '[]');
      existingResults.unshift(newResult);
      localStorage.setItem('quiz-results', JSON.stringify(existingResults));
      
      // Also save single result for backwards compatibility
      localStorage.setItem('quiz-result', JSON.stringify(data.data.result));
      
      router.push('/results');
    } catch {
      setError('Đã xảy ra lỗi kết nối');
      setIsSubmitting(false);
    }
  };

  const handleJumpToQuestion = (index: number) => {
    setCurrentQuestion(index);
    setSelectedAnswer(answers[index]);
    setError('');
  };

  const question = quizQuestions[currentQuestion];

  // Intro Screen
  if (showIntro) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full"
        >
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl border border-[#EDE4D3]">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <Image
                  src="/logo.svg"
                  alt="ECHO Logo"
                  width={80}
                  height={80}
                  className="w-20 h-20 mx-auto mb-6"
                />
              </motion.div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-[#2C1810] mb-3">
                Khảo sát ECHO
              </h1>
              <p className="text-[#6B5B4F]">
                20 câu hỏi để hiểu rõ mối quan hệ của bạn với AI
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4 p-4 bg-[#F5EDE0] rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-[#5C4033] flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium text-[#2C1810]">20 câu hỏi</p>
                  <p className="text-sm text-[#6B5B4F]">Khoảng 10 phút để hoàn thành</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-[#F5EDE0] rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-[#4A7C23] flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium text-[#2C1810]">Trả lời trung thực</p>
                  <p className="text-sm text-[#6B5B4F]">Không có đáp án đúng hay sai</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-[#F5EDE0] rounded-xl">
                <div className="w-10 h-10 rounded-xl bg-[#C9A227] flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium text-[#2C1810]">Nhận kết quả</p>
                  <p className="text-sm text-[#6B5B4F]">Thư cá nhân hóa dành riêng cho bạn</p>
                </div>
              </div>
            </div>

            <Button onClick={() => setShowIntro(false)} fullWidth size="lg">
              <Sparkles className="w-5 h-5" />
              Bắt đầu khảo sát
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Fixed Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-lg border-b border-[#EDE4D3]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="ECHO"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="font-display font-bold text-[#2C1810]">ECHO</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-[#6B5B4F]">
                <span className="font-semibold text-[#5C4033]">{answeredCount}</span>/20
              </span>
              <span className="text-[#6B5B4F]">
                Cành: <span className="font-semibold text-[#4A7C23]">{branches}</span>
              </span>
              <span className="text-[#6B5B4F]">
                Lá: <span className="font-semibold text-[#C9A227]">{leaves}</span>
              </span>
            </div>
          </div>
          
          {/* Progress */}
          <div className="relative h-1.5 bg-[#EDE4D3] rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#5C4033] to-[#4A7C23] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column - Tree Visualization */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 order-2 lg:order-1"
          >
            <div className="sticky top-24 bg-white rounded-2xl p-6 shadow-lg border border-[#EDE4D3]">
              <div className="text-center mb-4">
                <h3 className="font-display font-semibold text-[#2C1810] flex items-center justify-center gap-2">
                  <span className="text-2xl">🌳</span>
                  Cây tư duy của bạn
                </h3>
              </div>
              
              <TreeVisualization
                branches={branches}
                leaves={leaves}
                totalQuestions={quizQuestions.length}
                currentQuestion={currentQuestion + 1}
              />

              {/* Mini Question Navigator */}
              <div className="mt-4">
                <p className="text-xs text-center text-[#6B5B4F] mb-2">Điều hướng nhanh</p>
                <div className="grid grid-cols-10 gap-1">
                  {quizQuestions.map((_, index) => {
                    const isAnswered = answers[index] !== null;
                    const isCurrent = index === currentQuestion;
                    const isBranch = answers[index] !== null && answers[index] >= 3;

                    return (
                      <button
                        key={index}
                        onClick={() => handleJumpToQuestion(index)}
                        className={`
                          aspect-square rounded flex items-center justify-center text-xs font-medium transition-all duration-200
                          focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5C4033]
                          ${isCurrent
                            ? 'bg-[#5C4033] text-white shadow-md'
                            : isAnswered
                              ? isBranch
                                ? 'bg-[#4A7C23]/20 text-[#4A7C23]'
                                : 'bg-[#C9A227]/20 text-[#C9A227]'
                              : 'bg-[#F5EDE0] text-[#6B5B4F] hover:bg-[#EDE4D3]'}
                        `}
                        aria-label={`Câu ${index + 1}`}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Question */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Question Card */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-[#EDE4D3] mb-6">
                  {/* Question Number */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-sm font-medium text-[#6B5B4F]">
                      Câu {currentQuestion + 1} trong 20
                    </span>
                    {answers[currentQuestion] !== null && (
                      <span className="flex items-center gap-1 text-sm text-[#4A7C23] font-medium">
                        <Check className="w-4 h-4" />
                        Đã trả lời
                      </span>
                    )}
                  </div>

                  {/* Question Text */}
                  <h2 className="text-xl md:text-2xl text-[#2C1810] font-medium leading-relaxed mb-8">
                    {question.question}
                  </h2>

                  {/* Answer Options */}
                  <div className="space-y-3">
                    {Object.entries(question.options).map(([key, text]) => {
                      const score = question.scores[key as keyof typeof question.scores];
                      const isSelected = selectedAnswer === score;

                      return (
                        <motion.button
                          key={key}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => handleSelectAnswer(score)}
                          className={`
                            w-full p-4 rounded-xl text-left font-ui transition-all duration-200
                            border-2 flex items-center gap-4
                            ${isSelected
                              ? 'border-[#5C4033] bg-[#5C4033]/5 shadow-md'
                              : 'border-[#EDE4D3] bg-white hover:border-[#5C4033]/30 hover:shadow-md'}
                          `}
                        >
                          <span className={`
                            w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base flex-shrink-0
                            font-display text-lg transition-colors
                            ${isSelected
                              ? 'bg-[#5C4033] text-white shadow-md'
                              : 'bg-[#F5EDE0] text-[#6B5B4F]'}
                          `}>
                            {key}
                          </span>
                          <span className="flex-1 text-[#2C1810]">{text}</span>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-6 h-6 rounded-full bg-[#5C4033] flex items-center justify-center flex-shrink-0"
                            >
                              <Check className="w-4 h-4 text-white" />
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-red-500 text-sm mt-4 p-3 bg-red-50 rounded-lg"
                      >
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#EDE4D3]">
                    <Button
                      variant="ghost"
                      onClick={handlePrev}
                      disabled={currentQuestion === 0}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Câu trước
                    </Button>

                    {currentQuestion === quizQuestions.length - 1 ? (
                      <Button
                        onClick={handleSubmit}
                        isLoading={isSubmitting}
                      >
                        <Sparkles className="w-4 h-4" />
                        Xem kết quả
                      </Button>
                    ) : (
                      <Button onClick={handleNext}>
                        Câu tiếp
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Question Navigator - Full */}
                <div className="bg-white rounded-2xl p-4 shadow-lg border border-[#EDE4D3]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-[#6B5B4F]">Tất cả câu hỏi</span>
                    <span className="text-xs text-[#6B5B4F]">
                      {answeredCount}/20 đã trả lời
                    </span>
                  </div>
                  <div className="grid grid-cols-10 gap-1.5">
                    {quizQuestions.map((_, index) => {
                      const isAnswered = answers[index] !== null;
                      const isCurrent = index === currentQuestion;
                      const isBranch = answers[index] !== null && answers[index] >= 3;

                      return (
                        <button
                          key={index}
                          onClick={() => handleJumpToQuestion(index)}
                          className={`
                            aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all duration-200
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5C4033] focus-visible:ring-offset-1
                            ${isCurrent
                              ? 'bg-[#5C4033] text-white shadow-md scale-110'
                              : isAnswered
                                ? isBranch
                                  ? 'bg-[#4A7C23]/20 text-[#4A7C23] border-2 border-[#4A7C23]'
                                  : 'bg-[#C9A227]/20 text-[#C9A227] border-2 border-[#C9A227]'
                                : 'bg-[#F5EDE0] text-[#6B5B4F] hover:bg-[#EDE4D3]'}
                          `}
                          aria-label={`Câu ${index + 1}${isAnswered ? ' - đã trả lời' : ''}`}
                          aria-current={isCurrent ? 'step' : undefined}
                        >
                          {index + 1}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-[#6B5B4F]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-[#4A7C23]/20 border border-[#4A7C23]" />
                      <span>Cành (độc lập)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-[#C9A227]/20 border border-[#C9A227]" />
                      <span>Lá (hỗ trợ)</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Bottom Actions */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
                <Home className="w-4 h-4" />
                Về Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
