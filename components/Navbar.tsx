"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X, User, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthModal from "./AuthModal";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  
  const isHomePage = pathname === '/';
  // Use transparent style only on home page when at the top
  const useTransparentStyle = isHomePage && !isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = ["Verified PGs", "No Brokerage", "Easy Booking", "Smart Alerts"];
  const services = ["PG for Students", "PG for Girls", "PG for Boys", "Short Stay", "Paying Guest"];

  const getNavClass = (path: string) => {
    // Exact match for home, startsWith for others to catch sub-pages
    const isActive = path === '/' ? pathname === '/' : pathname.startsWith(path);
    if (isActive) {
      return `text-sm font-bold transition-colors pb-1 relative top-[1px] ${
        useTransparentStyle 
          ? 'text-white border-b-2 border-white' 
          : 'text-[var(--color-brand-primary)] border-b-2 border-[var(--color-brand-primary)]'
      }`;
    }
    return `text-sm font-medium transition-colors ${
      useTransparentStyle 
        ? 'text-white/80 hover:text-white' 
        : 'text-gray-700 hover:text-[var(--color-brand-primary)]'
    }`;
  };

  return (
    <header
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        useTransparentStyle
          ? "top-8 bg-transparent py-4"
          : "top-0 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 py-3"
      }`}
    >
      <div className={`max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8`}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/assets/images/pgLogo1.png" alt="PG Info Logo" className="h-10 w-auto object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className={getNavClass('/')}>
              Home
            </Link>
            <Link href="/explore" className={getNavClass('/explore')}>
              Explore PGs
            </Link>
            <Link href="/buffets" className={getNavClass('/buffets')}>
              Buffets
            </Link>
            <Link href="/deals" className={getNavClass('/deals')}>
              Deals
            </Link>
            <Link href="#circle" className={getNavClass('#circle')}>
              Circle
            </Link>
            <Link href="#jobs" className={getNavClass('#jobs')}>
              Jobs
            </Link>
            <Link href="#more" className={getNavClass('#more')}>
              More
            </Link>
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              (() => {
                const userObj = (user as any)?.user || user;
                const displayName = userObj?.name || '';
                const displayContact = userObj?.email || userObj?.phone || '';
                const initial = (displayName.trim()?.[0] || displayContact.trim()?.[0] || 'U').toUpperCase();

                return (
                  <div className="relative">
                    <button 
                      onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                      className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 cursor-pointer bg-gradient-to-br from-[#8B5CF6] via-[#7C3AED] to-[#6366F1] text-white shadow-[0_4px_14px_rgba(124,58,237,0.4)] hover:shadow-[0_6px_20px_rgba(124,58,237,0.55)] hover:scale-105 border border-white/30"
                    >
                      <span className="font-sans font-extrabold text-[16px] tracking-wide relative top-[0.5px] text-white select-none">
                        {initial}
                      </span>
                    </button>

                    <AnimatePresence>
                      {profileMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                        >
                          <div className="py-2">
                            <div className="px-4 py-2 border-b border-gray-50 mb-1">
                              <p className="text-sm font-semibold text-gray-900 truncate">{displayName || 'User'}</p>
                              <p className="text-xs text-gray-500 truncate">{displayContact}</p>
                            </div>
                            <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[var(--color-brand-primary)] transition-colors" onClick={() => setProfileMenuOpen(false)}>
                              <User className="w-4 h-4" /> My Profile
                            </Link>
                        <button 
                          onClick={() => {
                            logout();
                            setProfileMenuOpen(false);
                          }}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                    </AnimatePresence>
                  </div>
                );
              })()
            ) : (
              <button 
                onClick={() => setAuthModalOpen(true)}
                className="px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-secondary)] hover:shadow-lg hover:shadow-[var(--color-brand-primary)]/30 transition-all duration-300 cursor-pointer"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className={`lg:hidden p-2 ${!useTransparentStyle ? 'text-gray-600 hover:text-[var(--color-brand-primary)]' : 'text-white hover:text-gray-200'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden shadow-xl"
          >
            <div className="px-4 py-4 flex flex-col gap-4">
              <Link href="/" className="block py-2 text-base font-medium text-gray-900" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link href="/explore" className="block py-2 text-base font-medium text-gray-700" onClick={() => setMobileMenuOpen(false)}>Explore PGs</Link>
              
              <Link href="/buffets" className="block py-2 text-base font-medium text-gray-700" onClick={() => setMobileMenuOpen(false)}>Buffets</Link>
              <Link href="/deals" className="block py-2 text-base font-medium text-gray-700" onClick={() => setMobileMenuOpen(false)}>Deals</Link>
              <Link href="#circle" className="block py-2 text-base font-medium text-gray-700" onClick={() => setMobileMenuOpen(false)}>Circle</Link>
              <Link href="#jobs" className="block py-2 text-base font-medium text-gray-700" onClick={() => setMobileMenuOpen(false)}>Jobs</Link>
              <Link href="#more" className="block py-2 text-base font-medium text-gray-700" onClick={() => setMobileMenuOpen(false)}>More</Link>
              
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-100">
                {user ? (
                  <>
                    <Link href="/profile" className="flex items-center gap-3 py-2 text-base font-medium text-gray-700" onClick={() => setMobileMenuOpen(false)}>
                      <User className="w-5 h-5 text-gray-400" /> My Profile
                    </Link>
                    <button 
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 py-2 text-base font-medium text-red-600 text-left"
                    >
                      <LogOut className="w-5 h-5 text-red-400" /> Logout
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setAuthModalOpen(true);
                    }}
                    className="flex items-center justify-center w-full py-3 rounded-xl font-semibold text-white bg-[var(--color-brand-primary)] cursor-pointer"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </header>
  );
}
