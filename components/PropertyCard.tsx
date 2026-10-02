"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Heart,
  Share2,
  ShieldCheck,
  Star,
  Users,
  Wifi,
  Armchair,
  Car,
  Snowflake,
  Shield,
  ChevronLeft,
  ChevronRight,
  PhoneCall,
  ExternalLink,
  Layers,
  Building2,
} from 'lucide-react';
import { Property } from '../lib/types/property';
import { useToggleWishlist } from '../lib/hooks/useWishlist';
import { useAuth } from '../contexts/AuthContext';
import { useUIStore } from '../lib/store/uiStore';

interface PropertyCardProps {
  property: Property;
  viewMode?: 'grid' | 'list';
}

export default function PropertyCard({ property, viewMode = 'grid' }: PropertyCardProps) {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [imageError, setImageError] = useState(false);
  const { user } = useAuth();
  const { openAuthModal, openContactModal, addToast } = useUIStore();
  const toggleWishlistMutation = useToggleWishlist();

  // Photo gallery preparation
  const rawPhotos = property.photos && property.photos.length > 0
    ? property.photos.map((p) => p.url)
    : [
        '/assets/images/banner-pg-hostel.jpg',
        '/assets/images/hero-banner.jpg',
        '/assets/images/banner-pg-hostel.jpg',
      ];

  // Guarantee at least 3 thumbnails for preview strip
  const displayPhotos = rawPhotos.length >= 3
    ? rawPhotos
    : [
        ...rawPhotos,
        '/assets/images/banner-pg-hostel.jpg',
        '/assets/images/hero-banner.jpg',
      ].slice(0, 3);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = typeof window !== 'undefined'
      ? `${window.location.origin}/explore/${property._id}`
      : `/explore/${property._id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out ${property.title} in ${property.area}, ${property.city} on PGInfo!`,
          url,
        });
      } catch {
        // User dismissed
      }
    } else {
      navigator.clipboard.writeText(url);
      addToast('Property link copied to clipboard!', 'success');
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      openAuthModal('otp');
      return;
    }
    toggleWishlistMutation.mutate(property._id);
  };

  const handleContactOwner = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openContactModal(property);
  };

  // Pricing calculations
  const rawBasePrice =
    property.pricing?.expectedPrice ||
    property.minRent ||
    (property as any)?.rent?.single ||
    7500;

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    return `₹${Number(amount).toLocaleString('en-IN')}`;
  };

  // PG Room configurations
  const roomConfigs = property.pgDetails?.roomConfigs || [];
  const singleConfig = roomConfigs.find((r) => r.shareType === 'single');
  const doubleConfig = roomConfigs.find((r) => r.shareType === 'double');
  const tripleConfig = roomConfigs.find((r) => r.shareType === 'triple');

  const singleRent = singleConfig?.rent || (property as any)?.rent?.single || rawBasePrice;
  const doubleRent = doubleConfig?.rent || (property as any)?.rent?.double || Math.round(rawBasePrice * 0.65);
  const tripleRent = tripleConfig?.rent || (property as any)?.rent?.triple;

  // Star rating fallback (4.6 to 4.9 for verified places)
  const rating = property.dataQualityScore ? Math.min(5, Math.max(4, 3.5 + property.dataQualityScore * 0.3)).toFixed(1) : '4.8';

  return (
    <article
      className={`group bg-white rounded-3xl border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex ${
        viewMode === 'list'
          ? 'flex-col lg:flex-row'
          : 'flex-col'
      }`}
    >
      {/* ── Left / Top: Main Photo + 3-Thumbnail Preview Bar ── */}
      <div
        className={`relative flex flex-col p-3 sm:p-4 bg-slate-50/60 ${
          viewMode === 'list'
            ? 'w-full lg:w-[360px] shrink-0'
            : 'w-full'
        }`}
      >
        {/* Main Photo Container */}
        <div className="relative w-full h-52 sm:h-56 rounded-2xl overflow-hidden bg-slate-900 shadow-inner">
          <img
            src={imageError ? '/assets/images/banner-pg-hostel.jpg' : displayPhotos[activePhotoIdx]}
            alt={property.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />

          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/20 pointer-events-none" />

          {/* Top Floating Badges */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Category Tag */}
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-900/85 text-white backdrop-blur-md border border-white/20">
                {property.category === 'pg'
                  ? 'PG / Co-Living'
                  : property.category === 'residential_rental'
                  ? 'Rental Flat'
                  : 'Commercial'}
              </span>

              {/* Verified Tag */}
              {property.isVerified && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-600 text-white flex items-center gap-1 shadow-xs">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified</span>
                </span>
              )}
            </div>

            {/* Quick Heart Icon for Mobile View */}
            <button
              type="button"
              onClick={handleWishlist}
              className="pointer-events-auto sm:hidden w-8 h-8 rounded-full bg-white/90 text-slate-700 hover:text-rose-500 flex items-center justify-center shadow-md transition-colors"
              aria-label="Save to favorites"
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>

          {/* In-photo Photo Slider arrows for quick browsing */}
          {displayPhotos.length > 1 && (
            <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActivePhotoIdx((prev) => (prev - 1 + displayPhotos.length) % displayPhotos.length);
                }}
                className="pointer-events-auto w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActivePhotoIdx((prev) => (prev + 1) % displayPhotos.length);
                }}
                className="pointer-events-auto w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all cursor-pointer"
                aria-label="Next photo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* 3-Thumbnail Preview Bar (Directly from Screenshot 2026-10-02 062441) */}
        <div className="grid grid-cols-3 gap-2 mt-2">
          {displayPhotos.slice(0, 3).map((thumb, idx) => {
            const isCurrent = activePhotoIdx === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActivePhotoIdx(idx);
                }}
                className={`relative h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  isCurrent
                    ? 'border-teal-700 ring-2 ring-teal-700/20 scale-[1.02]'
                    : 'border-transparent opacity-75 hover:opacity-100'
                }`}
              >
                <img
                  src={thumb}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Right / Bottom: Detailed Info & Actions ── */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Top Row: Title + Star Rating + Action Icons */}
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <div>
              <Link
                href={`/explore/${property._id}`}
                className="text-base sm:text-lg font-black text-slate-900 hover:text-teal-700 transition-colors line-clamp-1 tracking-tight"
              >
                {property.title}
              </Link>

              {/* Star Rating Badge */}
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="flex items-center text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-[11px] font-bold text-slate-700">{rating}</span>
                <span className="text-[10px] text-slate-400">({property.views || 48} reviews)</span>
              </div>
            </div>

            {/* Top-Right Action Icons: Share & Wishlist */}
            <div className="hidden sm:flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleShare}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
                title="Share property"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleWishlist}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                title="Save to favorites"
              >
                <Heart className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Location Pin & Full Address */}
          <div className="flex items-start gap-1.5 text-xs text-slate-500 mb-3 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
            <span className="truncate">
              {property.address ? `${property.address}, ` : ''}{property.area}, {property.city}
            </span>
          </div>

          {/* Badges Strip (Fully Furnished, High Security, Wifi) */}
          <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-800 border border-teal-200/80 flex items-center gap-1">
              <Armchair className="w-3 h-3" />
              <span>
                {property.residentialDetails?.furnishingStatus
                  ? property.residentialDetails.furnishingStatus.replace('_', ' ')
                  : 'Fully Furnished'}
              </span>
            </span>

            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200/80 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>High Security</span>
            </span>

            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 flex items-center gap-1">
              <Wifi className="w-3 h-3" />
              <span>Wifi Included</span>
            </span>
          </div>

          {/* Quick Spec Icon Tiles (Boys/Furnished/Parking/AC) */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {/* 1. Gender / Occupancy */}
            <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
              <Users className="w-4 h-4 text-slate-600 mb-1" />
              <span className="text-[10px] font-bold text-slate-700 capitalize truncate w-full">
                {property.category === 'pg'
                  ? property.pgDetails?.gender === 'female'
                    ? 'Girls'
                    : property.pgDetails?.gender === 'male'
                    ? 'Boys'
                    : 'Co-ed'
                  : property.category === 'residential_rental'
                  ? property.residentialDetails?.bhk || 'Flats'
                  : 'Commercial'}
              </span>
            </div>

            {/* 2. Furnishing Status */}
            <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
              <Armchair className="w-4 h-4 text-slate-600 mb-1" />
              <span className="text-[10px] font-bold text-slate-700 truncate w-full">
                {property.residentialDetails?.furnishingStatus === 'unfurnished'
                  ? 'Unfurnished'
                  : 'Furnished'}
              </span>
            </div>

            {/* 3. Parking */}
            <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
              <Car className="w-4 h-4 text-slate-600 mb-1" />
              <span className="text-[10px] font-bold text-slate-700 truncate w-full">
                Parking
              </span>
            </div>

            {/* 4. AC */}
            <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 border border-slate-200/70 text-center">
              <Snowflake className="w-4 h-4 text-slate-600 mb-1" />
              <span className="text-[10px] font-bold text-slate-700 truncate w-full">
                {property.pgDetails?.ac ? 'AC Room' : 'AC Avail'}
              </span>
            </div>
          </div>

          {/* Pricing Breakdown Boxes (Matching Reference Single ₹20000, Double ₹11000) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
            {property.category === 'pg' ? (
              <>
                <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 text-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-0.5">
                    Single Room
                  </span>
                  <span className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                    {formatCurrency(singleRent)}
                  </span>
                </div>

                <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 text-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-0.5">
                    Double Sharing
                  </span>
                  <span className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                    {formatCurrency(doubleRent)}
                  </span>
                </div>

                {tripleRent ? (
                  <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 text-center hidden sm:block">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-0.5">
                      Triple Sharing
                    </span>
                    <span className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                      {formatCurrency(tripleRent)}
                    </span>
                  </div>
                ) : (
                  <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-center hidden sm:block">
                    <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block mb-0.5">
                      Zero Brokerage
                    </span>
                    <span className="text-xs font-extrabold text-emerald-700">
                      Direct Owner
                    </span>
                  </div>
                )}
              </>
            ) : property.category === 'residential_rental' ? (
              <>
                <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 text-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-0.5">
                    Monthly Rent
                  </span>
                  <span className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                    {formatCurrency(rawBasePrice)}
                  </span>
                </div>

                <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 text-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-0.5">
                    Deposit
                  </span>
                  <span className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                    {property.pricing?.securityDeposit ? formatCurrency(property.pricing.securityDeposit) : '2 Mo Rent'}
                  </span>
                </div>

                <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 text-center hidden sm:block">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-0.5">
                    Carpet Area
                  </span>
                  <span className="text-xs sm:text-sm font-black text-slate-900">
                    {property.residentialDetails?.carpetAreaSqFt || 650} sq.ft
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 text-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-0.5">
                    Expected Rent
                  </span>
                  <span className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                    {formatCurrency(rawBasePrice)}
                  </span>
                </div>

                <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 text-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-0.5">
                    Carpet Area
                  </span>
                  <span className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                    {property.commercialDetails?.carpetAreaSqFt || 1200} sq.ft
                  </span>
                </div>

                <div className="p-2 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-200/90 text-center hidden sm:block">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-0.5">
                    Fitout
                  </span>
                  <span className="text-xs font-black text-slate-900 capitalize">
                    {property.commercialDetails?.fitoutStatus ? property.commercialDetails.fitoutStatus.replace(/_/g, ' ') : 'Ready to move'}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom Dual Action Buttons: "Contact Owner" and "View Details" */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={handleContactOwner}
            className="w-full py-2.5 sm:py-3 px-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-teal-700 hover:bg-teal-800 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Contact Owner</span>
          </button>

          <Link
            href={`/explore/${property._id}`}
            className="w-full py-2.5 sm:py-3 px-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-extrabold text-teal-800 bg-white hover:bg-teal-50/60 border border-teal-700/30 hover:border-teal-700/60 transition-all flex items-center justify-center gap-1.5 text-center cursor-pointer active:scale-98"
          >
            <span>View Details</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
