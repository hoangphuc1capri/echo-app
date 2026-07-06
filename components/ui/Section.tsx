'use client';

import { HTMLAttributes } from 'react';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'alt';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export default function Section({
  variant = 'default',
  padding = 'lg',
  className = '',
  children,
  ...props
}: SectionProps) {
  const variants = {
    default: 'bg-transparent',
    alt: 'bg-[var(--echo-cream)]',
  };

  const paddings = {
    none: 'py-0',
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16 md:py-24',
    xl: 'py-20 md:py-32',
  };

  return (
    <section
      className={`
        w-full
        ${variants[variant]}
        ${paddings[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </section>
  );
}
