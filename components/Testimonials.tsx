"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      initials: "A",
      name: "Ananya S.",
      location: "Bangalore",
      quote: "Found a great single room in Indiranagar within 2 days. The visit was smooth and the owner was very responsive.",
      rating: 5,
      delay: 0.1
    },
    {
      initials: "R",
      name: "Rahul M.",
      location: "Pune",
      quote: "No brokerage, no hidden terms. PGInfo.online made the entire process transparent and stress-free.",
      rating: 5,
      delay: 0.2
    },
    {
      initials: "N",
      name: "Neha P.",
      location: "Hyderabad",
      quote: "The community groups helped me find an awesome roommate. Now my PG feels like home!",
      rating: 5,
      delay: 0.3
    }
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 flex flex-col items-center">
          <span className="inline-block px-3 py-1 bg-slate-100 text-[var(--color-brand-primary)] rounded-full text-xs font-bold tracking-wider mb-4 uppercase">Love from our community</span>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Stories from happy tenants
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: testimonial.delay }}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 text-[var(--color-brand-primary)] flex items-center justify-center font-bold text-lg">
                    {testimonial.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 leading-tight">{testimonial.name}</h4>
                    <span className="text-xs text-gray-500">{testimonial.location}</span>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 italic text-sm leading-relaxed">
                "{testimonial.quote}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
