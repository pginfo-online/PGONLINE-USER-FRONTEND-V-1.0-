"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, Award, CheckCircle2, MessageCircle, Star, Sparkles } from "lucide-react";
import UnifiedSearchModule from "./search/UnifiedSearchModule";
import Link from "next/link";

export default function Hero() {
  const trustHighlights = [
    { label: "100% Verified Properties", icon: <ShieldCheck className="w-4 h-4 text-emerald-600" /> },
    { label: "Direct Owner Connect", icon: <Zap className="w-4 h-4 text-teal-600" /> },
    { label: "Zero Hidden Charges", icon: <Award className="w-4 h-4 text-blue-600" /> },
  ];

  const stats = [
    { value: "50K+", label: "Listings", desc: "Verified rooms & flats" },
    { value: "200+", label: "Cities", desc: "Across India" },
    { value: "1L+", label: "Happy Tenants", desc: "Discovered homes" },
    { value: "₹0", label: "Brokerage", desc: "Direct owner options" },
  ];

  return (
    <section className="relative w-full bg-gradient-to-b from-teal-50/40 via-white to-slate-50/80 pt-8 sm:pt-14 pb-16 sm:pb-24 overflow-hidden border-b border-slate-100">
      {/* Subtle Luminous Background Glows (clean, warm, light mode) */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-teal-100/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-10 w-[400px] h-[400px] bg-blue-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Split Section: Pitch on Left, Dual Overlapping Photo Showcase on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-10 sm:mb-14">
          
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Super Header Badge (Inspired by Screenshot 2026-10-02 062317) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-extrabold tracking-wide uppercase mb-4"
            >
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
              <span>• Trusted by 1L+ users across India</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12] mb-4 sm:mb-5"
            >
              Discover Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-teal-600 to-blue-700">
                Next Home
              </span>{" "}
              Effortlessly
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.16 }}
              className="text-slate-600 text-base sm:text-lg lg:text-xl font-medium leading-relaxed max-w-2xl mb-6"
            >
              Search verified PGs, co-living spaces, rental flats &amp; commercial properties with zero brokerage and instant owner connect.
            </motion.p>

            {/* Trust Highlights Badges Row */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.24 }}
              className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs font-bold text-slate-700 mb-8"
            >
              {trustHighlights.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 bg-white border border-slate-200/80 px-3 py-1.5 rounded-xl shadow-2xs"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              ))}
            </motion.div>

            {/* Direct Numbers Strip (50K+ Listings, 200+ Cities, 1L+ Users, 0 Brokerage) */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-4 border-t border-slate-200/70 w-full"
            >
              {stats.map((s, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mb-1">
                    {s.value}
                  </span>
                  <span className="text-xs font-bold text-teal-800 leading-tight">
                    {s.label}
                  </span>
                  <span className="text-[11px] text-slate-400 leading-tight hidden sm:block">
                    {s.desc}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Visual Overlapping Photo Cards (Directly matching Screenshot 2026-10-02 062317) */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[420px] h-[380px] sm:h-[440px]">
              
              {/* Card 1: Top Right Overlapping Photo Card */}
              <motion.div
                initial={{ opacity: 0, y: -20, rotate: 2 }}
                animate={{ opacity: 1, y: 0, rotate: 3 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="absolute top-0 right-2 w-56 sm:w-64 h-56 sm:h-64 rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100 group"
              >
                <img
                  src="/assets/images/twin-sharing.jpg"
                  alt="Co-living Student Space"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-bold drop-shadow-sm">
                  <span>Furnished Co-Living</span>
                </div>
              </motion.div>

              {/* Card 2: Bottom Left Overlapping Photo Card */}
              <motion.div
                initial={{ opacity: 0, y: 20, rotate: -2 }}
                animate={{ opacity: 1, y: 0, rotate: -2 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute bottom-4 left-2 w-64 sm:w-72 h-64 sm:h-72 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 group"
              >
                <img
                  src="/assets/images/hero-banner.jpg"
                  alt="Premium Luxury Bedroom"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

                {/* Floating Verified Chip on bottom card */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-emerald-800 text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Verified</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-1 text-amber-300 text-xs mb-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                    <span className="text-white font-bold ml-1">4.9</span>
                  </div>
                  <h4 className="text-sm sm:text-base font-extrabold leading-tight">
                    Premium Managed Flats
                  </h4>
                  <p className="text-[11px] text-slate-200">Zero Brokerage Options</p>
                </div>
              </motion.div>

              {/* Decorative Accent Pill */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="absolute -bottom-2 right-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-slate-200/80 flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-xl bg-teal-100/80 text-teal-800 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900 leading-none">Instant Booking</p>
                  <p className="text-[10px] text-slate-500 leading-none mt-0.5">Direct Owner Connect</p>
                </div>
              </motion.div>

            </div>
          </div>

        </div>

        {/* Center/Bottom: Large Unified Search Module */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.35 }}
          className="relative z-20"
        >
          <UnifiedSearchModule />
        </motion.div>

      </div>

      {/* Floating WhatsApp Action Button (Seen in Screenshot 2026-10-02 062317 & 062441) */}
      <a
        href="https://wa.me/919876543210?text=Hi%20PGInfo,%20I%20need%20help%20finding%20accommodation"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer group"
        aria-label="Contact support on WhatsApp"
      >
        <MessageCircle className="w-6 sm:w-7 h-6 sm:h-7 fill-current" />
        <span className="sr-only">Chat on WhatsApp</span>
      </a>
    </section>
  );
}
