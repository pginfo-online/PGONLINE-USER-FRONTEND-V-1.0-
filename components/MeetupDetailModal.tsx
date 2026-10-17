"use client";

import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Heart, 
  Share2, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles,
  ShieldCheck,
  Building2,
  Info,
  Check,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MeetupItem } from './MeetupCard';

interface MeetupDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetup: MeetupItem | null;
  onToggleInterest: (meetupId: string) => Promise<void> | void;
  onJoinMeetup: (meetupId: string) => Promise<void> | void;
  isInterested?: boolean;
  isJoined?: boolean;
  isActionLoading?: boolean;
}

export default function MeetupDetailModal({
  isOpen,
  onClose,
  meetup,
  onToggleInterest,
  onJoinMeetup,
  isInterested = false,
  isJoined = false,
  isActionLoading = false,
}: MeetupDetailModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !meetup) return null;

  // Compile photos list
  const defaultFallbackImage = 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1200';
  const photos = meetup.images && meetup.images.length > 0
    ? meetup.images.map(img => img.url)
    : meetup.bannerImage?.url
    ? [meetup.bannerImage.url]
    : [defaultFallbackImage];

  const currentPhoto = photos[activeImageIndex] || photos[0] || defaultFallbackImage;

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Date TBA';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const isFree = meetup.participation?.isFree ?? (meetup.pricing?.ticketPrice === 0 || !meetup.pricing?.ticketPrice);
  const ticketPrice = meetup.pricing?.ticketPrice || 0;

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      try {
        await navigator.share({
          title: meetup.title,
          text: `Check out this meetup: ${meetup.title}`,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const googleMapsUrl = meetup.location?.mapsLink || (
    meetup.location?.name
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${meetup.location.name} ${meetup.location.address || ''} ${meetup.location.city || ''}`
        )}`
      : null
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] my-auto"
        >
          {/* Header Close & Share Actions */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-md backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="Share meetup"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-md backdrop-blur-md hover:text-gray-900 transition-all cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div className="overflow-y-auto hide-scrollbar flex-1">
            {/* Main Cover Photo & Gallery */}
            <div className="relative w-full aspect-[21/9] min-h-[220px] sm:min-h-[280px] bg-slate-900">
              <img
                src={currentPhoto}
                alt={meetup.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Badges on Cover */}
              <div className="absolute bottom-4 left-4 sm:left-6 right-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span 
                    className="px-3.5 py-1 rounded-full text-white text-xs font-black shadow-md flex items-center gap-1.5 backdrop-blur-md border border-white/20"
                    style={{ backgroundColor: `${meetup.category?.color || '#0a7ea4'}EE` }}
                  >
                    <span>{meetup.category?.icon || '🎯'}</span>
                    <span>{meetup.category?.displayName || meetup.category?.name || 'Community'}</span>
                  </span>

                  {isFree ? (
                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500 text-white shadow-md">
                      FREE ENTRY
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white text-gray-900 shadow-md">
                      ₹{ticketPrice} / person
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-white/90 text-xs font-semibold bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{meetup.analytics?.goingCount || 0} attending</span>
                </div>
              </div>
            </div>

            {/* Photo Thumbnails if multiple */}
            {photos.length > 1 && (
              <div className="flex gap-2 p-3 bg-slate-50 border-b border-slate-100 overflow-x-auto hide-scrollbar">
                {photos.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx ? 'border-[#0a7ea4] scale-105 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={p} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Content Details */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Title & Date banner */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                  {meetup.title}
                </h2>
                {meetup.shortDescription && (
                  <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed">
                    {meetup.shortDescription}
                  </p>
                )}
              </div>

              {/* Event Key Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date & Time Box */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#0a7ea4]/10 text-[#0a7ea4] flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date & Time</div>
                    <div className="text-sm font-extrabold text-slate-900 mt-0.5">{formatDate(meetup.startDate)}</div>
                    {meetup.startTime && (
                      <div className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mt-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{meetup.startTime}{meetup.endTime ? ` - ${meetup.endTime}` : ''}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location Box */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location & Venue</div>
                    <div className="text-sm font-extrabold text-slate-900 mt-0.5 truncate">
                      {meetup.location?.name || meetup.location?.city || 'Venue Details Provided Upon RSVP'}
                    </div>
                    {meetup.location?.address && (
                      <div className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                        {meetup.location.address}
                      </div>
                    )}
                    {googleMapsUrl && (
                      <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#0a7ea4] hover:text-[#086989] mt-2 group"
                      >
                        <span>Open in Google Maps</span>
                        <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Host / Organizer Banner */}
              <div className="bg-[#0a7ea4]/5 rounded-2xl p-4 border border-[#0a7ea4]/15 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#0a7ea4] to-cyan-400 text-white font-black text-sm flex items-center justify-center shadow-sm">
                    {meetup.createdBy?.name ? meetup.createdBy.name.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <div>
                    <div className="text-xs text-[#0a7ea4] font-bold uppercase tracking-wider">Organized By</div>
                    <div className="text-sm font-extrabold text-slate-900">
                      {meetup.organizer?.name || meetup.createdBy?.name || 'Community Ambassador'}
                    </div>
                    <div className="text-xs text-slate-500">
                      Verified Community Host • PG Circle
                    </div>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/60 px-3 py-1.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified Meetup</span>
                </div>
              </div>

              {/* Description */}
              {meetup.description && (
                <div>
                  <h4 className="text-base font-extrabold text-slate-900 mb-2.5">
                    About this Meetup
                  </h4>
                  <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line space-y-2">
                    {meetup.description}
                  </div>
                </div>
              )}

              {/* Highlights if any */}
              {meetup.highlights && meetup.highlights.length > 0 && (
                <div>
                  <h4 className="text-base font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#0a7ea4]" />
                    <span>What to Expect</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {meetup.highlights.map((h, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {meetup.tags && meetup.tags.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tags & Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {meetup.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modal Sticky Bottom Action Bar */}
          <div className="p-4 sm:p-5 bg-white border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onToggleInterest(meetup._id)}
                disabled={isActionLoading}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border flex items-center gap-2 transition-all cursor-pointer ${
                  isInterested
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <Heart className={`w-4 h-4 ${isInterested ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{isInterested ? 'Interested' : 'Interested?'}</span>
              </button>

              <div className="text-xs text-slate-500 hidden sm:block">
                <span className="font-bold text-slate-800">{meetup.analytics?.interestedCount || 0}</span> people interested
              </div>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Close
              </button>

              <button
                onClick={() => onJoinMeetup(meetup._id)}
                disabled={isActionLoading}
                className={`px-6 sm:px-8 py-2.5 rounded-2xl text-xs sm:text-sm font-black text-white shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer flex items-center gap-2 ${
                  isJoined
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25'
                    : 'bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-secondary)] shadow-[#0a7ea4]/30'
                }`}
              >
                {isJoined ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>You're Attending!</span>
                  </>
                ) : (
                  <>
                    <span>{isFree ? 'Join Free Meetup' : `Book Ticket (₹${ticketPrice})`}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
