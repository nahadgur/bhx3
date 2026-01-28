'use client';

import type { ReactNode } from 'react';

interface OpenModalButtonProps {
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary';
}

export default function OpenModalButton({ children, className = '', variant = 'primary' }: OpenModalButtonProps) {
  const handleClick = () => {
    if (typeof window !== 'undefined' && (window as any).openModal) {
      (window as any).openModal();
    }
  };

  const baseStyles = variant === 'primary'
    ? 'px-8 py-4 bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-bold rounded-xl transition shadow-lg'
    : 'px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition';

  return (
    <button
      onClick={handleClick}
      className={`${baseStyles} ${className}`}
    >
      {children}
    </button>
  );
}