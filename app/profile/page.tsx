"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2, User, Mail, Phone, MapPin, Calendar, CheckCircle2, AlertCircle, ArrowLeft, Users, Building, MapIcon, Sparkles, Check, Download, X, Heart, CalendarRange, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfilePage() {
  const { user, token, login, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    altPhone: '',
    gender: '',
    dob: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [modalType, setModalType] = useState<'wishlist' | 'visits' | null>(null);
  const [modalData, setModalData] = useState<any[]>([]);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const fetchModalData = async (type: 'wishlist' | 'visits') => {
    setModalType(type);
    setIsModalLoading(true);
    setModalData([]);
    try {
      const endpoint = type === 'wishlist' 
        ? 'https://pgonline-backend-v-1-0.onrender.com/api/v1/lead/my' 
        : 'https://pgonline-backend-v-1-0.onrender.com/api/v1/visit/my';
      const res = await fetch(endpoint, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        if (type === 'wishlist') {
          const leads = data.data.leads || [];
          setModalData(leads.filter((l: any) => l.type === 'wishlist'));
        } else {
          setModalData(data.data.visits || []);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsModalLoading(false);
    }
  };

  // Auth Protection
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  // Fetch complete profile on mount
  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      setIsFetching(true);
      const res = await fetch('https://pgonline-backend-v-1-0.onrender.com/api/v1/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      
      if (data.success && data.data) {
        const p = data.data.user || data.data;
        setFormData({
          name: p.name || '',
          email: p.email || '',
          phone: p.phone || '',
          altPhone: p.altPhone || '',
          gender: p.gender || '',
          dob: p.dob ? new Date(p.dob).toISOString().split('T')[0] : '', // Format for date input
          address: p.address || '',
          city: p.city || '',
          state: p.state || '',
          pincode: p.pincode || ''
        });
      }
    } catch (err) {
      console.error("Error fetching profile", err);
    } finally {
      setIsFetching(false);
    }
  };

  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        else if (value.trim().length < 3) error = 'Must be at least 3 characters';
        break;
      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email address';
        break;
      case 'phone':
        if (!value.trim()) error = 'Primary phone is required';
        else if (!/^\d{10}$/.test(value)) error = 'Must be exactly 10 digits';
        break;
      case 'altPhone':
        if (value.trim() && !/^\d{10}$/.test(value)) error = 'Must be exactly 10 digits';
        break;
      case 'pincode':
        if (value.trim() && !/^\d{6}$/.test(value)) error = 'Must be exactly 6 digits';
        break;
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear global messages when user types
    setErrorMsg('');
    setSuccessMsg('');

    // Field-level validation on change
    const error = validateField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateAllFields = () => {
    const errors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
      const err = validateField(key, formData[key as keyof typeof formData]);
      if (err) errors[key] = err;
    });
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAllFields()) {
      setErrorMsg('Please fix the errors in the form before saving.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('https://pgonline-backend-v-1-0.onrender.com/api/v1/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();

      if (data.success) {
        setSuccessMsg('Profile updated successfully!');
        // Update global context so Navbar avatar reflects new name if changed
        if (token) {
           login(token, data.data.user || data.data);
        }
        setIsEditing(false); // Switch back to view mode on success
      } else {
        setErrorMsg(data.message || 'Failed to update profile');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || (!authLoading && !user)) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[var(--color-brand-primary)]" />
        <p className="mt-4 text-gray-500 font-medium">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-[70px]">
        {/* Back Button */}
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold text-xs uppercase tracking-wider mb-6 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> BACK
        </button>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar */}
          <aside className="w-full lg:w-[320px] flex-shrink-0 flex flex-col gap-6">
            
            {/* Profile Card */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#8B5CF6] via-[#7C3AED] to-[#6366F1] text-white flex items-center justify-center text-4xl font-black shadow-[0_12px_28px_rgba(124,58,237,0.42)] mb-4 select-none border-2 border-white/30 transition-transform duration-300 hover:scale-105">
                {(formData.name?.trim()?.[0] || user?.name?.trim()?.[0] || formData.email?.trim()?.[0] || user?.email?.trim()?.[0] || 'U').toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{formData.name || user?.name}</h2>
              <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 border border-blue-100 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                <User className="w-3.5 h-3.5" /> {user?.role || 'TENANT'}
              </div>
            </div>

            {/* Account Summary */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-5">Account Summary</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Primary Phone</p>
                    <p className="text-sm font-bold text-gray-800">{formData.phone || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">City</p>
                    <p className="text-sm font-bold text-gray-800">{formData.city || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">State</p>
                    <p className="text-sm font-bold text-gray-800">{formData.state || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapIcon className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Pincode</p>
                    <p className="text-sm font-bold text-gray-800">{formData.pincode || '—'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* User Activity / Shortcuts */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col gap-3">
              <button 
                onClick={() => fetchModalData('wishlist')}
                className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors border border-transparent hover:border-red-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-red-500" />
                  </div>
                  <span className="font-bold">My Wishlist</span>
                </div>
                <ArrowLeft className="w-4 h-4 rotate-180 text-gray-400" />
              </button>
              
              <button 
                onClick={() => fetchModalData('visits')}
                className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors border border-transparent hover:border-blue-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                    <CalendarRange className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="font-bold">My Visits & Bookings</span>
                </div>
                <ArrowLeft className="w-4 h-4 rotate-180 text-gray-400" />
              </button>
            </div>

            {/* Circle & Meetup Hub Widget */}
            <div className="bg-[#1a1744] rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#2a265c] text-white">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-blue-200 uppercase tracking-widest flex items-center gap-1.5">
                    Circle & Meetup Hub
                    <span className="bg-blue-600/30 text-blue-300 text-[8px] px-1.5 py-0.5 rounded-sm shrink-0">ACTIVE HUB</span>
                  </h3>
                </div>
              </div>
              <p className="text-[11px] text-indigo-200 mb-5 leading-relaxed font-medium pr-2">
                Connect with local hobby circles, join community meetups, or host your own PG events.
              </p>
              <div className="space-y-2.5">
                <button className="w-full bg-[var(--color-brand-primary)] hover:bg-opacity-90 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors shadow-md shadow-[var(--color-brand-primary)]/20 flex items-center justify-center gap-2">
                  <Users className="w-4 h-4" /> Explore Circles & Events
                </button>
                <div className="grid grid-cols-2 gap-2.5">
                  <button className="w-full bg-[var(--color-brand-primary)] hover:bg-opacity-90 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors shadow-md shadow-[var(--color-brand-primary)]/20 flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-500" /> Host Event
                  </button>
                  <button className="w-full bg-[var(--color-brand-primary)] hover:bg-opacity-90 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors shadow-md shadow-[var(--color-brand-primary)]/20 flex items-center justify-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-100" /> My Meetups
                  </button>
                </div>
              </div>
            </div>

            {/* Download PG Owner App Widget */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] text-white relative overflow-hidden">
              <h3 className="text-[10px] font-bold text-purple-200 uppercase tracking-widest mb-3 flex items-center gap-1.5 relative z-10">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> PG OWNER APP
              </h3>
              <h4 className="text-lg font-bold mb-1.5 relative z-10">Are you a PG Owner?</h4>
              <p className="text-[11px] text-purple-100 mb-5 leading-relaxed relative z-10 font-medium">
                Download the PGinfo Owner app to list your PG, connect with tenants, and manage bookings seamlessly.
              </p>
              <a href="https://play.google.com/store/apps/details?id=com.pginfo.onlinee&pcampaignid=web_share" target="_blank" rel="noopener noreferrer" className="w-full bg-[var(--color-brand-primary)] hover:bg-opacity-90 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors shadow-md shadow-[var(--color-brand-primary)]/20 flex items-center justify-center gap-2 relative z-10">
                <Download className="w-4 h-4" /> Download App
              </a>
            </div>

          </aside>

          {/* Right Content */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden h-fit">
              
              {isFetching ? (
                <div className="p-12 flex justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-[var(--color-brand-primary)]" />
                </div>
              ) : !isEditing ? (
                <div className="p-6 md:p-8">
                  
                  {/* Status Messages for View Mode */}
                  {successMsg && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 text-sm rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" /> {successMsg}
                    </div>
                  )}

                  <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <User className="w-5 h-5 text-[var(--color-brand-primary)]" /> Profile Information
                    </h3>
                    <button 
                      onClick={() => setIsEditing(true)} 
                      className="bg-[var(--color-brand-primary)] hover:bg-opacity-90 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-md shadow-[var(--color-brand-primary)]/20 flex items-center gap-2"
                    >
                      Edit Profile
                    </button>
                  </div>

                  <div className="space-y-8">
                    {/* Basic Info Readonly */}
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-5">Basic Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                        <div>
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</p>
                          <p className="text-sm font-semibold text-gray-900">{formData.name || '—'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</p>
                          <p className="text-sm font-semibold text-gray-900">{formData.email || '—'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Primary Phone</p>
                          <p className="text-sm font-semibold text-gray-900">{formData.phone || '—'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Alternative Phone</p>
                          <p className="text-sm font-semibold text-gray-900">{formData.altPhone || '—'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Gender</p>
                          <p className="text-sm font-semibold text-gray-900 capitalize">{formData.gender || '—'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Date of Birth</p>
                          <p className="text-sm font-semibold text-gray-900">{formData.dob || '—'}</p>
                        </div>
                      </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Address Readonly */}
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-5">Address Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                        <div className="md:col-span-2">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Address</p>
                          <p className="text-sm font-semibold text-gray-900">{formData.address || '—'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">City</p>
                          <p className="text-sm font-semibold text-gray-900">{formData.city || '—'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">State</p>
                          <p className="text-sm font-semibold text-gray-900">{formData.state || '—'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Pincode</p>
                          <p className="text-sm font-semibold text-gray-900">{formData.pincode || '—'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 md:p-8">
                  
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                      <User className="w-5 h-5 text-[var(--color-brand-primary)]" /> Edit Basic Information
                    </h3>
                    <button 
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setErrorMsg('');
                        setSuccessMsg('');
                      }} 
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Basic Info Section */}
                  <div className="mb-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name *</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} onBlur={handleBlur} className={`w-full px-4 py-3 bg-gray-50/50 border rounded-xl text-sm font-medium text-gray-900 outline-none transition-all ${fieldErrors.name ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500'}`} />
                        {fieldErrors.name && <p className="text-red-500 text-[10px] mt-1 font-semibold">{fieldErrors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address *</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} className={`w-full px-4 py-3 bg-gray-50/50 border rounded-xl text-sm font-medium text-gray-900 outline-none transition-all ${fieldErrors.email ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500'}`} />
                        {fieldErrors.email && <p className="text-red-500 text-[10px] mt-1 font-semibold">{fieldErrors.email}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400" /> Primary Phone *</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} onBlur={handleBlur} className={`w-full px-4 py-3 bg-gray-50/50 border rounded-xl text-sm font-medium text-gray-900 outline-none transition-all ${fieldErrors.phone ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500'}`} />
                        {fieldErrors.phone && <p className="text-red-500 text-[10px] mt-1 font-semibold">{fieldErrors.phone}</p>}
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400" /> Alternative Phone</label>
                        <input type="tel" name="altPhone" value={formData.altPhone} onChange={handleChange} onBlur={handleBlur} placeholder="Alternative mobile number" className={`w-full px-4 py-3 bg-gray-50/50 border rounded-xl text-sm font-medium text-gray-900 outline-none transition-all ${fieldErrors.altPhone ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500'}`} />
                        {fieldErrors.altPhone && <p className="text-red-500 text-[10px] mt-1 font-semibold">{fieldErrors.altPhone}</p>}
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-gray-400" /> Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleChange} onBlur={handleBlur} className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer_not_to_say">Prefer not to say</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-gray-400" /> Date of Birth</label>
                        <input type="date" name="dob" value={formData.dob} onChange={handleChange} onBlur={handleBlur} className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-500" />
                      </div>
                    </div>
                  </div>

                  <hr className="border-gray-100 my-8" />

                  {/* Address Section */}
                  <div className="mb-8">
                    <h3 className="text-sm font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" /> ADDRESS DETAILS
                      <span className="text-[10px] font-medium text-gray-400 normal-case ml-1 mt-0.5">(optional — required for owner verification)</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
                      <div className="md:col-span-3">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Full Address</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange} onBlur={handleBlur} placeholder="House No., Street, Locality" className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">City</label>
                        <input type="text" name="city" value={formData.city} onChange={handleChange} onBlur={handleBlur} placeholder="e.g. Pune" className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">State</label>
                        <input type="text" name="state" value={formData.state} onChange={handleChange} onBlur={handleBlur} placeholder="e.g. Maharashtra" className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Pincode</label>
                        <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} onBlur={handleBlur} placeholder="6-digit pincode" className={`w-full px-4 py-3 bg-gray-50/50 border rounded-xl text-sm font-medium text-gray-900 outline-none transition-all ${fieldErrors.pincode ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500'}`} />
                        {fieldErrors.pincode && <p className="text-red-500 text-[10px] mt-1 font-semibold">{fieldErrors.pincode}</p>}
                      </div>
                    </div>
                  </div>
                  
                  {/* Status Messages */}
                  {successMsg && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 text-sm rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" /> {successMsg}
                    </div>
                  )}
                  {errorMsg && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" /> {errorMsg}
                    </div>
                  )}

                  {/* Save and Cancel Buttons */}
                  <div className="flex justify-end gap-3 pt-4">
                    <button 
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setErrorMsg('');
                        setSuccessMsg('');
                      }} 
                      className="bg-white hover:bg-gray-50 text-[var(--color-brand-primary)] border border-[var(--color-brand-primary)]/20 text-xs font-semibold py-2.5 px-6 rounded-lg transition-colors shadow-sm"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="bg-[var(--color-brand-primary)] hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold py-2.5 px-8 rounded-lg transition-colors shadow-md shadow-[var(--color-brand-primary)]/20 flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" strokeWidth={3} />
                      )}
                      Save Profile
                    </button>
                  </div>

                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Dynamic 40% Width Modal */}
      <AnimatePresence>
        {modalType && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalType(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] lg:w-[60vw] min-h-[60vh] max-h-[90vh] bg-white rounded-[2rem] shadow-2xl z-50 flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${modalType === 'wishlist' ? 'bg-red-100' : 'bg-blue-100'}`}>
                    {modalType === 'wishlist' ? <Heart className="w-5 h-5 text-red-500 fill-red-500" /> : <CalendarRange className="w-5 h-5 text-blue-500" />}
                  </div>
                  <h2 className="text-2xl font-black text-gray-900">
                    {modalType === 'wishlist' ? 'My Wishlist' : 'My Visits & Bookings'}
                  </h2>
                </div>
                <button 
                  onClick={() => setModalType(null)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
                {isModalLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                    <Loader2 className="w-10 h-10 animate-spin text-[var(--color-brand-primary)] mb-4" />
                    <p className="font-semibold">Loading your {modalType}...</p>
                  </div>
                ) : modalData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-500 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      {modalType === 'wishlist' ? <Heart className="w-8 h-8 text-gray-300" /> : <CalendarRange className="w-8 h-8 text-gray-300" />}
                    </div>
                    <p className="font-bold text-lg text-gray-700">No {modalType} found</p>
                    <p className="text-sm mt-2">Looks like you haven't added anything here yet.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {modalData.map((item, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="w-24 h-24 sm:w-20 sm:h-20 shrink-0 bg-gray-100 rounded-xl overflow-hidden relative">
                          <img 
                            src={item.pg?.photos?.[0]?.url || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop"} 
                            alt={item.pg?.name || 'PG'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{item.pg?.name || 'Unknown PG'}</h3>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin className="w-3.5 h-3.5" /> {item.pg?.city || 'Unknown Location'}
                          </p>
                          {modalType === 'visits' && (
                            <div className="mt-2 inline-block px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wider">
                              Status: {item.status || 'Pending'}
                            </div>
                          )}
                        </div>
                        <a 
                          href={`/explore/${item.pg?._id}`}
                          className="shrink-0 w-full sm:w-auto mt-2 sm:mt-0 px-4 py-2 bg-gray-900 hover:bg-[var(--color-brand-primary)] text-white text-sm font-bold rounded-xl transition-colors text-center"
                        >
                          View details
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
