'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // If already logged in, redirect to quiz
    const token = localStorage.getItem('auth-token');
    if (token) {
      router.push('/quiz');
    }
  }, [router]);

  return <div className="min-h-screen paper-texture">{children}</div>;
}
