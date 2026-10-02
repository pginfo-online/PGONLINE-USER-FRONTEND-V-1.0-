"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, Search, Loader2, AlertCircle } from 'lucide-react';
import { useCities } from '../../lib/hooks/useCities';
import { City } from '../../lib/types/city';

interface CitySelectorProps {
  selectedCity: City | null;
  onSelectCity: (city: City) => void;
}

export default function CitySelector({ selectedCity, onSelectCity }: CitySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: cities = [], isLoading, isError, refetch } = useCities();

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const filteredCities = cities.filter((city) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const matchesName = city.name.toLowerCase().includes(q);
    const matchesAlias = city.aliases?.some((a) => a.toLowerCase().includes(q));
    const matchesState = city.state?.toLowerCase().includes(q);
    return matchesName || matchesAlias || matchesState;
  });

  return (
    <div className="relative flex-1" ref={dropdownRef}>
      {/* Selector Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-full flex items-center justify-between gap-3 px-4 py-3 sm:py-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 transition-all text-left group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0A4242]/30"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#0A4242]/10 text-[#0A4242] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 leading-none mb-1">
              Step 1 · City
            </span>
            <span className="text-sm sm:text-base font-bold text-slate-900 truncate leading-none">
              {selectedCity?.name || 'Select City'}
            </span>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${
            isOpen ? 'rotate-180 text-[#0A4242]' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 sm:left-0 sm:w-80 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200/80 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          
          {/* Search Input */}
          <div className="p-3 border-b border-slate-100 bg-slate-50/50">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city (e.g. Pune, Mumbai)..."
                className="w-full text-xs font-medium pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0A4242]/30 text-slate-900 placeholder:text-slate-400"
                autoFocus
              />
            </div>
          </div>

          {/* Cities List */}
          <div className="max-h-64 overflow-y-auto p-1.5 scrollbar-thin divide-y divide-slate-50">
            {isLoading ? (
              <div className="flex items-center justify-center py-8 text-xs text-slate-500 gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#0A4242]" />
                <span>Loading available cities...</span>
              </div>
            ) : isError ? (
              <div className="p-4 text-center">
                <AlertCircle className="w-5 h-5 text-rose-500 mx-auto mb-1" />
                <p className="text-xs text-rose-600 font-medium mb-2">Failed to load cities</p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-xs font-semibold rounded-lg text-slate-700"
                >
                  Retry
                </button>
              </div>
            ) : filteredCities.length === 0 ? (
              <div className="py-6 px-4 text-center text-xs text-slate-500">
                No cities found matching &quot;{searchQuery}&quot;
              </div>
            ) : (
              filteredCities.map((city) => {
                const isSelected = selectedCity?._id === city._id || selectedCity?.name === city.name;
                return (
                  <button
                    key={city._id || city.name}
                    type="button"
                    onClick={() => {
                      onSelectCity(city);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-colors text-xs font-medium ${
                      isSelected
                        ? 'bg-[#0A4242]/10 text-[#0A4242] font-bold'
                        : 'text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-600 text-[10px] font-bold">
                        {city.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="leading-tight">{city.name}</span>
                        {city.state && (
                          <span className="text-[10px] text-slate-400 leading-tight">
                            {city.state}
                          </span>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#0A4242]" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
