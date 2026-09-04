import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, Clock, Star, Flame, Crown } from 'lucide-react';
import Image from 'next/image';

interface BuffetCardProps {
  buffet: any; // We'll type this properly later or just use any for now
  index: number;
}

export default function BuffetCard({ buffet, index }: BuffetCardProps) {
  // Define themes based on index for the colorful variations seen in the app
  const themes = [
    { bg: 'bg-[#fff4ed]', strip: 'bg-[#d9534f]', text: 'text-[#d9534f]', badge: 'bg-[#d9534f]' }, // Orange/Red
    { bg: 'bg-[#f4f0ff]', strip: 'bg-[#7c4dff]', text: 'text-[#7c4dff]', badge: 'bg-[#7c4dff]' }, // Purple
    { bg: 'bg-[#ecfdf5]', strip: 'bg-[#10b981]', text: 'text-[#10b981]', badge: 'bg-[#10b981]' }, // Green
    { bg: 'bg-[#fffbeb]', strip: 'bg-[#f59e0b]', text: 'text-[#f59e0b]', badge: 'bg-[#f59e0b]' }, // Yellow
  ];
  const theme = themes[index % themes.length];

  // Determine badge based on food type or other props
  const getBadge = () => {
    if (buffet.foodType === 'veg') return { label: 'Veg', icon: '🥦', color: 'bg-green-600' };
    if (index % 3 === 0) return { label: 'Popular', icon: <Flame className="w-3.5 h-3.5 fill-white text-white" />, color: 'bg-green-600' };
    if (index % 4 === 0) return { label: 'Special', icon: <Crown className="w-3.5 h-3.5 fill-white text-white" />, color: 'bg-[#b45309]' };
    return { label: 'New', icon: null, color: 'bg-purple-600' };
  };
  const badge = getBadge();

  // Fallback image if none
  const imageUrl = buffet.images && buffet.images.length > 0 ? buffet.images[0].url : 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600';
  const hotelName = buffet.hotel?.name || 'Hotel Name';
  const location = `${buffet.hotel?.area || 'Area'}, ${buffet.hotel?.city || 'City'}`;
  const rating = buffet.hotel?.avgRating || 4.2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative rounded-3xl overflow-hidden flex flex-col shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer ${theme.bg}`}
    >
      {/* Top Section - Badges & Heart */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
        <div className={`px-3 py-1.5 rounded-full text-white text-xs font-bold flex items-center gap-1.5 shadow-sm ${badge.color}`}>
          {badge.icon && <span>{badge.icon}</span>}
          {badge.label}
        </div>
        <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400 hover:text-red-500 hover:scale-110 transition-all">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* Decorative background vectors (Subtle flowers/leaves) */}
      <div className="absolute top-10 left-2 opacity-10">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
      </div>
      <div className="absolute top-20 right-4 opacity-10">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/></svg>
      </div>

      {/* Circular Image Container */}
      <div className="pt-14 px-6 pb-2 relative z-10 flex justify-center">
        <div className="w-full aspect-square max-w-[200px] rounded-full overflow-hidden shadow-xl border-4 border-white/50 relative bg-black/5">
          {/* Using standard img tag with absolute positioning to perfectly match Next.js fill behavior */}
          <img 
            src={imageUrl} 
            alt={buffet.name} 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 text-transparent" 
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="px-5 pb-5 pt-2 flex flex-col gap-1.5 flex-1 relative z-10">
        <h3 className="font-bold text-gray-900 text-[18px] leading-tight line-clamp-1">{buffet.name}</h3>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700 font-medium line-clamp-1">{hotelName}</span>
          <div className="flex items-center gap-1 text-[#f59e0b] font-bold text-xs bg-white/50 px-1.5 py-0.5 rounded">
            <Star className="w-3 h-3 fill-current" /> {rating}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-gray-500 text-xs mt-0.5">
          <MapPin className="w-3.5 h-3.5" />
          <span className="truncate">{location}</span>
        </div>

        {/* Time and Price Pills */}
        <div className="flex items-center gap-2 mt-4">
          <div className="flex-1 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-xl flex items-center gap-2 shadow-sm border border-white">
            <div className={`p-1.5 rounded-full bg-opacity-20 ${theme.bg} ${theme.text}`}>
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-gray-900 leading-none">{buffet.startTime}</span>
              <span className="text-[9px] text-gray-500 leading-none mt-0.5">- {buffet.endTime}</span>
            </div>
          </div>
          
          <div className="flex-1 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-xl flex items-center gap-2 shadow-sm border border-white">
            <div className={`p-1.5 rounded-full bg-opacity-20 ${theme.bg} ${theme.text}`}>
              <span className="font-bold text-[10px] leading-none flex items-center justify-center">₹</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-bold text-gray-900 leading-none">₹{buffet.pricePerPerson}</span>
              <span className="text-[9px] text-gray-500 leading-none mt-0.5">/ person</span>
            </div>
          </div>
        </div>
      </div>

      {/* Colored Footer Strip */}
      <div className={`${theme.strip} text-white px-5 py-2.5 text-[11px] font-medium tracking-wide flex items-center justify-center truncate`}>
        {buffet.type ? buffet.type.charAt(0).toUpperCase() + buffet.type.slice(1) : 'Buffet'}
        {buffet.cuisine && buffet.cuisine.length > 0 && ` • ${buffet.cuisine.slice(0, 3).join(' • ')}`}
      </div>
    </motion.div>
  );
}
