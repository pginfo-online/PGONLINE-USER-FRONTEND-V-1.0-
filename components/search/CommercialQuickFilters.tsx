"use client";

import React from 'react';
import { Briefcase, Building2 } from 'lucide-react';
import { useSearchStore } from '../../lib/store/searchStore';

export default function CommercialQuickFilters() {
  const {
    commercialPurpose,
    commercialSubtype,
    setCommercialFilters,
  } = useSearchStore();

  const types = [
    { label: 'All Types', value: '' },
    { label: 'Office', value: 'office_space' },
    { label: 'Retail/Shop', value: 'retail_shop' },
    { label: 'Showroom', value: 'showroom' },
    { label: 'Co-Working', value: 'co_working' },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
      {/* Purpose: Rent vs Buy */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-1.5 flex items-center gap-1 shrink-0 sm:w-48">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 flex items-center gap-1 shrink-0">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Intent</span>
        </span>
        <div className="grid grid-cols-2 gap-1 flex-1">
          {(['rent', 'sale'] as const).map((purpose) => {
            const isSelected = commercialPurpose === purpose;
            return (
              <button
                key={purpose}
                type="button"
                onClick={() => setCommercialFilters({ commercialPurpose: purpose })}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all text-center uppercase tracking-wider cursor-pointer ${
                  isSelected
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {purpose}
              </button>
            );
          })}
        </div>
      </div>

      {/* Commercial Type */}
      <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-200/80 p-1.5 flex items-center gap-1 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 flex items-center gap-1 shrink-0">
          <Building2 className="w-3.5 h-3.5" />
          <span>Type</span>
        </span>
        <div className="flex gap-1 flex-1">
          {types.map((t) => {
            const isSelected = commercialSubtype === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setCommercialFilters({ commercialSubtype: t.value })}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-1 text-center cursor-pointer ${
                  isSelected
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
