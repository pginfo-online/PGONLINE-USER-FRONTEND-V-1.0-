"use client";

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Heart, 
  Share2, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Tag
} from 'lucide-react';

export interface MeetupItem {
  _id: string;
  title: string;
  shortDescription?: string;
  description?: string;
  category?: {
    _id: string;
    name: string;
    displayName: string;
    icon?: string;
    color?: string;
    slug?: string;
  } | null;
  bannerImage?: {
    url?: string;
    publicId?: string;
  } | null;
  images?: Array<{
    url: string;
    publicId?: string;
    isMain?: boolean;
  }>;
  locationType: 'physical' | 'online' | 'hybrid';
  location?: {
    name?: string;
    address?: string;
    city?: string;
    area?: string;
    mapsLink?: string;
  };
  onlineLink?: string;
  scheduleType?: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  participation?: {
    capacity?: number | null;
    registrationType?: 'open' | 'approval' | 'invite';
    isFree?: boolean;
  };
  pricing?: {
    ticketPrice?: number;
    currency?: string;
  };
  createdBy?: {
    _id?: string;
    name?: string;
    email?: string;
    role?: string;
  };
  organizer?: {
    name?: string;
    contact?: string;
  };
  tags?: string[];
  highlights?: string[];
  analytics?: {
    views?: number;
    shares?: number;
    interestedCount?: number;
    goingCount?: number;
  };
  myParticipation?: {
    status?: string;
  } | null;
}

interface MeetupCardProps {
  meetup: MeetupItem;
  onOpenDetails: (meetup: MeetupItem) => void;
  onToggleInterest: (meetupId: string, e: React.MouseEvent) => void;
  isInterested?: boolean;
  isJoined?: boolean;
}

export default function MeetupCard({
  meetup,
  onOpenDetails,
  onToggleInterest,
  isInterested = false,
  isJoined = false,
}: MeetupCardProps) {
  const [imageError, setImageError] = useState(false);

  // Determine display image
  const defaultFallbackImage = 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800';
  const displayImage = !imageError && (meetup.bannerImage?.url || meetup.images?.[0]?.url)
    ? (meetup.bannerImage?.url || meetup.images?.[0]?.url || defaultFallbackImage)
    : defaultFallbackImage;

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Upcoming';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const formattedDate = formatDate(meetup.startDate);
  const timeString = meetup.startTime 
    ? `${meetup.startTime}${meetup.endTime ? ` - ${meetup.endTime}` : ''}`
    : '';

  const isFree = meetup.participation?.isFree ?? (meetup.pricing?.ticketPrice === 0 || !meetup.pricing?.ticketPrice);
  const ticketPrice = meetup.pricing?.ticketPrice || 0;

  const categoryName = meetup.category?.displayName || meetup.category?.name || 'Community';
  const categoryColor = meetup.category?.color || '#0a7ea4';
  const categoryIcon = meetup.category?.icon || '🎯';

  const goingCount = meetup.analytics?.goingCount ?? 0;
  const interestedCount = meetup.analytics?.interestedCount ?? 0;

  const locationLabel = meetup.locationType === 'online'
    ? 'Online via Video'
    : meetup.location?.area && meetup.location?.city
    ? `${meetup.location.area}, ${meetup.location.city}`
    : meetup.location?.city || meetup.location?.name || 'In-Person Venue';

  return (
    <div 
      onClick={() => onOpenDetails(meetup)}
      className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(10,126,164,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Top Image & Overlay Badges */}
      <div className="relative w-full aspect-[16/10] bg-slate-100 overflow-hidden">
        <img
          src={displayImage}
          alt={meetup.title}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Ambient Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

        {/* Top Left: Category Pill */}
        <div 
          className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full text-white text-[11px] font-extrabold shadow-sm flex items-center gap-1.5 backdrop-blur-md border border-white/20"
          style={{ backgroundColor: `${categoryColor}E6` }}
        >
          <span className="text-[12px]">{categoryIcon}</span>
          <span>{categoryName}</span>
        </div>

        {/* Top Right: Free / Price Pill & Interest Toggle */}
        <div className="absolute top-3.5 right-3.5 flex items-center gap-2">
          {isFree ? (
            <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500 text-white shadow-md shadow-emerald-500/30">
              FREE
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-white text-gray-900 shadow-md">
              ₹{ticketPrice}
            </span>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleInterest(meetup._id, e);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all cursor-pointer ${
              isInterested 
                ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/40' 
                : 'bg-white/80 hover:bg-white text-gray-700 hover:text-rose-500 border-white/40 shadow-xs'
            }`}
            title={isInterested ? "Remove from interested" : "Mark as interested"}
          >
            <Heart className={`w-4 h-4 ${isInterested ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom Left: Date & Time Floating Badge */}
        <div className="absolute bottom-3.5 left-3.5 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-2xl text-slate-800 text-xs font-bold shadow-md flex items-center gap-2 border border-white/60">
          <Calendar className="w-3.5 h-3.5 text-[#0a7ea4]" />
          <span>{formattedDate}</span>
          {timeString && (
            <>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-medium">{timeString}</span>
            </>
          )}
        </div>

        {/* Bottom Right: Status badge */}
        {isJoined && (
          <div className="absolute bottom-3.5 right-3.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-xl text-[11px] font-bold border border-emerald-200 flex items-center gap-1 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Joined</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        {/* Venue / Location */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-2">
          <MapPin className="w-3.5 h-3.5 text-[#0a7ea4] shrink-0" />
          <span className="truncate">{locationLabel}</span>
        </div>

        {/* Title */}
        <h3 className="font-extrabold text-slate-900 text-lg leading-snug line-clamp-2 mb-2 group-hover:text-[#0a7ea4] transition-colors">
          {meetup.title}
        </h3>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4">
          {meetup.shortDescription || meetup.description || 'Connect with like-minded peers, make new friends, and share great experiences.'}
        </p>

        {/* Tags preview if any */}
        {meetup.tags && meetup.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {meetup.tags.slice(0, 3).map((tag, idx) => (
              <span 
                key={idx}
                className="px-2 py-0.5 rounded-lg bg-slate-50 text-slate-600 text-[11px] font-medium border border-slate-100"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Bottom Footer Details */}
        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          {/* Attendees / Going count */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2 overflow-hidden">
              <span className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-[#0a7ea4]/20 text-[#0a7ea4] text-[10px] font-bold flex items-center justify-center">
                👤
              </span>
              <span className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center">
                ✨
              </span>
            </div>
            <div className="text-xs text-slate-600 font-bold">
              <span>{goingCount}</span>
              <span className="text-slate-400 font-normal"> going</span>
              {interestedCount > 0 && (
                <span className="text-slate-400 font-normal"> • {interestedCount} interested</span>
              )}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(meetup);
            }}
            className="px-4 py-2 bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-secondary)] text-white rounded-xl font-bold text-xs shadow-md shadow-[#0a7ea4]/20 flex items-center gap-1.5 transition-all transform hover:scale-[1.03] cursor-pointer"
          >
            <span>{isJoined ? 'View Details' : 'Join Meetup'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
