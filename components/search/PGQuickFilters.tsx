"use client";

import React from 'react';
import { Users, IndianRupee } from 'lucide-react';
import { useSearchStore } from '../../lib/store/searchStore';

export default function PGQuickFilters() {
  const {
    pgGender,
    pgMinPrice,
    pgMaxPrice,
    setPGFilters,
  } = useSearchStore();

  const pricePresets = [
    { label: 'Any Budget', min: '', max: '' },
    { label: 'Under ₹7k', min: '', max: 7000 },
    { label: '₹7k - ₹14k', min: 7000, max: 14000 },
    { label: '₹14k+', min: 14000, max: '' },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
      {/* Gender Selector */}
      <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-200/80 p-1.5 flex items-center gap-1">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 flex items-center gap-1 shrink-0">
          <Users className="w-3.5 h-3.5" />
          <span>Gender</span>
        </span>
        <div className="grid grid-cols-3 gap-1 flex-1">
          {(['any', 'male', 'female'] as const).map((gender) => {
            const isSelected = pgGender === gender;
            const labels = { any: 'Any', male: 'Boys', female: 'Girls' };
            return (
              <button
                key={gender}
                type="button"
                onClick={() => setPGFilters({ pgGender: gender })}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                  isSelected
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {labels[gender]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Budget Selector */}
      <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-200/80 p-1.5 flex items-center gap-1 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 flex items-center gap-1 shrink-0">
          <IndianRupee className="w-3.5 h-3.5" />
          <span>Budget</span>
        </span>
        <div className="flex gap-1 flex-1">
          {pricePresets.map((preset, idx) => {
            const isSelected =
              pgMinPrice === preset.min && pgMaxPrice === preset.max;
            return (
              <button
                key={idx}
                type="button"
                onClick={() =>
                  setPGFilters({
                    pgMinPrice: preset.min as any,
                    pgMaxPrice: preset.max as any,
                  })
                }
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-1 text-center cursor-pointer ${
                  isSelected
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
