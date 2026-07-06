'use client';

import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className = '',
      variant = 'elevated',
      padding = 'md',
      hoverable = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      rounded-2xl
      transition-all duration-300 ease-out
    `;

    const variants = {
      default: `
        bg-[var(--echo-cream)]/60
        border border-[var(--echo-parchment)]/50
      `,
      elevated: `
        bg-white/95
        shadow-xl shadow-[var(--echo-wood)]/5
        border border-[var(--echo-parchment)]/30
      `,
      outlined: `
        bg-transparent
        border-2 border-[var(--echo-parchment)]
      `,
      glass: `
        bg-white/70
        backdrop-blur-xl
        border border-white/20
        shadow-lg
      `,
    };

    const paddings = {
      sm: 'p-4',
      md: 'p-5',
      lg: 'p-6',
    };

    const hoverStyles = hoverable
      ? `
        cursor-pointer
        hover:shadow-2xl hover:shadow-[var(--echo-wood)]/10
        hover:-translate-y-1
        hover:border-[var(--echo-wood)]/30
        active:translate-y-0
      `
      : '';

    return (
      <div
        ref={ref}
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${paddings[padding]}
          ${hoverStyles}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
