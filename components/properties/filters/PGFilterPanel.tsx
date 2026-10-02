"use client";

import React from 'react';
import { Users, Utensils, Snowflake, Wifi } from 'lucide-react';
import { PropertySearchParams } from '../../../lib/types/property';

interface PGFilterPanelProps {
  filters: PropertySearchParams;
  onChange: (updated: Partial<PropertySearchParams>) => void;
}

export default function PGFilterPanel({ filters, onChange }: PGFilterPanelProps) {
  const occupancies = [
    { label: 'Single Room', value: 'single' },
    { label: 'Double Sharing', value: 'double' },
    { label: 'Triple Sharing', value: 'triple' },
    { label: 'Other / Dormitory', value: 'four' },
  ];

  const genders = [
    { label: 'All', value: 'any' },
    { label: 'Boys Only', value: 'male' },
    { label: 'Girls Only', value: 'female' },
  ];

  return (
    <div className="space-y-6">
      {/* Occupancy / Sharing (Directly matching Screenshot 2026-10-02 062441) */}
      <div>
        <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2.5">
          Occupancy
        </label>
        <div className="space-y-2">
          {occupancies.map((item) => {
            const isSelected = filters.sharingType === item.value;
            return (
              <label
                key={item.value}
                className="flex items-center gap-2.5 cursor-pointer select-none group"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => {
                    onChange({ sharingType: e.target.checked ? item.value : undefined });
                  }}
                  className="w-4 h-4 rounded text-teal-700 focus:ring-teal-700 border-slate-300 cursor-pointer"
                />
                <span className={`text-xs font-semibold ${isSelected ? 'text-teal-900 font-bold' : 'text-slate-700 group-hover:text-slate-900'}`}>
                  {item.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Gender Selection */}
      <div className="pt-2 border-t border-slate-100">
        <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2.5">
          Gender / Tenant
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {genders.map((g) => {
            const isSelected = (filters.gender || 'any') === g.value;
            return (
              <button
                key={g.value}
                type="button"
                onClick={() => onChange({ gender: g.value === 'any' ? undefined : (g.value as any) })}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                  isSelected
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                {g.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Food / Mess Option */}
      <div className="pt-2 border-t border-slate-100">
        <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2.5">
          Food / Mess Facility
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { label: 'Any', value: 'any' },
            { label: 'Pure Veg', value: 'veg' },
            { label: 'Non-Veg', value: 'nonveg' },
            { label: 'Veg & Non-Veg', value: 'both' },
          ].map((f) => {
            const isSelected = (filters.food || 'any') === f.value;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => onChange({ food: f.value === 'any' ? undefined : (f.value as any) })}
                className={`py-2 px-2 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-teal-700 text-white shadow-xs font-bold'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* AC Preference */}
      <div className="pt-2 border-t border-slate-100">
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={Boolean(filters.ac)}
            onChange={(e) => onChange({ ac: e.target.checked ? 'true' : undefined })}
            className="w-4 h-4 rounded text-teal-700 focus:ring-teal-700 border-slate-300 cursor-pointer"
          />
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <Snowflake className="w-3.5 h-3.5 text-sky-600" />
            <span>Air Conditioned (AC) Rooms Only</span>
          </div>
        </label>
      </div>
    </div>
  );
}
