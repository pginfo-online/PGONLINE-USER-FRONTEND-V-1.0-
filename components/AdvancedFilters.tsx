"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter } from 'lucide-react';
import { createPortal } from 'react-dom';

export interface FilterState {
  minRent: string;
  maxRent: string;
  sharingType: string;
  gender: string;
  ac: boolean;
  foodIncluded: boolean;
  isVerified: boolean;
  foodOption: string;
  amenities: string[];
}

interface AdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  initialFilters: FilterState;
  onApply: (filters: FilterState) => void;
}

const AMENITIES_LIST = [
  "WiFi", "Laundry", "Parking", "Gym", "CCTV", "Power Backup", 
  "Hot Water", "Housekeeping", "TV", "Refrigerator", "RO Water", 
  "Study Room", "Lift", "Security Guard", "Kitchen Access"
];

export default function AdvancedFilters({ isOpen, onClose, initialFilters, onApply }: AdvancedFiltersProps) {
  const [mounted, setMounted] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setFilters(initialFilters);
    }
  }, [isOpen, initialFilters]);

  if (!mounted) return null;

  const handleReset = () => {
    setFilters({
      minRent: '', maxRent: '', sharingType: '', gender: '',
      ac: false, foodIncluded: false, isVerified: false,
      foodOption: '', amenities: []
    });
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const toggleAmenity = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const drawerContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Filter className="w-5 h-5 text-[var(--color-brand-primary)]" />
                Advanced Filters
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
              
              {/* Monthly Rent */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Monthly Rent (Single Sharing reference)</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block uppercase font-medium">Min</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                      <input 
                        type="number" 
                        value={filters.minRent}
                        onChange={(e) => setFilters({...filters, minRent: e.target.value})}
                        className="w-full pl-8 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none transition-all"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block uppercase font-medium">Max</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                      <input 
                        type="number" 
                        value={filters.maxRent}
                        onChange={(e) => setFilters({...filters, maxRent: e.target.value})}
                        className="w-full pl-8 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none transition-all"
                        placeholder="25,000+"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sharing Room Type */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Sharing Room Type</h3>
                <div className="grid grid-cols-3 gap-3">
                  {['single', 'double', 'triple'].map(type => (
                    <button
                      key={type}
                      onClick={() => setFilters({...filters, sharingType: filters.sharingType === type ? '' : type})}
                      className={`py-2 rounded-xl text-sm font-medium transition-all border ${
                        filters.sharingType === type
                          ? 'bg-[var(--color-brand-primary)]/5 border-[var(--color-brand-primary)] text-[var(--color-brand-primary)]'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tenant Gender Preference */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Tenant Gender Preference</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'male', label: 'Male' },
                    { id: 'female', label: 'Female' },
                    { id: 'any', label: 'Co-Ed' }
                  ].map(gender => (
                    <button
                      key={gender.id}
                      onClick={() => setFilters({...filters, gender: filters.gender === gender.id ? '' : gender.id})}
                      className={`py-2 rounded-xl text-sm font-medium transition-all border ${
                        filters.gender === gender.id
                          ? 'bg-[var(--color-brand-primary)]/5 border-[var(--color-brand-primary)] text-[var(--color-brand-primary)]'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {gender.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Checkboxes */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.ac ? 'bg-[var(--color-brand-primary)] border-[var(--color-brand-primary)]' : 'border-gray-300 group-hover:border-gray-400'}`}>
                    {filters.ac && <svg className="w-3 h-3 text-white" viewBox="0 0 14 14" fill="none"><path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <span className="text-sm text-gray-700">AC Accommodation Required</span>
                  <input type="checkbox" className="hidden" checked={filters.ac} onChange={(e) => setFilters({...filters, ac: e.target.checked})} />
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.foodIncluded ? 'bg-[var(--color-brand-primary)] border-[var(--color-brand-primary)]' : 'border-gray-300 group-hover:border-gray-400'}`}>
                    {filters.foodIncluded && <svg className="w-3 h-3 text-white" viewBox="0 0 14 14" fill="none"><path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <span className="text-sm text-gray-700">Food Included in Rent</span>
                  <input type="checkbox" className="hidden" checked={filters.foodIncluded} onChange={(e) => setFilters({...filters, foodIncluded: e.target.checked})} />
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.isVerified ? 'bg-[var(--color-brand-primary)] border-[var(--color-brand-primary)]' : 'border-gray-300 group-hover:border-gray-400'}`}>
                    {filters.isVerified && <svg className="w-3 h-3 text-white" viewBox="0 0 14 14" fill="none"><path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <span className="text-sm text-gray-700">Verified PGs Only</span>
                  <input type="checkbox" className="hidden" checked={filters.isVerified} onChange={(e) => setFilters({...filters, isVerified: e.target.checked})} />
                </label>
              </div>

              {/* Food Availability Option */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Food Availability Option</h3>
                <div className="flex flex-wrap gap-2">
                  {['veg', 'nonveg', 'veg & non-veg', 'none'].map(option => (
                    <button
                      key={option}
                      onClick={() => setFilters({...filters, foodOption: filters.foodOption === option ? '' : option})}
                      className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border ${
                        filters.foodOption === option
                          ? 'bg-[var(--color-brand-primary)]/5 border-[var(--color-brand-primary)] text-[var(--color-brand-primary)]'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Amenities / Facilities</h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                  {AMENITIES_LIST.map(amenity => (
                    <label key={amenity} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 rounded border flex shrink-0 items-center justify-center transition-colors ${filters.amenities.includes(amenity) ? 'bg-[var(--color-brand-primary)] border-[var(--color-brand-primary)]' : 'border-gray-300 group-hover:border-gray-400'}`}>
                        {filters.amenities.includes(amenity) && <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 14 14" fill="none"><path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <span className="text-sm text-gray-700 leading-tight">{amenity}</span>
                      <input type="checkbox" className="hidden" checked={filters.amenities.includes(amenity)} onChange={() => toggleAmenity(amenity)} />
                    </label>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 flex items-center gap-3 shrink-0 bg-white">
              <button 
                onClick={handleReset}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                Reset All
              </button>
              <button 
                onClick={handleApply}
                className="flex-1 py-3 rounded-xl bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-secondary)] text-white font-semibold text-sm transition-colors shadow-md"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(drawerContent, document.body);
}
