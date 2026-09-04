"use client";

import { motion } from "framer-motion";
import { Search, MapPin, Calendar } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 pt-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6"
      >
        <div className="flex flex-col md:flex-row items-center gap-4 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          
          {/* Location Field */}
          <div className="flex-1 w-full px-4 py-2 md:py-0">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div className="flex flex-col w-full">
                <input 
                  type="text" 
                  placeholder="Search by location, area or landmark" 
                  className="w-full font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* Check In Field */}
          <div className="w-full md:w-auto md:min-w-[200px] px-4 pt-4 pb-2 md:py-0">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Check In</span>
              <div className="flex items-center justify-between cursor-pointer group">
                <span className="font-medium text-gray-900 group-hover:text-[var(--color-brand-primary)] transition-colors">Select Date</span>
                <Calendar className="w-5 h-5 text-gray-400 group-hover:text-[var(--color-brand-primary)] transition-colors" />
              </div>
            </div>
          </div>

          {/* Check Out Field */}
          <div className="w-full md:w-auto md:min-w-[200px] px-4 pt-4 pb-2 md:py-0">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Check Out</span>
              <div className="flex items-center justify-between cursor-pointer group">
                <span className="font-medium text-gray-900 group-hover:text-[var(--color-brand-primary)] transition-colors">Select Date</span>
                <Calendar className="w-5 h-5 text-gray-400 group-hover:text-[var(--color-brand-primary)] transition-colors" />
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="w-full md:w-auto pl-0 md:pl-4 pt-4 md:pt-0">
            <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-secondary)] text-white px-8 py-4 rounded-xl font-semibold transition-colors shadow-lg shadow-[var(--color-brand-primary)]/30">
              <Search className="w-5 h-5" />
              <span>Search</span>
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
