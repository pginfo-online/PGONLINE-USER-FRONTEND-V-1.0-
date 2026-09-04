"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Download, ShieldCheck, Star, MapPin, CheckCircle, Sparkles, Smartphone } from "lucide-react";
import Link from "next/link";

export default function FinalCTA() {
  const [showAppModal, setShowAppModal] = useState(false);

  const handleDownload = () => {
    setShowAppModal(true);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-gradient-to-br from-[#0A4242] via-[#0F5858] to-[#1E3A8A] rounded-[2.5rem] p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-[0_20px_50px_rgba(10,66,66,0.3)] flex flex-col lg:flex-row items-center justify-between gap-12 border border-white/10">
        
        {/* Ambient Glows & Floating Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-teal-400/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px]"></div>
          
          {/* Floating animated shapes */}
          <motion.div 
            animate={{ y: [0, -15, 0], rotate: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute top-8 right-16 w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-lg hidden sm:flex"
          >
            <ShieldCheck className="w-7 h-7 text-teal-200" />
          </motion.div>

          <motion.div 
            animate={{ y: [0, 15, 0], rotate: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-10 left-12 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-lg hidden sm:flex"
          >
            <Sparkles className="w-6 h-6 text-amber-300" />
          </motion.div>
        </div>

        {/* Left Content Area */}
        <div className="lg:w-7/12 relative z-10 text-center lg:text-left">
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-xs font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>#1 Rated PG Booking Platform</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6 leading-[1.15] tracking-tight">
            The smarter way <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-amber-200 via-teal-100 to-white bg-clip-text text-transparent">
              to find your perfect PG!
            </span>
          </h2>

          <p className="text-teal-100/90 mb-8 max-w-xl mx-auto lg:mx-0 text-base sm:text-lg leading-relaxed font-normal">
            Book, manage & stay connected with PGInfo.online. Join thousands of students and working professionals today.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-8">
            <Link 
              href="/explore" 
              className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#0A4242] px-8 py-4 rounded-2xl font-bold text-base transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 w-full sm:w-auto group cursor-pointer"
            >
              Explore PGs
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-[#0A4242]" />
            </Link>

            <button 
              onClick={handleDownload}
              className="flex items-center justify-center gap-2.5 bg-slate-900/90 hover:bg-slate-900 text-white border border-white/20 px-8 py-4 rounded-2xl font-bold text-base transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 w-full sm:w-auto cursor-pointer"
            >
              <Download className="w-5 h-5 text-teal-300" />
              Download App
            </button>
          </div>

          {/* Store Badges */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 border-t border-white/10">
            <div className="text-white/70 text-xs font-semibold uppercase tracking-wider mr-2">Available on:</div>
            
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2.5 bg-black/40 hover:bg-black/60 border border-white/15 px-4 py-2 rounded-xl transition-all text-white text-left cursor-pointer"
            >
              <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                <path d="M3.6 1.8l12.6 10.2-2.7 2.7L3.6 1.8zM1.8 3.6l10.2 12.6-2.7 2.7L1.8 3.6zM18.9 10.2L15 13.8l3.9 3.6c.6-.6 1.2-1.5 1.2-2.7s-.6-2.1-1.2-4.5z"/>
              </svg>
              <div>
                <p className="text-[9px] text-gray-300 font-medium leading-none uppercase">GET IT ON</p>
                <p className="text-xs font-bold text-white leading-tight">Google Play</p>
              </div>
            </button>

            <button 
              onClick={handleDownload}
              className="flex items-center gap-2.5 bg-black/40 hover:bg-black/60 border border-white/15 px-4 py-2 rounded-xl transition-all text-white text-left cursor-pointer"
            >
              <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.67-.82 1.13-1.96.99-3.11-.98.04-2.18.66-2.88 1.48-.62.72-1.16 1.88-1.01 3.01 1.1.09 2.22-.55 2.9-1.38z"/>
              </svg>
              <div>
                <p className="text-[9px] text-gray-300 font-medium leading-none uppercase">DOWNLOAD ON THE</p>
                <p className="text-xs font-bold text-white leading-tight">App Store</p>
              </div>
            </button>
          </div>

        </div>

        {/* Right Phone Mockup Image */}
        <div className="hidden lg:flex lg:w-5/12 justify-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <img 
              src="/assets/images/app-phone-mockup.png" 
              alt="PGInfo Mobile App" 
              className="w-[340px] max-w-full h-auto drop-shadow-[0_30px_50px_rgba(0,0,0,0.5)] transform hover:scale-105 hover:-rotate-1 transition-transform duration-500"
            />
          </motion.div>
        </div>

      </div>

      {/* App Download Modal */}
      <AnimatePresence>
        {showAppModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowAppModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md bg-white rounded-3xl p-6 shadow-2xl z-50 text-center"
            >
              <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#0A4242]">
                <Smartphone className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-2">Download PGInfo Mobile App</h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Get the best PG booking experience right on your phone! Scan or choose your platform below to download.
              </p>

              <div className="flex flex-col gap-3 mb-6">
                <a 
                  href="https://play.google.com/store" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 bg-slate-900 text-white py-3 px-4 rounded-xl font-bold hover:bg-slate-800 transition-colors"
                >
                  <Download className="w-5 h-5 text-teal-400" />
                  Download for Android (APK / Play Store)
                </a>
                <a 
                  href="https://apple.com/app-store" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 bg-gray-100 text-gray-800 py-3 px-4 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Download for iOS (App Store)
                </a>
              </div>

              <button 
                onClick={() => setShowAppModal(false)}
                className="text-xs text-gray-400 hover:text-gray-600 font-semibold cursor-pointer"
              >
                Close Window
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
