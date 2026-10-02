"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import DealCard from '../../components/DealCard';
import { 
  Building2, 
  MapPin, 
  Loader2, 
  Clock, 
  Flame, 
  Tag, 
  SlidersHorizontal,
  ShieldCheck, 
  CheckCircle2, 
  Zap, 
  Sparkles, 
  Mail, 
  ArrowRight, 
  Headphones, 
  ShoppingBag, 
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { getBaseApiUrl } from '../../lib/api/apiClient';

export default function DealsPage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Filters state
  const [filters, setFilters] = useState({
    city: 'All Cities',
    area: 'All Areas',
    category: 'all',
    sort: ''
  });

  // Location Filter State (Cities & Areas from backend controllers)
  const [citiesData, setCitiesData] = useState<any[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [availableAreas, setAvailableAreas] = useState<string[]>([]);

  // Custom Dropdown states
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isAreaOpen, setIsAreaOpen] = useState(false);

  // 1. Fetch all cities on mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch(`${getBaseApiUrl()}/cities`);
        const data = await res.json();
        if (data.success && data.data?.cities) {
          setCitiesData(data.data.cities);
          const cityNames = data.data.cities.map((c: any) => c.name);
          setAvailableCities(cityNames);
        }
      } catch (err) {
        console.error("Error fetching cities:", err);
      }
    };
    fetchCities();
  }, []);

  // 2. Fetch areas dynamically when selected city changes
  useEffect(() => {
    const fetchAreasForCity = async () => {
      if (filters.city === 'All Cities') {
        setAvailableAreas([]);
        return;
      }
      const selectedCityObj = citiesData.find(c => c.name.toLowerCase() === filters.city.toLowerCase());
      if (selectedCityObj && selectedCityObj._id) {
        try {
          const res = await fetch(`${getBaseApiUrl()}/areas?cityId=${selectedCityObj._id}`);
          const data = await res.json();
          if (data.success && data.data?.areas) {
            const areaNames = data.data.areas.map((a: any) => a.name);
            setAvailableAreas(areaNames);
          }
        } catch (err) {
          console.error("Error fetching areas:", err);
        }
      }
    };
    fetchAreasForCity();
  }, [filters.city, citiesData]);

  // Auth protection
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchDeals();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${getBaseApiUrl()}/hot-deal-categories`);
      const data = await res.json();
      if (data.success) {
        setCategories(data.data?.categories || []);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchDeals = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${getBaseApiUrl()}/hot-deals/discover?limit=20`;
      if (filters.category !== 'all') url += `&category=${filters.category}`;
      if (filters.sort !== '') url += `&sort=${filters.sort}`;
      if (filters.city !== 'All Cities') url += `&city=${encodeURIComponent(filters.city)}`;
      if (filters.area !== 'All Areas') url += `&area=${encodeURIComponent(filters.area)}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setDeals(data.data || []);
      } else {
        throw new Error(data.message || 'Failed to fetch deals');
      }
    } catch (err: any) {
      console.error("Error fetching deals:", err);
      setError(err.message || 'An error occurred while loading deals.');
    } finally {
      setLoading(false);
    }
  };

  // Standard marketplace categories matching reference mockup
  const standardCategories = [
    { key: 'all', label: 'All Deals', icon: '🔥' },
    { key: 'cleaning-laundry', label: 'Cleaning & Laundry', icon: '🧹' },
    { key: 'moving-shifting', label: 'Moving & Shifting', icon: '📦' },
    { key: 'fitness-wellness', label: 'Fitness & Wellness', icon: '💪' },
    { key: 'internet-services', label: 'Internet & Services', icon: '🌐' },
    { key: 'shopping', label: 'Shopping', icon: '🛍️' },
    { key: 'electronics', label: 'Electronics', icon: '📱' },
    { key: 'beauty-salon', label: 'Beauty & Salon', icon: '💄' },
    { key: 'travel', label: 'Travel', icon: '✈️' },
    { key: 'entertainment', label: 'Entertainment', icon: '🎭' },
    { key: 'bills', label: 'Bills', icon: '💡' },
  ];

  // Helper to handle category selection
  const handleCategorySelect = (key: string, label: string) => {
    if (key === 'all') {
      setFilters(prev => ({ ...prev, category: 'all' }));
      return;
    }
    // Check if backend has a category that matches this label
    const matched = categories.find(c => 
      c.name?.toLowerCase() === label.toLowerCase() || 
      c.displayName?.toLowerCase() === label.toLowerCase() ||
      c._id === key
    );
    if (matched) {
      setFilters(prev => ({ ...prev, category: matched._id }));
    } else {
      setFilters(prev => ({ ...prev, category: key }));
    }
  };

  const isCategoryActive = (key: string, label: string) => {
    if (filters.category === 'all' && key === 'all') return true;
    if (filters.category === key) return true;
    const matched = categories.find(c => c._id === filters.category);
    if (matched && (matched.name?.toLowerCase() === label.toLowerCase() || matched.displayName?.toLowerCase() === label.toLowerCase())) {
      return true;
    }
    return false;
  };

  if (authLoading || (!authLoading && !user)) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[var(--color-brand-primary)]" />
        <p className="mt-4 text-gray-500 font-medium">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-[85px] pb-12">
        
        {/* ------------------ 1. HERO SECTION ------------------ */}
        <section className="relative rounded-3xl bg-gradient-to-r from-[#F8F7FF] via-[#FCFBFF] to-[#F3F0FF] border border-purple-100/80 p-6 sm:p-8 lg:p-10 shadow-[0_4px_30px_rgba(99,102,241,0.06)] overflow-hidden mb-6">
          
          {/* Subtle background decorative blurs */}
          <div className="absolute -top-12 -right-12 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />

          {/* Top Right "Top Discounts" Button */}
          <div className="absolute top-6 right-6 z-20 hidden sm:block">
            <button 
              onClick={() => setFilters(prev => ({ ...prev, sort: prev.sort === 'discount' ? '' : 'discount' }))}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all shadow-sm cursor-pointer ${
                filters.sort === 'discount' 
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-rose-500/25' 
                  : 'bg-white text-slate-800 border border-slate-200 hover:border-amber-400 hover:text-amber-600'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Top Discounts</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <span className="inline-block px-3.5 py-1 bg-purple-100 text-purple-700 font-extrabold text-[11px] tracking-wider uppercase rounded-full mb-4">
                EXPLORE EXCLUSIVE DEALS
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-3">
                HotDeals & Offers
              </h1>

              <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed mb-6 max-w-xl">
                Amazing offers on top brands & services<br className="hidden sm:block" />
                Save more on things you love 🎉
              </p>

              {/* 4 Value Indicators */}
              <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-purple-100/70 shadow-sm flex flex-wrap items-center gap-4 sm:gap-6 w-full max-w-2xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-slate-900 font-extrabold text-xs">Verified Offers</p>
                    <p className="text-slate-400 text-[10px] font-medium">100% Genuine</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-slate-900 font-extrabold text-xs">Best Prices</p>
                    <p className="text-slate-400 text-[10px] font-medium">Guaranteed</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-slate-900 font-extrabold text-xs">Limited Time</p>
                    <p className="text-slate-400 text-[10px] font-medium">Hurry Up!</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-slate-900 font-extrabold text-xs">Easy Redeem</p>
                    <p className="text-slate-400 text-[10px] font-medium">No Extra Steps</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 3D Visual */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end items-center relative">
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="relative max-w-[380px] sm:max-w-[420px] w-full"
              >
                <img 
                  src="/assets/images/deals-hero-3d.png" 
                  alt="Hot Deals 3D Shopping" 
                  className="w-full h-auto drop-shadow-xl transform hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ------------------ 2. FLOATING FILTER BAR ------------------ */}
        <section className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 mb-8 relative z-40">
          {/* Full-screen overlay to close dropdowns when clicking outside */}
          {(isCityOpen || isAreaOpen) && (
            <div 
              className="fixed inset-0 z-[90]" 
              onClick={() => { setIsCityOpen(false); setIsAreaOpen(false); }}
            />
          )}

          <div className="flex flex-wrap items-center justify-between gap-2.5">
            {/* Left Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Custom City Selector */}
              <div className="relative inline-flex items-center shrink-0 z-[95]">
                <button 
                  onClick={() => { setIsCityOpen(!isCityOpen); setIsAreaOpen(false); }}
                  className={`flex items-center justify-between gap-2 pl-3.5 pr-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs sm:text-sm font-bold transition-all border ${isCityOpen ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm' : 'border-slate-200/70'} outline-none cursor-pointer w-38`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="truncate">{filters.city}</span>
                  </div>
                  <span className={`text-slate-400 text-xs transition-transform duration-200 ${isCityOpen ? 'rotate-180' : ''}`}>▾</span>
                </button>

                <AnimatePresence>
                  {isCityOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] overflow-hidden py-2 max-h-64 overflow-y-auto z-[100] hide-scrollbar"
                    >
                      <button
                        onClick={() => { setFilters(prev => ({ ...prev, city: 'All Cities', area: 'All Areas' })); setIsCityOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm font-bold transition-colors hover:bg-slate-50 ${filters.city === 'All Cities' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-700'}`}
                      >
                        All Cities
                      </button>
                      {availableCities.map(c => (
                        <button
                          key={c}
                          onClick={() => { setFilters(prev => ({ ...prev, city: c, area: 'All Areas' })); setIsCityOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm font-bold transition-colors hover:bg-slate-50 ${filters.city === c ? 'text-indigo-600 bg-indigo-50' : 'text-slate-700'}`}
                        >
                          {c}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Custom Area Selector */}
              <div className="relative inline-flex items-center shrink-0 z-[95]">
                <button 
                  onClick={() => { setIsAreaOpen(!isAreaOpen); setIsCityOpen(false); }}
                  className={`flex items-center justify-between gap-2 pl-3.5 pr-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs sm:text-sm font-bold transition-all border ${isAreaOpen ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm' : 'border-slate-200/70'} outline-none cursor-pointer w-40`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{filters.area}</span>
                  </div>
                  <span className={`text-slate-400 text-xs transition-transform duration-200 ${isAreaOpen ? 'rotate-180' : ''}`}>▾</span>
                </button>

                <AnimatePresence>
                  {isAreaOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] overflow-hidden py-2 max-h-64 overflow-y-auto z-[100] hide-scrollbar"
                    >
                      <button
                        onClick={() => { setFilters(prev => ({ ...prev, area: 'All Areas' })); setIsAreaOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm font-bold transition-colors hover:bg-slate-50 ${filters.area === 'All Areas' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-700'}`}
                      >
                        All Areas
                      </button>
                      {availableAreas.length === 0 && (
                        <div className="px-4 py-2 text-xs text-slate-400 font-medium">Select a city first</div>
                      )}
                      {availableAreas.map(a => (
                        <button
                          key={a}
                          onClick={() => { setFilters(prev => ({ ...prev, area: a })); setIsAreaOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm font-bold transition-colors hover:bg-slate-50 ${filters.area === a ? 'text-indigo-600 bg-indigo-50' : 'text-slate-700'}`}
                        >
                          {a}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Ending Soon Button */}
              <button 
                onClick={() => setFilters(prev => ({ ...prev, sort: prev.sort === 'expiry' ? '' : 'expiry' }))}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border cursor-pointer ${
                  filters.sort === 'expiry' 
                    ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-xs' 
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/70'
                }`}
              >
                <Clock className={`w-4 h-4 ${filters.sort === 'expiry' ? 'text-rose-600' : 'text-slate-400'}`} />
                <span>Ending Soon</span>
              </button>

              {/* Budget Button */}
              <button 
                onClick={() => setFilters(prev => ({ ...prev, sort: prev.sort === 'price' ? '' : 'price' }))}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border cursor-pointer ${
                  filters.sort === 'price' 
                    ? 'bg-amber-50 text-amber-700 border-amber-300 shadow-xs' 
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/70'
                }`}
              >
                <span>💰</span>
                <span>Budget</span>
              </button>
            </div>

            {/* Right Controls: More Filters */}
            <div className="flex items-center gap-2 ml-auto">
              <button 
                onClick={() => router.push('/deals')}
                className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/70 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                <span>More Filters</span>
              </button>
            </div>
          </div>
        </section>

        {/* ------------------ 3. TWO COLUMN MAIN CONTENT ------------------ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* LEFT SIDEBAR: CATEGORIES + PROMO CARD */}
          <aside className="lg:col-span-3 w-full space-y-6">
            
            {/* Categories List Box */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-4 px-2">
                CATEGORIES
              </h3>

              <div className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 hide-scrollbar">
                {standardCategories.map((cat) => {
                  const active = isCategoryActive(cat.key, cat.label);
                  return (
                    <button
                      key={cat.key}
                      onClick={() => handleCategorySelect(cat.key, cat.label)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all text-left whitespace-nowrap cursor-pointer ${
                        active 
                          ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-500/25' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span className="text-base">{cat.icon}</span>
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Want exclusive offers? Promo Card */}
            <div className="bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-3xl p-6 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
              {/* Decorative shapes */}
              <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <div className="absolute -left-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-lg pointer-events-none" />

              <h4 className="font-black text-lg mb-2 relative z-10 leading-tight">
                Want exclusive offers?
              </h4>
              <p className="text-indigo-100 text-xs leading-relaxed mb-5 relative z-10">
                Join PGInfo community and get special member-only deals and discounts.
              </p>

              <button 
                onClick={() => router.push('/circle')}
                className="bg-white hover:bg-indigo-50 text-indigo-700 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer relative z-10 mb-5 inline-block"
              >
                Join Now
              </button>

              {/* Member Avatars */}
              <div className="flex items-center gap-3 relative z-10 pt-2 border-t border-white/15">
                <div className="flex -space-x-2 overflow-hidden">
                  <img className="inline-block h-7 w-7 rounded-full ring-2 ring-indigo-400 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" alt="Member" />
                  <img className="inline-block h-7 w-7 rounded-full ring-2 ring-indigo-400 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" alt="Member" />
                  <img className="inline-block h-7 w-7 rounded-full ring-2 ring-indigo-400 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" alt="Member" />
                </div>
                <span className="text-[11px] font-extrabold text-white/90">
                  10K+ members +
                </span>
              </div>
            </div>

          </aside>

          {/* RIGHT COLUMN: ACTIVE DEALS GRID */}
          <section className="lg:col-span-9 w-full">
            
            {/* Header with real count */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                All Active Deals
              </h2>
              <span className="text-xs sm:text-sm font-extrabold text-slate-400">
                {deals.length} {deals.length === 1 ? 'deal' : 'deals'}
              </span>
            </div>

            {/* Deals Loading State */}
            {loading ? (
              <div className="bg-white rounded-3xl p-16 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
                <p className="text-slate-500 font-bold text-sm">Loading active marketplace deals...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-8 rounded-3xl text-center border border-red-100">
                <p className="font-bold text-sm mb-4">{error}</p>
                <button 
                  onClick={fetchDeals} 
                  className="px-6 py-2.5 bg-red-600 text-white rounded-xl font-bold text-xs hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            ) : deals.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-slate-100 shadow-sm flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-5 text-3xl">
                  🏷️
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">No deals found</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto mb-6 leading-relaxed">
                  We couldn't find any active deals matching your current filters. Try resetting the location or selecting another category.
                </p>
                <button 
                  onClick={() => setFilters({ city: 'All Cities', area: 'All Areas', category: 'all', sort: '' })}
                  className="px-6 py-3 bg-[#0B132B] hover:bg-indigo-600 text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {deals.map((deal) => (
                  <DealCard key={deal._id} deal={deal} />
                ))}
              </div>
            )}

          </section>

        </div>

        {/* ------------------ 4. MORE SAVINGS FOR YOU ------------------ */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              More Savings For You
            </h2>
            <button 
              onClick={() => handleCategorySelect('all', 'All Deals')}
              className="text-xs sm:text-sm font-extrabold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>View All Deals</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Card 1: Food & Restaurants */}
            <div 
              onClick={() => handleCategorySelect('food', 'Food & Dining')}
              className="bg-[#FAF5FF] rounded-3xl p-5 border border-purple-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <span className="inline-block text-[11px] font-black text-purple-700 mb-1">Flat 50% OFF</span>
                <h3 className="text-sm font-black text-slate-900 mb-1">Food & Restaurants</h3>
                <p className="text-[11px] text-slate-500 mb-4">Delicious deals on food</p>
              </div>
              <div className="flex items-end justify-between mt-auto">
                <div className="w-8 h-8 rounded-full bg-white shadow-xs flex items-center justify-center text-slate-700 group-hover:bg-purple-600 group-hover:text-white transition-all">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
                <div className="w-18 h-18 relative rounded-2xl overflow-hidden shadow-xs">
                  <img src="https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=250" alt="Food" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
              </div>
            </div>

            {/* Card 2: Health & Fitness */}
            <div 
              onClick={() => handleCategorySelect('fitness', 'Fitness & Wellness')}
              className="bg-[#EFF6FF] rounded-3xl p-5 border border-blue-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <span className="inline-block text-[11px] font-black text-blue-700 mb-1">Up to 30% OFF</span>
                <h3 className="text-sm font-black text-slate-900 mb-1">Health & Fitness</h3>
                <p className="text-[11px] text-slate-500 mb-4">Offers to keep you fit</p>
              </div>
              <div className="flex items-end justify-between mt-auto">
                <div className="w-8 h-8 rounded-full bg-white shadow-xs flex items-center justify-center text-slate-700 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
                <div className="w-18 h-18 relative rounded-2xl overflow-hidden shadow-xs">
                  <img src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=250" alt="Fitness" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
              </div>
            </div>

            {/* Card 3: Home Services */}
            <div 
              onClick={() => handleCategorySelect('cleaning-laundry', 'Cleaning & Laundry')}
              className="bg-[#F0FDF4] rounded-3xl p-5 border border-emerald-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <span className="inline-block text-[11px] font-black text-emerald-700 mb-1">Up to 60% OFF</span>
                <h3 className="text-sm font-black text-slate-900 mb-1">Home Services</h3>
                <p className="text-[11px] text-slate-500 mb-4">Home cleaning, repair & more</p>
              </div>
              <div className="flex items-end justify-between mt-auto">
                <div className="w-8 h-8 rounded-full bg-white shadow-xs flex items-center justify-center text-slate-700 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
                <div className="w-18 h-18 relative rounded-2xl overflow-hidden shadow-xs">
                  <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=250" alt="Home Services" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
              </div>
            </div>

            {/* Card 4: Travel & Stays */}
            <div 
              onClick={() => handleCategorySelect('travel', 'Travel')}
              className="bg-[#FDF4FF] rounded-3xl p-5 border border-fuchsia-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <span className="inline-block text-[11px] font-black text-fuchsia-700 mb-1">Up to 75% OFF</span>
                <h3 className="text-sm font-black text-slate-900 mb-1">Travel & Stays</h3>
                <p className="text-[11px] text-slate-500 mb-4">Travel more for less</p>
              </div>
              <div className="flex items-end justify-between mt-auto">
                <div className="w-8 h-8 rounded-full bg-white shadow-xs flex items-center justify-center text-slate-700 group-hover:bg-fuchsia-600 group-hover:text-white transition-all">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
                <div className="w-18 h-18 relative rounded-2xl overflow-hidden shadow-xs">
                  <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=250" alt="Travel" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
              </div>
            </div>

            {/* Card 5: Shopping */}
            <div 
              onClick={() => handleCategorySelect('shopping', 'Shopping')}
              className="bg-[#FFF1F2] rounded-3xl p-5 border border-rose-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <span className="inline-block text-[11px] font-black text-rose-700 mb-1">Up to 40% OFF</span>
                <h3 className="text-sm font-black text-slate-900 mb-1">Shopping</h3>
                <p className="text-[11px] text-slate-500 mb-4">Top brands, best offers</p>
              </div>
              <div className="flex items-end justify-between mt-auto">
                <div className="w-8 h-8 rounded-full bg-white shadow-xs flex items-center justify-center text-slate-700 group-hover:bg-rose-600 group-hover:text-white transition-all">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
                <div className="w-18 h-18 relative rounded-2xl overflow-hidden shadow-xs">
                  <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=250" alt="Shopping" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------ 5. WHY PGINFO DEALS? BENEFIT BAR ------------------ */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] mb-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 items-center text-center sm:text-left">
            
            {/* Item 1 */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-black text-xs sm:text-sm text-slate-900">Exclusive Deals</h4>
                <p className="text-[11px] text-slate-400 font-medium">Handpicked offers just for you</p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-black text-xs sm:text-sm text-slate-900">Huge Savings</h4>
                <p className="text-[11px] text-slate-400 font-medium">Save big on favourite brands</p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-black text-xs sm:text-sm text-slate-900">Easy to Redeem</h4>
                <p className="text-[11px] text-slate-400 font-medium">Simple steps, instant discounts</p>
              </div>
            </div>

            {/* Item 4 */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-black text-xs sm:text-sm text-slate-900">100% Secure</h4>
                <p className="text-[11px] text-slate-400 font-medium">Safe & secure transactions</p>
              </div>
            </div>

            {/* Item 5 */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h4 className="font-black text-xs sm:text-sm text-slate-900">24/7 Support</h4>
                <p className="text-[11px] text-slate-400 font-medium">We're here to help anytime</p>
              </div>
            </div>

          </div>
        </section>

        {/* ------------------ 6. NEVER MISS AN OFFER! NEWSLETTER CTA ------------------ */}
        <section className="bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-xl shadow-indigo-500/15 mb-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            
            {/* Left Content */}
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black leading-tight mb-1">
                  Never Miss an Offer!
                </h3>
                <p className="text-indigo-100 text-xs sm:text-sm font-medium">
                  Get the best deals & discounts straight to your inbox.
                </p>
              </div>
            </div>

            {/* Right Form */}
            <form 
              onSubmit={(e) => { e.preventDefault(); alert("Thanks for subscribing to PGInfo Deals!"); }}
              className="flex items-center bg-white rounded-full p-1.5 shadow-lg w-full md:w-auto max-w-md"
            >
              <input 
                type="email" 
                placeholder="Enter your email" 
                required
                className="px-5 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none w-full bg-transparent rounded-full"
              />
              <button 
                type="submit"
                className="bg-[#4F46E5] hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm px-6 py-2.5 rounded-full flex items-center gap-2 transition-colors shadow-md cursor-pointer shrink-0"
              >
                <span>Subscribe</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>
        </section>

      </main>

      <Footer />

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
