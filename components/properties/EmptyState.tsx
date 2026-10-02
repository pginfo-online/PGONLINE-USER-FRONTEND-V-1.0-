"use client";

import React from 'react';
import { Home, RotateCcw, Search, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  onReset: () => void;
  title?: string;
  description?: string;
}

export default function EmptyState({
  onReset,
  title = 'No verified properties found',
  description = 'Try loosening your price filters, selecting a different sharing type, or searching across a wider locality.',
}: EmptyStateProps) {
  return (
    <div className="w-full py-16 px-6 bg-white rounded-3xl border border-slate-200/80 text-center flex flex-col items-center justify-center shadow-xs">
      <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4 shadow-inner">
        <Home className="w-8 h-8" />
      </div>
      <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto mb-6 leading-relaxed">
        {description}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-teal-700 hover:bg-teal-800 shadow-md shadow-teal-700/20 transition-all cursor-pointer"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Reset All Filters</span>
      </button>
    </div>
  );
}
