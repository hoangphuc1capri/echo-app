'use client';

import { HTMLAttributes } from 'react';

interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export default function ProgressBar({
  value,
  max = 100,
  showLabel = true,
  size = 'md',
  variant = 'default',
  className = '',
  ...props
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variants = {
    default: 'bg-gradient-to-r from-[var(--echo-wood)] to-[var(--echo-amber)]',
    success: 'bg-[var(--echo-success)]',
    warning: 'bg-[var(--echo-warning)]',
    danger: 'bg-[var(--echo-danger)]',
  };

  return (
    <div className={`w-full ${className}`} {...props}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="font-ui text-sm text-[var(--echo-ink-muted)]">
            Tiến độ
          </span>
          <span className="font-ui text-sm font-medium text-[var(--echo-ink)]">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div
        className={`
          w-full
          bg-[var(--echo-parchment)]
          rounded-full
          overflow-hidden
          ${sizes[size]}
        `}
      >
        <div
          className={`
            h-full
            rounded-full
            transition-all duration-500 ease-out
            ${variants[variant]}
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
