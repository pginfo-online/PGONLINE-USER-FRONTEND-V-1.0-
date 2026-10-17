"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, Clock, Star, Flame, Crown, Sparkles, ArrowUpRight } from 'lucide-react';

interface BuffetCardProps {
  buffet: any;
  index: number;
}

export default function BuffetCard({ buffet, index }: BuffetCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  // Modern pastel theme variations tailored to culinary aesthetics
  const themes = [
    {
      cardBg: 'bg-gradient-to-b from-[#F0FDFA] via-[#F8FFFE] to-white',
      border: 'border-teal-100/80 hover:border-teal-300',
      shadow: 'hover:shadow-[0_20px_40px_-15px_rgba(15,118,110,0.15)]',
      halo: 'border-teal-200/50',
      badge: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white',
      pillBg: 'bg-teal-500/10 text-teal-700',
      strip: 'bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600',
      accentDot: 'bg-teal-500',
    },
    {
      cardBg: 'bg-gradient-to-b from-[#F5F3FF] via-[#FAF8FF] to-white',
      border: 'border-purple-100/80 hover:border-purple-300',
      shadow: 'hover:shadow-[0_20px_40px_-15px_rgba(124,77,255,0.15)]',
      halo: 'border-purple-200/50',
      badge: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white',
      pillBg: 'bg-purple-500/10 text-purple-700',
      strip: 'bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-600',
      accentDot: 'bg-purple-500',
    },
    {
      cardBg: 'bg-gradient-to-b from-[#ECFDF5] via-[#F6FEFA] to-white',
      border: 'border-emerald-100/80 hover:border-emerald-300',
      shadow: 'hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.15)]',
      halo: 'border-emerald-200/50',
      badge: 'bg-gradient-to-r from-emerald-600 to-green-600 text-white',
      pillBg: 'bg-emerald-500/10 text-emerald-700',
      strip: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600',
      accentDot: 'bg-emerald-500',
    },
    {
      cardBg: 'bg-gradient-to-b from-[#FFFBEB] via-[#FFFEF7] to-white',
      border: 'border-amber-100/80 hover:border-amber-300',
      shadow: 'hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.15)]',
      halo: 'border-amber-200/50',
      badge: 'bg-gradient-to-r from-amber-600 to-orange-500 text-white',
      pillBg: 'bg-amber-500/10 text-amber-700',
      strip: 'bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600',
      accentDot: 'bg-amber-500',
    },
  ];

  const theme = themes[index % themes.length];

  // Dynamic status badges
  const getBadge = () => {
    if (buffet.foodType === 'veg') {
      return { label: 'Veg Only', icon: '🥦', color: 'bg-emerald-600' };
    }
    if (index % 4 === 0) {
      return { label: 'Popular', icon: <Flame className="w-3.5 h-3.5 fill-white text-white" />, color: 'bg-emerald-600' };
    }
    if (index % 4 === 1) {
      return { label: 'New Spread', icon: <Sparkles className="w-3.5 h-3.5 text-white" />, color: 'bg-purple-600' };
    }
    if (index % 4 === 2) {
      return { label: 'Pure Veg', icon: '🥦', color: 'bg-emerald-600' };
    }
    return { label: 'Chef Pick', icon: <Crown className="w-3.5 h-3.5 fill-white text-white" />, color: 'bg-amber-600' };
  };

  const badge = getBadge();

  // Primary image fallback
  const fallbackImages = [
    '/assets/images/buffet-1.jpg',
    '/assets/images/buffet-2.jpg',
    '/assets/images/buffet-3.jpg',
    '/assets/images/buffet-4.jpg'
  ];
  const imageUrl =
    (buffet.images && buffet.images.length > 0 && buffet.images[0]?.url)
      ? buffet.images[0].url
      : fallbackImages[index % fallbackImages.length];

  const hotelName = buffet.hotel?.name || 'Grand Dining Hotel';
  const location = `${buffet.hotel?.area || 'Koregaon Park'}, ${buffet.hotel?.city || 'Pune'}`;
  const rating = buffet.hotel?.avgRating || (4.5 + (index % 5) * 0.1).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
      whileHover={{ y: -6 }}
      className={`group relative rounded-3xl overflow-hidden flex flex-col border transition-all duration-300 ${theme.cardBg} ${theme.border} ${theme.shadow} shadow-[0_4px_20px_rgba(0,0,0,0.03)] cursor-pointer`}
    >
      {/* Background Decorative Rings */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-white/60 to-transparent rounded-full -mr-12 -mt-12 pointer-events-none blur-xl" />
      <div className={`absolute top-16 left-3 w-16 h-16 rounded-full border border-dashed ${theme.halo} pointer-events-none opacity-40`} />

      {/* Top Header Controls: Badge & Favorite Button */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20">
        <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1.5 shadow-sm tracking-wide ${badge.color} text-white`}>
          {badge.icon && <span>{badge.icon}</span>}
          <span>{badge.label}</span>
        </span>

        <motion.button
          type="button"
          whileTap={{ scale: 0.82 }}
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-sm ${
            isFavorite 
              ? 'bg-red-50 text-red-500 shadow-red-200 border border-red-200' 
              : 'bg-white/90 hover:bg-white text-gray-400 hover:text-red-500 border border-gray-100 hover:shadow-md'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        </motion.button>
      </div>

      {/* Hero Circular Dish Visual */}
      <div className="pt-12 px-6 pb-3 relative z-10 flex justify-center">
        <div className="relative">
          {/* Subtle Rotating Halo Ring on Card Hover */}
          <div className="absolute inset-[-6px] rounded-full border-2 border-dashed border-gray-200/80 group-hover:border-emerald-400/80 transition-colors duration-500 group-hover:rotate-45" />

          {/* Dish Platter */}
          <div className="w-44 h-44 sm:w-48 sm:h-48 rounded-full overflow-hidden shadow-[0_12px_28px_-6px_rgba(0,0,0,0.16)] border-4 border-white relative bg-slate-100 transition-transform duration-500">
            <img
              src={imageUrl}
              alt={buffet.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = fallbackImages[index % fallbackImages.length];
              }}
            />
            {/* Dish Surface Glare Accent */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/20 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Details Section */}
      <div className="px-5 pb-5 pt-1 flex flex-col gap-1.5 flex-1 relative z-10">
        
        {/* Buffet Name */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-extrabold text-slate-900 text-lg leading-snug line-clamp-1 group-hover:text-emerald-700 transition-colors">
            {buffet.name}
          </h3>
          <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1 opacity-0 group-hover:opacity-100" />
        </div>

        {/* Hotel & Rating Row */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 truncate">
            <span className="font-semibold text-slate-700 truncate">{hotelName}</span>
          </div>
          <div className="flex items-center gap-1 font-bold text-amber-600 bg-amber-50/90 border border-amber-200/70 px-2 py-0.5 rounded-full shrink-0 shadow-2xs">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span>{rating}</span>
          </div>
        </div>

        {/* Location Pin */}
        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate">{location}</span>
        </div>

        {/* Glassmorphic Time & Price Capsules */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-1 border-t border-slate-100/80">
          
          {/* Time Capsule */}
          <div className="bg-white/85 backdrop-blur-md px-3 py-2 rounded-2xl flex items-center gap-2 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className={`p-1.5 rounded-xl ${theme.pillBg} shrink-0`}>
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-extrabold text-slate-900 leading-tight truncate">
                {buffet.startTime || '12:00 PM'}
              </span>
              <span className="text-[9px] text-slate-500 font-medium leading-none mt-0.5 truncate">
                till {buffet.endTime || '3:30 PM'}
              </span>
            </div>
          </div>

          {/* Price Capsule */}
          <div className="bg-white/85 backdrop-blur-md px-3 py-2 rounded-2xl flex items-center gap-2 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className={`p-1.5 rounded-xl ${theme.pillBg} shrink-0 font-black text-xs flex items-center justify-center`}>
              ₹
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-baseline gap-0.5">
                <span className="text-sm font-black text-slate-900 leading-tight">
                  ₹{buffet.pricePerPerson || buffet.price || 499}
                </span>
              </div>
              <span className="text-[9px] text-slate-500 font-medium leading-none mt-0.5">
                / person
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Colored Solid/Gradient Footer Ribbon */}
      <div className={`${theme.strip} text-white px-5 py-2.5 text-[11px] font-semibold tracking-wide flex items-center justify-between shadow-inner`}>
        <div className="truncate flex items-center gap-1.5">
          <span className="uppercase tracking-wider text-[10px] font-extrabold bg-white/20 px-2 py-0.5 rounded-md">
            {buffet.type ? buffet.type.toUpperCase() : 'BUFFET'}
          </span>
          <span className="truncate opacity-95">
            {buffet.cuisine && buffet.cuisine.length > 0 
              ? `• ${buffet.cuisine.slice(0, 3).join(' • ')}`
              : '• Multi-Cuisine Spread'}
          </span>
        </div>
        <span className="text-[10px] uppercase font-bold opacity-0 group-hover:opacity-100 transition-opacity pl-2 shrink-0">
          Book →
        </span>
      </div>
    </motion.div>
  );
}
