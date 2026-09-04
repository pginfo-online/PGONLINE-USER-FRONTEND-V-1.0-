"use client";

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Share2, Heart, ChevronLeft, ChevronRight, Eye, 
  MapPin, Wifi, CheckCircle, Droplet, Monitor, Shield,
  Calendar, Headset, Check, Map as MapIcon, Crosshair, Loader2, Navigation
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';

export default function PGDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { user, token } = useAuth();

  const [pgData, setPgData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactDetails, setShowContactDetails] = useState(false);

  // Visit Booking State
  const [visitDate, setVisitDate] = useState("");
  const [visitSlot, setVisitSlot] = useState("");
  const [visitMessage, setVisitMessage] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM',
    '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM',
    '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM',
    '04:30 PM', '05:00 PM', '05:30 PM',
    '06:00 PM', '06:30 PM', '07:00 PM',
    '07:30 PM', '08:00 PM'
  ];

  const handleBookVisit = async () => {
    if (!visitDate || !visitSlot) {
      setBookingError("Please select a date and time slot.");
      return;
    }
    try {
      setIsBooking(true);
      setBookingError("");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://pgonline-backend-v-1-0.onrender.com/api/v1";
      const response = await fetch(`${apiUrl}/visit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          pgId: id,
          scheduledDate: visitDate,
          scheduledTime: visitSlot,
          message: visitMessage
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to book visit');
      }
      setBookingSuccess(true);
    } catch (err: any) {
      setBookingError(err.message);
    } finally {
      setIsBooking(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchPGDetails = async () => {
      try {
        setIsLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://pgonline-backend-v-1-0.onrender.com/api/v1";
        
        const headers: HeadersInit = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(`${apiUrl}/pg/${id}`, { headers });
        
        if (!response.ok) {
          throw new Error('Failed to fetch PG details');
        }

        const data = await response.json();
        setPgData(data.data.pg || data.data);
      } catch (err: any) {
        console.error("Error fetching PG details:", err);
        setError(err.message || "Failed to load property details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPGDetails();
  }, [id]);

  const images = pgData?.photos?.length > 0 
    ? pgData.photos.map((p: any) => p.url) 
    : ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop"]; // Fallback image

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const formatGender = (gender: string) => {
    if (!gender) return "CO-ED";
    if (gender.toLowerCase() === 'male') return "BOYS ACCOMMODATION";
    if (gender.toLowerCase() === 'female') return "GIRLS ACCOMMODATION";
    return "CO-ED ACCOMMODATION";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center pt-[70px]">
          <Loader2 className="w-12 h-12 text-[var(--color-brand-primary)] animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !pgData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center pt-[70px] px-4 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
          <p className="text-gray-500 mb-6 max-w-md">{error || "The PG you are looking for does not exist or has been removed."}</p>
          <button onClick={() => router.back()} className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: pgData?.name || "PG Detail",
          text: `Check out ${pgData?.name || 'this PG'} on PGOnline!`,
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

  const handleWishlist = async () => {
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
          pgId: id,
          pg: id,
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
      alert("Error updating wishlist.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900">
      <Navbar />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-6 pb-24 mt-[70px]">
        
        {/* Public Preview Mode Banner */}
        {!user && (
          <div className="w-full bg-[#1e1a4f] rounded-2xl p-4 sm:p-6 mb-6 flex flex-col sm:flex-row items-center justify-between text-white gap-4 shadow-lg">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <Eye className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-wide mb-1">Public Preview Mode</h2>
                <p className="text-[13px] text-indigo-200 leading-relaxed">
                  You are viewing basic information. Log in to view owner contact, exact address, and schedule visits.
                </p>
              </div>
            </div>
            <button 
              onClick={() => router.push('/login')}
              className="w-full sm:w-auto shrink-0 bg-white hover:bg-gray-50 text-[#1e1a4f] px-6 py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              Log In to Unlock Full Access
            </button>
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-700 hover:text-black font-medium transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to results
          </button>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleShare}
              title="Share this PG"
              className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-[var(--color-brand-primary)] transition-colors shadow-sm cursor-pointer"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button 
              onClick={handleWishlist}
              title="Save to Wishlist"
              className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm cursor-pointer"
            >
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (Images & Details) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Image Gallery */}
            <div className="bg-white p-3 rounded-3xl shadow-sm border border-gray-100">
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] rounded-2xl overflow-hidden mb-3 group">
                <img src={images[currentImageIndex]} alt={pgData.name} className="w-full h-full object-cover" />
                
                {/* Navigation Arrows (Only show if multiple images) */}
                {images.length > 1 && (
                  <>
                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-gray-800 shadow-md hover:bg-white transition-colors opacity-0 group-hover:opacity-100">
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-gray-800 shadow-md hover:bg-white transition-colors opacity-0 group-hover:opacity-100">
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Badge */}
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5" />
                  Public Photo Preview
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
                  {images.map((img: string, idx: number) => (
                    <button 
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 transition-colors ${currentImageIndex === idx ? 'border-[var(--color-brand-primary)]' : 'border-transparent'}`}
                    >
                      <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
              
              {/* Header Info */}
              <div className="mb-2">
                <span className={`inline-block text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-widest mb-3 ${
                  pgData.gender === 'male' ? 'bg-blue-50 text-blue-600' :
                  pgData.gender === 'female' ? 'bg-pink-50 text-pink-600' :
                  'bg-purple-50 text-purple-600'
                }`}>
                  {formatGender(pgData.gender)}
                </span>
                <h1 className="text-3xl sm:text-[32px] leading-tight font-extrabold text-gray-900 mb-4">{pgData.name}</h1>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center text-gray-600 gap-1.5 text-sm font-medium">
                    <MapPin className="w-4 h-4 text-[var(--color-brand-primary)]" />
                    <span className="text-gray-600 truncate">{pgData.address || `${pgData.area}, ${pgData.city}`}</span>
                  </div>
                  {!user && (
                    <span className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-100 hidden sm:inline-block whitespace-nowrap">
                      Exact address unlocked after login
                    </span>
                  )}
                </div>
              </div>

              <hr className="border-gray-100 my-8" />

              {/* Pricing Cards */}
              <div className="mb-8">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-5 flex items-center gap-2">
                  <span className="text-[var(--color-brand-primary)]"><CheckCircle className="w-4 h-4" /></span>
                  SHARING PRICING & OPTIONS
                </h3>
                
                {pgData.roomConfigs && Array.isArray(pgData.roomConfigs) && pgData.roomConfigs.length > 0 ? (
                  <div className="grid sm:grid-cols-3 gap-4">
                    {pgData.roomConfigs.map((room: any, index: number) => (
                      <div key={index} className="border border-gray-100 bg-white rounded-2xl p-5 hover:border-[var(--color-brand-primary)]/30 transition-colors shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                        <p className="text-[10px] text-gray-700 font-extrabold mb-3 uppercase tracking-wider">{room.shareType} SHARING</p>
                        <div className="flex items-end gap-1 mb-4">
                          <span className="text-3xl font-extrabold text-[var(--color-brand-primary)]">
                            ₹{room.rent ? Number(room.rent).toLocaleString('en-IN') : 'N/A'}
                          </span>
                          <span className="text-gray-500 text-xs font-medium pb-1.5">/mo</span>
                        </div>
                        <div className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50/50 border border-green-100 px-2 py-1 rounded">
                          <Check className="w-3 h-3" strokeWidth={3} /> 
                          {room.availableBeds > 0 ? `${room.availableBeds} BEDS AVAILABLE` : 'IMMEDIATE MOVE-IN'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                   <div className="grid sm:grid-cols-3 gap-4">
                     <div className="border border-gray-100 bg-white rounded-2xl p-5 hover:border-[var(--color-brand-primary)]/30 transition-colors shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                        <p className="text-[10px] text-gray-700 font-extrabold mb-3 uppercase tracking-wider">MONTHLY RENT</p>
                        <div className="flex items-end gap-1 mb-4">
                          <span className="text-3xl font-extrabold text-[var(--color-brand-primary)]">
                            ₹{pgData.monthlyPricing ? Number(pgData.monthlyPricing).toLocaleString('en-IN') : 'N/A'}
                          </span>
                          <span className="text-gray-500 text-xs font-medium pb-1.5">/mo</span>
                        </div>
                        <div className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50/50 border border-green-100 px-2 py-1 rounded">
                          <Check className="w-3 h-3" strokeWidth={3} /> CONTACT OWNER
                        </div>
                      </div>
                   </div>
                )}
              </div>

              <hr className="border-gray-100 my-8" />

              {/* About Section */}
              <div className="mb-8">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-4">ABOUT THIS ACCOMMODATION</h3>
                <p className="text-gray-600 text-[13px] leading-relaxed max-w-4xl whitespace-pre-wrap">
                  {pgData.description || `Furnished rooms offering attached bathrooms, personal storage, and unlimited Wi-Fi access. Includes freshly cooked meals, laundry services, weekly cleaning, and 24/7 security coverage.`}
                </p>
              </div>

              <hr className="border-gray-100 my-8" />

              {/* Amenities */}
              <div className="mb-8">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-6 flex items-center gap-2">
                  <span className="text-[var(--color-brand-primary)]"><Shield className="w-4 h-4" /></span>
                  AMENITIES PROVIDED
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-5 gap-x-4">
                  
                  {/* Dynamic Amenities from Backend */}
                  {pgData.amenities && pgData.amenities.length > 0 ? (
                     pgData.amenities.map((amenity: string, i: number) => {
                       const amLower = amenity.toLowerCase();
                       let icon = <CheckCircle className="w-4 h-4" />;
                       let colorClass = "bg-gray-50 text-gray-600";
                       
                       if (amLower.includes('wifi')) { icon = <Wifi className="w-4 h-4" />; colorClass = "bg-blue-50 text-blue-500"; }
                       else if (amLower.includes('ac')) { icon = <Monitor className="w-4 h-4" />; colorClass = "bg-cyan-50 text-cyan-500"; }
                       else if (amLower.includes('food') || amLower.includes('meal')) { icon = <CheckCircle className="w-4 h-4" />; colorClass = "bg-orange-50 text-orange-500"; }
                       else if (amLower.includes('water')) { icon = <Droplet className="w-4 h-4" />; colorClass = "bg-green-50 text-green-500"; }
                       else if (amLower.includes('security') || amLower.includes('cctv')) { icon = <Shield className="w-4 h-4" />; colorClass = "bg-emerald-50 text-emerald-500"; }
                       else if (amLower.includes('laundry')) { icon = <Droplet className="w-4 h-4" />; colorClass = "bg-purple-50 text-purple-500"; }
                       else if (amLower.includes('study')) { icon = <MapIcon className="w-4 h-4" />; colorClass = "bg-indigo-50 text-indigo-500"; }
                       else if (amLower.includes('parking')) { icon = <MapIcon className="w-4 h-4" />; colorClass = "bg-amber-50 text-amber-500"; }
                       else if (amLower.includes('power')) { icon = <CheckCircle className="w-4 h-4" />; colorClass = "bg-yellow-50 text-yellow-500"; }
                       
                       return (
                        <div key={i} className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClass}`}>
                            {icon}
                          </div>
                          <span className="text-[13px] font-bold text-gray-700 capitalize">{amenity}</span>
                        </div>
                       );
                     })
                  ) : (
                    /* Fallback to known booleans or standard list */
                    <>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                          <Shield className="w-4 h-4" />
                        </div>
                        <span className="text-[13px] font-bold text-gray-700">Security Guard</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                        <span className="text-[13px] font-bold text-gray-700">Study Room</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                          <Wifi className="w-4 h-4" />
                        </div>
                        <span className="text-[13px] font-bold text-gray-700">WiFi</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                          <Droplet className="w-4 h-4" />
                        </div>
                        <span className="text-[13px] font-bold text-gray-700">Laundry</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                          <MapIcon className="w-4 h-4" />
                        </div>
                        <span className="text-[13px] font-bold text-gray-700">Parking</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-fuchsia-50 flex items-center justify-center text-fuchsia-600">
                          <Shield className="w-4 h-4" />
                        </div>
                        <span className="text-[13px] font-bold text-gray-700">CCTV</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                        <span className="text-[13px] font-bold text-gray-700">Power Backup</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                          <Droplet className="w-4 h-4" />
                        </div>
                        <span className="text-[13px] font-bold text-gray-700">Hot Water</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                        <span className="text-[13px] font-bold text-gray-700">Housekeeping</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <hr className="border-gray-100 my-8" />

              {/* Location & Navigation */}
              {(() => {
                const lat = pgData?.latitude || (pgData?.location?.coordinates?.[1] !== 0 ? pgData?.location?.coordinates?.[1] : null);
                const lng = pgData?.longitude || (pgData?.location?.coordinates?.[0] !== 0 ? pgData?.location?.coordinates?.[0] : null);
                const fullAddrStr = [pgData?.name, pgData?.address, pgData?.area, pgData?.city, pgData?.state].filter(Boolean).join(', ');
                const searchQuery = (lat && lng) ? `${lat},${lng}` : (fullAddrStr || 'Pune, India');
                const googleMapsUrl = pgData?.mapsLink || ((lat && lng) 
                  ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}` 
                  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddrStr || 'PG')}`);

                return (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
                      <div>
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                          LOCATION & NAVIGATION
                        </h3>
                        <p className="text-[11px] text-gray-500 font-medium mt-1 leading-snug">
                          {fullAddrStr || 'Explore transit links and nearby points of interest'}
                        </p>
                      </div>

                      <a 
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[var(--color-brand-primary)] hover:bg-opacity-90 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm w-fit"
                      >
                        <Navigation className="w-4 h-4" />
                        Open Google Maps & Directions
                      </a>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-6 items-start">
                      {/* Dynamic Google Map iFrame */}
                      <div className="bg-gray-100 rounded-2xl h-[280px] relative overflow-hidden border border-gray-200 shadow-sm group">
                        <iframe
                          title="PG Location Map"
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          scrolling="no"
                          marginHeight={0}
                          marginWidth={0}
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                          className="w-full h-full rounded-2xl"
                        ></iframe>
                        
                        <a 
                          href={googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute bottom-3 right-3 bg-white/95 hover:bg-white text-gray-900 text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-md border border-gray-200 backdrop-blur-sm flex items-center gap-1.5 transition-all group-hover:scale-105"
                        >
                          <MapPin className="w-3.5 h-3.5 text-red-500" />
                          View on Google Maps
                        </a>
                      </div>

                      {/* Nearby Places */}
                      <div className="flex flex-col gap-3">
                        <h4 className="text-[10px] font-bold text-[var(--color-brand-primary)] uppercase flex items-center gap-1.5 mb-1">
                          <Crosshair className="w-3.5 h-3.5" /> NEARBY PLACES
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { name: "New Excel ...", type: "COLLEGE", dist: "0.4 KM" },
                            { name: "Swamikrup...", type: "HOSPITAL", dist: "0.4 KM" },
                            { name: "Golden Aura", type: "SHOPPING MALL", dist: "0.4 KM" },
                            { name: "Cafe love b...", type: "RESTAURANT", dist: "0 KM" },
                            { name: "Park Sprin...", type: "IT PARK", dist: "0.5 KM" },
                          ].map((place, i) => (
                            <div key={i} className="flex items-center gap-3 p-2.5 border border-gray-100 bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.015)] hover:border-blue-100 transition-colors">
                              <div className="w-7 h-7 rounded-full bg-blue-50/50 flex items-center justify-center shrink-0">
                                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                              </div>
                              <div className="min-w-0">
                                <span className="text-[11px] font-bold text-gray-900 block truncate">{place.name}</span>
                                <span className="text-[8px] font-bold text-gray-400 block uppercase tracking-wider truncate">{place.type} • {place.dist}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Contact Owner Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                <Headset className="w-4 h-4 text-gray-500" />
                CONTACT PROPERTY OWNER
              </h3>
              <p className="text-[13px] text-gray-500 mb-5 leading-relaxed">Connect directly to confirm availability or ask questions.</p>
              
              {!user ? (
                <div className="bg-slate-500 rounded-2xl p-6 text-center relative overflow-hidden">
                  {/* Blurred Content Background Simulation */}
                  <div className="absolute inset-0 bg-slate-600 opacity-90 backdrop-blur-xl"></div>
                  
                  <div className="relative z-10">
                    <div className="opacity-30 blur-[2px] pointer-events-none select-none mb-4 flex flex-col gap-2 items-center">
                      <div className="h-4 bg-white rounded w-32"></div>
                      <div className="h-5 bg-white rounded w-48"></div>
                    </div>
                    
                    <p className="text-white text-sm font-semibold mb-4">Owner Phone & WhatsApp Hidden</p>
                    <button className="w-full bg-[var(--color-brand-violet)] hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-md">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                      Log In to View Owner Contact
                    </button>
                  </div>
                </div>
              ) : showContactDetails ? (
                <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[13px] font-bold text-gray-700">Direct Owner Contact</span>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">Verified</span>
                  </div>
                  
                  <div className="space-y-5">
                    <div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Owner Name</span>
                      <span className="text-sm font-bold text-gray-900">{pgData.owner?.name || "Property Owner"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Phone</span>
                      <span className="text-sm font-bold text-gray-900">{pgData.contactPhone || pgData.owner?.phone || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">WhatsApp</span>
                      <span className="text-sm font-bold text-gray-900">{pgData.contactWhatsapp || pgData.contactPhone || "N/A"}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => setShowContactDetails(true)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-md"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    Call Owner
                  </button>
                  <button 
                    onClick={() => setShowContactDetails(true)}
                    className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-md"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                    WhatsApp Chat
                  </button>
                </div>
              )}
            </div>

            {/* Schedule Visit Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-5 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                SCHEDULE PROPERTY VISIT
              </h3>
              
              {!user ? (
                <div className="bg-slate-50/80 rounded-2xl p-6 text-center border border-gray-100">
                  <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-sm">
                    <Calendar className="w-8 h-8 text-[var(--color-brand-blue)]" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Schedule a Free Visit</h4>
                  <p className="text-[13px] text-gray-500 mb-6 px-2">Select your preferred date & time slot to inspect the property in-person.</p>
                  
                  <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-md">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    Log In to Schedule Visit
                  </button>
                </div>
              ) : bookingSuccess ? (
                <div className="bg-green-50 rounded-2xl p-6 text-center border border-green-100 flex flex-col items-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-3">
                    <Check className="w-6 h-6 text-white" strokeWidth={3} />
                  </div>
                  <h4 className="text-sm font-bold text-green-800 mb-1">Visit Booked Successfully!</h4>
                  <p className="text-xs text-green-700 mb-4">The owner will be notified of your visit.</p>
                  <button 
                    onClick={() => router.push('/my-visits')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm shadow-sm"
                  >
                    View My Visits
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  {bookingError && (
                    <div className="bg-red-50 text-red-600 text-xs font-semibold px-3 py-2 rounded-lg border border-red-100">
                      {bookingError}
                    </div>
                  )}
                  <div>
                    <label className="text-[11px] font-bold text-[#1e1a4f] mb-1.5 block uppercase tracking-wide">Visit Date</label>
                    <div className="relative">
                      <input 
                        type="date" 
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 font-medium outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow bg-gray-50/50" 
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-bold text-[#1e1a4f] block uppercase tracking-wide">Available Slot</label>
                      {visitSlot && <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{visitSlot}</span>}
                    </div>
                    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                      {timeSlots.map((slot, i) => {
                        const isSelected = visitSlot === slot;
                        return (
                          <button 
                            key={i} 
                            onClick={() => setVisitSlot(slot)}
                            className={`text-[10px] font-bold py-2.5 rounded-lg border transition-all ${
                              isSelected 
                                ? 'bg-blue-600 border-blue-600 text-white shadow-md transform scale-[1.02]' 
                                : 'border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#1e1a4f] mb-1.5 block uppercase tracking-wide">Message for Owner (Optional)</label>
                    <textarea 
                      rows={2} 
                      value={visitMessage}
                      onChange={(e) => setVisitMessage(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none bg-gray-50/50" 
                      placeholder="e.g. I will visit with my parents around..."
                    ></textarea>
                  </div>
                  <button 
                    onClick={handleBookVisit}
                    disabled={isBooking}
                    className="w-full bg-[#1e2336] hover:bg-[#151928] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors mt-2 text-sm shadow-md flex items-center justify-center gap-2"
                  >
                    {isBooking ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      'Book Free Property Visit'
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Why Choose Us */}
            <div className="bg-gradient-to-br from-indigo-500 via-[#5b73e8] to-blue-500 rounded-3xl p-7 text-white shadow-lg relative overflow-hidden">
               
               <h3 className="text-xl font-bold mb-6 relative z-10">Why Choose PGinfo?</h3>
               <div className="flex flex-col gap-5 relative z-10">
                 {[
                   { title: "Verified Listings", desc: "100% verified properties", icon: <CheckCircle className="w-5 h-5 text-white/90" /> },
                   { title: "Best Prices", desc: "Compare & save more", icon: <Shield className="w-5 h-5 text-white/90" /> },
                   { title: "Safe & Secure", desc: "Your safety is our priority", icon: <Shield className="w-5 h-5 text-white/90" /> },
                   { title: "24/7 Support", desc: "We're here to help anytime", icon: <Headset className="w-5 h-5 text-white/90" /> },
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                       {item.icon}
                     </div>
                     <div>
                       <h4 className="font-semibold text-sm mb-0.5">{item.title}</h4>
                       <p className="text-white/80 text-[12px]">{item.desc}</p>
                     </div>
                   </div>
                 ))}
               </div>

               {/* Background Shield Logo (large) */}
               <div className="absolute -bottom-12 -right-4 opacity-[0.15] pointer-events-none">
                 <Shield className="w-64 h-64 text-white" strokeWidth={1.5} />
               </div>
            </div>

          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-8 bg-indigo-50/60 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-indigo-100 relative overflow-hidden">
          <div className="flex-1 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left z-10">
            <div className="w-32 h-24 shrink-0 overflow-hidden flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop" alt="Room" className="w-full h-full object-cover rounded-xl" />
            </div>
            <div className="pt-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Find your perfect PG today!</h2>
              <p className="text-gray-600 text-[13px] max-w-md">Join thousands of students and professionals who've found their ideal home with PGinfo.online</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 z-10">
            <button className="w-full sm:w-auto bg-[var(--color-brand-violet)] hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm shadow-md flex items-center justify-center gap-2">
              Explore PGs <ChevronRight className="w-4 h-4" />
            </button>
            <button className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-900 font-semibold px-6 py-3 rounded-xl transition-colors text-sm border border-gray-200 shadow-sm flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              Join PG Circle
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
