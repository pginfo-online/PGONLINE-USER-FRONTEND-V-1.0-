"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Filter, X, ChevronDown, Check, AlertCircle, ChevronLeft, ChevronRight, Navigation, ShieldCheck, Share2, Heart, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import AdvancedFilters, { FilterState } from '../../components/AdvancedFilters';

const GENDERS = ["Any", "male", "female"];
const CITIES = ["Pune", "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Kolkata", "Jaipur", "Ahmedabad", "Other"];
const SORT_OPTIONS = [
  { label: "Recommended", value: "popular" },
  { label: "Price: Low to High", value: "rent_asc" },
  { label: "Price: High to Low", value: "rent_desc" }
];

const PGImageCarousel = ({ photos, altText, pgId, onWishlist }: { photos: any[], altText: string, pgId: string, onWishlist: (e: React.MouseEvent, id: string) => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = photos?.length > 0 ? photos : [{ url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop" }];

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <img 
        src={images[currentIndex]?.url} 
        alt={altText}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      />
      {images.length > 1 && (
        <>
          <button 
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md z-10 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5 text-gray-800" />
          </button>
          <button 
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md z-10 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-5 h-5 text-gray-800" />
          </button>
        </>
      )}
      
      <button 
        onClick={(e) => onWishlist(e, pgId)}
        className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md z-20 hover:scale-110 transition-transform"
      >
        <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
      </button>
      
      {/* Carousel Indicator Dots */}
      <div className="absolute bottom-2.5 left-0 right-0 flex justify-center gap-1.5 z-10">
        {images.slice(0, 5).map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all ${i === currentIndex ? 'w-3.5 bg-white' : 'w-1.5 bg-white/60'}`}></div>
        ))}
      </div>
    </>
  );
};

export default function ExplorePage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/');
    }
  }, [user, isAuthLoading, router]);

  // Geolocation States
  const [locationStatus, setLocationStatus] = useState<'idle' | 'detecting' | 'resolved'>('idle');
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);

  const [pgs, setPgs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Pagination States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Pune");
  const [selectedGender, setSelectedGender] = useState("Any");
  const [sortBy, setSortBy] = useState("popular");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<FilterState>({
    minRent: '', maxRent: '', sharingType: '', gender: '',
    ac: false, foodIncluded: false, isVerified: false, amenities: [],
    foodOption: 'none'
  });

  const handleShare = async (e: React.MouseEvent, pg: any) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/explore/${pg._id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: pg.name,
          text: `Check out ${pg.name} on PGOnline!`,
          url: url,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const handleWishlist = async (e: React.MouseEvent, pgId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login to save to wishlist");
      return;
    }

    try {
      const res = await fetch('https://pgonline-backend-v-1-0.onrender.com/api/v1/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          pgId: pgId,
          pg: pgId,
          type: 'wishlist'
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message || "Saved to Wishlist!");
      } else {
        alert(data.message || "Could not update wishlist.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving to wishlist.");
    }
  };

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const limit = 12;

  // Handle Initial Location Detection
  useEffect(() => {
    if (locationStatus !== 'idle') return;
    setLocationStatus('detecting');

    if (!navigator.geolocation) {
      setLocationStatus('resolved');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLat(position.coords.latitude);
        setUserLng(position.coords.longitude);
        setLocationStatus('resolved');
      },
      (error) => {
        console.warn("Geolocation error/denied:", error);
        setLocationStatus('resolved'); // Proceed without location
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }, [locationStatus]);


  // Handle API Fetching
  useEffect(() => {
    if (locationStatus !== 'resolved') return; // Wait for location to resolve

    const fetchPGs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://pgonline-backend-v-1-0.onrender.com/api/v1";
        
        // Build Query Params
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        
        if (searchQuery.trim()) {
          params.append("q", searchQuery.trim());
        }
        if (selectedCity !== "Other" && userLat === null) {
          // Only apply city filter if we aren't using live geolocation
          params.append("city", selectedCity);
        }
        if (selectedGender !== "Any") {
          params.append("gender", selectedGender);
        }

        // Advanced Filters
        if (advancedFilters.minRent) params.append("minRent", advancedFilters.minRent);
        if (advancedFilters.maxRent) params.append("maxRent", advancedFilters.maxRent);
        if (advancedFilters.sharingType) params.append("sharingType", advancedFilters.sharingType);
        if (advancedFilters.gender) params.append("gender", advancedFilters.gender);
        if (advancedFilters.ac) params.append("ac", "true");
        if (advancedFilters.isVerified) params.append("isVerified", "true");
        if (advancedFilters.foodOption && advancedFilters.foodOption !== 'none') {
          params.append("food", advancedFilters.foodOption);
        }

        // Sort parameter
        if (sortBy === 'distance' && userLat === null) {
          params.append("sort", "popular");
        } else {
          params.append("sort", sortBy);
        }

        // Add Live Location if available
        if (userLat !== null && userLng !== null) {
          params.append("lat", userLat.toString());
          params.append("lng", userLng.toString());
          params.append("radius", "15"); // Search within 15km
        }

        const response = await fetch(`${apiUrl}/pg?${params.toString()}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Error Response:", response.status, errorText);
          throw new Error(`API Error ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        setPgs(result.data || []);
        if (result.pagination) {
          setTotalPages(result.pagination.totalPages || 1);
        }
      } catch (err: any) {
        console.error("Error fetching PGs:", err);
        setError(err.message || "Failed to load PGs. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchPGs();
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCity, selectedGender, sortBy, page, locationStatus, userLat, userLng, advancedFilters]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCity, selectedGender, sortBy, userLat, userLng, advancedFilters]);


  // Helper to format gender label
  const formatGender = (gender: string) => {
    if (!gender) return "Co-ed";
    if (gender.toLowerCase() === 'male') return "Boys";
    if (gender.toLowerCase() === 'female') return "Girls";
    return "Co-ed";
  };

  // Helper to get minimum rent
  const getMinRent = (pg: any) => {
    const validRents: number[] = [];
    
    // Check roomConfigs array
    if (pg.roomConfigs && Array.isArray(pg.roomConfigs)) {
      pg.roomConfigs.forEach((config: any) => {
        const r = Number(config.rent);
        if (!isNaN(r) && r > 0) validRents.push(r);
      });
    }
    
    // Check legacy rent object
    if (pg.rent?.single) {
      const r = Number(pg.rent.single);
      if (!isNaN(r) && r > 0) validRents.push(r);
    }
    if (pg.rent?.double) {
      const r = Number(pg.rent.double);
      if (!isNaN(r) && r > 0) validRents.push(r);
    }
    if (pg.rent?.triple) {
      const r = Number(pg.rent.triple);
      if (!isNaN(r) && r > 0) validRents.push(r);
    }
    
    // Check monthly pricing
    if (pg.monthlyPricing) {
      const r = Number(pg.monthlyPricing);
      if (!isNaN(r) && r > 0) validRents.push(r);
    }
    
    if (validRents.length > 0) {
      return Math.min(...validRents);
    }
    return null;
  };

  // Pagination Handlers
  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };
  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  if (isAuthLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[var(--color-brand-primary)] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 font-medium">Authenticating...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      
      <main className="flex-1 w-full bg-slate-50 min-h-screen flex flex-col pt-[65px]">
        {/* City Filter Bar */}
        <div className="bg-white border-b border-gray-200 sticky top-[65px] z-40 shadow-sm py-3 px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1400px] mx-auto flex items-center gap-4">
            <div className="flex-1 overflow-x-auto scrollbar-hide flex items-center gap-2 py-1">
              {CITIES.map(city => (
                <button
                  key={city}
                  onClick={() => {
                    setSelectedCity(city);
                    if (userLat !== null) {
                      setUserLat(null);
                      setUserLng(null);
                    }
                  }}
                  className={`shrink-0 px-4 py-1 rounded-full text-xs font-bold transition-all border-2 ${
                    selectedCity === city && userLat === null
                      ? "bg-[var(--color-brand-primary)] text-white border-[var(--color-brand-primary)] shadow-md shadow-[var(--color-brand-primary)]/20"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>

            {/* Advanced Filters Button */}
            <div className="shrink-0">
              <button 
                onClick={() => setIsAdvancedFiltersOpen(true)}
                className="flex items-center gap-1.5 px-4 py-1 rounded-full bg-white border-2 border-gray-200 text-gray-700 hover:border-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)] text-xs font-bold transition-all shadow-sm"
              >
                <Filter className="w-4 h-4" />
                Advanced Filters
                {/* Show indicator if any advanced filter is active */}
                {(advancedFilters.minRent || advancedFilters.maxRent || advancedFilters.sharingType || advancedFilters.gender || advancedFilters.ac || advancedFilters.foodIncluded || advancedFilters.isVerified || advancedFilters.foodOption || advancedFilters.amenities.length > 0) && (
                  <span className="w-2 h-2 rounded-full bg-[var(--color-brand-primary)] ml-1 shadow-[0_0_8px_var(--color-brand-primary)]"></span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Drawer Component */}
        <AdvancedFilters 
          isOpen={isAdvancedFiltersOpen}
          onClose={() => setIsAdvancedFiltersOpen(false)}
          initialFilters={advancedFilters}
          onApply={(filters) => {
            setAdvancedFilters(filters);
            setPage(1);
          }}
        />

        {locationStatus === 'detecting' ? (
          <div className="flex-1 flex flex-col items-center justify-center py-32 bg-slate-50 px-4">
            <div className="w-20 h-20 rounded-full bg-[var(--color-brand-primary)]/10 flex items-center justify-center mb-6 animate-pulse">
              <Navigation className="w-10 h-10 text-[var(--color-brand-primary)]" />
            </div>
            <h2 className="text-2xl font-serif text-gray-900 mb-3 text-center">Detecting your location...</h2>
            <p className="text-gray-500 max-w-md text-center text-sm">
              We're waiting for location permissions to show you the best PG accommodations exactly where you are.
            </p>
          </div>
        ) : (
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex flex-col lg:flex-row gap-8 w-full">
            
            {/* Sidebar Filters */}
            <aside className={`w-full lg:w-1/4 shrink-0 transition-all duration-300 ${isSidebarOpen ? 'block' : 'hidden'}`}>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:sticky lg:top-[145px] max-h-[calc(100vh-160px)] overflow-y-auto scrollbar-hide">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-serif text-gray-900 flex items-center gap-2">
                    <Filter className="w-5 h-5 text-[var(--color-brand-primary)]" /> 
                    Filters
                  </h2>
                  <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="hidden lg:flex items-center justify-center p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors border border-gray-200 cursor-pointer"
                    title="Collapse Sidebar"
                  >
                    <PanelLeftClose className="w-5 h-5" />
                  </button>
                </div>

                {/* Location Badge */}
                {userLat !== null && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 bg-blue-50 border border-blue-100 rounded-xl p-4 flex flex-col gap-2"
                  >
                    <div className="flex items-center gap-2 text-blue-800 font-medium text-sm">
                      <Navigation className="w-4 h-4 fill-blue-800" />
                      Showing PGs near you
                    </div>
                    <button 
                      onClick={() => { setUserLat(null); setUserLng(null); }}
                      className="text-xs text-blue-600 hover:text-blue-800 underline text-left"
                    >
                      Clear location filter
                    </button>
                  </motion.div>
                )}

                {/* Search */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold text-gray-900">Search Location</label>
                    <button 
                      onClick={() => {
                        if (navigator.geolocation) {
                          setLocationStatus('detecting');
                          navigator.geolocation.getCurrentPosition(
                            (position) => {
                              setUserLat(position.coords.latitude);
                              setUserLng(position.coords.longitude);
                              setLocationStatus('resolved');
                              setSelectedCity("Other"); // Reset city filter so nearby takes precedence
                              setSortBy("distance"); // Auto sort by distance
                            },
                            (error) => {
                              console.warn("Geolocation error/denied:", error);
                              setLocationStatus('resolved');
                              alert("Please enable location permissions in your browser to use this feature.");
                            },
                            { timeout: 10000, maximumAge: 60000 }
                          );
                        }
                      }}
                      className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-100/50 shadow-sm transition-all bg-white"
                      title="Find PGs near my current location"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      Near Me
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl bg-gray-50 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent text-sm transition-all"
                      placeholder="Locality, city, or PG name"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery("")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Gender */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Gender Preference</label>
                  <div className="flex flex-col gap-2">
                    {GENDERS.map((gender) => (
                      <button
                        key={gender}
                        onClick={() => setSelectedGender(gender)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all capitalize border ${
                          selectedGender === gender 
                            ? "bg-slate-50 border-[var(--color-brand-primary)] text-[var(--color-brand-primary)] shadow-sm" 
                            : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <span>{gender === 'male' ? 'Boys' : gender === 'female' ? 'Girls' : 'Any'}</span>
                        {selectedGender === gender && (
                          <div className="w-5 h-5 rounded-full bg-[var(--color-brand-primary)] flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget Range */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Budget Range (₹/mo)</label>
                  <div className="pt-2">
                    {/* Interactive Dual-Range Slider */}
                    <div className="relative h-1.5 bg-gray-100 rounded-full mb-3 mt-4">
                      {/* Active Track */}
                      <div 
                        className="absolute top-0 bottom-0 bg-[var(--color-brand-primary)] rounded-full"
                        style={{
                          left: `${(Number(advancedFilters.minRent || 0) / 20000) * 100}%`,
                          right: `${100 - (Number(advancedFilters.maxRent || 20000) / 20000) * 100}%`
                        }}
                      ></div>
                      
                      {/* Min Range Input */}
                      <input
                        type="range"
                        min="0"
                        max="20000"
                        step="500"
                        value={advancedFilters.minRent || 0}
                        onChange={(e) => {
                          const val = Math.min(Number(e.target.value), Number(advancedFilters.maxRent || 20000) - 500);
                          setAdvancedFilters({...advancedFilters, minRent: val.toString()});
                        }}
                        className="absolute w-full top-1/2 -translate-y-1/2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[var(--color-brand-primary)] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer z-10"
                      />
                      
                      {/* Max Range Input */}
                      <input
                        type="range"
                        min="0"
                        max="20000"
                        step="500"
                        value={advancedFilters.maxRent || 20000}
                        onChange={(e) => {
                          const val = Math.max(Number(e.target.value), Number(advancedFilters.minRent || 0) + 500);
                          setAdvancedFilters({...advancedFilters, maxRent: val.toString()});
                        }}
                        className="absolute w-full top-1/2 -translate-y-1/2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[var(--color-brand-primary)] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer z-20"
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold text-gray-900 mb-3">
                      <span>₹0</span>
                      <span>₹20,000+</span>
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        placeholder="Min" 
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none" 
                        value={advancedFilters.minRent} 
                        onChange={(e) => setAdvancedFilters({...advancedFilters, minRent: e.target.value})} 
                      />
                      <input 
                        type="number" 
                        placeholder="Max" 
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:border-transparent outline-none" 
                        value={advancedFilters.maxRent} 
                        onChange={(e) => setAdvancedFilters({...advancedFilters, maxRent: e.target.value})} 
                      />
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-semibold text-gray-900">Amenities</label>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="flex flex-col gap-3">
                    {['WiFi', 'AC Available', 'Food Facility', 'Laundry', 'Housekeeping', 'Power Backup', 'RO Water', 'Parking'].map(amenity => (
                      <label key={amenity} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${advancedFilters.amenities.includes(amenity) ? 'bg-[var(--color-brand-primary)] border-[var(--color-brand-primary)]' : 'border-gray-300 group-hover:border-[var(--color-brand-primary)]'}`}>
                          {advancedFilters.amenities.includes(amenity) && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-sm text-gray-700">{amenity}</span>
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={advancedFilters.amenities.includes(amenity)}
                          onChange={() => {
                            setAdvancedFilters(prev => ({
                              ...prev,
                              amenities: prev.amenities.includes(amenity)
                                ? prev.amenities.filter(a => a !== amenity)
                                : [...prev.amenities, amenity]
                            }))
                          }}
                        />
                      </label>
                    ))}
                  </div>
                </div>




                {/* Promo Box */}
                <div className="bg-[#f8f9ff] rounded-2xl p-5 border border-blue-100/50">
                  <h3 className="font-semibold text-gray-900 mb-2">Looking for something specific?</h3>
                  <p className="text-xs text-gray-500 mb-5 leading-relaxed">Let us help you find the perfect PG that matches your preferences.</p>
                  <button className="flex items-center justify-center gap-2 w-full text-[var(--color-brand-primary)] bg-white border border-slate-100 font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    Request Callback
                  </button>
                </div>

              </div>
            </aside>

            {/* Main Content Area */}
            <section className="flex-1 min-w-0">
              {isLoading ? (
                <div className={`grid grid-cols-1 ${isSidebarOpen ? 'md:grid-cols-2 xl:grid-cols-3' : 'sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'} gap-6`}>
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="animate-pulse bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-[400px]">
                      <div className="bg-gray-200 h-48 sm:h-56 w-full"></div>
                      <div className="p-5 flex flex-col flex-1">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="flex gap-2 mb-4 mt-2">
                          <div className="h-5 bg-gray-200 rounded w-16"></div>
                          <div className="h-5 bg-gray-200 rounded w-16"></div>
                        </div>
                        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                          <div className="h-10 bg-gray-200 rounded-xl w-24"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-red-100 h-full flex flex-col items-center justify-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Failed to load PGs</h3>
                  <p className="text-gray-500">{error}</p>
                </div>
              ) : pgs.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col items-center justify-center px-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No PGs found {selectedCity !== 'Other' ? `in ${selectedCity}` : ''}</h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6 text-sm leading-relaxed">
                    {searchQuery ? (
                      <>We couldn't find <strong>"{searchQuery}"</strong> in {selectedCity !== 'Other' ? selectedCity : 'this location'}. It might be located in a different city. Try selecting another city or changing your filters.</>
                    ) : (
                      "We couldn't find any properties matching your current filters or location."
                    )}
                  </p>
                  <button 
                    onClick={() => { setSearchQuery(""); setSelectedGender("Any"); setSortBy("popular"); setUserLat(null); setUserLng(null); }}
                    className="px-6 py-2 bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] font-medium rounded-full hover:bg-[var(--color-brand-primary)]/20 transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <>
                  {/* Result Header */}
                  <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {!isSidebarOpen && (
                        <button 
                          onClick={() => setIsSidebarOpen(true)}
                          className="hidden lg:flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 shadow-sm rounded-xl text-xs font-bold text-[var(--color-brand-primary)] hover:bg-gray-50 hover:border-[var(--color-brand-primary)]/40 transition-all cursor-pointer shrink-0"
                          title="Expand Filters Sidebar"
                        >
                          <PanelLeftOpen className="w-4 h-4 text-[var(--color-brand-primary)]" />
                          <span>Show Filters</span>
                        </button>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">
                          Showing {(page - 1) * limit + 1}–{Math.min(page * limit, (page - 1) * limit + pgs.length)} PGs in {selectedCity}
                        </p>
                        {userLat !== null && (
                          <p className="text-xs text-blue-600 font-medium mt-1">Sorted by nearest to you (15km radius)</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {/* Sort Dropdown (Desktop Right) */}
                      <div className="hidden lg:flex items-center gap-2">
                        <span className="text-sm text-gray-600">Sort by</span>
                        <div className="relative">
                          <button 
                            onClick={() => setIsSortOpen(!isSortOpen)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                          >
                            {SORT_OPTIONS.find(o => o.value === sortBy)?.label}
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isSortOpen ? "rotate-180" : ""}`} />
                          </button>
                          
                          <AnimatePresence>
                            {isSortOpen && (
                              <motion.div 
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="absolute right-0 mt-1 w-48 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-hidden z-50 border border-gray-100"
                              >
                                <div className="py-1">
                                  {SORT_OPTIONS.map((option) => (
                                    <button
                                      key={option.value}
                                      onClick={() => {
                                        setSortBy(option.value);
                                        setIsSortOpen(false);
                                      }}
                                      className={`flex items-center justify-between w-full text-left px-4 py-2.5 text-sm ${
                                        sortBy === option.value ? "bg-[var(--color-brand-primary)]/5 text-[var(--color-brand-primary)] font-medium" : "text-gray-700 hover:bg-gray-50"
                                      }`}
                                    >
                                      {option.label}
                                      {sortBy === option.value && <Check className="w-4 h-4" />}
                                    </button>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      
                      {/* View Toggles */}
                      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
                        <button 
                          onClick={() => setViewMode('grid')}
                          className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                        </button>
                        <button 
                          onClick={() => setViewMode('list')}
                          className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Grid / List */}
                  <div className={viewMode === 'grid' ? `grid grid-cols-1 ${isSidebarOpen ? 'md:grid-cols-2 xl:grid-cols-3' : 'sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'} gap-6` : "flex flex-col gap-6"}>
                    {pgs.map((pg, idx) => {
                      if (viewMode === 'grid') {
                        return (
                          <motion.div
                            key={pg._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => router.push(`/explore/${pg._id}`)}
                            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col cursor-pointer"
                          >
                            <div className="relative overflow-hidden bg-gray-100 shrink-0 h-48 sm:h-52 w-full">
                              {idx === 0 && (
                                <div className="absolute top-3 left-3 bg-[var(--color-brand-primary)] text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider z-10">
                                  FEATURED
                                </div>
                              )}
                              <PGImageCarousel photos={pg.photos} altText={pg.name} pgId={pg._id} onWishlist={handleWishlist} />
                            </div>
                            
                            <div className="p-5 flex flex-col flex-1 gap-4">
                              <div className="flex-1 flex flex-col">
                                <div className="mb-3">
                                  <div className="flex items-start justify-between gap-2 mb-1.5">
                                    <h3 className="font-serif text-lg text-gray-900 leading-tight group-hover:text-[var(--color-brand-primary)] transition-colors line-clamp-1">{pg.name}</h3>
                                    <button 
                                      onClick={(e) => handleShare(e, pg)}
                                      className="text-gray-400 hover:text-[var(--color-brand-primary)] transition-colors p-1"
                                      title="Share this PG"
                                    >
                                      <Share2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                  <p className="text-xs text-gray-500 flex items-center gap-1 line-clamp-1">
                                    <MapPin className="w-3.5 h-3.5 shrink-0" /> {pg.area || 'Unknown Area'}, {pg.city || 'Unknown City'}
                                  </p>
                                  {userLat !== null && pg.distance !== undefined && (
                                    <p className="text-xs text-blue-600 font-semibold mt-1">
                                      {(pg.distance / 1000).toFixed(1)} km away
                                    </p>
                                  )}
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                  <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                                    pg.gender === 'male' ? 'bg-blue-50 text-blue-600' :
                                    pg.gender === 'female' ? 'bg-pink-50 text-pink-600' :
                                    'bg-slate-50 text-[var(--color-brand-primary)]'
                                  }`}>
                                    {formatGender(pg.gender)}
                                  </span>
                                  {pg.ac && (
                                    <span className="text-[10px] font-semibold px-2 py-1 bg-gray-50 text-gray-600 rounded flex items-center gap-1">
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg> AC
                                    </span>
                                  )}
                                  {pg.food && pg.food !== 'none' && (
                                    <span className="text-[10px] font-semibold px-2 py-1 bg-gray-50 text-gray-600 rounded capitalize flex items-center gap-1">
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg> {pg.food} Food
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="mt-auto flex items-end justify-between">
                                <div>
                                  {getMinRent(pg) !== null ? (
                                    <>
                                      <span className="text-[11px] text-gray-500 block mb-0.5 font-medium">Starts from</span>
                                      <span className="text-lg font-bold text-gray-900 leading-none">
                                        ₹{getMinRent(pg)?.toLocaleString('en-IN')}
                                        <span className="text-[11px] text-gray-500 font-normal ml-0.5">/mo</span>
                                      </span>
                                    </>
                                  ) : (
                                    <span className="text-sm font-bold text-gray-500 leading-none mt-4 block">Price on Request</span>
                                  )}
                                </div>
                                <Link 
                                  href={`/explore/${pg._id}`}
                                  className="bg-[var(--color-brand-primary)] hover:bg-opacity-90 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-md shadow-[var(--color-brand-primary)]/20 text-center whitespace-nowrap"
                                >
                                  View Details
                                </Link>
                              </div>
                            </div>
                          </motion.div>
                        );
                      }

                      // --- LIST VIEW NEW DESIGN ---
                      return (
                        <motion.div
                          key={pg._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          onClick={() => router.push(`/explore/${pg._id}`)}
                          className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200 flex flex-col md:flex-row p-3 gap-4 cursor-pointer"
                        >
                          {/* Left: Image Gallery */}
                          <div className="flex flex-col gap-2 shrink-0 w-full md:w-[320px]">
                            {/* Main Image */}
                            <div className="relative h-48 md:h-[220px] rounded-lg overflow-hidden bg-gray-100 group/listimg">
                              <img 
                                src={pg.photos?.[0]?.url || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop"} 
                                alt={pg.name}
                                className="w-full h-full object-cover group-hover/listimg:scale-105 transition-transform duration-500"
                              />
                              <button 
                                onClick={(e) => handleWishlist(e, pg._id)}
                                className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md z-20 hover:scale-110 transition-transform"
                              >
                                <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                              </button>
                            </div>
                            {/* Thumbnails (Only show if multiple photos exist, slice 1 to 3) */}
                            {pg.photos && pg.photos.length > 1 && (
                              <div className="grid grid-cols-3 gap-2">
                                {[1, 2, 3].map(i => {
                                  const photo = pg.photos[i];
                                  if (!photo) return (
                                    <div key={i} className="h-16 bg-gray-50 rounded-md border border-gray-100 flex items-center justify-center">
                                      <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    </div>
                                  );
                                  return (
                                    <div key={i} className="h-16 rounded-md overflow-hidden bg-gray-100 relative group cursor-pointer border border-gray-100 hover:border-gray-300 transition-colors">
                                      <img src={photo.url} alt={`${pg.name} view ${i}`} className="w-full h-full object-cover" />
                                      {i === 3 && pg.photos.length > 4 && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold">
                                          +{pg.photos.length - 4}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {/* Right: Detailed Content */}
                          <div className="flex-1 flex flex-col py-1 pr-2">
                            {/* Header & Share/Heart */}
                            <div className="flex items-start justify-between mb-1">
                              <h3 className="font-bold text-xl text-gray-900 line-clamp-1">{pg.name}</h3>
                              <div className="flex items-center gap-3 text-[var(--color-brand-primary)] ml-2 shrink-0">
                                <button 
                                  onClick={(e) => handleShare(e, pg)}
                                  className="hover:text-slate-800 transition-colors" 
                                  title="Share"
                                >
                                  <Share2 className="w-5 h-5" />
                                </button>
                                <button className="hover:text-slate-800 transition-colors" title="Save">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                </button>
                              </div>
                            </div>
                            
                            {/* Location */}
                            <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-3 line-clamp-1">
                              <MapPin className="w-4 h-4 shrink-0 text-gray-400" /> 
                              {pg.area || 'Unknown Area'}, {pg.city || 'Unknown City'}
                            </p>

                            {/* Pill Highlights */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              <span className="px-3 py-1 bg-[var(--color-brand-primary)] text-white text-[11px] font-semibold rounded-full flex items-center gap-1.5">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4zM3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"></path></svg>
                                Fully Furnished
                              </span>
                              <span className="px-3 py-1 bg-[var(--color-brand-primary)] text-white text-[11px] font-semibold rounded-full flex items-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                                High Security
                              </span>
                              {pg.ac && (
                                <span className="px-3 py-1 bg-[var(--color-brand-primary)] text-white text-[11px] font-semibold rounded-full flex items-center gap-1.5">
                                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path></svg>
                                  WiFi
                                </span>
                              )}
                            </div>

                            {/* Amenities Square Grid */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              <div className="flex flex-col items-center justify-center w-[72px] h-[72px] rounded-lg border border-gray-200 bg-white shadow-sm hover:border-[var(--color-brand-primary)] transition-colors">
                                <svg className="w-6 h-6 text-[var(--color-brand-primary)] mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                <span className="text-[10px] text-gray-700 font-medium capitalize">{formatGender(pg.gender)}</span>
                              </div>
                              <div className="flex flex-col items-center justify-center w-[72px] h-[72px] rounded-lg border border-gray-200 bg-white shadow-sm hover:border-[var(--color-brand-primary)] transition-colors">
                                <svg className="w-6 h-6 text-[var(--color-brand-primary)] mb-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4zM3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"></path></svg>
                                <span className="text-[10px] text-gray-700 font-medium">Furnished</span>
                              </div>
                              <div className="flex flex-col items-center justify-center w-[72px] h-[72px] rounded-lg border border-gray-200 bg-white shadow-sm hover:border-[var(--color-brand-primary)] transition-colors">
                                <svg className="w-6 h-6 text-[var(--color-brand-primary)] mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path></svg>
                                <span className="text-[10px] text-gray-700 font-medium">Parking</span>
                              </div>
                              {pg.ac && (
                                <div className="flex flex-col items-center justify-center w-[72px] h-[72px] rounded-lg border border-gray-200 bg-white shadow-sm hover:border-[var(--color-brand-primary)] transition-colors">
                                  <svg className="w-6 h-6 text-[var(--color-brand-primary)] mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                  <span className="text-[10px] text-gray-700 font-medium">AC</span>
                                </div>
                              )}
                              {pg.food && pg.food !== 'none' && (
                                <div className="flex flex-col items-center justify-center w-[72px] h-[72px] rounded-lg border border-gray-200 bg-white shadow-sm hover:border-[var(--color-brand-primary)] transition-colors">
                                  <svg className="w-6 h-6 text-[var(--color-brand-primary)] mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                                  <span className="text-[10px] text-gray-700 font-medium capitalize">{pg.food} Food</span>
                                </div>
                              )}
                            </div>

                            {/* Detailed Pricing Cards */}
                            <div className="flex flex-wrap gap-3 mb-5">
                              {pg.rent?.single && (
                                <div className="flex-1 min-w-[100px] rounded-lg border border-gray-200 bg-white p-3 text-center shadow-sm hover:shadow-md transition-shadow">
                                  <p className="text-[11px] text-gray-500 mb-1 tracking-wide font-medium">Single</p>
                                  <p className="text-xl font-bold text-gray-900">₹{pg.rent.single}</p>
                                </div>
                              )}
                              {pg.rent?.double && (
                                <div className="flex-1 min-w-[100px] rounded-lg border border-gray-200 bg-white p-3 text-center shadow-sm hover:shadow-md transition-shadow">
                                  <p className="text-[11px] text-gray-500 mb-1 tracking-wide font-medium">Double</p>
                                  <p className="text-xl font-bold text-gray-900">₹{pg.rent.double}</p>
                                </div>
                              )}
                              {pg.rent?.triple && (
                                <div className="flex-1 min-w-[100px] rounded-lg border border-gray-200 bg-white p-3 text-center shadow-sm hover:shadow-md transition-shadow">
                                  <p className="text-[11px] text-gray-500 mb-1 tracking-wide font-medium">Triple</p>
                                  <p className="text-xl font-bold text-gray-900">₹{pg.rent.triple}</p>
                                </div>
                              )}
                              {/* Fallback if no specific rent defined */}
                              {!pg.rent?.single && !pg.rent?.double && !pg.rent?.triple && (
                                <div className="flex-1 min-w-[100px] rounded-lg border border-gray-200 bg-white p-3 text-center shadow-sm hover:shadow-md transition-shadow">
                                  {getMinRent(pg) !== null ? (
                                    <>
                                      <p className="text-[11px] text-gray-500 mb-1 tracking-wide font-medium">Starts From</p>
                                      <p className="text-xl font-bold text-gray-900">₹{getMinRent(pg)?.toLocaleString('en-IN')}</p>
                                    </>
                                  ) : (
                                    <p className="text-sm font-bold text-gray-500 mt-2">Price on Request</p>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Actions (Bottom Buttons) */}
                            <div className="mt-auto flex flex-col sm:flex-row gap-3">
                              <Link 
                                href={`/explore/${pg._id}`}
                                className="flex-1 bg-[var(--color-brand-primary)] hover:bg-opacity-95 text-white font-semibold py-2.5 rounded-lg transition-colors text-center shadow-md text-sm flex items-center justify-center gap-2"
                              >
                                Contact Owner
                              </Link>
                              <Link 
                                href={`/explore/${pg._id}`}
                                className="flex-1 bg-white hover:bg-gray-50 text-[var(--color-brand-primary)] font-semibold py-2.5 rounded-lg border border-[var(--color-brand-primary)] transition-colors text-center shadow-sm text-sm"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="mt-12 flex items-center justify-center gap-2">
                      <button 
                        onClick={handlePrevPage}
                        disabled={page === 1}
                        className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          page === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" /> Prev
                      </button>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum = page;
                        if (totalPages <= 5) pageNum = i + 1;
                        else if (page <= 3) pageNum = i + 1;
                        else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                        else pageNum = page - 2 + i;
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                              page === pageNum 
                                ? "bg-[var(--color-brand-primary)] text-white shadow-md shadow-[var(--color-brand-primary)]/30" 
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      <button 
                        onClick={handleNextPage}
                        disabled={page === totalPages}
                        className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          page === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        Next <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        )}

        {/* Trust Section */}
        {!isLoading && !error && locationStatus === 'resolved' && (
          <div className="bg-[#f8f9ff] py-10 mt-12 border-t border-slate-100/50">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 text-[var(--color-brand-primary)] shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Verified Listings</h4>
                    <p className="text-xs text-gray-500 mt-0.5">100% verified PGs & owners</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 text-[var(--color-brand-primary)] shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Best Prices</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Compare & save more</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 text-[var(--color-brand-primary)] shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Safe & Secure</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Your safety is our priority</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 text-[var(--color-brand-primary)] shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">24/7 Support</h4>
                    <p className="text-xs text-gray-500 mt-0.5">We're here to help you</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
