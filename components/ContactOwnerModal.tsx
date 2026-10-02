"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Phone,
  MessageCircle,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Send,
  Loader2,
  Building,
  MapPin,
} from 'lucide-react';
import { useUIStore } from '../lib/store/uiStore';
import { useAuth } from '../contexts/AuthContext';
import { leadService } from '../lib/services/leadService';
import { apiClient } from '../lib/api/apiClient';
import { API_ENDPOINTS } from '../lib/api/endpoints';

export default function ContactOwnerModal() {
  const { isContactModalOpen, contactProperty, closeContactModal, addToast, openAuthModal } = useUIStore();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'instant' | 'schedule'>('instant');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredSlot, setPreferredSlot] = useState('11:00 AM');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isContactModalOpen || !contactProperty) return null;

  const phone = contactProperty.contactPhone || contactProperty.owner?.phone || '9876543210';
  const whatsapp = contactProperty.contactWhatsapp || phone;
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const cleanWhatsapp = whatsapp.replace(/[^0-9]/g, '');

  const defaultPhoto = contactProperty.photos?.[0]?.url || '/assets/images/banner-pg-hostel.jpg';

  const timeSlots = [
    '10:00 AM',
    '11:30 AM',
    '02:00 PM',
    '04:30 PM',
    '06:00 PM',
  ];

  const handleScheduleVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('otp');
      return;
    }

    if (!preferredDate) {
      addToast('Please select a preferred visit date', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await leadService.bookVisit({
        propertyId: contactProperty._id,
        pgId: contactProperty._id,
        scheduledDate: preferredDate,
        scheduledTime: preferredSlot,
        message: notes || `Interested in ${contactProperty.title}`,
      });

      setIsSubmitted(true);
      addToast('Visit request sent to the owner! You will receive a confirmation call.', 'success');
      setTimeout(() => {
        closeContactModal();
        setIsSubmitted(false);
      }, 2500);
    } catch (err: any) {
      addToast(err?.message || 'Failed to submit visit request. Please call directly.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello, I am interested in "${contactProperty.title}" (${contactProperty.area}, ${contactProperty.city}) listed on PGInfo. Is this property available for visit?`
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="relative p-5 pb-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                  Contact Property Owner
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Verified owner details &amp; instant direct connect
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeContactModal}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 overflow-y-auto space-y-5 scrollbar-thin">
            {/* Property Quick Summary Card */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <img
                src={defaultPhoto}
                alt={contactProperty.title}
                className="w-16 h-16 rounded-xl object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-100/70 text-teal-800">
                    {contactProperty.category === 'pg'
                      ? 'PG'
                      : contactProperty.category === 'residential_rental'
                      ? 'Flat'
                      : 'Commercial'}
                  </span>
                  {contactProperty.isVerified && (
                    <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-slate-900 truncate">
                  {contactProperty.title}
                </h4>
                <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  {contactProperty.area}, {contactProperty.city}
                </p>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setActiveTab('instant')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'instant'
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Direct Contact</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('schedule')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'schedule'
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule Visit</span>
              </button>
            </div>

            {/* Tab 1: Instant Direct Connect */}
            {activeTab === 'instant' && (
              <div className="space-y-4 pt-1">
                <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 text-teal-900 text-xs leading-relaxed flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Zero Brokerage Guarantee:</strong> Connect directly with the verified property manager or owner without intermediary agent commissions.
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Call Button */}
                  <a
                    href={`tel:${cleanPhone}`}
                    className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-700/20 transition-all cursor-pointer"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Owner Now</span>
                  </a>

                  {/* WhatsApp Button */}
                  <a
                    href={`https://wa.me/91${cleanWhatsapp}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Chat</span>
                  </a>
                </div>

                <p className="text-center text-[11px] text-slate-400">
                  Phone: +91 {cleanPhone.slice(-10).replace(/(\d{5})(\d{5})/, '$1 $2')}
                </p>
              </div>
            )}

            {/* Tab 2: Schedule Visit Form */}
            {activeTab === 'schedule' && (
              <form onSubmit={handleScheduleVisit} className="space-y-4 pt-1">
                {isSubmitted ? (
                  <div className="py-8 text-center space-y-2">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                    <h4 className="text-sm font-extrabold text-slate-900">
                      Visit Scheduled Successfully!
                    </h4>
                    <p className="text-xs text-slate-500">
                      The owner has been notified and will contact you to confirm the timing.
                    </p>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-700/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Preferred Time Slot
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                        {timeSlots.map((slot) => {
                          const isSelected = preferredSlot === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setPreferredSlot(slot)}
                              className={`py-2 px-1 text-[11px] font-bold rounded-xl transition-all ${
                                isSelected
                                  ? 'bg-teal-700 text-white shadow-xs'
                                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Additional Note (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. Looking for immediate joining, vegetarian food preference..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-700/30"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-2xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending Request...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Confirm &amp; Schedule Visit</span>
                        </>
                      )}
                    </button>
                  </>
                )}
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
