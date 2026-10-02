"use client";

import React, { Suspense, useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutGrid,
  List,
  SlidersHorizontal,
  Home,
  Building,
  Store,
  MapPin,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  ShieldCheck,
  RotateCcw,
  ChevronDown,
  Compass,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PropertyCard from "../../components/PropertyCard";
import PropertyFilters from "../../components/properties/PropertyFilters";
import PropertySort from "../../components/properties/PropertySort";
import { PropertyCardSkeleton } from "../../components/ui/Skeleton";
import EmptyState from "../../components/properties/EmptyState";
import BottomSheet from "../../components/ui/BottomSheet";
import ContactOwnerModal from "../../components/ContactOwnerModal";
import { useProperties } from "../../lib/hooks/useProperties";
import { PropertyCategory, PropertySearchParams } from "../../lib/types/property";
import { useUIStore } from "../../lib/store/uiStore";
import { useCities } from "../../lib/hooks/useCities";

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { viewMode, setViewMode, isFilterSheetOpen, setFilterSheetOpen } = useUIStore();
  const { data: cities = [] } = useCities();

  // Read initial filter params from URL
  const initialParams: PropertySearchParams = useMemo(() => {
    return {
      category: (searchParams.get("category") as PropertyCategory) || "pg",
      purpose: (searchParams.get("purpose") as any) || undefined,
      city: searchParams.get("city") || "Pune",
      area: searchParams.get("area") || undefined,
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
      gender: (searchParams.get("gender") as any) || undefined,
      sharingType: searchParams.get("sharingType") || undefined,
      bhk: searchParams.get("bhk") || undefined,
      furnishingStatus: (searchParams.get("furnishingStatus") as any) || undefined,
      commercialSubtype: searchParams.get("commercialSubtype") || undefined,
      fitoutStatus: searchParams.get("fitoutStatus") || undefined,
      isVerified: searchParams.get("isVerified") || undefined,
      isFeatured: searchParams.get("isFeatured") || undefined,
      q: searchParams.get("q") || undefined,
      sort: (searchParams.get("sort") as any) || "popular",
      page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
      limit: 12,
    };
  }, [searchParams]);

  const [filters, setFilters] = useState<PropertySearchParams>(initialParams);

  // Sync internal state when URL changes externally
  useEffect(() => {
    setFilters(initialParams);
  }, [initialParams]);

  // Push updated filter state to URL (enables deep linking & shareable URLs)
  const syncUrl = useCallback(
    (newFilters: PropertySearchParams) => {
      const q = new URLSearchParams();
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          q.set(key, String(value));
        }
      });
      router.push(`/explore?${q.toString()}`, { scroll: false });
    },
    [router]
  );

  const handleFilterChange = (updated: Partial<PropertySearchParams>) => {
    const nextFilters = { ...filters, ...updated, page: 1 };
    setFilters(nextFilters);
    syncUrl(nextFilters);
  };

  const handleResetFilters = () => {
    const reset: PropertySearchParams = {
      category: filters.category || "pg",
      city: filters.city || "Pune",
      page: 1,
      limit: 12,
      sort: "popular",
    };
    setFilters(reset);
    syncUrl(reset);
    setFilterSheetOpen(false);
  };

  const handlePageChange = (newPage: number) => {
    const next = { ...filters, page: newPage };
    setFilters(next);
    syncUrl(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // TanStack Query for property search
  const { data, isLoading, isError, refetch } = useProperties(filters);

  const properties = data?.properties || [];
  const pagination = data?.pagination || {
    total: 0,
    page: filters.page || 1,
    limit: 12,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  };

  // Active filter count for badge
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.area) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.gender && filters.gender !== "any") count++;
    if (filters.sharingType) count++;
    if (filters.bhk) count++;
    if (filters.furnishingStatus) count++;
    if (filters.commercialSubtype) count++;
    if (filters.fitoutStatus) count++;
    if (filters.isVerified) count++;
    if (filters.isFeatured) count++;
    if (filters.q) count++;
    return count;
  }, [filters]);

  const categories = [
    { id: "pg" as const, label: "PGs & Co-Living", icon: <Home className="w-4 h-4" /> },
    { id: "residential_rental" as const, label: "Rental Flats", icon: <Building className="w-4 h-4" /> },
    { id: "commercial" as const, label: "Commercial", icon: <Store className="w-4 h-4" /> },
  ];

  const cityOptions = ["Pune", "Mumbai", "Bangalore", "Delhi", "Hyderabad", "Gurugram", "Pirangut", "Hinjewadi"];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* ── Top Search Filter Bar (Directly from Screenshot 2026-10-02 062441) ── */}
      <section className="bg-white border-b border-slate-200/90 py-3 sm:py-4 px-4 sm:px-6 lg:px-8 shadow-xs sticky top-[57px] sm:top-[65px] z-30">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 sm:gap-3 items-center">
            
            {/* 1. City Select with Clear icon */}
            <div className="lg:col-span-3 relative flex items-center bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/90 px-3 py-2 transition-all">
              <MapPin className="w-4 h-4 text-teal-700 shrink-0 mr-2" />
              <div className="flex-1 flex flex-col min-w-0">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 leading-none">
                  City
                </span>
                <select
                  value={filters.city || "Pune"}
                  onChange={(e) => handleFilterChange({ city: e.target.value, area: undefined })}
                  className="w-full text-xs sm:text-sm font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer truncate"
                >
                  {cityOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              {filters.city && (
                <button
                  type="button"
                  onClick={() => handleFilterChange({ city: "Pune" })}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
                  title="Reset to Pune"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* 2. Search Location / Area */}
            <div className="lg:col-span-3 relative flex items-center bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/90 px-3 py-2 transition-all">
              <Compass className="w-4 h-4 text-teal-700 shrink-0 mr-2" />
              <div className="flex-1 flex flex-col min-w-0">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 leading-none">
                  Location / Area
                </span>
                <input
                  type="text"
                  value={filters.area || ""}
                  onChange={(e) => handleFilterChange({ area: e.target.value || undefined })}
                  placeholder="e.g. Wakad, Hinjewadi, Baner..."
                  className="w-full text-xs sm:text-sm font-bold text-slate-900 bg-transparent placeholder:text-slate-400 placeholder:font-normal focus:outline-none"
                />
              </div>
              {filters.area && (
                <button
                  type="button"
                  onClick={() => handleFilterChange({ area: undefined })}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
                  aria-label="Clear area"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* 3. Gender / Config / Type Dropdown */}
            <div className="lg:col-span-2 relative flex items-center bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/90 px-3 py-2 transition-all">
              <div className="flex-1 flex flex-col min-w-0">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 leading-none">
                  {filters.category === "pg" ? "Gender" : filters.category === "residential_rental" ? "Config" : "Type"}
                </span>
                {filters.category === "pg" ? (
                  <select
                    value={filters.gender || "any"}
                    onChange={(e) => handleFilterChange({ gender: e.target.value === "any" ? undefined : (e.target.value as any) })}
                    className="w-full text-xs sm:text-sm font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="any">Any Gender</option>
                    <option value="male">Boys / Male</option>
                    <option value="female">Girls / Female</option>
                  </select>
                ) : filters.category === "residential_rental" ? (
                  <select
                    value={filters.bhk || ""}
                    onChange={(e) => handleFilterChange({ bhk: e.target.value || undefined })}
                    className="w-full text-xs sm:text-sm font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="">All BHK</option>
                    <option value="1BHK">1 BHK</option>
                    <option value="2BHK">2 BHK</option>
                    <option value="3BHK">3+ BHK</option>
                  </select>
                ) : (
                  <select
                    value={filters.commercialSubtype || ""}
                    onChange={(e) => handleFilterChange({ commercialSubtype: e.target.value || undefined })}
                    className="w-full text-xs sm:text-sm font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="">All Commercial</option>
                    <option value="office_space">Office Space</option>
                    <option value="retail_shop">Retail Shop</option>
                    <option value="showroom">Showroom</option>
                    <option value="co_working">Co-Working</option>
                  </select>
                )}
              </div>
            </div>

            {/* 4. Rent Range Slider (Reference dual endpoints 1000 - 100000) */}
            <div className="lg:col-span-4 flex items-center gap-3 bg-slate-50 rounded-2xl border border-slate-200/90 px-3.5 py-2">
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between text-[9px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                  <span>Rent Range</span>
                  <span className="text-teal-800 font-bold">
                    ₹{((filters.minPrice as number) || 1000).toLocaleString("en-IN")} - ₹{((filters.maxPrice as number) || 100000).toLocaleString("en-IN")}
                  </span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={100000}
                  step={1000}
                  value={(filters.maxPrice as number) || 100000}
                  onChange={(e) => handleFilterChange({ maxPrice: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-700"
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-semibold mt-0.5">
                  <span>1000</span>
                  <span>100000</span>
                </div>
              </div>

              {/* Quick Search Action */}
              <button
                type="button"
                onClick={() => refetch()}
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition-colors shrink-0 cursor-pointer"
                title="Search listings"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ── Main Explore Workspace ── */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Category Tabs Pill Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            {categories.map((cat) => {
              const isSelected = filters.category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleFilterChange({ category: cat.id })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-teal-700 text-white shadow-md shadow-teal-700/20"
                      : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80"
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Filter Button */}
          <div className="flex lg:hidden items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setFilterSheetOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-teal-700" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-teal-700 text-white text-[10px] font-black flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <PropertySort
              value={filters.sort}
              onChange={(sort) => handleFilterChange({ sort })}
            />
          </div>
        </div>

        {/* ── Results Summary & Breadcrumb Strip (Screenshot 2026-10-02 062441) ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 mb-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            {/* Dynamic Results Headline */}
            <h1 className="text-base sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>
                {pagination.total || properties.length}{" "}
                {filters.category === "pg"
                  ? "PGs"
                  : filters.category === "residential_rental"
                  ? "Rental Flats"
                  : "Commercial Properties"}{" "}
                found in {filters.city || "Pune"}
              </span>
            </h1>

            {/* Breadcrumbs Row */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 flex-wrap">
              <Link href="/" className="hover:text-teal-700 font-semibold flex items-center gap-1">
                <Home className="w-3 h-3" />
                <span>Home</span>
              </Link>
              <span>&gt;</span>
              <span className="text-slate-600 font-medium">
                {filters.category === "pg"
                  ? `PGs in ${filters.city || "Pune"}`
                  : filters.category === "residential_rental"
                  ? `Flats in ${filters.city || "Pune"}`
                  : `Commercial in ${filters.city || "Pune"}`}
              </span>
              <span>&gt;</span>
              <span className="text-teal-700 font-bold">
                Results ({pagination.total || properties.length} found)
              </span>
            </div>
          </div>

          {/* Right Controls: Verified Toggle, Sort Dropdown & Grid/List View */}
          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 flex-wrap">
            
            {/* Verified Properties Toggle Switch (Screenshot 2026-10-02 062441) */}
            <label className="flex items-center gap-2 cursor-pointer select-none bg-slate-50 hover:bg-slate-100/80 px-3 py-1.5 rounded-xl border border-slate-200/80 transition-colors">
              <span className="text-xs font-bold text-slate-800">
                Verified Properties
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={Boolean(filters.isVerified)}
                  onChange={(e) => handleFilterChange({ isVerified: e.target.checked ? "true" : undefined })}
                  className="sr-only"
                />
                <div
                  className={`w-9 h-5 rounded-full transition-colors ${
                    filters.isVerified ? "bg-teal-700" : "bg-slate-300"
                  }`}
                />
                <div
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                    filters.isVerified ? "translate-x-4" : ""
                  }`}
                />
              </div>
            </label>

            {/* Sort by Dropdown */}
            <div className="hidden lg:block">
              <PropertySort
                value={filters.sort}
                onChange={(sort) => handleFilterChange({ sort })}
              />
            </div>

            {/* Grid vs List View Toggle */}
            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-slate-900 shadow-2xs font-bold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                aria-label="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "list"
                    ? "bg-white text-slate-900 shadow-2xs font-bold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                aria-label="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Main Content: Desktop Filter Sidebar + Results ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Left Sidebar: Filters */}
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-36">
            <PropertyFilters
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </aside>

          {/* Right Column: Listings */}
          <section className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
            {isLoading ? (
              <div
                className={`grid gap-6 ${
                  viewMode === "list"
                    ? "grid-cols-1"
                    : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                }`}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <PropertyCardSkeleton key={i} />
                ))}
              </div>
            ) : isError ? (
              <div className="bg-white p-8 rounded-3xl border border-rose-100 text-center shadow-xs">
                <p className="text-sm font-bold text-rose-600 mb-3">
                  Failed to load properties. Please check network connection.
                </p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 transition-colors shadow-xs"
                >
                  Retry Search
                </button>
              </div>
            ) : properties.length === 0 ? (
              <EmptyState onReset={handleResetFilters} />
            ) : (
              <>
                {/* Property Cards Grid / List */}
                <div
                  className={`grid gap-6 ${
                    viewMode === "list"
                      ? "grid-cols-1"
                      : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                  }`}
                >
                  {properties.map((property) => (
                    <PropertyCard
                      key={property._id}
                      property={property}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {pagination.totalPages > 1 && (
                  <div className="pt-8 pb-4 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      disabled={!pagination.hasPrev}
                      onClick={() => handlePageChange(pagination.page - 1)}
                      className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs transition-all cursor-pointer"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-1.5 px-3">
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                        .slice(
                          Math.max(0, pagination.page - 3),
                          Math.min(pagination.totalPages, pagination.page + 2)
                        )
                        .map((p) => {
                          const isCurrent = p === pagination.page;
                          return (
                            <button
                              key={p}
                              type="button"
                              onClick={() => handlePageChange(p)}
                              className={`w-9 h-9 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                                isCurrent
                                  ? "bg-teal-700 text-white shadow-md shadow-teal-700/20"
                                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs"
                              }`}
                            >
                              {p}
                            </button>
                          );
                        })}
                    </div>

                    <button
                      type="button"
                      disabled={!pagination.hasNext}
                      onClick={() => handlePageChange(pagination.page + 1)}
                      className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs transition-all cursor-pointer"
                      aria-label="Next page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </section>

        </div>
      </main>

      {/* Mobile Filter Bottom Sheet */}
      <BottomSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        title="Refine Properties"
        footer={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex-1 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => setFilterSheetOpen(false)}
              className="flex-2 py-3 rounded-xl bg-teal-700 text-white text-xs font-bold shadow-md cursor-pointer"
            >
              Apply Filters
            </button>
          </div>
        }
      >
        <PropertyFilters
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
          className="border-0 shadow-none p-0"
        />
      </BottomSheet>

      {/* Global Contact Owner Modal */}
      <ContactOwnerModal />

      <Footer />
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-sm font-medium">
          Loading property search...
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
