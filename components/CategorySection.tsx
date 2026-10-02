"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Shield, User, Building, Store } from "lucide-react";

export default function CategorySection() {
  const categories = [
    {
      title: "PG for Girls",
      desc: "Safe & verified spaces",
      href: "/explore?category=pg&gender=female",
      icon: <Shield className="w-5 h-5 text-pink-600" />,
      bg: "bg-pink-50",
    },
    {
      title: "PG for Boys",
      desc: "Near IT hubs & colleges",
      href: "/explore?category=pg&gender=male",
      icon: <User className="w-5 h-5 text-blue-600" />,
      bg: "bg-blue-50",
    },
    {
      title: "Co-Living Hostels",
      desc: "Community living",
      href: "/explore?category=pg",
      icon: <Home className="w-5 h-5 text-emerald-600" />,
      bg: "bg-emerald-50",
    },
    {
      title: "Rental Flats",
      desc: "1, 2 & 3 BHK Apartments",
      href: "/explore?category=residential_rental",
      icon: <Building className="w-5 h-5 text-purple-600" />,
      bg: "bg-purple-50",
    },
    {
      title: "Commercial Spaces",
      desc: "Offices, retail & shops",
      href: "/explore?category=commercial",
      icon: <Store className="w-5 h-5 text-amber-600" />,
      bg: "bg-amber-50",
    },
  ];

  return (
    <section className="py-4">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-nowrap overflow-x-auto pb-4 gap-3 sm:gap-4 hide-scrollbar xl:justify-center">
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="shrink-0"
            >
              <Link
                href={cat.href}
                className="flex items-center gap-3.5 bg-white border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300 pr-6 pl-3 py-3 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1 group"
              >
                <div
                  className={`w-11 h-11 rounded-xl ${cat.bg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                >
                  {cat.icon}
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-slate-900 text-sm leading-none mb-1 group-hover:text-[#0A4242] transition-colors">
                    {cat.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold leading-none">
                    {cat.desc}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
