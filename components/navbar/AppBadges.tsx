import React from 'react';

export function GooglePlayBadge({ className = '' }: { className?: string }) {
  return (
    <a
      href="https://play.google.com/store/apps"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-all border border-slate-700 shadow-sm group cursor-pointer ${className}`}
      aria-label="Get it on Google Play"
    >
      {/* Official Google Play SVG logo */}
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3.609 1.814L13.792 12 3.61 22.186a2.406 2.406 0 0 1-.22-.387 2.39 2.39 0 0 1-.167-.887V3.088c0-.323.058-.624.167-.887.054-.135.127-.266.22-.387z" fill="#00D3FF"/>
        <path d="M17.156 8.636l-3.364 3.364 3.364 3.364 3.824-2.185c1.09-.623 1.09-1.72 0-2.343l-3.824-2.2z" fill="#FFCE00"/>
        <path d="M3.609 1.814l10.183 10.186 3.364-3.364L4.767 1.637c-.394-.226-.826-.174-1.158.177z" fill="#00F076"/>
        <path d="M17.156 15.364l-3.364-3.364L3.609 22.186c.332.35.764.403 1.158.177l12.389-6.999z" fill="#FF3A44"/>
      </svg>
      <div className="flex flex-col text-left leading-none">
        <span className="text-[8px] uppercase tracking-wider text-slate-300">GET IT ON</span>
        <span className="text-[11px] font-semibold text-white tracking-tight">Google Play</span>
      </div>
    </a>
  );
}

export function AppStoreBadge({ className = '' }: { className?: string }) {
  return (
    <a
      href="https://apps.apple.com"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-all border border-slate-700 shadow-sm group cursor-pointer ${className}`}
      aria-label="Download on the App Store"
    >
      {/* Official Apple SVG logo */}
      <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.98.6-2.62 1.35-.57.65-1.07 1.72-.94 2.74 1 .08 2.02-.49 2.64-1.24z"/>
      </svg>
      <div className="flex flex-col text-left leading-none">
        <span className="text-[8px] uppercase tracking-wider text-slate-300">Download on the</span>
        <span className="text-[11px] font-semibold text-white tracking-tight">App Store</span>
      </div>
    </a>
  );
}
