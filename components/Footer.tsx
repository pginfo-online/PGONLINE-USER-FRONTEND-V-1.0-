"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-brand-navy)] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--color-brand-primary)] text-white font-bold text-xl">
                PG
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl leading-none text-white">
                  PGInfo.online
                </span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              India’s trusted platform to discover PG accommodations. Connecting tenants and owners with transparency, safety and trust.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[var(--color-brand-primary)] hover:text-white transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[var(--color-brand-primary)] hover:text-white transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[var(--color-brand-primary)] hover:text-white transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[var(--color-brand-primary)] hover:text-white transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300">Explore</h4>
            <Link href="/explore" className="text-sm text-gray-400 hover:text-white transition-colors">Explore PGs</Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Cities</Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Blog</Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Help Center</Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Community</Link>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300">Owners</h4>
            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">List Your Property</Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Owner Guide</Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Resources</Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Support</Link>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300">Company</h4>
            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">About Us</Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Careers</Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Press</Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Terms & Conditions</Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300">Services</h4>
            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Short Stay</Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Paying Guest</Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Roommates</Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">PG for Girls</Link>
            <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">PG for Boys</Link>
          </div>
        </div>

        {/* Newsletter & Bottom Footer */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex-1 w-full md:max-w-md">
            <p className="text-sm text-gray-400 mb-3">
              Stay updated with new listings, insights, and offers.
            </p>
            <form className="flex w-full gap-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[var(--color-brand-primary)] transition-colors"
                required
              />
              <button 
                type="submit" 
                className="bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-secondary)] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
          <div className="text-sm text-gray-500">
            © 2026 PGInfo.online. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
