"use client";

import React from 'react';
import { Filter, RotateCcw, Home, Building, Store } from 'lucide-react';
import { PropertyCategory, PropertySearchParams } from '../../lib/types/property';
import CommonFilterControls from './filters/CommonFilterControls';
import PGFilterPanel from './filters/PGFilterPanel';
import FlatFilterPanel from './filters/FlatFilterPanel';
import CommercialFilterPanel from './filters/CommercialFilterPanel';

interface PropertyFiltersProps {
  filters: PropertySearchParams;
  onChange: (updated: Partial<PropertySearchParams>) => void;
  onReset: () => void;
  className?: string;
}

export default function PropertyFilters({
  filters,
  onChange,
  onReset,
  className = '',
}: PropertyFiltersProps) {
  const currentCategory = (filters.category || 'pg') as PropertyCategory;

  const categories = [
    { id: 'pg' as const, label: 'PGs', icon: <Home className="w-3.5 h-3.5" /> },
    { id: 'residential_rental' as const, label: 'Flats', icon: <Building className="w-3.5 h-3.5" /> },
    { id: 'commercial' as const, label: 'Commercials', icon: <Store className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className={`bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-teal-700" />
          <h3 className="font-black text-sm sm:text-base text-slate-900 tracking-tight">
            Filters
          </h3>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Category Switcher in Filters */}
      <div>
        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
          Property Category
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/70 rounded-2xl">
          {categories.map((cat) => {
            const isSelected = currentCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onChange({ category: cat.id })}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-white text-teal-800 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category-Specific Filters */}
      <div className="pt-2 border-t border-slate-100">
        {currentCategory === 'pg' && (
          <PGFilterPanel filters={filters} onChange={onChange} />
        )}
        {currentCategory === 'residential_rental' && (
          <FlatFilterPanel filters={filters} onChange={onChange} />
        )}
        {currentCategory === 'commercial' && (
          <CommercialFilterPanel filters={filters} onChange={onChange} />
        )}
      </div>

      {/* Common Filters (Price Range, Verified Toggle, Class) */}
      <div className="pt-2 border-t border-slate-100">
        <CommonFilterControls filters={filters} onChange={onChange} />
      </div>
    </div>
  );
}
