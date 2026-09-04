"use client";

import { motion } from "framer-motion";
import { Heart, MapPin, Wifi, Utensils, Snowflake, Star } from "lucide-react";

interface PropertyCardProps {
  name: string;
  location: string;
  price: string;
  rating: number;
  image: string;
  featured?: boolean;
}

export default function PropertyCard({ name, location, price, rating, image, featured }: PropertyCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 group cursor-pointer"
    >
      {/* Image Area */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {featured && (
            <span className="bg-[var(--color-brand-primary)] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              Featured
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white text-gray-400 hover:text-red-500 flex items-center justify-center shadow-md transition-colors">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* Content Area */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg text-gray-900 leading-tight">{name}</h3>
            <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{location}</span>
            </div>
          </div>
        </div>

        <div className="mt-3 mb-4">
          <span className="text-xl font-bold text-[var(--color-brand-primary)]">{price}</span>
          <span className="text-sm text-gray-500"> /month</span>
        </div>

        {/* Amenities & Rating */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4 text-gray-500">
            <div className="flex items-center gap-1" title="Wi-Fi">
              <Wifi className="w-4 h-4" />
              <span className="text-xs font-medium hidden sm:inline">Wi-Fi</span>
            </div>
            <div className="flex items-center gap-1" title="Food">
              <Utensils className="w-4 h-4" />
              <span className="text-xs font-medium hidden sm:inline">Food</span>
            </div>
            <div className="flex items-center gap-1" title="AC">
              <Snowflake className="w-4 h-4" />
              <span className="text-xs font-medium hidden sm:inline">AC</span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-green-50 text-[var(--color-brand-green)] px-2 py-1 rounded text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{rating}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
