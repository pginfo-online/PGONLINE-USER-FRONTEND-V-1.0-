"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function TenantOwnerSection() {
  const tenantChecks = [
    "Advanced search filters",
    "Verified PG listings",
    "Genuine property photos",
    "Save and compare properties",
    "Direct owner communication",
    "Schedule visits"
  ];

  const ownerChecks = [
    "Easy property listing",
    "Reach verified tenants",
    "Manage enquiries",
    "Schedule visits",
    "Manage property details",
    "Dedicated owner tools"
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* For Tenants Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl p-8 lg:p-12 bg-gradient-to-br from-indigo-50 via-slate-50 to-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-3xl font-extrabold text-gray-900 mb-4">For Tenants</h3>
            <p className="text-gray-600 mb-8 max-w-sm">
              Find accommodation matching your location, lifestyle and budget.
            </p>
            
            <ul className="space-y-4 mb-10">
              {tenantChecks.map((text, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-gray-700 font-medium text-sm">{text}</span>
                </li>
              ))}
            </ul>
            
            <button className="bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-secondary)] text-white px-8 py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-[var(--color-brand-primary)]/20 w-full sm:w-auto">
              Start Searching
            </button>
          </motion.div>

          {/* For Owners Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl p-8 lg:p-12 bg-gradient-to-br from-blue-50 via-cyan-50 to-white border border-blue-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-3xl font-extrabold text-gray-900 mb-4">For Owners</h3>
            <p className="text-gray-600 mb-8 max-w-sm">
              List your property and connect with suitable tenants easily.
            </p>
            
            <ul className="space-y-4 mb-10">
              {ownerChecks.map((text, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[var(--color-brand-blue)]/10 text-[var(--color-brand-blue)] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-gray-700 font-medium text-sm">{text}</span>
                </li>
              ))}
            </ul>
            
            <button className="bg-[var(--color-brand-blue)] hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-[var(--color-brand-blue)]/20 w-full sm:w-auto">
              List Your Property
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
