"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import PropertyCard from "./PropertyCard";

export default function RecommendedPGs() {
  const properties = [
    {
      name: "Sunrise PG",
      location: "Andheri East, Mumbai",
      price: "₹7,500",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
      featured: true
    },
    {
      name: "Comfort Living PG",
      location: "Goregaon West, Mumbai",
      price: "₹8,000",
      rating: 4.3,
      image: "https://images.unsplash.com/photo-1502672260266-1c1cd2cb4441?q=80&w=2080&auto=format&fit=crop",
      featured: true
    },
    {
      name: "Bliss PG",
      location: "Malad West, Mumbai",
      price: "₹6,500",
      rating: 4.2,
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop",
      featured: true
    }
  ];

  return (
    <section className="py-16 bg-slate-50" id="explore">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Recommended PGs</h2>
            <p className="text-gray-600">Explore our top verified properties</p>
          </div>
          <Link href="/explore" className="hidden sm:flex items-center gap-1 text-[var(--color-brand-primary)] font-semibold hover:text-[var(--color-brand-secondary)] transition-colors group">
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((prop, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <PropertyCard {...prop} />
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex justify-center sm:hidden">
          <Link href="/explore" className="flex items-center gap-2 text-[var(--color-brand-primary)] font-semibold border border-[var(--color-brand-primary)] px-6 py-2.5 rounded-full hover:bg-slate-50 transition-colors">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
