"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  User,
  Heart,
  Calendar,
  LogOut,
  PlusCircle,
  MapPin,
  ChevronDown,
  Building,
  Home,
  Store,
  Compass,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useUIStore } from "../lib/store/uiStore";
import { useCities } from "../lib/hooks/useCities";
import { GooglePlayBadge, AppStoreBadge } from "./navbar/AppBadges";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { isAuthModalOpen, openAuthModal, closeAuthModal, addToast } = useUIStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Pune");

  const { data: cities = [] } = useCities();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#user-profile-menu")) {
        setProfileDropdownOpen(false);
      }
      if (!target.closest("#header-city-selector")) {
        setCityDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const navLinks = [
    { label: "Explore All", href: "/explore", icon: <Compass className="w-4 h-4" /> },
    { label: "PGs & Co-Living", href: "/explore?category=pg", icon: <Home className="w-4 h-4" /> },
    { label: "Rental Flats", href: "/explore?category=residential_rental", icon: <Building className="w-4 h-4" /> },
    { label: "Commercial", href: "/explore?category=commercial", icon: <Store className="w-4 h-4" /> },
  ];

  const userObj = (user as any)?.user || user;
  const displayName = userObj?.name || "User";
  const displayContact = userObj?.email || userObj?.phone || "";
  const initial = (displayName.trim()?.[0] || displayContact.trim()?.[0] || "U").toUpperCase();

  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
    setCityDropdownOpen(false);
    if (pathname === "/explore") {
      const url = new URL(window.location.href);
      url.searchParams.set("city", cityName);
      url.searchParams.set("page", "1");
      router.push(url.pathname + url.search);
    } else {
      router.push(`/explore?city=${encodeURIComponent(cityName)}`);
    }
  };

  const handlePostProperty = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      addToast("Please sign in to post your property for free", "info");
      openAuthModal("otp");
    } else {
      router.push("/profile");
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200/90 py-2.5"
            : "bg-white border-b border-slate-100 py-3"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 sm:gap-6">
            
            {/* Left: Logo & Location Selector */}
            <div className="flex items-center gap-4 sm:gap-6">
              <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
                <img
                  src="/assets/images/pgLogo1.png"
                  alt="PGInfo"
                  className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
                />
                <div className="flex flex-col">
                  <span className="font-black text-lg sm:text-xl leading-none text-slate-900 tracking-tight">
                    PG<span className="text-teal-700">Info</span>
                  </span>
                  <span className="text-[9px] text-slate-500 font-bold tracking-wider uppercase leading-none mt-0.5">
                    Your Accommodation Partner
                  </span>
                </div>
              </Link>

              {/* Header City Selector (Reference: Screenshot 2026-10-02 062317) */}
              <div id="header-city-selector" className="relative hidden md:block">
                <button
                  type="button"
                  onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                  <span>{selectedCity}</span>
                  <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${cityDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {cityDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 py-1.5">
                      Popular Cities
                    </div>
                    {["Pune", "Mumbai", "Bangalore", "Delhi", "Hyderabad", "Pirangut", "Hinjewadi"].map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => handleCitySelect(city)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                          selectedCity === city
                            ? "bg-teal-50 text-teal-800 font-bold"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span>{city}</span>
                        {selectedCity === city && <span className="w-1.5 h-1.5 rounded-full bg-teal-700" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Middle: Navigation Links */}
            <nav className="hidden xl:flex items-center gap-6" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/explore" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-xs sm:text-sm font-semibold transition-colors hover:text-teal-700 relative py-1 flex items-center gap-1.5 ${
                      isActive
                        ? "text-teal-700 font-bold"
                        : "text-slate-600"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-700 rounded-full"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Middle-Right: App Badges */}
            <div className="hidden 2xl:flex items-center gap-2">
              <GooglePlayBadge />
              <AppStoreBadge />
            </div>

            {/* Right: Post Property FREE & User Profile */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Post Property Button */}
              <button
                type="button"
                onClick={handlePostProperty}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold text-white bg-teal-700 hover:bg-teal-800 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer active:scale-95 shrink-0"
              >
                <PlusCircle className="w-4 h-4 shrink-0" />
                <span className="hidden xs:inline">Post Property</span>
                <span className="bg-white/20 text-white text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-black">
                  FREE
                </span>
              </button>

              {/* User Avatar / Login */}
              {user ? (
                <div id="user-profile-menu" className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors cursor-pointer"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {initial}
                    </div>
                    <span className="hidden sm:inline text-xs font-bold text-slate-800 max-w-[90px] truncate">
                      {displayName}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <p className="text-xs font-bold text-slate-900 truncate">{displayName}</p>
                        <p className="text-[11px] text-slate-500 truncate">{displayContact}</p>
                      </div>

                      <Link
                        href="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <User className="w-4 h-4 text-slate-500" />
                        <span>My Profile &amp; Listings</span>
                      </Link>

                      <Link
                        href="/profile#wishlist"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Heart className="w-4 h-4 text-slate-500" />
                        <span>Saved Properties</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal("otp")}
                  className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="xl:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3"
            >
              {/* Mobile City Selector */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 mb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <MapPin className="w-4 h-4 text-teal-700" />
                  <span>City: {selectedCity}</span>
                </div>
                <select
                  value={selectedCity}
                  onChange={(e) => handleCitySelect(e.target.value)}
                  className="text-xs font-bold text-teal-800 bg-transparent focus:outline-none cursor-pointer"
                >
                  {["Pune", "Mumbai", "Bangalore", "Delhi", "Hyderabad", "Pirangut", "Hinjewadi"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Mobile Post Property FREE Button */}
              <button
                type="button"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handlePostProperty(e);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold text-white bg-teal-700 hover:bg-teal-800 shadow-xs cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post Your Property</span>
                <span className="bg-white/20 text-white text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-black">
                  FREE
                </span>
              </button>

              {/* Mobile Sign In Button (if not logged in) */}
              {!user && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal("otp");
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>Sign In / Register</span>
                </button>
              )}

              <div className="space-y-1 pt-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-teal-700 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                      {link.icon}
                    </div>
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-around">
                <GooglePlayBadge />
                <AppStoreBadge />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Render AuthModal so clicking "Sign In" or "Post Property FREE" opens the modal smoothly! */}
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </>
  );
}
