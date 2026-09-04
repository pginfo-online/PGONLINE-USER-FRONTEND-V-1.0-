"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const HERO_SLIDES = [
  {
    id: "pg-hostel",
    eyebrow: "VERIFIED CO-LIVING & HOSTELS",
    title: "Premium Co-Living & Student Hostels",
    subtitle: "Modern, fully-furnished PG & hostel spaces with high-speed WiFi, security & daily housekeeping.",
    ctaText: "Explore PGs",
    ctaLink: "/explore",
    image: "/assets/images/banner-pg-hostel.jpg",
    badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    glowColor: "from-emerald-950/80 via-black/60 to-transparent",
    buttonBg: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30"
  },
  {
    id: "buffets",
    eyebrow: "EXPLORE DINING SPREADS",
    title: "Unlimited Feasts & Gourmet Dining",
    subtitle: "Eat more, pay less. Handcrafted multi-cuisine spreads, tandoori sizzlers & live food counters near you.",
    ctaText: "Discover Buffets",
    ctaLink: "/buffets",
    image: "/assets/images/banner-buffets.jpg",
    badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    glowColor: "from-amber-950/80 via-black/60 to-transparent",
    buttonBg: "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/30"
  },
  {
    id: "deals",
    eyebrow: "EXCLUSIVE DEALS & DISCOUNTS",
    title: "Exclusive Offers & Everyday Savings",
    subtitle: "Save up to 80% on everyday essentials, food, services, shopping & experiences for the PG community.",
    ctaText: "Explore Deals",
    ctaLink: "/deals",
    image: "/assets/images/banner-deals.jpg",
    badgeBg: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    glowColor: "from-purple-950/80 via-black/60 to-transparent",
    buttonBg: "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/30"
  },
  {
    id: "circle",
    eyebrow: "COMMUNITY & SOCIAL HANGOUTS",
    title: "Social Meetups & Community Hangouts",
    subtitle: "Network with like-minded students, make lifelong friends, join weekend events & gaming hubs.",
    ctaText: "Join Circle",
    ctaLink: "/circle",
    image: "/assets/images/banner-circle.jpg",
    badgeBg: "bg-rose-500/20 text-rose-300 border-rose-500/40",
    glowColor: "from-rose-950/80 via-black/60 to-transparent",
    buttonBg: "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30"
  },
  {
    id: "jobs",
    eyebrow: "CAREERS & INTERNSHIPS",
    title: "Career Opportunities & Tech Roles",
    subtitle: "Curated fresher jobs, remote tech roles, and verified internships tailored for students & graduates.",
    ctaText: "Browse Jobs",
    ctaLink: "/jobs",
    image: "/assets/images/banner-jobs.jpg",
    badgeBg: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    glowColor: "from-blue-950/80 via-black/60 to-transparent",
    buttonBg: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30"
  },
];

const DEFAULT_ROOMS = [
  {
    title: "Premium Single Room",
    subtitle: "Ultimate Privacy & Comfort",
    price: "₹8,500",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
    _id: "dummy-1"
  },
  {
    title: "Deluxe Twin Sharing",
    subtitle: "Perfect for Friends",
    price: "₹6,000",
    image: "/assets/images/twin-sharing.jpg",
    _id: "dummy-2"
  },
  {
    title: "Modern Co-living Space",
    subtitle: "Vibrant Community Living",
    price: "₹4,500",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop",
    _id: "dummy-3"
  },
];

export default function Hero() {
  const [rooms] = useState(DEFAULT_ROOMS);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  // Automatic slide every 3.8 seconds continuously
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const active = HERO_SLIDES[currentSlide];

  return (
    <section className="relative w-full pb-32 lg:pb-48 bg-[#0a2540] pt-8 overflow-hidden">
      {/* Background Image Container */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-0">
        <div className="relative w-full h-[450px] sm:h-[480px] lg:h-[530px] rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-900 group">
          {/* Animated Background Slides */}
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={active.id}
              custom={direction}
              initial={{ x: direction > 0 ? "100%" : "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction < 0 ? "100%" : "-100%", opacity: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <img 
                src={active.image} 
                alt={active.title}
                className="w-full h-full object-cover object-center"
              />
              {/* Dynamic Gradient Overlays */}
              <div className={`absolute inset-0 bg-gradient-to-r ${active.glowColor}`} />
              <div className="absolute inset-0 bg-black/45" />
            </motion.div>
          </AnimatePresence>
          
          {/* Left-Aligned Animated Text Content */}
          <div className="absolute inset-x-0 top-0 bottom-36 sm:bottom-40 lg:bottom-44 flex flex-col items-start justify-center text-left px-6 sm:px-12 lg:px-20 pt-4 z-10 pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="max-w-3xl pointer-events-auto"
              >
                {/* Main Heading */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-white tracking-wide leading-tight mb-3 drop-shadow-md">
                  {active.title}
                </h1>
                
                {/* Subtitle */}
                <p className="text-white/90 text-xs sm:text-sm lg:text-base font-light tracking-wide leading-relaxed drop-shadow-sm mb-6 max-w-xl">
                  {active.subtitle}
                </p>

                {/* CTA Button */}
                <div className="flex items-center gap-4">
                  <Link 
                    href={active.ctaLink}
                    className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-none font-medium text-xs tracking-widest uppercase transition-all duration-300 border border-white/80 hover:border-white text-white bg-black/20 hover:bg-white hover:text-gray-900 backdrop-blur-sm cursor-pointer shadow-md"
                  >
                    <span>{active.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>



        </div>

        {/* Overlapping Room Cards */}
        <div className="absolute left-0 right-0 -bottom-32 lg:-bottom-40 px-4 sm:px-12 lg:px-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 max-w-[960px] mx-auto">
            {rooms.map((room, idx) => (
              <motion.div 
                key={room._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + (idx * 0.1) }}
                className="bg-white shadow-xl flex flex-col"
              >
                <div className="h-32 sm:h-36 w-full overflow-hidden bg-gray-100">
                  <img 
                    src={room.image} 
                    alt={room.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-5 sm:p-6 flex flex-col flex-1">
                  <h3 className="font-serif text-lg sm:text-xl text-gray-800 mb-1 line-clamp-1">{room.title}</h3>
                  <p className="text-sm text-gray-500 mb-6 line-clamp-1">{room.subtitle}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <Link href="/explore" className="bg-[var(--color-brand-primary)] hover:opacity-90 text-white text-xs font-semibold px-4 sm:px-6 py-2.5 tracking-wider uppercase transition-colors text-center inline-block">
                      View Properties
                    </Link>
                    <div className="text-right pl-2">
                      <p className="text-base sm:text-lg font-serif text-gray-800">{room.price}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">per month</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
