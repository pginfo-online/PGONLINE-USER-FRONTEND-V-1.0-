"use client";

import { motion } from "framer-motion";
import { MapPin, Smile, Home, HeartHandshake } from "lucide-react";

export default function TrustStats() {
  const stats = [
    { value: "10,000+", label: "Cities & Locations", icon: <MapPin className="w-8 h-8 opacity-80" /> },
    { value: "1M+", label: "Happy Tenants", icon: <Smile className="w-8 h-8 opacity-80" /> },
    { value: "25K+", label: "Verified PGs", icon: <Home className="w-8 h-8 opacity-80" /> },
    { value: "99.2%", label: "Successful Matches", icon: <HeartHandshake className="w-8 h-8 opacity-80" /> },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-gradient-to-br from-[var(--color-brand-navy)] via-indigo-950 to-[var(--color-brand-primary)] rounded-3xl p-10 lg:p-16 relative overflow-hidden shadow-2xl">
        
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-brand-primary)] rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10 items-center">
          
          <div className="lg:col-span-5 text-white">
            <span className="text-blue-300 text-xs font-bold tracking-widest uppercase mb-4 block">Trusted by Thousands</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 leading-tight">
              Building trust in every<br />stay, every day.
            </h2>
            <p className="text-indigo-100/80 mb-8 max-w-md text-sm leading-relaxed">
              PGInfo.online is on a mission to make finding a PG as easy as booking a cab. Transparent, reliable, and community-driven – that's our promise. We verify listings so you don't have to worry.
            </p>
            <button className="bg-white/10 hover:bg-white/20 border border-white/20 transition-colors text-white px-6 py-2.5 rounded-lg text-sm font-medium backdrop-blur-sm">
              Learn More About Us &rarr;
            </button>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-x-8 gap-y-12">
              {stats.map((stat, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-4 text-white"
                >
                  <div className="text-blue-300">
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-3xl sm:text-4xl font-bold mb-1 tracking-tight">{stat.value}</div>
                    <div className="text-indigo-200 text-sm">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
