"use client";

import React, { useState } from "react";
import { ArrowRight, Sparkles, Home, Building, Store } from "lucide-react";
import Link from "next/link";
import PropertyCard from "./PropertyCard";
import { PropertyCardSkeleton } from "./ui/Skeleton";
import { useProperties } from "../lib/hooks/useProperties";
import { PropertyCategory } from "../lib/types/property";

export default function RecommendedPGs() {
  const [activeTab, setActiveTab] = useState<PropertyCategory>("pg");

  const { data, isLoading } = useProperties({
    category: activeTab,
    limit: 6,
    sort: "popular",
  });

  const properties = data?.properties || [];

  const categories = [
    { id: "pg" as const, label: "Featured PGs", icon: <Home className="w-3.5 h-3.5" /> },
    { id: "residential_rental" as const, label: "Top Flats", icon: <Building className="w-3.5 h-3.5" /> },
    { id: "commercial" as const, label: "Commercials", icon: <Store className="w-3.5 h-3.5" /> },
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-y border-slate-100" id="explore">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-extrabold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-teal-700" />
              <span>Handpicked &amp; Verified</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Featured Properties Near You
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-xl">
              Verified amenities, zero hidden brokerage, high-resolution photographs, and direct owner connects.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200 shadow-2xs shrink-0">
            {categories.map((cat) => {
              const isSelected = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveTab(cat.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-teal-700 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Listings Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs">
            <p className="text-sm font-bold text-slate-700 mb-4">
              Explore all verified properties in our discovery engine
            </p>
            <Link
              href={`/explore?category=${activeTab}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-teal-700 text-white text-xs font-extrabold hover:bg-teal-800 shadow-xs"
            >
              <span>Browse All Listings</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {properties.slice(0, 6).map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}

        {/* View All CTA */}
        <div className="mt-10 sm:mt-12 text-center">
          <Link
            href={`/explore?category=${activeTab}`}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 text-xs sm:text-sm font-black shadow-xs hover:shadow-md transition-all group cursor-pointer"
          >
            <span>View All {activeTab === 'pg' ? 'PGs & Hostels' : activeTab === 'residential_rental' ? 'Rental Flats' : 'Commercial Spaces'}</span>
            <ArrowRight className="w-4 h-4 text-teal-700 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}
