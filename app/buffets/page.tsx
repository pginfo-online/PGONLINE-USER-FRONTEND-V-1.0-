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
  Map, 
  Tag, 
  Utensils, 
  ArrowRight, 
  Mail, 
  Coffee, 
  Star, 
  Flame, 
  RotateCcw,
  X,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { getBaseApiUrl } from '../../lib/api/apiClient';
import Image from 'next/image';
import Link from 'next/link';

export default function BuffetsPage() {
  const [buffets, setBuffets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

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
        // Local filtering for extra filters if needed
        if (filters.maxPrice < 1000) {
          fetchedBuffets = fetchedBuffets.filter((b: any) => (b.price || 0) <= filters.maxPrice);
        }
        if (filters.minRating > 0) {
          fetchedBuffets = fetchedBuffets.filter((b: any) => (b.hotel?.avgRating || 4.2) >= filters.minRating);
        }

        // --- ADD DUMMY DATA FOR DEMO PURPOSES IF EMPTY ---
        if (fetchedBuffets.length === 0) {
          fetchedBuffets = [
            {
              _id: 'dummy1',
              name: 'Royal Indian Thali Feast',
              foodType: 'veg',
              price: 499,
              pricePerPerson: 499,
              startTime: '12:30 PM',
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
              startTime: '8:00 PM',
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
              startTime: '11:00 AM',
              endTime: '4:00 PM',
              type: 'brunch',
              cuisine: ['Wood-fired Pizza', 'Creamy Pasta', 'Garlic Bread'],
              hotel: { name: 'Cafe Botanica', area: 'Baner', city: 'Pune', avgRating: 4.9 },
              images: [{ url: '/assets/images/buffet-3.jpg' }]
            },
            {
              _id: 'dummy4',
              name: 'Heavenly Dessert & Sweets Bar',
              foodType: 'all',
              price: 399,
              pricePerPerson: 399,
              startTime: '4:00 PM',
              endTime: '8:30 PM',
              type: 'dessert',
              cuisine: ['Choco Lava', 'Gulab Jamun', 'Waffles', 'Ice Cream'],
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
      city: 'All Cities',
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

  if (authLoading || (!authLoading && !user)) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[var(--color-brand-primary)]" />
        <p className="mt-4 text-gray-500 font-medium">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-[75px] md:pt-[85px] pb-8">
        
        {/* ------------------ 2. HERO / PAGE HEADER ------------------ */}
        <AnimatePresence>
          {!isBannerCollapsed && (
            <motion.section 
              initial={{ opacity: 1, height: 'auto', marginBottom: 12 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 12 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3 }}
              className="relative py-4 md:py-6 bg-cover bg-center rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100"
              style={{ backgroundImage: 'url("/assets/images/buffet-header-bg.png")' }}
            >
              {/* Subtle gradient overlay to ensure text legibility on light/white background */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent"></div>

              {/* Collapse Button Top-Right Corner */}
              <button 
                onClick={() => setIsBannerCollapsed(true)}
                className="absolute top-3.5 right-3.5 z-20 flex items-center justify-center p-2 bg-white/80 hover:bg-white text-gray-600 hover:text-gray-900 rounded-full backdrop-blur-md border border-white shadow-xs transition-all cursor-pointer group"
                title="Collapse banner"
              >
                <ChevronUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
              </button>
              
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 px-6 sm:px-10">
                
                {/* Left Content */}
                <div className="max-w-2xl">
                  <span className="text-[#059669] font-extrabold text-xs tracking-wider uppercase mb-2 inline-flex items-center gap-1.5 bg-white/60 px-3 py-1 rounded-full backdrop-blur-sm border border-emerald-100">
                    EXPLORE DINING SPREADS
                  </span>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight flex items-center gap-2 mt-2">
                    Unlimited Buffets
                    <Sparkles className="w-7 h-7 text-[#059669] fill-[#059669]/20 shrink-0" />
                  </h1>
                  <p className="mt-3 text-gray-800 text-sm sm:text-base leading-relaxed font-bold bg-white/50 backdrop-blur-sm inline-block px-4 py-2 rounded-xl border border-white">
                    Eat more. Pay less. Discover the best buffet deals near you.
                  </p>
                </div>

                {/* Right: Bookings Button */}
                <div className="flex flex-col items-end w-full md:w-auto">
                  <div className="flex items-center gap-4 w-full justify-between md:justify-end">
                    {/* Bookings Button */}
                    <div className="flex flex-col items-end">
                      <button 
                        onClick={() => router.push('/profile?tab=bookings')}
                        className="flex items-center justify-center gap-2.5 px-6 py-3 bg-[#FFF5F2] text-[#D97706] border border-[#FDE68A] rounded-full text-sm font-bold hover:bg-[#F59E0B] hover:text-white hover:border-[#F59E0B] transition-all shadow-md cursor-pointer group"
                      >
                        <Calendar className="w-4 h-4 text-[#D97706] group-hover:text-white transition-colors" />
                        <span>Bookings</span>
                      </button>
                      <span className="text-[11px] text-gray-500 font-bold mt-2 bg-white/50 backdrop-blur-sm px-2 py-0.5 rounded-full">Manage your buffet bookings</span>
                    </div>
                  </div>
                </div>

              </div>
            </motion.section>
          )}
        </AnimatePresence>


        {/* ------------------ 4. LOCATION + FILTER BAR ------------------ */}
        <section className="mb-4 relative z-40">
          <div className="bg-white rounded-2xl p-2 sm:p-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-wrap items-center justify-between gap-2.5 relative">
            
            {/* Full-screen overlay to close dropdowns when clicking outside */}
            {(isCityOpen || isAreaOpen) && (
              <div 
                className="fixed inset-0 z-[90]" 
                onClick={() => { setIsCityOpen(false); setIsAreaOpen(false); }}
              ></div>
            )}

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto relative z-[95]">
              
              {/* Custom City Selector */}
              <div className="relative inline-flex items-center shrink-0">
                <button 
                  onClick={() => { setIsCityOpen(!isCityOpen); setIsAreaOpen(false); }}
                  className={`flex items-center justify-between gap-2 pl-3 pr-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-800 rounded-xl text-xs sm:text-sm font-bold transition-all border ${isCityOpen ? 'border-emerald-500 shadow-sm ring-2 ring-emerald-500/20' : 'border-gray-200'} outline-none cursor-pointer w-36`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Building2 className="w-4 h-4 text-[#0A4242] shrink-0" />
                    <span className="truncate">{filters.city}</span>
                  </div>
                  <span className={`text-gray-400 text-xs transition-transform duration-200 ${isCityOpen ? 'rotate-180' : ''}`}>▾</span>
                </button>

                <AnimatePresence>
                  {isCityOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] overflow-hidden py-2 max-h-64 overflow-y-auto z-[100] hide-scrollbar"
                    >
                      <button
                        onClick={() => { setFilters(prev => ({ ...prev, city: 'All Cities', area: 'All Areas' })); setIsCityOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm font-bold transition-colors hover:bg-gray-50 ${filters.city === 'All Cities' ? 'text-emerald-600 bg-emerald-50' : 'text-gray-700'}`}
                      >
                        All Cities
                      </button>
                      {availableCities.map(c => (
                        <button
                          key={c}
                          onClick={() => { setFilters(prev => ({ ...prev, city: c, area: 'All Areas' })); setIsCityOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 text-sm font-bold transition-colors hover:bg-gray-50 ${filters.city === c ? 'text-emerald-600 bg-emerald-50' : 'text-gray-700'}`}
                        >
                          {c}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Custom Area Selector */}
              <div className="relative inline-flex items-center shrink-0">
                <button 
                  onClick={() => { setIsAreaOpen(!isAreaOpen); setIsCityOpen(false); }}
                  className={`flex items-center justify-between gap-2 pl-3 pr-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-800 rounded-xl text-xs sm:text-sm font-bold transition-all border ${isAreaOpen ? 'border-emerald-500 shadow-sm ring-2 ring-emerald-500/20' : 'border-gray-200'} outline-none cursor-pointer w-40`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">{filters.area}</span>
                  </div>
                  <span className={`text-gray-400 text-xs transition-transform duration-200 ${isAreaOpen ? 'rotate-180' : ''}`}>▾</span>
                </button>

                <AnimatePresence>
                  {isAreaOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] overflow-hidden py-2 max-h-64 overflow-y-auto z-[100] hide-scrollbar"
                    >
                      <button
                        onClick={() => { setFilters(prev => ({ ...prev, area: 'All Areas' })); setIsAreaOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm font-bold transition-colors hover:bg-gray-50 ${filters.area === 'All Areas' ? 'text-emerald-600 bg-emerald-50' : 'text-gray-700'}`}
                      >
                        All Areas
                      </button>
                      {availableAreas.length === 0 && (
                        <div className="px-4 py-2 text-xs text-gray-400 font-medium">Select a city first</div>
                      )}
                      {availableAreas.map(a => (
                        <button
                          key={a}
                          onClick={() => { setFilters(prev => ({ ...prev, area: a })); setIsAreaOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 text-sm font-bold transition-colors hover:bg-gray-50 ${filters.area === a ? 'text-emerald-600 bg-emerald-50' : 'text-gray-700'}`}
                        >
                          {a}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Veg Button */}
              <button 
                onClick={() => setFilters({ ...filters, foodType: filters.foodType === 'veg' ? 'all' : 'veg' })}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all border cursor-pointer ${
                  filters.foodType === 'veg' 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs' 
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                }`}
              >
                <span>🥦</span> Veg
              </button>

              {/* Non-Veg Button */}
              <button 
                onClick={() => setFilters({ ...filters, foodType: filters.foodType === 'nonveg' ? 'all' : 'nonveg' })}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all border cursor-pointer ${
                  filters.foodType === 'nonveg' 
                    ? 'bg-rose-50 text-rose-800 border-rose-300 shadow-2xs' 
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                }`}
              >
                <span>🍗</span> Non-Veg
              </button>

              {/* More Filters Toggle Button */}
              <button
                onClick={() => setShowMoreFilters(!showMoreFilters)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all border cursor-pointer ${
                  showMoreFilters || filters.maxPrice < 1000 || filters.minRating > 0
                    ? 'bg-purple-50 text-purple-800 border-purple-300'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4 text-purple-600" />
                <span>More Filters</span>
              </button>
            </div>

            {/* Right Side Controls (Reset & Bookings when collapsed) */}
            <div className="flex items-center gap-2.5 ml-auto relative z-30">
              {/* Show Bookings Button when Banner is Collapsed */}
              {isBannerCollapsed && (
                <button 
                  onClick={() => router.push('/profile?tab=bookings')}
                  className="flex items-center justify-center gap-2 px-3.5 py-1.5 bg-[#FFF5F2] text-[#D97706] border border-[#FDE68A] rounded-xl text-xs sm:text-sm font-bold hover:bg-[#F59E0B] hover:text-white transition-all shadow-xs cursor-pointer group"
                >
                  <Calendar className="w-4 h-4 text-[#D97706] group-hover:text-white transition-colors" />
                  <span>Bookings</span>
                </button>
              )}

              {/* Reset Button */}
              {(filters.city !== 'All Cities' || filters.area !== 'All Areas' || filters.foodType !== 'all' || filters.maxPrice < 1000 || filters.minRating > 0) && (
                <button 
                  onClick={handleClearFilters}
                  className="text-xs font-bold text-gray-500 hover:text-gray-900 underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>

          </div>

          {/* More Filters Expandable Panel */}
          <AnimatePresence>
            {showMoreFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-3 bg-white rounded-2xl p-5 shadow-lg border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-gray-700">Max Price: ₹{filters.maxPrice}/person</label>
                    <span className="text-xs text-gray-400">Up to ₹1000</span>
                  </div>
                  <input 
                    type="range" 
                    min="200" 
                    max="1000" 
                    step="50"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                    className="w-full accent-[var(--color-brand-primary)] cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 mb-2 block">Minimum Rating</label>
                  <div className="flex items-center gap-2">
                    {[0, 3.5, 4.0, 4.5].map((r) => (
                      <button
                        key={r}
                        onClick={() => setFilters({ ...filters, minRating: r })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                          filters.minRating === r 
                            ? 'bg-[#0A4242] text-white border-[#0A4242]' 
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {r === 0 ? 'Any' : `${r}★+`}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>


        {/* ------------------ 5. EMPTY STATE & BUFFET GRID ------------------ */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-500 bg-white rounded-3xl border border-gray-100 shadow-2xs">
            <Loader2 className="w-10 h-10 animate-spin text-[#0A4242] mb-4" />
            <p className="font-medium text-gray-600">Discovering delicious buffet spreads near you...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-8 rounded-3xl text-center shadow-2xs border border-red-100">
            <p className="font-bold text-lg mb-2">{error}</p>
            <button onClick={fetchBuffets} className="mt-4 px-6 py-2.5 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-colors shadow-sm">
              Try Again
            </button>
          </div>
        ) : buffets.length === 0 ? (
          /* Premium Empty State matching Image 1 mockup */
          <motion.section 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 sm:p-14 text-center border border-gray-100 shadow-sm max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 mb-16"
          >
            {/* Cloche / Search Illustration Graphic */}
            <div className="relative shrink-0">
              <div className="w-36 h-36 rounded-full bg-purple-50 flex items-center justify-center relative">
                {/* 3D Purple Cloche Dish */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-400 shadow-lg flex items-center justify-center text-white relative">
                  <span className="text-5xl">🍲</span>
                </div>
                {/* Floating Search Icon Badge */}
                <div className="absolute top-1 left-1 bg-white p-2.5 rounded-full shadow-md border border-gray-100">
                  <Search className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Empty State Text & Buttons */}
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-black text-gray-900 mb-2 flex items-center justify-center md:justify-start gap-2">
                No buffets found <span>😟</span>
              </h2>
              <p className="text-gray-500 text-sm sm:text-base max-w-md mb-6 leading-relaxed">
                We couldn't find any buffets matching your current filters. Try changing your location or food preferences.
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <button 
                  onClick={handleClearFilters}
                  className="px-6 py-3 bg-[#0A4242] text-white rounded-full font-bold text-sm shadow-md hover:bg-opacity-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Clear all filters</span>
                </button>
                <button 
                  onClick={() => setFilters(prev => ({ ...prev, city: 'All Cities', area: 'All Areas' }))}
                  className="px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-full font-bold text-sm hover:bg-gray-50 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Browse all areas</span>
                </button>
              </div>
            </div>
          </motion.section>
        ) : (
          /* ------------------ 6. BUFFET DISCOVERY GRID ------------------ */
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                Available Buffets Near You ({buffets.length})
              </h2>
              <span className="text-xs text-gray-400 font-medium">Updated live</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {buffets.map((buffet, index) => (
                <BuffetCard key={buffet._id || index} buffet={buffet} index={index} />
              ))}
            </div>
          </section>
        )}


        {/* ------------------ 10. FOOD VISUAL SECTION ------------------ */}
        <section className="mb-16 bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Image Side */}
            <div className="lg:col-span-6 relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-lg border border-gray-100 group">
              <img 
                src="/assets/images/buffet-hero-spread.png" 
                alt="Luxury Buffet Counter Spread" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="bg-amber-500 text-white font-black text-[10px] uppercase px-2.5 py-1 rounded-full tracking-wider mb-1.5 inline-block">
                  Unlimited Feast
                </span>
                <p className="font-bold text-sm sm:text-base text-white/90">Premium Multi-Cuisine Spreads</p>
              </div>
            </div>

            {/* Text Side */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2 block">PG-FRIENDLY DINING</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-4">
                Good Food. Great Value.<br />Zero Hassle.
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6 font-medium">
                From quick weekday meals to weekend food plans, discover buffet options that fit your budget and your appetite. Compare prices, check menus, and reserve tables effortlessly.
              </p>

              <div className="flex flex-wrap gap-4 items-center">
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="px-6 py-3 bg-[#0A4242] text-white rounded-full font-bold text-sm shadow-md hover:bg-opacity-90 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore Buffets</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <Link 
                  href="/deals"
                  className="px-6 py-3 bg-gray-100 text-gray-800 rounded-full font-bold text-sm hover:bg-gray-200 transition-all"
                >
                  View Food Deals
                </Link>
              </div>
            </div>

          </div>
        </section>


        {/* ------------------ 9. WHY PGINFO BUFFETS? ------------------ */}
        <section className="mb-16">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">Why PGInfo Buffets?</h2>
            <p className="text-gray-500 text-sm font-medium">Tailored dining experiences designed specifically for students and young professionals.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <MapPin className="w-6 h-6 text-emerald-600" />,
                title: "Discover Nearby",
                desc: "Find buffet options right around your PG, college, or office workplace."
              },
              {
                icon: <Tag className="w-6 h-6 text-amber-500" />,
                title: "Compare Prices",
                desc: "Easily compare unlimited spread prices, veg/non-veg options, and discounts."
              },
              {
                icon: <Utensils className="w-6 h-6 text-purple-600" />,
                title: "Easy Booking",
                desc: "Reserve your preferred dining table in seconds without tedious call waits."
              },
              {
                icon: <Sparkles className="w-6 h-6 text-rose-500" />,
                title: "PG-Friendly Deals",
                desc: "Exclusive student discounts and group buffet offers created for PG tenants."
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-1.5">{item.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>


        {/* ------------------ 11. YOU MIGHT ALSO LIKE (Matches Image 1) ------------------ */}
        <section className="mb-16">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
              You might also like
              <Sparkles className="w-5 h-5 text-purple-600" />
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm font-medium mt-0.5">Explore popular dining options near you</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Deals & Offers */}
            <div className="bg-[#F4F0FF] rounded-3xl p-5 border border-purple-100 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold">
                  <Utensils className="w-5 h-5" />
                </div>
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-xs relative">
                  <img src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=300&q=80" alt="Deals" className="w-full h-full object-cover" />
                </div>
              </div>
              <div>
                <h3 className="font-black text-gray-900 text-base mb-1">Deals & Offers</h3>
                <p className="text-gray-500 text-xs mb-4">Exciting offers on food at top restaurants</p>
                <Link href="/deals" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-purple-600 shadow-xs hover:scale-110 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Card 2: Top Restaurants */}
            <div className="bg-teal-50/70 rounded-3xl p-5 border border-teal-100 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold">
                  <span>🛎️</span>
                </div>
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-xs relative">
                  <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80" alt="Restaurants" className="w-full h-full object-cover" />
                </div>
              </div>
              <div>
                <h3 className="font-black text-gray-900 text-base mb-1">Top Restaurants</h3>
                <p className="text-gray-500 text-xs mb-4">Discover top-rated restaurants near you</p>
                <Link href="/explore" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-teal-700 shadow-xs hover:scale-110 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Card 3: Trending Buffets */}
            <div className="bg-[#ECFDF5] rounded-3xl p-5 border border-emerald-100 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-xs relative">
                  <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80" alt="Trending" className="w-full h-full object-cover" />
                </div>
              </div>
              <div>
                <h3 className="font-black text-gray-900 text-base mb-1">Trending Buffets</h3>
                <p className="text-gray-500 text-xs mb-4">Most loved buffets by students</p>
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-emerald-600 shadow-xs hover:scale-110 transition-transform cursor-pointer">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Card 4: Cafes & More */}
            <div className="bg-[#FDF2F8] rounded-3xl p-5 border border-pink-100 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-2xl bg-pink-600 text-white flex items-center justify-center font-bold">
                  <Coffee className="w-5 h-5" />
                </div>
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-xs relative">
                  <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=300&q=80" alt="Cafes" className="w-full h-full object-cover" />
                </div>
              </div>
              <div>
                <h3 className="font-black text-gray-900 text-base mb-1">Cafes & More</h3>
                <p className="text-gray-500 text-xs mb-4">Cafes, snacks and beverages</p>
                <Link href="/deals" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-pink-600 shadow-xs hover:scale-110 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </section>


        {/* ------------------ 12. NEWSLETTER / COMMUNITY CTA ------------------ */}
        <section className="bg-[#052828] rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center gap-4 text-center lg:text-left">
              <div className="w-12 h-12 rounded-full bg-[#0E4242] flex items-center justify-center shrink-0 border border-emerald-800">
                <Mail className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white mb-1">Don't miss exclusive buffet offers!</h3>
                <p className="text-gray-300 text-xs sm:text-sm font-medium">Subscribe now and get the best buffet deals delivered to your inbox.</p>
              </div>
            </div>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
              {subSuccess ? (
                <div className="bg-emerald-600/30 text-emerald-300 px-6 py-3 rounded-xl border border-emerald-500/40 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Subscribed successfully!
                </div>
              ) : (
                <>
                  <input 
                    type="email" 
                    required
                    value={emailSub}
                    onChange={(e) => setEmailSub(e.target.value)}
                    placeholder="Enter your email" 
                    className="w-full sm:w-72 px-4 py-3 bg-[#0A1A1A] border border-gray-700/80 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <button 
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 bg-[#008080] hover:bg-teal-600 text-white text-sm font-bold rounded-xl transition-colors shadow-md cursor-pointer shrink-0"
                  >
                    Subscribe
                  </button>
                </>
              )}
            </form>

          </div>
        </section>

      </main>

      {/* ------------------ 13. FOOTER ------------------ */}
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

