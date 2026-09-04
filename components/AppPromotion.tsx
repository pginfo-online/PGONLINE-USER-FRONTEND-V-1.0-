"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Ticket, HeadphonesIcon, MapPin, Star, Building2, Map, Navigation, Compass } from "lucide-react";

export default function AppPromotion() {
  const features = [
    { icon: <CheckCircle2 className="w-5 h-5 text-[var(--color-brand-primary)]" />, title: "Easy Booking" },
    { icon: <ShieldCheck className="w-5 h-5 text-[var(--color-brand-primary)]" />, title: "Verified Listings" },
    { icon: <Ticket className="w-5 h-5 text-[var(--color-brand-primary)]" />, title: "Exclusive Offers" },
    { icon: <HeadphonesIcon className="w-5 h-5 text-[var(--color-brand-primary)]" />, title: "24x7 Support" },
  ];

  return (
    <section className="py-12 mt-8 overflow-hidden relative">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl min-h-[600px] flex items-center">
          
          {/* Project Theme Background (#0A4242 accent gradient) */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A4242]/5 via-white to-[#0A4242]/10 border border-[#0A4242]/10"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 w-full">
            
            {/* Left: 3D Smartphone Mockup */}
            <div className="hidden lg:flex lg:col-span-5 justify-center items-center relative w-full h-[580px]">
              
              {/* Subtle background glow */}
              <div className="absolute w-[400px] h-[400px] bg-emerald-400/15 rounded-full blur-3xl pointer-events-none"></div>

              {/* 3D Floating Phone Image Container */}
              <motion.div 
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                className="relative z-10 flex items-center justify-center cursor-pointer"
              >
                {/* Floating Label 1: Top Left (Clinging to phone) */}
                <motion.div 
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                  className="absolute -top-2 -left-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl px-3.5 py-2 shadow-xl border border-gray-100 flex items-center gap-2"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <span className="text-gray-900 font-extrabold text-xs whitespace-nowrap">100% Verified PGs</span>
                </motion.div>

                {/* Floating Label 2: Middle Right (Clinging to phone) */}
                <motion.div 
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut" }}
                  className="absolute top-28 -right-6 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-gray-100 flex items-center gap-2.5"
                >
                  <div className="w-7 h-7 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold text-[11px]">Premium Twin Sharing</p>
                    <p className="text-blue-600 font-extrabold text-xs">₹8,500<span className="text-gray-400 font-normal text-[9px]">/mo</span></p>
                  </div>
                </motion.div>

                {/* Floating Label 3: Bottom Left (Clinging to phone) */}
                <motion.div 
                  animate={{ y: [0, -7, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                  className="absolute -bottom-2 -left-6 z-20 bg-white/95 backdrop-blur-md rounded-2xl px-3.5 py-2 shadow-xl border border-gray-100 flex items-center gap-2"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <span className="text-gray-900 font-extrabold text-xs whitespace-nowrap">Instant Rent Booking</span>
                </motion.div>

                <img 
                  src="/assets/images/app-phone-3d.png" 
                  alt="PGInfo Mobile App 3D Mockup" 
                  className="w-[500px] max-w-full h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)] transform hover:scale-105 transition-transform duration-500"
                />
              </motion.div>

            </div>

            {/* Center: Content */}
            <div className="lg:col-span-4 text-center lg:text-left flex flex-col items-center lg:items-start">
              <span className="inline-block px-3 py-1 bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] border border-[var(--color-brand-primary)]/20 rounded-full text-xs font-bold tracking-wider mb-6">OUR APP</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-6 drop-shadow-sm">
                The smarter way<br className="hidden lg:block" /> to find your perfect PG!
              </h2>
              <p className="text-gray-600 mb-10 max-w-md text-lg leading-relaxed font-medium">
                Book, manage & stay connected with our all-in-one app. Find roommates, pay rent, and raise requests effortlessly.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-lg lg:max-w-none">
                {features.map((feature, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * idx }}
                    className="flex flex-col items-center lg:items-start gap-3"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center border border-gray-100">
                      {feature.icon}
                    </div>
                    <span className="text-xs font-bold text-gray-700 text-center lg:text-left">{feature.title}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: QR Code & Download CTA */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:col-span-3 flex flex-col items-center justify-center h-full"
            >
              <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-lg border border-gray-100 mb-4 flex flex-col items-center transform hover:-translate-y-1 transition-transform duration-300">
                <p className="text-gray-900 font-extrabold text-sm mb-0.5">Scan to Download</p>
                <p className="text-gray-400 text-xs font-medium mb-4">Get the app now</p>
                <div className="w-32 h-32 bg-gray-50 rounded-xl p-2 shadow-inner mb-1 flex items-center justify-center overflow-hidden relative border border-gray-100">
                  {/* Fake QR code pattern for placeholder */}
                  <div className="absolute inset-2.5 grid grid-cols-8 grid-rows-8 gap-0.5 opacity-60 mix-blend-multiply">
                    {Array.from({length: 64}).map((_, i) => (
                      <div key={i} className={`bg-[#0A4242] rounded-2xs ${(i * 7) % 10 > 3 ? 'opacity-100' : 'opacity-0'}`}></div>
                    ))}
                  </div>
                  {/* Center logo */}
                  <div className="absolute w-8 h-8 bg-[#0A4242] rounded-md flex items-center justify-center text-white font-bold text-xs shadow-md z-10">PG</div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2.5 w-full max-w-[210px]">
                <a 
                  href="https://play.google.com/store/apps/details?id=com.pginfo.onlinee&pcampaignid=web_share" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 bg-[#0A4242] text-white px-4 py-2.5 rounded-xl hover:bg-[#062B2B] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-md border border-[#0A4242]/20 relative group overflow-hidden w-full"
                >
                  <svg viewBox="0 0 512 512" className="w-5 h-5 relative z-10 shrink-0">
                    <path fill="#4285f4" d="M99.6 19.5C92.2 24.3 87.5 32 87.5 42v428c0 10 4.7 17.7 12.1 22.5 7.4 4.8 17.1 5.3 25.1 1.3l270-134.6-96.6-96.6 96.6-96.6L124.7 18.2c-8-4-17.7-3.5-25.1 1.3z"/>
                    <path fill="#fbbc05" d="M297.8 174L476 233.1c9.9 4.9 9.9 19.3 0 24.2L397.4 317 311 230.6l86.4-86.4z"/>
                    <path fill="#ea4335" d="M294.4 246L98.5 442 278.3 352l16.1-106z"/>
                    <path fill="#34a853" d="M98.5 70l195.9 196L278.3 160 98.5 70z"/>
                  </svg>
                  <div className="flex flex-col items-start relative z-10">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-200/80 leading-none mb-1">Get it on</span>
                    <span className="text-xs sm:text-sm font-extrabold leading-none tracking-tight">Google Play</span>
                  </div>
                </a>
                
                <a 
                  href="#" 
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center justify-center gap-3 bg-[#0A4242] text-white px-4 py-2.5 rounded-xl hover:bg-[#062B2B] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-md border border-[#0A4242]/20 relative group overflow-hidden w-full"
                >
                  <svg viewBox="0 0 384 512" className="w-5 h-5 fill-white relative z-10 shrink-0"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                  <div className="flex flex-col items-start relative z-10">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-200/80 leading-none mb-1">Download on the</span>
                    <span className="text-xs sm:text-sm font-extrabold leading-none tracking-tight">App Store</span>
                  </div>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* CSS for custom float animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
      `}} />
    </section>
  );
}
