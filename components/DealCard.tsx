import React, { useState, useEffect } from 'react';
import { Clock, Flame, Tag } from 'lucide-react';

interface DealCardProps {
  deal: any; // We'll type this properly later or just use any for now
}

export default function DealCard({ deal }: DealCardProps) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(deal.endDate).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        return 'Expired';
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);

      if (days > 0) return `${days}d ${hours}h left`;
      return `${hours}h ${minutes}m left`;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // update every minute

    return () => clearInterval(timer);
  }, [deal.endDate]);

  // Fallback image if none
  const imageUrl = deal.coverImage?.url || (deal.images && deal.images.length > 0 ? deal.images[0].url : 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600');
  
  const categoryName = deal.category?.name || 'Deal';
  const categoryColor = deal.category?.color || '#84cc16'; // lime green default

  return (
    <div className="bg-white rounded-3xl overflow-hidden flex flex-col shadow-[0_4px_25px_rgb(0,0,0,0.03)] border border-slate-100 hover:shadow-[0_12px_35px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group">
      {/* Top Image Section */}
      <div className="relative w-full aspect-[16/10] bg-gray-100 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={deal.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top Left Category Pill */}
        <div 
          className="absolute top-3 left-3 px-3 py-1 rounded-full text-white text-[11px] font-extrabold shadow-sm flex items-center gap-1.5 backdrop-blur-xs" 
          style={{ backgroundColor: categoryColor || '#10B981' }}
        >
          <span className="text-[11px]">⚡</span> {categoryName}
        </div>

        {/* Top Right Discount Pill */}
        {deal.discountPercent > 0 && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-red-500 to-rose-600 rounded-full text-white text-[11px] font-black shadow-md shadow-red-500/30 tracking-tight">
            {deal.discountPercent}% OFF
          </div>
        )}

        {/* Bottom Left Timer Pill */}
        <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-slate-800 text-[11px] font-bold shadow-sm flex items-center gap-1.5 border border-white/40">
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>{timeLeft}</span>
        </div>

        {/* Bottom Right Quantity Pill */}
        {deal.availabilityType === 'limited' && deal.remainingQuantity != null && (
          <div className="absolute bottom-3 right-3 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-red-600 text-[11px] font-bold shadow-sm flex items-center gap-1.5 border border-white/40">
            <Flame className="w-3.5 h-3.5 fill-red-500 text-red-500" />
            <span>Only {deal.remainingQuantity} left</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-2.5">
          <h4 className="text-slate-400 font-extrabold text-[11px] uppercase tracking-wider line-clamp-1 flex-1 pr-2">
            {deal.providerName || 'VERIFIED MERCHANT'}
          </h4>
          
          {deal.couponType === 'scratch' ? (
            <div className="shrink-0 bg-purple-50 text-purple-700 px-2.5 py-1 rounded-lg border border-purple-100 text-[11px] font-bold flex items-center gap-1">
              ✨ Scratch Coupon
            </div>
          ) : deal.couponType === 'code' ? (
            <div className="shrink-0 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg border border-blue-100 text-[11px] font-bold flex items-center gap-1">
              <Tag className="w-3 h-3" /> Code
            </div>
          ) : (
            <div className="shrink-0 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-100 text-[11px] font-bold flex items-center gap-1">
              ✓ Direct Deal
            </div>
          )}
        </div>
        
        <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl leading-snug mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {deal.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mb-5 leading-relaxed">
          {deal.shortDescription}
        </p>

        {/* Footer Pricing & CTA */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mb-0.5">Price</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-slate-900 leading-none">₹{deal.dealPrice}</span>
              {deal.originalPrice > deal.dealPrice && (
                <span className="text-xs sm:text-sm text-slate-400 font-medium line-through">₹{deal.originalPrice}</span>
              )}
            </div>
          </div>

          <button className="bg-[#0B132B] hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-slate-900/10 hover:shadow-indigo-500/25 flex items-center gap-1.5 transition-all transform hover:scale-[1.03] cursor-pointer">
            <span>Get Deal</span>
            <span className="text-sm">➔</span>
          </button>
        </div>
      </div>
    </div>
  );
}
