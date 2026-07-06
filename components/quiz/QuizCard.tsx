'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface QuizCardProps {
  questionNumber: number;
  totalQuestions: number;
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  selectedAnswer?: string;
  onSelect: (id: string) => void;
  progress: number;
}

export default function QuizCard({
  questionNumber,
  totalQuestions,
  question,
  options,
  selectedAnswer,
  onSelect,
  progress,
}: QuizCardProps) {
  return (
    <motion.div
      className="w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="echo-card p-8 md:p-10">
        <div className="flex items-center justify-between mb-8">
          <span className="font-ui text-sm text-[var(--echo-ink-muted)]">
            Câu hỏi {questionNumber}/{totalQuestions}
          </span>
          <span className="font-ui text-sm font-medium text-[var(--echo-wood)]">
            {Math.round(progress)}%
          </span>
        </div>

        <div className="echo-progress mb-8">
          <div
            className="echo-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>

        <h2 className="text-2xl md:text-3xl font-display font-semibold text-[var(--echo-ink)] mb-8 leading-relaxed">
          {question}
        </h2>

        <div className="space-y-4">
          {options.map((option, index) => (
            <motion.button
              key={option.id}
              onClick={() => onSelect(option.id)}
              className={`
                w-full p-5
                text-left
                rounded-xl
                border-2
                font-ui text-base
                transition-all duration-200
                ${
                  selectedAnswer === option.id
                    ? 'border-[var(--echo-wood)] bg-[var(--echo-wood)]/5 shadow-md'
                    : 'border-[var(--echo-parchment)] bg-white hover:border-[var(--echo-wood)]/50 hover:bg-[var(--echo-cream)]'
                }
              `}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-4">
                <span
                  className={`
                    flex-shrink-0 w-8 h-8
                    rounded-full
                    flex items-center justify-center
                    font-ui text-sm font-semibold
                    transition-colors duration-200
                    ${
                      selectedAnswer === option.id
                        ? 'bg-[var(--echo-wood)] text-white'
                        : 'bg-[var(--echo-parchment)] text-[var(--echo-ink-muted)]'
                    }
                  `}
                >
                  {selectedAnswer === option.id ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    String.fromCharCode(65 + index)
                  )}
                </span>
                <span className="text-[var(--echo-ink)]">{option.text}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
