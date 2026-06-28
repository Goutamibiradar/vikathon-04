import React, { HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'grade-a' | 'grade-b' | 'grade-c' | 'grade-f';
}

export const Badge = ({ className = '', variant = 'neutral', ...props }: BadgeProps) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border';

  const variants = {
    success: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50',
    warning: 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/50',
    danger: 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/50',
    info: 'bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-900/50',
    neutral: 'bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800',
    'grade-a': 'bg-emerald-500 text-white border-transparent text-sm px-3.5 py-1.5 rounded-xl shadow-sm shadow-emerald-500/20 font-bold',
    'grade-b': 'bg-sky-500 text-white border-transparent text-sm px-3.5 py-1.5 rounded-xl shadow-sm shadow-sky-500/20 font-bold',
    'grade-c': 'bg-amber-500 text-white border-transparent text-sm px-3.5 py-1.5 rounded-xl shadow-sm shadow-amber-500/20 font-bold',
    'grade-f': 'bg-rose-500 text-white border-transparent text-sm px-3.5 py-1.5 rounded-xl shadow-sm shadow-rose-500/20 font-bold',
  };

  return <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props} />;
};
