'use client';

import { HTMLAttributes } from 'react';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'fluid';
}

export default function Container({
  size = 'lg',
  className = '',
  children,
  ...props
}: ContainerProps) {
  const sizes = {
    sm: 'max-w-2xl',
    md: 'max-w-3xl',
    lg: 'max-w-5xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
    fluid: 'max-w-none',
  };

  return (
    <div
      className={`
        w-full
        mx-auto
        px-4
        sm:px-6
        lg:px-0
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
