import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'accent' | 'danger' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export default function Badge({
  children,
  variant = 'primary',
  size = 'sm',
  className = '',
}: BadgeProps) {
  const variantStyles = {
    primary: 'bg-teal-50 text-teal-800 border-teal-200/80 font-semibold',
    secondary: 'bg-slate-100 text-slate-700 border-slate-200 font-medium',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
    warning: 'bg-amber-50 text-amber-800 border-amber-200 font-medium',
    accent: 'bg-blue-50 text-blue-700 border-blue-200 font-semibold',
    danger: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold',
    outline: 'bg-white text-slate-700 border-slate-300 font-medium shadow-2xs',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 rounded-full border',
    md: 'text-xs px-3 py-1 rounded-full border',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 tracking-wide leading-tight ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
}
