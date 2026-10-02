"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Compass, ChevronDown, Search, Loader2, AlertCircle, X } from 'lucide-react';
import { useAreas } from '../../lib/hooks/useAreas';
import { City, Area } from '../../lib/types/city';

interface AreaSelectorProps {
  selectedCity: City | null;
  selectedArea: Area | null;
  onSelectArea: (area: Area | null) => void;
}

export default function AreaSelector({
  selectedCity,
  selectedArea,
  onSelectArea,
}: AreaSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: areas = [], isLoading, isError, refetch } = useAreas(selectedCity?.name || '');

  const isDisabled = !selectedCity;

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

  const filteredAreas = areas.filter((area) =>
    area.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="relative flex-1" ref={dropdownRef}>
      {/* Selector Trigger Button */}
      <div className="relative">
        <button
          type="button"
          disabled={isDisabled}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full h-full flex items-center justify-between gap-3 px-4 py-3 sm:py-3.5 rounded-2xl border transition-all text-left group ${
            isDisabled
              ? 'bg-slate-100/60 border-slate-200/60 opacity-60 cursor-not-allowed'
              : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/80 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-700/30'
          }`}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 leading-none mb-1">
                Step 2 · Area / Locality
              </span>
              <span className="text-sm sm:text-base font-bold text-slate-900 truncate leading-none">
                {isDisabled
                  ? 'Select city first'
                  : selectedArea?.name || 'All Localities'}
              </span>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${
              isOpen ? 'rotate-180 text-teal-700' : ''
            }`}
          />
        </button>

        {selectedArea && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectArea(null);
            }}
            className="absolute right-9 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
            aria-label="Clear area"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && !isDisabled && (
        <div className="absolute left-0 right-0 sm:left-0 sm:w-84 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200/80 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          
          {/* Search Input */}
          <div className="p-3 border-b border-slate-100 bg-slate-50/50">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search areas in ${selectedCity.name}...`}
                className="w-full text-xs font-medium pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-700/30 text-slate-900 placeholder:text-slate-400"
                autoFocus
              />
            </div>
          </div>

          {/* Area Options */}
          <div className="max-h-64 overflow-y-auto p-1.5 scrollbar-thin divide-y divide-slate-50">
            {/* Option to select "All Localities" */}
            <button
              type="button"
              onClick={() => {
                onSelectArea(null);
                setIsOpen(false);
                setSearchQuery('');
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-colors text-xs font-medium cursor-pointer ${
                !selectedArea ? 'bg-teal-50 text-teal-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>All Localities in {selectedCity.name}</span>
              {!selectedArea && <span className="w-2 h-2 rounded-full bg-teal-700" />}
            </button>

            {isLoading ? (
              <div className="flex items-center justify-center py-6 text-xs text-slate-500 gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-teal-700" />
                <span>Loading areas in {selectedCity.name}...</span>
              </div>
            ) : isError ? (
              <div className="p-4 text-center">
                <AlertCircle className="w-5 h-5 text-rose-500 mx-auto mb-1" />
                <p className="text-xs text-rose-600 font-medium mb-2">Failed to load areas</p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-xs font-semibold rounded-lg text-slate-700 cursor-pointer"
                >
                  Retry
                </button>
              </div>
            ) : filteredAreas.length === 0 ? (
              <div className="py-6 px-4 text-center text-xs text-slate-500">
                No specific areas found. You can search directly by area name on results page.
              </div>
            ) : (
              filteredAreas.map((area) => {
                const isSelected = selectedArea?._id === area._id || selectedArea?.name === area.name;
                return (
                  <button
                    key={area._id || area.name}
                    type="button"
                    onClick={() => {
                      onSelectArea(area);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-colors text-xs font-medium cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50 text-teal-800 font-bold'
                        : 'text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <span className="leading-tight truncate pr-2">{area.name}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      {typeof area.pgCount === 'number' && area.pgCount > 0 && (
                        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 font-medium">
                          {area.pgCount} spaces
                        </span>
                      )}
                      {isSelected && <span className="w-2 h-2 rounded-full bg-teal-700" />}
                    </div>
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
