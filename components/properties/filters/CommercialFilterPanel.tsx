"use client";

import React from 'react';
import { PropertySearchParams } from '../../../lib/types/property';

interface CommercialFilterPanelProps {
  filters: PropertySearchParams;
  onChange: (updated: Partial<PropertySearchParams>) => void;
}

export default function CommercialFilterPanel({
  filters,
  onChange,
}: CommercialFilterPanelProps) {
  const subtypes = [
    { label: 'All Types', value: '' },
    { label: 'Office Space', value: 'office_space' },
    { label: 'Retail Shop', value: 'retail_shop' },
    { label: 'Showroom', value: 'showroom' },
    { label: 'Co-Working Space', value: 'co_working' },
    { label: 'Warehouse / Godown', value: 'warehouse_godown' },
  ];

  const fitoutOptions = [
    { label: 'Any Fit-out', value: '' },
    { label: 'Fully Furnished (Plug & Play)', value: 'fully_furnished_plug_and_play' },
    { label: 'Warm Shell', value: 'warm_shell' },
    { label: 'Bare Shell', value: 'bare_shell' },
  ];

  return (
    <div className="space-y-6">
      {/* Purpose: Rent vs Sale */}
      <div>
        <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2.5">
          Purpose
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { label: 'For Rent', value: 'rent' },
            { label: 'For Sale', value: 'sale' },
          ].map((p) => {
            const isSelected = (filters.purpose || 'rent') === p.value;
            return (
              <button
                key={p.value}
                type="button"
                onClick={() => onChange({ purpose: p.value as any })}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                  isSelected
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Commercial Subtype */}
      <div className="pt-2 border-t border-slate-100">
        <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2.5">
          Property Type
        </label>
        <div className="space-y-2">
          {subtypes.map((sub) => {
            const isSelected = (filters.commercialSubtype || '') === sub.value;
            return (
              <label
                key={sub.value}
                className="flex items-center gap-2.5 cursor-pointer select-none group"
              >
                <input
                  type="radio"
                  name="comm-type"
                  checked={isSelected}
                  onChange={() => onChange({ commercialSubtype: sub.value || undefined })}
                  className="w-4 h-4 text-teal-700 focus:ring-teal-700 border-slate-300 cursor-pointer"
                />
                <span className={`text-xs font-semibold ${isSelected ? 'text-teal-900 font-bold' : 'text-slate-700 group-hover:text-slate-900'}`}>
                  {sub.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Fitout Status */}
      <div className="pt-2 border-t border-slate-100">
        <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2.5">
          Fit-Out Status
        </label>
        <div className="space-y-2">
          {fitoutOptions.map((f) => {
            const isSelected = (filters.fitoutStatus || '') === f.value;
            return (
              <label
                key={f.value}
                className="flex items-center gap-2.5 cursor-pointer select-none group"
              >
                <input
                  type="radio"
                  name="comm-fitout"
                  checked={isSelected}
                  onChange={() => onChange({ fitoutStatus: f.value || undefined })}
                  className="w-4 h-4 text-teal-700 focus:ring-teal-700 border-slate-300 cursor-pointer"
                />
                <span className={`text-xs font-semibold ${isSelected ? 'text-teal-900 font-bold' : 'text-slate-700 group-hover:text-slate-900'}`}>
                  {f.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
