"use client";

import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { PropertySearchParams } from '../../lib/types/property';

interface PropertySortProps {
  value?: PropertySearchParams['sort'];
  onChange: (sort: PropertySearchParams['sort']) => void;
}

export default function PropertySort({ value = 'popular', onChange }: PropertySortProps) {
  const options = [
    { label: 'Recommended', value: 'popular' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Newest Listed', value: 'newest' },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="hidden sm:flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
        <ArrowUpDown className="w-3 h-3" />
        <span>Sort by</span>
      </span>
      <select
        value={value || 'popular'}
        onChange={(e) => onChange(e.target.value as any)}
        className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-700/30 cursor-pointer shadow-2xs"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
