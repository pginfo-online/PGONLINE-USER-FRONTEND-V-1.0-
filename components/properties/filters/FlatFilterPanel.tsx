"use client";

import React from 'react';
import { PropertySearchParams } from '../../../lib/types/property';

interface FlatFilterPanelProps {
  filters: PropertySearchParams;
  onChange: (updated: Partial<PropertySearchParams>) => void;
}

export default function FlatFilterPanel({ filters, onChange }: FlatFilterPanelProps) {
  const bhkList = ['1RK', '1BHK', '2BHK', '2.5BHK', '3BHK', '4BHK+'];
  const furnishingOptions = [
    { label: 'All Furnishing', value: '' },
    { label: 'Fully Furnished', value: 'fully_furnished' },
    { label: 'Semi-Furnished', value: 'semi_furnished' },
    { label: 'Unfurnished', value: 'unfurnished' },
  ];

  const currentBhk = (filters.bhk || '').split(',').filter(Boolean);

  const toggleBhk = (bhk: string) => {
    const updated = currentBhk.includes(bhk)
      ? currentBhk.filter((b) => b !== bhk)
      : [...currentBhk, bhk];
    onChange({ bhk: updated.length > 0 ? updated.join(',') : undefined });
  };

  return (
    <div className="space-y-6">
      {/* BHK Options */}
      <div>
        <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2.5">
          BHK Configuration
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {bhkList.map((bhk) => {
            const isSelected = currentBhk.includes(bhk);
            return (
              <button
                key={bhk}
                type="button"
                onClick={() => toggleBhk(bhk)}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                  isSelected
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                {bhk}
              </button>
            );
          })}
        </div>
      </div>

      {/* Furnishing Status */}
      <div className="pt-2 border-t border-slate-100">
        <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2.5">
          Furnishing Status
        </label>
        <div className="space-y-2">
          {furnishingOptions.map((opt) => {
            const isSelected = (filters.furnishingStatus || '') === opt.value;
            return (
              <label
                key={opt.value}
                className="flex items-center gap-2.5 cursor-pointer select-none group"
              >
                <input
                  type="radio"
                  name="flat-furnishing"
                  checked={isSelected}
                  onChange={() => onChange({ furnishingStatus: opt.value ? (opt.value as any) : undefined })}
                  className="w-4 h-4 text-teal-700 focus:ring-teal-700 border-slate-300 cursor-pointer"
                />
                <span className={`text-xs font-semibold ${isSelected ? 'text-teal-900 font-bold' : 'text-slate-700 group-hover:text-slate-900'}`}>
                  {opt.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
