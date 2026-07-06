'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading,
      children,
      disabled,
      fullWidth,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      relative inline-flex items-center justify-center font-ui font-semibold
      transition-all duration-200 ease-out
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
      focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
      overflow-hidden
    `;

    const variants = {
      primary: `
        bg-gradient-to-br from-[var(--echo-wood)] to-[var(--echo-wood-dark)]
        text-white shadow-lg shadow-[var(--echo-wood)]/25
        hover:shadow-xl hover:shadow-[var(--echo-wood)]/30 hover:-translate-y-0.5
        active:translate-y-0 active:shadow-md
        focus-visible:ring-[var(--echo-wood)]
      `,
      secondary: `
        bg-[var(--echo-cream)]
        text-[var(--echo-wood)] border border-[var(--echo-wood)]/20
        hover:bg-[var(--echo-wood)] hover:text-white hover:border-transparent
        hover:shadow-lg hover:-translate-y-0.5
        active:translate-y-0
        focus-visible:ring-[var(--echo-wood)]
      `,
      ghost: `
        bg-transparent text-[var(--echo-ink-muted)]
        hover:bg-[var(--echo-cream)] hover:text-[var(--echo-ink)]
        focus-visible:ring-[var(--echo-wood)]
      `,
      danger: `
        bg-gradient-to-br from-[var(--echo-danger)] to-[#B91C1C]
        text-white shadow-lg shadow-[var(--echo-danger)]/25
        hover:shadow-xl hover:-translate-y-0.5
        active:translate-y-0
        focus-visible:ring-[var(--echo-danger)]
      `,
      outline: `
        bg-white text-[var(--echo-wood)] border-2 border-[var(--echo-wood)]
        hover:bg-[var(--echo-wood)] hover:text-white
        hover:shadow-lg
        active:shadow-md
        focus-visible:ring-[var(--echo-wood)]
      `,
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
      md: 'h-10 px-5 text-sm gap-2 rounded-xl',
      lg: 'h-12 px-7 text-base gap-2.5 rounded-xl',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${sizes[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <Loader2 className="w-4 h-4 animate-spin absolute" />
        )}
        <span className={`flex items-center gap-2 ${isLoading ? 'opacity-0' : ''}`}>
          {leftIcon}
          {children}
          {rightIcon}
        </span>
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
