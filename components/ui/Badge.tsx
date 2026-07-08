'use client';

import { HTMLAttributes } from 'react';

type BadgeVariant = 'seed' | 'walker' | 'supported' | 'borrowed' | 'prisoner' | 'success' | 'warning' | 'error' | 'default';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  seed: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  walker: 'bg-amber-100 text-amber-700 border border-amber-200',
  supported: 'bg-blue-100 text-blue-700 border border-blue-200',
  borrowed: 'bg-red-100 text-red-700 border border-red-200',
  prisoner: 'bg-purple-100 text-purple-700 border border-purple-200',
  success: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  warning: 'bg-amber-100 text-amber-700 border border-amber-200',
  error: 'bg-red-100 text-red-700 border border-red-200',
  default: 'bg-[var(--echo-cream)] text-[var(--echo-ink)] border border-[var(--echo-parchment)]',
};

const variantLabels: Record<BadgeVariant, string> = {
  seed: 'Người giữ lửa tư duy',
  walker: 'Người cân băng',
  supported: 'Người thích hỗ trợ',
  borrowed: 'Người phụ thuộc tiềm ẩn',
  prisoner: 'Người sống cùng AI',
  success: 'Thành công',
  warning: 'Cảnh báo',
  error: 'Lỗi',
  default: '',
};

const dotColors: Record<BadgeVariant, string> = {
  seed: 'bg-emerald-500',
  walker: 'bg-amber-500',
  supported: 'bg-blue-500',
  borrowed: 'bg-red-500',
  prisoner: 'bg-purple-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
  default: 'bg-gray-400',
};

export default function Badge({
  variant = 'default',
  size = 'sm',
  dot = false,
  className = '',
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        ${size === 'sm' ? 'px-2.5 py-1 text-[11px]' : size === 'lg' ? 'px-4 py-2 text-sm' : 'px-3 py-1.5 text-xs'}
        rounded-full font-ui font-medium
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children || variantLabels[variant]}
    </span>
  );
}
