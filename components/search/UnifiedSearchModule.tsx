"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Search, Home, Building, Store, Sparkles, ArrowRight } from 'lucide-react';
import { useSearchStore } from '../../lib/store/searchStore';
import { PropertyCategory } from '../../lib/types/property';
import CitySelector from './CitySelector';
import AreaSelector from './AreaSelector';
import PGQuickFilters from './PGQuickFilters';
import FlatQuickFilters from './FlatQuickFilters';
import CommercialQuickFilters from './CommercialQuickFilters';

export default function UnifiedSearchModule() {
  const router = useRouter();
  const {
    category,
    setCategory,
    selectedCity,
    setSelectedCity,
    selectedArea,
    setSelectedArea,
    buildQueryParams,
  } = useSearchStore();

  const categories: { id: PropertyCategory; label: string; icon: React.ReactNode; count: string }[] = [
    {
      id: 'pg',
      label: 'PG & Co-Living',
      icon: <Home className="w-4 h-4" />,
      count: '15,000+ Beds',
    },
    {
      id: 'residential_rental',
      label: 'Rented Flats',
      icon: <Building className="w-4 h-4" />,
      count: '8,500+ Homes',
    },
    {
      id: 'commercial',
      label: 'Commercial Spaces',
      icon: <Store className="w-4 h-4" />,
      count: '3,200+ Spaces',
    },
  ];

  const handleSearch = () => {
    const params = buildQueryParams();
    const query = new URLSearchParams();

    if (params.category) query.set('category', params.category);
    if (params.city) query.set('city', params.city);
    if (params.area) query.set('area', params.area);
    if (params.minPrice) query.set('minPrice', String(params.minPrice));
    if (params.maxPrice) query.set('maxPrice', String(params.maxPrice));
    if (params.gender) query.set('gender', params.gender);
    if (params.bhk) query.set('bhk', params.bhk);
    if (params.furnishingStatus) query.set('furnishingStatus', params.furnishingStatus);
    if (params.commercialSubtype) query.set('commercialSubtype', params.commercialSubtype);
    if (params.purpose) query.set('purpose', params.purpose);

    router.push(`/explore?${query.toString()}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/80 border border-slate-200/90 p-4 sm:p-6 transition-all">
      {/* Category Tabs Header */}
      <div className="flex items-center gap-2 pb-4 sm:pb-5 border-b border-slate-100 overflow-x-auto scrollbar-none">
        {categories.map((cat) => {
          const isSelected = category === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-2 sm:gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer shrink-0 ${
                isSelected
                  ? 'bg-teal-700 text-white shadow-md shadow-teal-700/25 scale-[1.02]'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div
                className={`p-1 rounded-lg ${
                  isSelected ? 'bg-white/20 text-white' : 'text-slate-500'
                }`}
              >
                {cat.icon}
              </div>
              <span>{cat.label}</span>
              <span
                className={`hidden md:inline text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/60 text-slate-500'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Search Grid */}
      <div className="pt-4 sm:pt-5 flex flex-col gap-4">
        {/* Step 1 & Step 2: Location Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <CitySelector
            selectedCity={selectedCity}
            onSelectCity={(city) => setSelectedCity(city)}
          />
          <AreaSelector
            selectedCity={selectedCity}
            selectedArea={selectedArea}
            onSelectArea={(area) => setSelectedArea(area)}
          />
        </div>

        {/* Step 3: Dynamic Category Quick Filters */}
        <div className="w-full">
          {category === 'pg' && <PGQuickFilters />}
          {category === 'residential_rental' && <FlatQuickFilters />}
          {category === 'commercial' && <CommercialQuickFilters />}
        </div>

        {/* Bottom Bar: Information & Big Action CTA */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Sparkles className="w-4 h-4 text-teal-700" />
            <span>
              {category === 'pg' && 'Explore verified student & professional PGs with zero brokerage'}
              {category === 'residential_rental' && 'Explore verified family & bachelors rental flats & apartments'}
              {category === 'commercial' && 'Explore prime commercial offices, showrooms & shops with direct owner connect'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleSearch}
            className="w-full sm:w-auto ml-auto flex items-center justify-center gap-2.5 px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl text-sm sm:text-base font-black text-white bg-teal-700 hover:bg-teal-800 shadow-md shadow-teal-700/25 hover:shadow-lg hover:shadow-teal-700/35 transition-all duration-200 cursor-pointer active:scale-98"
          >
            <Search className="w-5 h-5 shrink-0" />
            <span>Search Properties</span>
            <ArrowRight className="w-4 h-4 shrink-0 opacity-80" />
          </button>
        </div>
      </div>
    </div>
  );
}
