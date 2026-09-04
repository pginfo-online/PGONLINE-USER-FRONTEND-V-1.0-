"use client";

import { motion } from "framer-motion";
import { Home, Clock, Shield, User, Tag } from "lucide-react";

export default function CategorySection() {
  const categories = [
    { 
      title: "Nearby PG", 
      desc: "Find nearby", 
      icon: <Home className="w-5 h-5 text-[var(--color-brand-primary)]" />,
      bg: "bg-[var(--color-brand-primary)]/10"
    },
    { 
      title: "Short Stay", 
      desc: "Flexible stays", 
      icon: <Clock className="w-5 h-5 text-orange-600" />,
      bg: "bg-orange-50"
    },
    { 
      title: "PG for Girls", 
      desc: "Safe & secure", 
      icon: <Shield className="w-5 h-5 text-pink-600" />,
      bg: "bg-pink-50"
    },
    { 
      title: "PG for Boys", 
      desc: "Comfort stays", 
      icon: <User className="w-5 h-5 text-blue-600" />,
      bg: "bg-blue-50"
    },
    { 
      title: "Offers", 
      desc: "Best deals", 
      icon: <Tag className="w-5 h-5 text-emerald-600" />,
      bg: "bg-emerald-50"
    },
  ];

  return (
    <section className="py-2">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-nowrap overflow-x-auto pb-6 gap-3 sm:gap-4 hide-scrollbar xl:justify-center">
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex-shrink-0 flex items-center gap-3.5 bg-white border border-gray-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] hover:shadow-xl hover:border-gray-200 pr-6 pl-2.5 py-2.5 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className={`w-11 h-11 rounded-[14px] ${cat.bg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                {cat.icon}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-900 text-[15px] leading-none mb-1.5 group-hover:text-[var(--color-brand-primary)] transition-colors">{cat.title}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold leading-none">{cat.desc}</span>
              </div>
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
