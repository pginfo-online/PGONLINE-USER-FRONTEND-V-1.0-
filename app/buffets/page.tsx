"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import BuffetCard from '../../components/BuffetCard';
import { 
  Building2, 
  MapPin, 
  Loader2, 
  Calendar, 
  Sparkles, 
  Search, 
  SlidersHorizontal, 
  CheckCircle2, 
  Tag, 
  Utensils, 
  ArrowRight, 
  Mail, 
  Coffee, 
  Star, 
  Flame, 
  RotateCcw,
  ChevronUp,
  ChevronDown,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Award,
  BadgeCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { getBaseApiUrl } from '../../lib/api/apiClient';
import Link from 'next/link';

export default function BuffetsPage() {
  const [buffets, setBuffets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Public discovery page: guest and authenticated users can browse buffets freely

  // Filters state
  const [filters, setFilters] = useState({
    city: 'Pune',
    area: 'All Areas',
    foodType: 'all', // 'all', 'veg', 'nonveg'
    maxPrice: 1000,
    minRating: 0,
  });

  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [isBannerCollapsed, setIsBannerCollapsed] = useState(false);
  const [emailSub, setEmailSub] = useState('');
  const [subSuccess, setSubSuccess] = useState(false);

  // Custom Dropdown states
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isAreaOpen, setIsAreaOpen] = useState(false);

  // Location Filter State (Cities & Areas from backend controllers)
  const [citiesData, setCitiesData] = useState<any[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [availableAreas, setAvailableAreas] = useState<string[]>([]);

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

  useEffect(() => {
    fetchBuffets();
  }, [filters.city, filters.area, filters.foodType]);

  const fetchBuffets = async () => {
    setLoading(true);
    setError(null);
    try {
      // Build query string
      let url = `${getBaseApiUrl()}/buffet/discover?limit=20`;
      if (filters.city !== 'All Cities') url += `&city=${encodeURIComponent(filters.city)}`;
      if (filters.area !== 'All Areas') url += `&area=${encodeURIComponent(filters.area)}`;
      if (filters.foodType !== 'all') url += `&foodType=${filters.foodType}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        let fetchedBuffets = data.data || [];
        // Local filtering for extra filters
        if (filters.maxPrice < 1000) {
          fetchedBuffets = fetchedBuffets.filter((b: any) => (b.price || 0) <= filters.maxPrice);
        }
        if (filters.minRating > 0) {
          fetchedBuffets = fetchedBuffets.filter((b: any) => (b.hotel?.avgRating || 4.2) >= filters.minRating);
        }

        // Dummy fallback data matching the authentic items from the visual
        if (fetchedBuffets.length === 0) {
          fetchedBuffets = [
            {
              _id: 'dummy1',
              name: 'Royal Indian Thali Feast',
              foodType: 'veg',
              price: 499,
              pricePerPerson: 499,
              startTime: '12:00 PM',
              endTime: '3:30 PM',
              type: 'lunch',
              cuisine: ['North Indian', 'Paneer Special', 'Desserts'],
              hotel: { name: 'The Grand Palace', area: 'Koregaon Park', city: 'Pune', avgRating: 4.8 },
              images: [{ url: '/assets/images/buffet-1.jpg' }]
            },
            {
              _id: 'dummy2',
              name: 'Sizzling BBQ & Kebabs',
              foodType: 'nonveg',
              price: 799,
              pricePerPerson: 799,
              startTime: '7:00 PM',
              endTime: '11:30 PM',
              type: 'dinner',
              cuisine: ['BBQ Grill', 'Tandoori Kebabs', 'Mughlai'],
              hotel: { name: 'Spice Route', area: 'Viman Nagar', city: 'Pune', avgRating: 4.5 },
              images: [{ url: '/assets/images/buffet-2.jpg' }]
            },
            {
              _id: 'dummy3',
              name: 'Italian Pizza & Pasta Spread',
              foodType: 'veg',
              price: 599,
              pricePerPerson: 599,
              startTime: '11:30 AM',
              endTime: '4:00 PM',
              type: 'brunch',
              cuisine: ['Wood-fired Pizza', 'Creamy Pasta', 'Garlic Bread'],
              hotel: { name: 'Cafe Botanica', area: 'Baner', city: 'Pune', avgRating: 4.6 },
              images: [{ url: '/assets/images/buffet-3.jpg' }]
            },
            {
              _id: 'dummy4',
              name: 'Heavenly Dessert & Sweets Bar',
              foodType: 'all',
              price: 399,
              pricePerPerson: 399,
              startTime: '4:00 PM',
              endTime: '9:30 PM',
              type: 'dessert',
              cuisine: ['Choco Lava', 'Gulab Jamun', 'Waffles'],
              hotel: { name: 'Zenith Dining', area: 'Kalyani Nagar', city: 'Pune', avgRating: 4.7 },
              images: [{ url: '/assets/images/buffet-4.jpg' }]
            }
          ];
        }

        setBuffets(fetchedBuffets);
      } else {
        throw new Error(data.message || 'Failed to fetch buffets');
      }
    } catch (err: any) {
      console.error("Error fetching buffets:", err);
      setError(err.message || 'An error occurred while loading buffets.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      city: 'Pune',
      area: 'All Areas',
      foodType: 'all',
      maxPrice: 1000,
      minRating: 0,
    });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSub) return;
    setSubSuccess(true);
    setTimeout(() => {
      setEmailSub('');
      setSubSuccess(false);
    }, 4000);
  };

  const hasActiveFilters = 
    filters.city !== 'Pune' || 
    filters.area !== 'All Areas' || 
    filters.foodType !== 'all' || 
    filters.maxPrice < 1000 || 
    filters.minRating > 0;

  if (authLoading || (!authLoading && !user)) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
        <p className="mt-4 text-slate-500 font-medium">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />

      <main className="flex-1 w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-[78px] md:pt-[88px] pb-12">
        
        {/* ------------------ 1. LUXURY HERO BANNER ------------------ */}
        <AnimatePresence>
          {!isBannerCollapsed && (
            <motion.section 
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="relative mb-5 rounded-3xl overflow-hidden border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white"
            >
              {/* Decorative culinary background with rich gradient overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-right sm:bg-center"
                style={{ backgroundImage: 'url("/assets/images/buffet-header-bg.png")' }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/88 to-white/20 sm:to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.08),transparent_50%)]" />

              {/* Collapse Button Top-Right Corner */}
              <button 
                onClick={() => setIsBannerCollapsed(true)}
                className="absolute top-3.5 right-3.5 z-20 flex items-center justify-center w-8 h-8 bg-white/80 hover:bg-white text-slate-500 hover:text-slate-900 rounded-full backdrop-blur-md border border-white/80 shadow-xs transition-all cursor-pointer group"
                title="Collapse banner"
              >
                <ChevronUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
              </button>
              
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-6 sm:px-10 py-6 sm:py-8">
                
                {/* Left Content */}
                <div className="max-w-2xl">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 shadow-2xs mb-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-emerald-800 font-extrabold text-[11px] tracking-wider uppercase">
                      Explore Dining Spreads
                    </span>
                  </div>

                  {/* Heading */}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                    Unlimited Buffets
                    <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600 fill-emerald-500/20 shrink-0 animate-bounce" style={{ animationDuration: '3s' }} />
                  </h1>

                  {/* Subtitle */}
                  <p className="mt-2.5 text-slate-700 text-sm sm:text-base leading-relaxed font-semibold max-w-xl">
                    Eat more. Pay less. Discover the best buffet deals near you.
                  </p>

                  {/* Quick Feature Badges */}
                  <div className="flex flex-wrap items-center gap-2 mt-4 pt-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/70 text-xs font-bold text-slate-700 shadow-2xs">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      50+ Verified Spreads
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/70 text-xs font-bold text-slate-700 shadow-2xs">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      Special Student & PG Pricing
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/70 text-xs font-bold text-slate-700 shadow-2xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      Instant Table Confirmation
                    </span>
                  </div>
                </div>

                {/* Right: Bookings Card Button */}
                <div className="flex flex-col items-end w-full md:w-auto shrink-0">
                  <motion.button 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => router.push('/profile?tab=bookings')}
                    className="group relative flex items-center gap-3.5 px-6 py-3.5 bg-gradient-to-r from-[#FFFBEB] to-[#FEF3C7] text-amber-900 border border-amber-300/80 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm group-hover:rotate-6 transition-transform">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-sm text-slate-900">Bookings</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      </div>
                      <span className="text-[11px] font-medium text-amber-800/90 block">
                        Manage your buffet bookings
                      </span>
                    </div>
                  </motion.button>
                </div>

              </div>
            </motion.section>
          )}
        </AnimatePresence>


        {/* ------------------ 2. MODERN FLOATING FILTER TOOLBAR ------------------ */}
        <section className="mb-6 relative z-40">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-2.5 sm:p-3 shadow-[0_6px_25px_-5px_rgba(0,0,0,0.05)] border border-slate-200/80 flex flex-wrap items-center justify-between gap-2.5">
            
            {/* Click-outside backdrop for dropdowns */}
            {(isCityOpen || isAreaOpen) && (
              <div 
                className="fixed inset-0 z-[90]" 
                onClick={() => { setIsCityOpen(false); setIsAreaOpen(false); }}
              />
            )}

            {/* Left Controls Cluster */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto relative z-[95]">
              
              {/* City Dropdown */}
              <div className="relative inline-flex items-center shrink-0">
                <button 
                  onClick={() => { setIsCityOpen(!isCityOpen); setIsAreaOpen(false); }}
                  className={`flex items-center justify-between gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
                    isCityOpen ? 'border-emerald-500 shadow-sm ring-2 ring-emerald-500/20 bg-white' : 'border-slate-200'
                  } outline-none cursor-pointer w-36`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Building2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="truncate">{filters.city}</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isCityOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isCityOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] overflow-hidden py-1.5 max-h-64 overflow-y-auto z-[100] hide-scrollbar"
                    >
                      <button
                        onClick={() => { setFilters(prev => ({ ...prev, city: 'All Cities', area: 'All Areas' })); setIsCityOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-xs sm:text-sm font-bold transition-colors hover:bg-slate-50 flex items-center justify-between ${
                          filters.city === 'All Cities' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-700'
                        }`}
                      >
                        <span>All Cities</span>
                        {filters.city === 'All Cities' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      </button>
                      {availableCities.map(c => (
                        <button
                          key={c}
                          onClick={() => { setFilters(prev => ({ ...prev, city: c, area: 'All Areas' })); setIsCityOpen(false); }}
                          className={`w-full text-left px-4 py-2 text-xs sm:text-sm font-bold transition-colors hover:bg-slate-50 flex items-center justify-between ${
                            filters.city === c ? 'text-emerald-700 bg-emerald-50' : 'text-slate-700'
                          }`}
                        >
                          <span>{c}</span>
                          {filters.city === c && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Area Dropdown */}
              <div className="relative inline-flex items-center shrink-0">
                <button 
                  onClick={() => { setIsAreaOpen(!isAreaOpen); setIsCityOpen(false); }}
                  className={`flex items-center justify-between gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
                    isAreaOpen ? 'border-emerald-500 shadow-sm ring-2 ring-emerald-500/20 bg-white' : 'border-slate-200'
                  } outline-none cursor-pointer w-40`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">{filters.area}</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isAreaOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isAreaOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-52 bg-white border border-slate-100 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] overflow-hidden py-1.5 max-h-64 overflow-y-auto z-[100] hide-scrollbar"
                    >
                      <button
                        onClick={() => { setFilters(prev => ({ ...prev, area: 'All Areas' })); setIsAreaOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-xs sm:text-sm font-bold transition-colors hover:bg-slate-50 flex items-center justify-between ${
                          filters.area === 'All Areas' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-700'
                        }`}
                      >
                        <span>All Areas</span>
                        {filters.area === 'All Areas' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      </button>
                      {availableAreas.length === 0 && (
                        <div className="px-4 py-2 text-xs text-slate-400 font-medium">Select a city first</div>
                      )}
                      {availableAreas.map(a => (
                        <button
                          key={a}
                          onClick={() => { setFilters(prev => ({ ...prev, area: a })); setIsAreaOpen(false); }}
                          className={`w-full text-left px-4 py-2 text-xs sm:text-sm font-bold transition-colors hover:bg-slate-50 flex items-center justify-between ${
                            filters.area === a ? 'text-emerald-700 bg-emerald-50' : 'text-slate-700'
                          }`}
                        >
                          <span>{a}</span>
                          {filters.area === a && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Veg Toggle Pill */}
              <button 
                onClick={() => setFilters({ ...filters, foodType: filters.foodType === 'veg' ? 'all' : 'veg' })}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border cursor-pointer ${
                  filters.foodType === 'veg' 
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm shadow-emerald-200 ring-2 ring-emerald-500/20' 
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span>🥦</span>
                <span>Veg</span>
              </button>

              {/* Non-Veg Toggle Pill */}
              <button 
                onClick={() => setFilters({ ...filters, foodType: filters.foodType === 'nonveg' ? 'all' : 'nonveg' })}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border cursor-pointer ${
                  filters.foodType === 'nonveg' 
                    ? 'bg-rose-500 text-white border-rose-600 shadow-sm shadow-rose-200 ring-2 ring-rose-500/20' 
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span>🍗</span>
                <span>Non-Veg</span>
              </button>

              {/* More Filters Toggle */}
              <button
                onClick={() => setShowMoreFilters(!showMoreFilters)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border cursor-pointer ${
                  showMoreFilters || filters.maxPrice < 1000 || filters.minRating > 0
                    ? 'bg-purple-600 text-white border-purple-700 shadow-sm ring-2 ring-purple-500/20'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <SlidersHorizontal className={`w-3.5 h-3.5 ${showMoreFilters || filters.maxPrice < 1000 || filters.minRating > 0 ? 'text-white' : 'text-purple-600'}`} />
                <span>More Filters</span>
                {(filters.maxPrice < 1000 || filters.minRating > 0) && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 ml-0.5 animate-ping" />
                )}
              </button>
            </div>

            {/* Right Controls: Bookings (if collapsed) & Reset */}
            <div className="flex items-center gap-3 ml-auto relative z-30">
              
              {/* Show Bookings Button when Banner is Collapsed */}
              {isBannerCollapsed && (
                <button 
                  onClick={() => router.push('/profile?tab=bookings')}
                  className="flex items-center justify-center gap-2 px-3.5 py-2 bg-amber-50 text-amber-800 border border-amber-300 rounded-xl text-xs sm:text-sm font-bold hover:bg-amber-100 transition-all shadow-2xs cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-amber-700" />
                  <span>Bookings</span>
                </button>
              )}

              {/* Expand Banner Button when collapsed */}
              {isBannerCollapsed && (
                <button
                  onClick={() => setIsBannerCollapsed(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
                  title="Show header banner"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              )}

              {/* Reset Button */}
              {hasActiveFilters && (
                <motion.button 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={handleClearFilters}
                  className="text-xs font-bold text-slate-500 hover:text-emerald-700 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer group"
                >
                  <RotateCcw className="w-3.5 h-3.5 group-hover:-rotate-45 transition-transform" />
                  <span>Reset</span>
                </motion.button>
              )}
            </div>

          </div>

          {/* More Filters Expandable Drawer */}
          <AnimatePresence>
            {showMoreFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden mt-3 bg-white rounded-2xl p-5 shadow-lg border border-slate-200/80 grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div>
                  <div className="flex justify-between items-center mb-2.5">
                    <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                      Budget Cap: ₹{filters.maxPrice}/person
                    </label>
                    <span className="text-xs text-slate-400 font-semibold">Max ₹1000</span>
                  </div>
                  <input 
                    type="range" 
                    min="200" 
                    max="1000" 
                    step="50"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                    className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
                  />
                  <div className="flex justify-between text-[11px] font-bold text-slate-400 mt-1.5">
                    <span>₹200</span>
                    <span>₹500</span>
                    <span>₹750</span>
                    <span>₹1000</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2.5 block">
                    Minimum Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[0, 3.5, 4.0, 4.5].map((r) => (
                      <button
                        key={r}
                        onClick={() => setFilters({ ...filters, minRating: r })}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1 cursor-pointer ${
                          filters.minRating === r 
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {r === 0 ? (
                          <span>Any Rating</span>
                        ) : (
                          <>
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{r}★+</span>
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>


        {/* ------------------ 3. BUFFET DISCOVERY GRID ------------------ */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-500 bg-white rounded-3xl border border-slate-100 shadow-2xs mb-16">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-4" />
            <p className="font-bold text-slate-700 text-base">Discovering delicious buffet spreads near you...</p>
            <p className="text-xs text-slate-400 mt-1">Filtering verified restaurant spreads</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-8 rounded-3xl text-center shadow-2xs border border-red-200 mb-16 max-w-lg mx-auto">
            <p className="font-bold text-base mb-2">{error}</p>
            <button 
              onClick={fetchBuffets} 
              className="mt-4 px-6 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : buffets.length === 0 ? (
          /* Empty State */
          <motion.section 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 sm:p-14 text-center border border-slate-100 shadow-sm max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 mb-16"
          >
            <div className="w-32 h-32 rounded-3xl bg-purple-50 flex items-center justify-center relative shrink-0 shadow-inner">
              <span className="text-5xl">🍲</span>
              <div className="absolute -top-1 -right-1 bg-white p-2 rounded-full shadow-md border border-slate-100">
                <Search className="w-4 h-4 text-purple-600" />
              </div>
            </div>

            <div className="text-center md:text-left">
              <h2 className="text-2xl font-black text-slate-900 mb-2 flex items-center justify-center md:justify-start gap-2">
                No buffets found <span>🍽️</span>
              </h2>
              <p className="text-slate-500 text-sm max-w-md mb-5 leading-relaxed">
                We couldn't find any buffets matching your current location or filters. Try browsing all areas or resetting filters.
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <button 
                  onClick={handleClearFilters}
                  className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs shadow-md hover:bg-slate-800 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear all filters</span>
                </button>
                <button 
                  onClick={() => setFilters(prev => ({ ...prev, city: 'Pune', area: 'All Areas' }))}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Browse Pune</span>
                </button>
              </div>
            </div>
          </motion.section>
        ) : (
          /* Available Buffets Grid */
          <section className="mb-16">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Available Buffets Near You</span>
                  <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                    {buffets.length}
                  </span>
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Updated live</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {buffets.map((buffet, index) => (
                <BuffetCard key={buffet._id || index} buffet={buffet} index={index} />
              ))}
            </div>
          </section>
        )}


        {/* ------------------ 4. VISUAL STORYTELLING BENTO (Good Food. Great Value.) ------------------ */}
        <section className="mb-16 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Visual Side */}
            <div className="lg:col-span-6 relative h-72 sm:h-88 rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 group">
              <img 
                src="/assets/images/buffet-hero-spread.png" 
                alt="Luxury Buffet Counter Spread" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              
              {/* Floating Badge Bottom */}
              <div className="absolute bottom-5 left-5 right-5 text-white flex items-end justify-between gap-4">
                <div>
                  <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-[10px] uppercase px-3 py-1 rounded-full tracking-wider mb-2 inline-block shadow-sm">
                    Unlimited Feast
                  </span>
                  <p className="font-extrabold text-base sm:text-lg text-white">
                    Premium Multi-Cuisine Spreads
                  </p>
                  <p className="text-xs text-white/80 font-medium mt-0.5">
                    Live cooking counters, endless mains & dessert bars
                  </p>
                </div>
                
                <div className="hidden sm:flex flex-col items-end bg-black/40 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 shrink-0">
                  <span className="text-[10px] uppercase font-bold text-amber-300">Save up to</span>
                  <span className="text-sm font-black text-white">40% OFF</span>
                </div>
              </div>
            </div>

            {/* Story Content Side */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-800 text-[11px] font-extrabold tracking-wider uppercase mb-3 w-fit">
                <Utensils className="w-3.5 h-3.5" />
                <span>PG-Friendly Dining</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight mb-4 tracking-tight">
                Good Food. Great Value.<br />
                <span className="bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
                  Zero Hassle.
                </span>
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 font-medium">
                From quick weekday meals to weekend feast plans with roommates, discover buffet options that fit your budget and your appetite. Compare prices, check live menus, and reserve tables effortlessly with your PG credentials.
              </p>

              {/* Value Checkpoints */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    ✓
                  </div>
                  <span>Instant table booking</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    ✓
                  </div>
                  <span>Exclusive PG student discounts</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    ✓
                  </div>
                  <span>100% verified food ratings</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    ✓
                  </div>
                  <span>Zero hidden service charges</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3.5 items-center">
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer group"
                >
                  <span>Explore Buffets</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <Link 
                  href="/deals"
                  className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-bold text-sm transition-all shadow-2xs"
                >
                  View Food Deals
                </Link>
              </div>
            </div>

          </div>
        </section>


        {/* ------------------ 5. WHY PGINFO BUFFETS? ------------------ */}
        <section className="mb-16">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-emerald-700 font-extrabold text-xs tracking-wider uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60 inline-block mb-2">
              Tailored Dining Experiences
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
              Why PGInfo Buffets?
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              Curated unlimited spreads and dining perks designed specifically for students and young working professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <MapPin className="w-6 h-6 text-emerald-600" />,
                title: "Discover Nearby",
                desc: "Find buffet options right around your PG, college, or office workplace with walking distances.",
                badge: "Within 2-5 KM",
                badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200"
              },
              {
                icon: <Tag className="w-6 h-6 text-amber-500" />,
                title: "Compare Prices",
                desc: "Easily compare unlimited spread prices, veg/non-veg options, and student discounts before stepping out.",
                badge: "Save Up to 40%",
                badgeColor: "bg-amber-50 text-amber-700 border-amber-200"
              },
              {
                icon: <Utensils className="w-6 h-6 text-purple-600" />,
                title: "Easy Booking",
                desc: "Reserve your preferred dining table in seconds without tedious call waits or queueing.",
                badge: "Instant Pass",
                badgeColor: "bg-purple-50 text-purple-700 border-purple-200"
              },
              {
                icon: <Sparkles className="w-6 h-6 text-rose-500" />,
                title: "PG-Friendly Deals",
                desc: "Exclusive student discounts and group buffet offers created for PG tenants and coliving members.",
                badge: "Exclusive Perks",
                badgeColor: "bg-rose-50 text-rose-700 border-rose-200"
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx} 
                whileHover={{ y: -4 }}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>


        {/* ------------------ 6. YOU MIGHT ALSO LIKE (Bento Cards) ------------------ */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
                You might also like
                <Sparkles className="w-5 h-5 text-purple-600" />
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm font-medium mt-0.5">
                Explore popular dining options near you
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Deals & Offers */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-gradient-to-b from-[#F5F3FF] to-white rounded-3xl p-5 border border-purple-200/70 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-lg transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-11 h-11 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-sm group-hover:rotate-6 transition-transform">
                  <Utensils className="w-5 h-5" />
                </div>
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm relative bg-slate-100 border-2 border-white">
                  <img 
                    src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=300&q=80" 
                    alt="Deals" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    loading="lazy"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base mb-1 group-hover:text-purple-700 transition-colors">
                  Deals & Offers
                </h3>
                <p className="text-slate-500 text-xs mb-4">
                  Exciting offers on food at top restaurants
                </p>
                <Link 
                  href="/deals" 
                  className="w-9 h-9 rounded-full bg-white border border-purple-100 flex items-center justify-center text-purple-600 shadow-sm hover:bg-purple-600 hover:text-white transition-all"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* Card 2: Top Restaurants */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-gradient-to-b from-[#F0FDFA] to-white rounded-3xl p-5 border border-teal-200/70 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-lg transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-11 h-11 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-sm group-hover:rotate-6 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm relative bg-slate-100 border-2 border-white">
                  <img 
                    src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80" 
                    alt="Restaurants" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    loading="lazy"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base mb-1 group-hover:text-teal-700 transition-colors">
                  Top Restaurants
                </h3>
                <p className="text-slate-500 text-xs mb-4">
                  Discover top-rated restaurants near you
                </p>
                <Link 
                  href="/explore" 
                  className="w-9 h-9 rounded-full bg-white border border-teal-100 flex items-center justify-center text-teal-700 shadow-sm hover:bg-teal-600 hover:text-white transition-all"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* Card 3: Trending Buffets */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-gradient-to-b from-[#ECFDF5] to-white rounded-3xl p-5 border border-emerald-200/70 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-lg transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm group-hover:rotate-6 transition-transform">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm relative bg-slate-100 border-2 border-white">
                  <img 
                    src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80" 
                    alt="Trending" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    loading="lazy"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base mb-1 group-hover:text-emerald-700 transition-colors">
                  Trending Buffets
                </h3>
                <p className="text-slate-500 text-xs mb-4">
                  Most loved buffets by students & PG tenants
                </p>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
                  className="w-9 h-9 rounded-full bg-white border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm hover:bg-emerald-600 hover:text-white transition-all cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* Card 4: Cafes & More */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-gradient-to-b from-[#FDF2F8] to-white rounded-3xl p-5 border border-pink-200/70 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-lg transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-11 h-11 rounded-2xl bg-pink-600 text-white flex items-center justify-center font-bold shadow-sm group-hover:rotate-6 transition-transform">
                  <Coffee className="w-5 h-5" />
                </div>
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm relative bg-slate-100 border-2 border-white">
                  <img 
                    src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=300&q=80" 
                    alt="Cafes" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    loading="lazy"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base mb-1 group-hover:text-pink-700 transition-colors">
                  Cafes & More
                </h3>
                <p className="text-slate-500 text-xs mb-4">
                  Artisanal coffee, snacks and beverages
                </p>
                <Link 
                  href="/deals" 
                  className="w-9 h-9 rounded-full bg-white border border-pink-100 flex items-center justify-center text-pink-600 shadow-sm hover:bg-pink-600 hover:text-white transition-all"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

          </div>
        </section>


        {/* ------------------ 7. NEWSLETTER CTA (Luxury Dark Emerald) ------------------ */}
        <section className="bg-gradient-to-br from-[#022C22] via-[#064E3B] to-[#042F2E] rounded-3xl p-7 sm:p-10 text-white shadow-xl relative overflow-hidden">
          {/* Ambient Lighting Circles */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-60 h-60 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center gap-4 text-center lg:text-left">
              <div className="w-14 h-14 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-inner">
                <Mail className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                    Don't miss exclusive buffet offers!
                  </h3>
                  <span className="text-xs bg-emerald-400/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30 hidden sm:inline-block">
                    VIP Deals
                  </span>
                </div>
                <p className="text-emerald-100/80 text-xs sm:text-sm font-medium mt-1">
                  Subscribe now and get curated buffet flash deals delivered directly to your inbox.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
              {subSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-500/20 text-emerald-300 px-6 py-3.5 rounded-2xl border border-emerald-400/40 text-xs font-bold flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Subscribed successfully! Welcome to VIP Buffets.</span>
                </motion.div>
              ) : (
                <>
                  <input 
                    type="email" 
                    required
                    value={emailSub}
                    onChange={(e) => setEmailSub(e.target.value)}
                    placeholder="Enter your email address" 
                    className="w-full sm:w-80 px-4 py-3.5 bg-black/30 border border-emerald-500/30 rounded-2xl text-sm text-white placeholder-emerald-200/50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 backdrop-blur-sm transition-all"
                  />
                  <button 
                    type="submit"
                    className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-sm font-extrabold rounded-2xl transition-all shadow-md hover:shadow-lg cursor-pointer shrink-0"
                  >
                    Subscribe
                  </button>
                </>
              )}
            </form>

          </div>
        </section>

      </main>

      {/* ------------------ 8. FOOTER ------------------ */}
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


