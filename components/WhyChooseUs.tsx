"use client";

import { motion } from "framer-motion";
import { ShieldCheck, UserX, Zap, HeadphonesIcon } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      title: "Verified Listings",
      desc: "100% Verified",
      icon: <ShieldCheck className="w-6 h-6 text-[var(--color-brand-primary)]" />,
      delay: 0.1,
    },
    {
      title: "No Brokerage",
      desc: "Direct Contact",
      icon: <UserX className="w-6 h-6 text-[var(--color-brand-primary)]" />,
      delay: 0.2,
    },
    {
      title: "Easy Booking",
      desc: "Quick & Simple",
      icon: <Zap className="w-6 h-6 text-[var(--color-brand-primary)]" />,
      delay: 0.3,
    },
    {
      title: "Customer Support",
      desc: "24x7 Assistance",
      icon: <HeadphonesIcon className="w-6 h-6 text-[var(--color-brand-primary)]" />,
      delay: 0.4,
    },
  ];

  return (
    <section className="py-16 bg-white" id="why-choose-us">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-10">
          <h2 className="text-2xl font-bold text-gray-900">
            Why Choose <span className="text-[var(--color-brand-primary)]">PG Info?</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: feature.delay }}
              className="bg-slate-50/50 border border-slate-100/50 rounded-2xl p-6 flex items-center gap-4 hover:shadow-md hover:bg-white transition-all duration-300 group cursor-default"
            >
              <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
