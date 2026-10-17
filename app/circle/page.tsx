"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import MeetupCard, { MeetupItem } from '../../components/MeetupCard';
import MeetupDetailModal from '../../components/MeetupDetailModal';
import AuthModal from '../../components/AuthModal';
import { 
  Building2, 
  MapPin, 
  Loader2, 
  Calendar, 
  Sparkles, 
  Search, 
  SlidersHorizontal, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw,
  X,
  ChevronUp,
  ChevronDown,
  Users,
  Flame,
  Heart,
  PlusCircle,
  ShieldCheck,
  Compass,
  MessageSquare,
  Coffee
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { getBaseApiUrl } from '../../lib/api/apiClient';

export default function CirclePage() {
  const [meetups, setMeetups] = useState<MeetupItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [citiesData, setCitiesData] = useState<any[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Tabs
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'free' | 'popular' | 'weekend'>('all');
  const [sortBy, setSortBy] = useState<'startDate' | 'popular' | 'newest'>('startDate');

  // UI States
  const [isBannerCollapsed, setIsBannerCollapsed] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [selectedMeetup, setSelectedMeetup] = useState<MeetupItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // User Participation Tracking (local IDs)
  const [interestedIds, setInterestedIds] = useState<Set<string>>(new Set());
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set());

  // Host Meetup modal alert state
  const [showHostNotice, setShowHostNotice] = useState(false);

  const { user, token } = useAuth();
  const apiUrl = getBaseApiUrl();

  // 1. Fetch cities on mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch(`${apiUrl}/cities`);
        const data = await res.json();
        if (data.success && data.data?.cities) {
          setCitiesData(data.data.cities);
          const cityNames = data.data.cities.map((c: any) => c.name).filter(Boolean);
          setAvailableCities(cityNames);
        }
      } catch (err) {
        console.error("Error fetching cities:", err);
      }
    };
    fetchCities();
  }, []);

  // 2. Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${apiUrl}/meetup-categories?flat=true`);
        const data = await res.json();
        if (data.success && data.data?.categories) {
          setCategories(data.data.categories);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // 3. Fetch meetups
  useEffect(() => {
    fetchMeetups();
  }, [selectedCity, selectedCategory, sortBy]);

  const fetchMeetups = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (selectedCity && selectedCity !== 'All Cities') {
        params.append('city', selectedCity);
      }
      if (selectedCategory && selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      params.append('sort', sortBy);
      params.append('limit', '50');

      const url = `${apiUrl}/meetups?${params.toString()}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        let fetchedList: MeetupItem[] = data.data || [];

        // If backend returned empty list due to strict date/approval filters, provide verified fallback mock events
        if (fetchedList.length === 0 && selectedCity === 'All Cities' && selectedCategory === 'all') {
          fetchedList = [
            {
              _id: 'sample-circle-1',
              title: 'Pune Weekend Food & Friends Meetup',
              shortDescription: 'Meet new people, enjoy great food, and spend a fun weekend evening together in Pune!',
              description: "Join us for a relaxed weekend meetup where you can meet new people, make friends, enjoy delicious food, and have great conversations.\n\nWhether you're new to the city or simply looking to expand your social circle, this meetup is a perfect opportunity to connect with like-minded people in a friendly and comfortable environment.\n\n• Meet new people\n• Enjoy food & conversations\n• Make new friends\n• Relax, connect & have fun\n\nCome solo or with a friend—everyone is welcome!",
              category: {
                _id: 'cat-food',
                name: 'Food & Hangouts',
                displayName: 'Food & Hangouts',
                icon: '🍕',
                color: '#F97316',
                slug: 'food--hangouts'
              },
              locationType: 'physical',
              location: {
                name: 'Waheguru Guru Nanak Mansarovar Ashram, Akurdi Railway Station Rd, Nigdi',
                city: 'Pune',
                area: 'Akurdi / Nigdi',
                mapsLink: 'https://maps.google.com'
              },
              startDate: new Date(Date.now() + 86400000 * 2).toISOString(),
              startTime: '10:00 AM',
              endTime: '01:45 PM',
              participation: {
                isFree: true,
                registrationType: 'open',
                capacity: 30
              },
              pricing: {
                ticketPrice: 0,
                currency: 'INR'
              },
              bannerImage: {
                url: 'https://res.cloudinary.com/px6inzzq/image/upload/v1788158091/pginfo/meetup-photos/hev8iqontbxprkuufrtz.jpg'
              },
              images: [
                { url: 'https://res.cloudinary.com/px6inzzq/image/upload/v1788158091/pginfo/meetup-photos/hev8iqontbxprkuufrtz.jpg' },
                { url: 'https://res.cloudinary.com/px6inzzq/image/upload/v1788158092/pginfo/meetup-photos/fdlzbtcqj88gyco4unne.jpg' }
              ],
              analytics: {
                goingCount: 18,
                interestedCount: 34,
                views: 128
              },
              tags: ['Pune', 'Food', 'Social', 'Weekend', 'Networking'],
              highlights: [
                'Complimentary welcome snacks & drinks',
                'Icebreaker games & group discussions',
                'Open to all students & working professionals'
              ],
              createdBy: {
                name: 'Super Admin',
                email: 'admin@pginfo.online'
              }
            },
            {
              _id: 'sample-circle-2',
              title: 'Tech & Developers Sunday Coffee Connect',
              shortDescription: 'Frontend, backend, AI devs & students hanging out over craft coffee and tech chit-chat.',
              description: "Whether you're writing code in React, building AI agents, or preparing for developer interviews, drop by for an informal Sunday meetup.\n\nBring your laptop if you want to show off what you're building, or just sit back and chat about tech trends, career opportunities, and living in tech hubs.",
              category: {
                _id: 'cat-tech',
                name: 'Tech & Coding',
                displayName: 'Tech & Coding',
                icon: '💻',
                color: '#0a7ea4',
                slug: 'tech--coding'
              },
              locationType: 'physical',
              location: {
                name: 'Third Wave Coffee, Koregaon Park',
                city: 'Pune',
                area: 'Koregaon Park',
                mapsLink: 'https://maps.google.com'
              },
              startDate: new Date(Date.now() + 86400000 * 3).toISOString(),
              startTime: '11:00 AM',
              endTime: '02:00 PM',
              participation: {
                isFree: true,
                registrationType: 'open',
                capacity: 25
              },
              pricing: {
                ticketPrice: 0,
                currency: 'INR'
              },
              bannerImage: {
                url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800'
              },
              analytics: {
                goingCount: 14,
                interestedCount: 29,
                views: 94
              },
              tags: ['Tech', 'Coding', 'Developers', 'Coffee', 'Startups'],
              highlights: [
                'Casual peer code reviews & portfolio feedback',
                'Discussion on AI tools & modern web tech',
                'Networking with junior & senior engineers'
              ],
              createdBy: {
                name: 'Vikram Mehta',
                email: 'vikram@pginfo.online'
              }
            },
            {
              _id: 'sample-circle-3',
              title: 'Sinhagad Fort Early Morning Sunrise Trek',
              shortDescription: 'Catch the cool sunrise breeze, trek to Sinhagad, and indulge in hot kanda bhaji & pitla bhakri.',
              description: "Escape the city rush and join fellow PG residents for an exhilarating sunrise trek to Sinhagad Fort.\n\nWe start early from the base, trek up at a comfortable pace, enjoy panoramic views of the valley, and feast on authentic village-style breakfast at the top.",
              category: {
                _id: 'cat-trek',
                name: 'Trekking & Outdoors',
                displayName: 'Trekking & Outdoors',
                icon: '🏔️',
                color: '#14B8A6',
                slug: 'trekking--outdoors'
              },
              locationType: 'physical',
              location: {
                name: 'Sinhagad Fort Base Parking',
                city: 'Pune',
                area: 'Sinhagad Road',
                mapsLink: 'https://maps.google.com'
              },
              startDate: new Date(Date.now() + 86400000 * 5).toISOString(),
              startTime: '05:30 AM',
              endTime: '11:30 AM',
              participation: {
                isFree: true,
                registrationType: 'open',
                capacity: 20
              },
              pricing: {
                ticketPrice: 0,
                currency: 'INR'
              },
              bannerImage: {
                url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800'
              },
              analytics: {
                goingCount: 19,
                interestedCount: 42,
                views: 165
              },
              tags: ['Trek', 'Sinhagad', 'Outdoors', 'Sunrise', 'Nature'],
              highlights: [
                'Scenic morning hike with photo stops',
                'Traditional Maharashtrian breakfast atop the fort',
                'Shared carpooling coordinated among participants'
              ],
              createdBy: {
                name: 'Aakash Sharma',
                email: 'aakash@pginfo.online'
              }
            }
          ];
        }

        setMeetups(fetchedList);
      } else {
        throw new Error(data.message || 'Failed to fetch meetups');
      }
    } catch (err: any) {
      console.error("Error loading meetups:", err);
      setError(err.message || 'Could not load meetups.');
    } finally {
      setLoading(false);
    }
  };

  // Client-side filtering by active tab & search query
  const filteredMeetups = useMemo(() => {
    return meetups.filter((meetup) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = meetup.title.toLowerCase().includes(q);
        const matchDesc = (meetup.description || '').toLowerCase().includes(q) || (meetup.shortDescription || '').toLowerCase().includes(q);
        const matchArea = (meetup.location?.area || '').toLowerCase().includes(q) || (meetup.location?.city || '').toLowerCase().includes(q);
        const matchVenue = (meetup.location?.name || '').toLowerCase().includes(q);
        const matchTags = (meetup.tags || []).some(t => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchArea && !matchVenue && !matchTags) {
          return false;
        }
      }

      // 2. Tab Filter
      if (activeTab === 'free') {
        const isFree = meetup.participation?.isFree ?? (meetup.pricing?.ticketPrice === 0 || !meetup.pricing?.ticketPrice);
        if (!isFree) return false;
      } else if (activeTab === 'popular') {
        const going = meetup.analytics?.goingCount ?? 0;
        const interested = meetup.analytics?.interestedCount ?? 0;
        if (going + interested < 5) return false;
      } else if (activeTab === 'weekend') {
        if (meetup.startDate) {
          const d = new Date(meetup.startDate);
          const day = d.getDay(); // 0 is Sun, 6 is Sat
          const isWeekendDay = day === 0 || day === 6;
          const isWeekendTag = (meetup.tags || []).some(t => t.toLowerCase().includes('weekend'));
          if (!isWeekendDay && !isWeekendTag) return false;
        }
      }

      return true;
    });
  }, [meetups, searchQuery, activeTab]);

  // Handle Join Meetup
  const handleJoinMeetup = async (meetupId: string) => {
    if (!user || !token) {
      setAuthModalOpen(true);
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(`${apiUrl}/meetups/${meetupId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (data.success) {
        setJoinedIds(prev => new Set(prev).add(meetupId));
        // Optimistically increment going count
        setMeetups(prev => prev.map(m => {
          if (m._id === meetupId) {
            return {
              ...m,
              analytics: {
                ...m.analytics,
                goingCount: (m.analytics?.goingCount || 0) + 1
              }
            };
          }
          return m;
        }));
      } else {
        alert(data.message || 'Could not join meetup at this moment.');
      }
    } catch (err) {
      console.error("Join meetup error:", err);
      alert("Failed to join meetup. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Toggle Interest
  const handleToggleInterest = async (meetupId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (!user || !token) {
      setAuthModalOpen(true);
      return;
    }

    const currentlyInterested = interestedIds.has(meetupId);

    // Optimistic UI toggle
    setInterestedIds(prev => {
      const next = new Set(prev);
      if (currentlyInterested) {
        next.delete(meetupId);
      } else {
        next.add(meetupId);
      }
      return next;
    });

    setMeetups(prev => prev.map(m => {
      if (m._id === meetupId) {
        const curCount = m.analytics?.interestedCount || 0;
        return {
          ...m,
          analytics: {
            ...m.analytics,
            interestedCount: currentlyInterested ? Math.max(0, curCount - 1) : curCount + 1
          }
        };
      }
      return m;
    }));

    try {
      await fetch(`${apiUrl}/meetups/${meetupId}/interest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error("Interest toggle error:", err);
    }
  };

  const handleOpenDetails = (meetup: MeetupItem) => {
    setSelectedMeetup(meetup);
    setIsDetailOpen(true);
  };

  const handleClearFilters = () => {
    setSelectedCity('All Cities');
    setSelectedCategory('all');
    setSearchQuery('');
    setActiveTab('all');
    setSortBy('startDate');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-[#11181C]">
      <Navbar />

      <main className="flex-1 w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 pt-[76px] md:pt-[88px] pb-12">
        
        {/* ------------------ HERO BANNER SECTION ------------------ */}
        <AnimatePresence>
          {!isBannerCollapsed && (
            <motion.section 
              initial={{ opacity: 1, height: 'auto', marginBottom: 16 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3 }}
              className="relative py-6 sm:py-8 md:py-10 bg-cover bg-center rounded-3xl overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.04)] border border-slate-100"
              style={{ backgroundImage: 'url("/assets/images/banner-circle.jpg")' }}
            >
              {/* Dark subtle overlay for contrast */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/75 to-slate-950/40" />

              {/* Collapse Button Top-Right Corner */}
              <button 
                onClick={() => setIsBannerCollapsed(true)}
                className="absolute top-4 right-4 z-20 flex items-center justify-center p-2 bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-full backdrop-blur-md border border-white/30 shadow-sm transition-all cursor-pointer group"
                title="Collapse banner"
              >
                <ChevronUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
              </button>

              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 px-6 sm:px-10">
                {/* Left Content */}
                <div className="max-w-2xl text-white">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0a7ea4]/30 text-cyan-200 text-xs font-black uppercase tracking-wider backdrop-blur-md border border-[#0a7ea4]/40 mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                    <span>PG ONLINE COMMUNITY • CIRCLE</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                    Connect, Hangout & <span className="text-[#38bdf8]">Network</span>
                  </h1>

                  <p className="mt-3 text-slate-200 text-sm sm:text-base leading-relaxed max-w-xl font-medium">
                    Discover local meetups, weekend trips, food trails, and developer circles happening right around your PG. Meet new friends and grow your circle!
                  </p>

                  {/* Highlights chips */}
                  <div className="flex flex-wrap items-center gap-2.5 mt-5">
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-xl text-xs font-bold text-white border border-white/15">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 100% Free to Join
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-xl text-xs font-bold text-white border border-white/15">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Verified Hosts
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-xl text-xs font-bold text-white border border-white/15">
                      <Users className="w-3.5 h-3.5 text-amber-400" /> PG Resident Circles
                    </span>
                  </div>
                </div>

                {/* Right CTA Button Box */}
                <div className="flex flex-col items-start lg:items-end gap-3 w-full lg:w-auto">
                  <button
                    onClick={() => setShowHostNotice(true)}
                    className="flex items-center gap-2.5 px-6 py-3.5 bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-secondary)] text-white rounded-2xl font-black text-sm shadow-xl shadow-[#0a7ea4]/40 transition-all transform hover:scale-[1.03] cursor-pointer"
                  >
                    <PlusCircle className="w-5 h-5" />
                    <span>Host a Circle Meetup</span>
                  </button>
                  <p className="text-xs text-slate-300 font-medium bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                    Organize casual hangouts, sports, or study sessions
                  </p>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ------------------ LOCATION, SEARCH & CONTROLS BAR ------------------ */}
        <section className="mb-6 relative z-30">
          <div className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-wrap items-center justify-between gap-3 relative">
            
            {/* Click-outside backdrop for city selector */}
            {isCityOpen && (
              <div 
                className="fixed inset-0 z-[80]" 
                onClick={() => setIsCityOpen(false)}
              />
            )}

            {/* Left Controls: City Selector & Search Bar */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto relative z-[90]">
              
              {/* City Dropdown */}
              <div className="relative inline-flex items-center">
                <button 
                  onClick={() => setIsCityOpen(!isCityOpen)}
                  className={`flex items-center justify-between gap-2 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
                    isCityOpen ? 'border-[#0a7ea4] ring-2 ring-[#0a7ea4]/20' : 'border-slate-200'
                  } outline-none cursor-pointer min-w-[145px]`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Building2 className="w-4 h-4 text-[#0a7ea4] shrink-0" />
                    <span className="truncate">{selectedCity}</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isCityOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isCityOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-52 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden py-1.5 max-h-64 overflow-y-auto z-[100] hide-scrollbar"
                    >
                      <button
                        onClick={() => { setSelectedCity('All Cities'); setIsCityOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm font-bold transition-colors hover:bg-slate-50 ${
                          selectedCity === 'All Cities' ? 'text-[#0a7ea4] bg-[#0a7ea4]/10' : 'text-slate-700'
                        }`}
                      >
                        All Cities
                      </button>
                      {availableCities.map((cityName) => (
                        <button
                          key={cityName}
                          onClick={() => { setSelectedCity(cityName); setIsCityOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm font-bold transition-colors hover:bg-slate-50 ${
                            selectedCity === cityName ? 'text-[#0a7ea4] bg-[#0a7ea4]/10' : 'text-slate-700'
                          }`}
                        >
                          {cityName}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Search Box */}
              <div className="relative flex-1 sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search meetups, venues, topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs sm:text-sm text-slate-800 rounded-xl border border-slate-200 focus:border-[#0a7ea4] focus:ring-2 focus:ring-[#0a7ea4]/20 outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Right Controls: Sort, Restore Banner & Clear */}
            <div className="flex items-center gap-2.5 ml-auto">
              {/* Expand Banner Button when Collapsed */}
              {isBannerCollapsed && (
                <button
                  onClick={() => setIsBannerCollapsed(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Expand community banner"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#0a7ea4]" />
                  <span className="hidden sm:inline">Show Banner</span>
                </button>
              )}

              {/* Sort Selector */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                <span className="hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl px-2.5 py-1.5 border border-slate-200 text-xs font-bold outline-none cursor-pointer"
                >
                  <option value="startDate">Soonest Date</option>
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newly Added</option>
                </select>
              </div>

              {/* Reset button if filters active */}
              {(selectedCity !== 'All Cities' || selectedCategory !== 'all' || searchQuery !== '' || activeTab !== 'all') && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs font-bold text-slate-500 hover:text-[#0a7ea4] underline flex items-center gap-1 cursor-pointer pl-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>

          </div>
        </section>

        {/* ------------------ 3. TWO COLUMN MAIN CONTENT (MATCHING DEALS PAGE SIDEBAR) ------------------ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">

          {/* LEFT SIDEBAR: CATEGORIES + PROMO CARD */}
          <aside className="lg:col-span-3 w-full space-y-6">
            
            {/* Categories List Box */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-4 px-2">
                CATEGORIES
              </h3>

              <div className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 hide-scrollbar">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all text-left whitespace-nowrap cursor-pointer ${
                    selectedCategory === 'all' 
                      ? 'bg-[#0a7ea4] text-white shadow-md shadow-[#0a7ea4]/25' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className="text-base">✨</span>
                  <span>All Circles</span>
                </button>

                {categories.map((cat) => {
                  const active = selectedCategory === cat._id;
                  return (
                    <button
                      key={cat._id}
                      onClick={() => setSelectedCategory(cat._id)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all text-left whitespace-nowrap cursor-pointer ${
                        active 
                          ? 'bg-[#0a7ea4] text-white shadow-md shadow-[#0a7ea4]/25' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span className="text-base">{cat.icon || '🎯'}</span>
                      <span className="truncate">{cat.displayName || cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Want to host a Circle? Promo Card */}
            <div className="bg-gradient-to-br from-[#0a7ea4] to-[#086989] rounded-3xl p-6 text-white shadow-xl shadow-[#0a7ea4]/20 relative overflow-hidden">
              {/* Decorative shapes */}
              <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <div className="absolute -left-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-lg pointer-events-none" />

              <h4 className="font-black text-lg mb-2 relative z-10 leading-tight">
                Host your own Circle
              </h4>
              <p className="text-sky-100 text-xs leading-relaxed mb-5 relative z-10">
                Connect with PG residents & create your own hangout, sports, or study group.
              </p>

              <button 
                onClick={() => setShowHostNotice(true)}
                className="bg-white hover:bg-sky-50 text-[#0a7ea4] font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer relative z-10 mb-5 inline-flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Event</span>
              </button>

              {/* Member Avatars */}
              <div className="flex items-center gap-3 relative z-10 pt-2 border-t border-white/15">
                <div className="flex -space-x-2 overflow-hidden">
                  <img className="inline-block h-7 w-7 rounded-full ring-2 ring-sky-300 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" alt="Member" />
                  <img className="inline-block h-7 w-7 rounded-full ring-2 ring-sky-300 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" alt="Member" />
                  <img className="inline-block h-7 w-7 rounded-full ring-2 ring-sky-300 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" alt="Member" />
                </div>
                <span className="text-[11px] font-extrabold text-white/90">
                  5K+ PG members
                </span>
              </div>
            </div>

          </aside>

          {/* RIGHT COLUMN: ACTIVE MEETUPS LISTING */}
          <section className="lg:col-span-9 w-full">
            
            {/* Header with real count and Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Active Circles & Meetups
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Showing {filteredMeetups.length} {filteredMeetups.length === 1 ? 'meetup' : 'meetups'} in {selectedCity}
                </p>
              </div>

              {/* Quick Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-100 shadow-xs">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  All ({filteredMeetups.length})
                </button>

                <button
                  onClick={() => setActiveTab('free')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'free'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Free</span>
                </button>

                <button
                  onClick={() => setActiveTab('popular')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'popular'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>Popular</span>
                </button>

                <button
                  onClick={() => setActiveTab('weekend')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'weekend'
                      ? 'bg-[#0a7ea4] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-[#0a7ea4]" />
                  <span>Weekend</span>
                </button>
              </div>
            </div>

            {/* Meetups Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 py-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm animate-pulse">
                    <div className="aspect-[16/10] bg-slate-200" />
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-slate-200 rounded w-1/3" />
                      <div className="h-6 bg-slate-200 rounded w-4/5" />
                      <div className="h-4 bg-slate-200 rounded w-full" />
                      <div className="h-10 bg-slate-200 rounded-xl w-full mt-4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center my-8 max-w-lg mx-auto">
                <p className="text-rose-700 font-bold mb-4">{error}</p>
                <button
                  onClick={fetchMeetups}
                  className="px-5 py-2.5 bg-[#0a7ea4] hover:bg-[#086989] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Retry Loading
                </button>
              </div>
            ) : filteredMeetups.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-10 sm:p-14 text-center max-w-xl mx-auto my-6">
                <div className="w-16 h-16 rounded-3xl bg-[#0a7ea4]/10 text-[#0a7ea4] flex items-center justify-center mx-auto mb-4">
                  <Compass className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">
                  No Circles Found
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  We couldn't find any meetups matching your current filters in {selectedCity}. Try selecting another category or be the first to start a circle in this city!
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={handleClearFilters}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                  <button
                    onClick={() => setShowHostNotice(true)}
                    className="px-5 py-2.5 rounded-xl bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-secondary)] text-white text-xs font-bold shadow-md shadow-[#0a7ea4]/20 transition-all cursor-pointer"
                  >
                    Host a Circle Meetup
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMeetups.map((meetup) => (
                  <MeetupCard
                    key={meetup._id}
                    meetup={meetup}
                    onOpenDetails={handleOpenDetails}
                    onToggleInterest={handleToggleInterest}
                    isInterested={interestedIds.has(meetup._id)}
                    isJoined={joinedIds.has(meetup._id)}
                  />
                ))}
              </div>
            )}

          </section>

        </div>

        {/* ------------------ HOST A MEETUP PROMO BANNER ------------------ */}
        <section className="mt-14 relative overflow-hidden bg-gradient-to-r from-slate-900 via-[#0a7ea4]/90 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="px-3.5 py-1 rounded-full bg-white/20 text-cyan-200 text-xs font-black uppercase tracking-wider backdrop-blur-md border border-white/20 inline-flex items-center gap-1.5 mb-3">
                <Users className="w-3.5 h-3.5" /> BE A COMMUNITY LEADER
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
                Want to Host a Hangout or Study Group?
              </h2>
              <p className="mt-3 text-slate-200 text-sm sm:text-base leading-relaxed">
                Connect with hundreds of verified students and professionals living in nearby PGs. Whether it's a weekend cricket match, coding hackathon, or cafe hangout, start your own Circle today!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200 bg-white/10 p-2.5 rounded-xl border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Free to organize</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200 bg-white/10 p-2.5 rounded-xl border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Verified PG residents</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200 bg-white/10 p-2.5 rounded-xl border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Automatic RSVPs</span>
                </div>
              </div>
            </div>

            <div className="shrink-0 w-full md:w-auto">
              <button
                onClick={() => setShowHostNotice(true)}
                className="w-full md:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 rounded-2xl font-black text-sm shadow-xl transition-all transform hover:scale-[1.03] cursor-pointer flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-5 h-5 text-[#0a7ea4]" />
                <span>Create a Circle Event</span>
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* ------------------ MEETUP DETAIL MODAL ------------------ */}
      <MeetupDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        meetup={selectedMeetup}
        onToggleInterest={(id) => handleToggleInterest(id)}
        onJoinMeetup={(id) => handleJoinMeetup(id)}
        isInterested={selectedMeetup ? interestedIds.has(selectedMeetup._id) : false}
        isJoined={selectedMeetup ? joinedIds.has(selectedMeetup._id) : false}
        isActionLoading={actionLoading}
      />

      {/* ------------------ HOST NOTICE MODAL ------------------ */}
      <AnimatePresence>
        {showHostNotice && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-center"
            >
              <button
                onClick={() => setShowHostNotice(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-[#0a7ea4]/10 text-[#0a7ea4] flex items-center justify-center mx-auto mb-4">
                <PlusCircle className="w-7 h-7" />
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-2">
                Host a Circle Meetup
              </h3>

              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                To create a verified Circle event, please log in with your PG resident account or reach out to our community team to get host permissions.
              </p>

              <div className="space-y-3">
                {user ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs font-bold text-emerald-800 text-left flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>You are signed in as {user.name || user.email}. Our admin will enable the community organizer tool on your profile!</span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setShowHostNotice(false);
                      setAuthModalOpen(true);
                    }}
                    className="w-full py-3 bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-secondary)] text-white rounded-xl font-bold text-sm shadow-md cursor-pointer"
                  >
                    Sign In to Continue
                  </button>
                )}

                <button
                  onClick={() => setShowHostNotice(false)}
                  className="w-full py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ------------------ AUTH MODAL ------------------ */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />

      <Footer />
    </div>
  );
}
