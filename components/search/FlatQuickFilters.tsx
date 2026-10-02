"use client";

import React from 'react';
import { Home, Users } from 'lucide-react';
import { useSearchStore } from '../../lib/store/searchStore';

export default function FlatQuickFilters() {
  const {
    flatTenantType,
    flatBhk,
    setFlatFilters,
  } = useSearchStore();

  const bhkOptions = [
    { label: 'All BHK', value: '' },
    { label: '1 BHK', value: '1BHK' },
    { label: '2 BHK', value: '2BHK' },
    { label: '3+ BHK', value: '3BHK,3.5BHK,4BHK' },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
      {/* BHK Selector */}
      <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-200/80 p-1.5 flex items-center gap-1 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 flex items-center gap-1 shrink-0">
          <Home className="w-3.5 h-3.5" />
          <span>Config</span>
        </span>
        <div className="flex gap-1 flex-1">
          {bhkOptions.map((opt) => {
            const isSelected = flatBhk === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFlatFilters({ flatBhk: opt.value })}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-1 text-center cursor-pointer ${
                  isSelected
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tenant Type Selector */}
      <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-200/80 p-1.5 flex items-center gap-1">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 flex items-center gap-1 shrink-0">
          <Users className="w-3.5 h-3.5" />
          <span>Tenants</span>
        </span>
        <div className="grid grid-cols-3 gap-1 flex-1">
          {(['any', 'family', 'bachelors_male'] as const).map((type) => {
            const isSelected = flatTenantType === type;
            const labels = { any: 'Any', family: 'Family', bachelors_male: 'Bachelors' };
            return (
              <button
                key={type}
                type="button"
                onClick={() => setFlatFilters({ flatTenantType: type })}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                  isSelected
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {labels[type]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
