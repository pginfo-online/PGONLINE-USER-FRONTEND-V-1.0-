"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  MapPin,
  ShieldCheck,
  Building,
  Home,
  Store,
  Calendar,
  Phone,
  Mail,
  Clock,
  Utensils,
  Wifi,
  Snowflake,
  Users,
  Maximize2,
  CheckCircle2,
  Lock,
  Loader2,
  Sparkles,
} from "lucide-react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { usePropertyDetails } from "../../../lib/hooks/usePropertyDetails";
import { useToggleWishlist } from "../../../lib/hooks/useWishlist";
import { useAuth } from "../../../contexts/AuthContext";
import { useUIStore } from "../../../lib/store/uiStore";
import { leadService } from "../../../lib/services/leadService";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PropertyDetailsPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { user, token } = useAuth();
  const { openAuthModal, addToast } = useUIStore();
  const toggleWishlistMutation = useToggleWishlist();

  const { data: property, isLoading, isError, refetch } = usePropertyDetails(id);

  // Gallery state
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Visit Booking State
  const [visitDate, setVisitDate] = useState("");
  const [visitSlot, setVisitSlot] = useState("10:00 AM");
  const [visitMessage, setVisitMessage] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const timeSlots = [
    "09:30 AM",
    "11:00 AM",
    "01:00 PM",
    "03:00 PM",
    "05:00 PM",
    "06:30 PM",
  ];

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: property?.title || "PGInfo Property",
          text: `Check out ${property?.title} on PGInfo!`,
          url,
        });
      } catch {
        // Ignored if user dismissed
      }
    } else {
      navigator.clipboard.writeText(url);
      addToast("Property link copied to clipboard!", "success");
    }
  };

  const handleWishlist = () => {
    if (!user) {
      openAuthModal("otp");
      return;
    }
    if (property?._id) {
      toggleWishlistMutation.mutate(property._id);
    }
  };

  const handleBookVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal("otp");
      return;
    }
    if (!visitDate) {
      addToast("Please choose a visit date", "error");
      return;
    }

    try {
      setIsBooking(true);
      await leadService.bookVisit({
        propertyId: property?._id,
        scheduledDate: visitDate,
        scheduledTime: visitSlot,
        message: visitMessage,
      });
      setBookingSuccess(true);
      addToast("Visit request submitted! Owner will confirm shortly.", "success");
    } catch (err: any) {
      addToast(err?.message || "Failed to schedule visit", "error");
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#0A4242]" />
          <p className="text-sm font-semibold text-slate-600">Loading property details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Property Not Found</h2>
          <p className="text-sm text-slate-500 mb-6 max-w-sm">
            This listing may have been rented out or is currently undergoing review.
          </p>
          <Link
            href="/explore"
            className="px-6 py-2.5 rounded-xl bg-[#0A4242] text-white text-xs font-bold"
          >
            Browse Other Properties
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const photos =
    property.photos && property.photos.length > 0
      ? property.photos
      : [{ url: "/assets/images/banner-pg-hostel.jpg" }];

  const rawPrice =
    property.pricing?.expectedPrice ||
    property.minRent ||
    (property as any)?.rent?.single ||
    0;

  const formattedPrice =
    rawPrice >= 10000000
      ? `₹${(rawPrice / 10000000).toFixed(2)} Cr`
      : rawPrice >= 100000
      ? `₹${(rawPrice / 100000).toFixed(2)} Lac`
      : `₹${Number(rawPrice).toLocaleString("en-IN")}`;

  const isRent = property.purpose !== "sale";
  const isGuest = !user;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Navigation Breadcrumbs & Top Actions */}
        <div className="flex items-center justify-between mb-5">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Search</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <button
              type="button"
              onClick={handleWishlist}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-rose-500 hover:bg-slate-50 shadow-sm transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            >
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Save</span>
            </button>
          </div>
        </div>

        {/* Media Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-8">
          {/* Main Large Image */}
          <div className="lg:col-span-8 relative h-72 sm:h-96 lg:h-[480px] rounded-3xl overflow-hidden shadow-md bg-slate-950 group">
            <img
              src={photos[activePhotoIndex]?.url || "/assets/images/banner-pg-hostel.jpg"}
              alt={property.title}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
            {/* Prev/Next buttons */}
            {photos.length > 1 && (
              <div className="absolute inset-y-0 inset-x-3 flex items-center justify-between pointer-events-none">
                <button
                  type="button"
                  onClick={() =>
                    setActivePhotoIndex(
                      (prev) => (prev - 1 + photos.length) % photos.length
                    )
                  }
                  className="pointer-events-auto w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center shadow-lg transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActivePhotoIndex((prev) => (prev + 1) % photos.length)
                  }
                  className="pointer-events-auto w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center shadow-lg transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
            {/* Category Tag */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-900/85 text-white backdrop-blur-md border border-white/20">
                {property.category === "pg"
                  ? "PG / Co-Living"
                  : property.category === "residential_rental"
                  ? "Rental Flat"
                  : "Commercial Space"}
              </span>
              {property.isVerified && (
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-600 text-white flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails Sidebar */}
          <div className="lg:col-span-4 grid grid-cols-4 lg:grid-cols-2 gap-3 h-auto lg:h-[480px]">
            {photos.slice(0, 4).map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActivePhotoIndex(idx)}
                className={`relative rounded-2xl overflow-hidden h-24 lg:h-full border-2 transition-all ${
                  activePhotoIndex === idx
                    ? "border-[#0A4242] scale-[0.98] shadow-md"
                    : "border-transparent opacity-80 hover:opacity-100"
                }`}
              >
                <img
                  src={img.url}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Content Layout: Details on Left, Booking / Host Box on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Deep Property Specifications */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Key Title & Price Banner */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs sm:text-sm font-medium mt-2">
                    <MapPin className="w-4 h-4 text-teal-700 shrink-0" />
                    <span>
                      {property.area}, {property.city}
                      {property.address && ` — ${property.address}`}
                    </span>
                  </div>
                </div>

                <div className="sm:text-right shrink-0">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block mb-1">
                    {isRent ? "Monthly Rent" : "Selling Price"}
                  </span>
                  <div className="flex items-baseline sm:justify-end gap-1">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      {formattedPrice}
                    </span>
                    {isRent && (
                      <span className="text-xs text-slate-500 font-medium">/ mo</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Fast Highlights Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-100">
                <div className="p-3 bg-slate-50 rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Category
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900 capitalize">
                    {property.category.replace("_", " ")}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Brokerage
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-emerald-600">
                    Zero Brokerage
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Deposit
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                    {property.pricing?.securityDeposit
                      ? `₹${property.pricing.securityDeposit.toLocaleString("en-IN")}`
                      : "1 Month"}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Availability
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                    Immediate
                  </span>
                </div>
              </div>
            </div>

            {/* Category-Specific Deep Information */}

            {/* 1. PG Specific Room Configurations */}
            {property.category === "pg" && property.pgDetails && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
                <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Home className="w-5 h-5 text-[#0A4242]" />
                  <span>Room Configurations &amp; Sharing Pricing</span>
                </h3>

                {property.pgDetails.roomConfigs && property.pgDetails.roomConfigs.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {property.pgDetails.roomConfigs.map((rc, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-bold capitalize text-slate-900">
                            {rc.shareType} Sharing
                          </span>
                          <span className="text-sm font-black text-[#0A4242]">
                            ₹{rc.rent?.toLocaleString("en-IN")}/mo
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 space-y-1">
                          <p>
                            Bathroom:{" "}
                            <span className="font-semibold text-slate-700 capitalize">
                              {rc.bathroomType || "Attached"}
                            </span>
                          </p>
                          {rc.acIncluded && (
                            <p className="text-sky-600 font-semibold">Air Conditioning Included</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    Multiple sharing options (Single, Double, Triple) available. Inquire for exact bed rates.
                  </p>
                )}

                {/* PG Food & Rules */}
                <div className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Utensils className="w-4 h-4 text-teal-700" />
                      <span>Mess &amp; Food Facility</span>
                    </h4>
                    <p className="text-xs font-semibold text-slate-800">
                      Food:{" "}
                      <span className="capitalize">
                        {property.pgDetails.food === "none"
                          ? "Not Provided"
                          : property.pgDetails.food || "Available"}
                      </span>
                    </p>
                    {property.pgDetails.foodIncluded && (
                      <p className="text-xs text-emerald-600 font-bold mt-1">
                        Daily 3 Meals Included in Rent
                      </p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#0A4242]" />
                      <span>Hostel Rules &amp; Curfew</span>
                    </h4>
                    <p className="text-xs text-slate-700">
                      Curfew:{" "}
                      <span className="font-bold">
                        {property.pgDetails.rules?.curfewTime || "No curfew / 10:30 PM"}
                      </span>
                    </p>
                    <p className="text-xs text-slate-700 mt-0.5">
                      Notice Period:{" "}
                      <span className="font-bold">
                        {property.pgDetails.noticePeriod || 30} Days
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Flat Specific Specs */}
            {property.category === "residential_rental" && property.residentialDetails && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
                <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Building className="w-5 h-5 text-[#0A4242]" />
                  <span>Apartment Specifications</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-3.5 bg-slate-50 rounded-2xl">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                      BHK Type
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">
                      {property.residentialDetails.bhk}
                    </span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-2xl">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                      Carpet Area
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">
                      {property.residentialDetails.carpetAreaSqFt} sq.ft
                    </span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-2xl">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                      Furnishing
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 capitalize">
                      {property.residentialDetails.furnishingStatus.replace("_", " ")}
                    </span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-2xl">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                      Bathrooms
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">
                      {property.residentialDetails.bathrooms || 2}
                    </span>
                  </div>
                </div>

                {property.residentialDetails.societyName && (
                  <p className="text-xs text-slate-600 font-medium pt-2">
                    Located inside gated society:{" "}
                    <span className="font-bold text-slate-900">
                      {property.residentialDetails.societyName}
                    </span>
                  </p>
                )}
              </div>
            )}

            {/* 3. Commercial Specific Specs */}
            {property.category === "commercial" && property.commercialDetails && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
                <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Store className="w-5 h-5 text-[#0A4242]" />
                  <span>Commercial Space Specifications</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="p-3.5 bg-slate-50 rounded-2xl">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                      Type
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 capitalize">
                      {property.commercialDetails.commercialSubtype.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-2xl">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                      Carpet Area
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">
                      {property.commercialDetails.carpetAreaSqFt} sq.ft
                    </span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-2xl">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                      Fitout Status
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 capitalize">
                      {property.commercialDetails.fitoutStatus.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 tracking-tight mb-3">
                About this Property
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                {property.description ||
                  "Well-maintained property in a prime residential hub with convenient access to metro stations, bus stops, IT parks, colleges, and supermarkets. Ideal choice with verified security, water supply, and high-speed internet."}
              </p>
            </div>

            {/* Amenities Grid */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
                <h3 className="text-lg font-black text-slate-900 tracking-tight mb-4">
                  Amenities &amp; Facilities
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#0A4242]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nearby Places */}
            {property.nearbyPlaces && property.nearbyPlaces.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
                <h3 className="text-lg font-black text-slate-900 tracking-tight mb-4">
                  Nearby Landmarks &amp; Commute
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.nearbyPlaces.map((np, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                    >
                      <span className="font-bold text-slate-800">{np.name}</span>
                      <span className="text-slate-500 font-semibold bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        {np.distance ? `${np.distance} km` : `${np.walkTime || 5} min walk`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Contact Owner & Schedule Visit */}
          <aside className="lg:col-span-4 space-y-6 sticky top-24">
            
            {/* Host / Owner Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
              <div className="flex items-center gap-3.5 mb-5 pb-5 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-[#0A4242] text-white flex items-center justify-center text-lg font-black shrink-0 shadow-md">
                  {property.owner?.name?.[0]?.toUpperCase() || "O"}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {property.owner?.name || "Property Host / Owner"}
                  </h4>
                  <p className="text-xs text-slate-500">Verified PGInfo Partner</p>
                </div>
              </div>

              {/* Guest Masking vs Authenticated Contact */}
              {isGuest ? (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center mb-5">
                  <Lock className="w-5 h-5 text-amber-700 mx-auto mb-2" />
                  <p className="text-xs font-bold text-amber-900 mb-1">
                    Contact details locked for guests
                  </p>
                  <p className="text-[11px] text-amber-700 mb-3">
                    Sign in with mobile or email to unlock the direct phone number and schedule visits.
                  </p>
                  <button
                    type="button"
                    onClick={() => openAuthModal("otp")}
                    className="w-full py-2.5 rounded-xl bg-[#0A4242] text-white text-xs font-bold hover:bg-[#062b2b] shadow-sm transition-all"
                  >
                    Sign In to Unlock
                  </button>
                </div>
              ) : (
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-800">
                    <Phone className="w-4 h-4 text-teal-700" />
                    <a href={`tel:${property.contactPhone || "9999999999"}`} className="hover:underline">
                      {property.contactPhone || "+91 98765 43210"}
                    </a>
                  </div>
                  {property.contactWhatsapp && (
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-bold text-emerald-800">
                      <span>WhatsApp:</span>
                      <a
                        href={`https://wa.me/${property.contactWhatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                      >
                        {property.contactWhatsapp}
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Schedule Visit Form */}
              <div className="pt-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#0A4242]" />
                  <span>Schedule a Free Visit</span>
                </h4>

                <form onSubmit={handleBookVisit} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={visitDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setVisitDate(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0A4242]/30 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Time Slot
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setVisitSlot(slot)}
                          className={`py-1.5 rounded-lg text-[11px] font-bold transition-all text-center ${
                            visitSlot === slot
                              ? "bg-[#0A4242] text-white shadow-sm"
                              : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isBooking}
                    className="w-full mt-2 py-3.5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-extrabold shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isBooking ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Schedule Visit</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

            </div>

          </aside>

        </div>
      </main>

      <Footer />
    </div>
  );
}
