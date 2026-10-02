"use client";

import React from 'react';
import { ShieldCheck, IndianRupee, Search, Sparkles } from 'lucide-react';
import { PropertySearchParams } from '../../../lib/types/property';

interface CommonFilterControlsProps {
  filters: PropertySearchParams;
  onChange: (updated: Partial<PropertySearchParams>) => void;
}

export default function CommonFilterControls({
  filters,
  onChange,
}: CommonFilterControlsProps) {
  const minPriceVal = typeof filters.minPrice === 'number' ? filters.minPrice : 1000;
  const maxPriceVal = typeof filters.maxPrice === 'number' ? filters.maxPrice : 100000;

  return (
    <div className="space-y-6">
      {/* Search by Property Name (Matching Screenshot 2026-10-02 062441) */}
      <div>
        <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
          Search by Property Name
        </label>
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={filters.q || ''}
            onChange={(e) => onChange({ q: e.target.value || undefined })}
            placeholder="Search PG, Flat or Office name..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-200/90 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-700/30"
          />
        </div>
      </div>

      {/* Filter by: Premium / Luxury (Matching Screenshot 2026-10-02 062441) */}
      <div className="pt-2 border-t border-slate-100">
        <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2.5">
          Filter by Class
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2.5 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={filters.isFeatured === true || filters.isFeatured === 'true'}
              onChange={(e) => onChange({ isFeatured: e.target.checked ? true : undefined })}
              className="w-4 h-4 rounded text-teal-700 focus:ring-teal-700 border-slate-300 cursor-pointer"
            />
            <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900">
              Premium Listings
            </span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={Boolean(filters.minPrice && Number(filters.minPrice) >= 20000)}
              onChange={(e) => {
                if (e.target.checked) {
                  onChange({ minPrice: 20000 });
                } else {
                  onChange({ minPrice: undefined });
                }
              }}
              className="w-4 h-4 rounded text-teal-700 focus:ring-teal-700 border-slate-300 cursor-pointer"
            />
            <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900">
              Luxury / High-End
            </span>
          </label>
        </div>
      </div>

      {/* Price Range Slider & Inputs */}
      <div className="pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            Rent Range (₹)
          </label>
          <span className="text-[11px] font-bold text-teal-800">
            ₹{minPriceVal.toLocaleString('en-IN')} - ₹{maxPriceVal.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Range Slider Track */}
        <input
          type="range"
          min={1000}
          max={100000}
          step={1000}
          value={maxPriceVal}
          onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer mb-3 accent-teal-700"
        />

        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[10px] text-slate-400 font-semibold block mb-1">Min (₹)</span>
            <div className="relative flex items-center">
              <IndianRupee className="w-3.5 h-3.5 text-slate-400 absolute left-2.5" />
              <input
                type="number"
                value={filters.minPrice || ''}
                onChange={(e) =>
                  onChange({ minPrice: e.target.value ? Number(e.target.value) : undefined })
                }
                placeholder="1,000"
                className="w-full pl-7 pr-2 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-700/30 text-slate-900"
              />
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 font-semibold block mb-1">Max (₹)</span>
            <div className="relative flex items-center">
              <IndianRupee className="w-3.5 h-3.5 text-slate-400 absolute left-2.5" />
              <input
                type="number"
                value={filters.maxPrice || ''}
                onChange={(e) =>
                  onChange({ maxPrice: e.target.value ? Number(e.target.value) : undefined })
                }
                placeholder="1,00,000"
                className="w-full pl-7 pr-2 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-700/30 text-slate-900"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Verified Properties Checkbox */}
      <div className="pt-3 border-t border-slate-100">
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={Boolean(filters.isVerified)}
            onChange={(e) => onChange({ isVerified: e.target.checked ? 'true' : undefined })}
            className="w-4 h-4 rounded text-teal-700 focus:ring-teal-700 border-slate-300 cursor-pointer"
          />
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Show Only Verified Properties</span>
          </div>
        </label>
      </div>
    </div>
  );
}
