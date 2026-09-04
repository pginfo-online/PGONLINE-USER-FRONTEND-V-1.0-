"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Phone, User, MapPin, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'password' | 'otp';
type PasswordMode = 'login' | 'signup';
type OtpStep = 'send' | 'verify';

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter();
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('otp');
  
  // Password Flow State
  const [passwordMode, setPasswordMode] = useState<PasswordMode>('login');
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', password: ''
  });
  
  // OTP Flow State
  const [otpStep, setOtpStep] = useState<OtpStep>('send');
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');
  
  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://pgonline-backend-v-1-0.onrender.com/api/v1";

  // --- Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Validations
    if (passwordMode === 'signup') {
      if (formData.name.trim().length < 2) {
        setError("Name must be at least 2 characters.");
        setIsLoading(false);
        return;
      }
      if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone)) {
        setError("Please enter a valid 10-digit mobile number.");
        setIsLoading(false);
        return;
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = passwordMode === 'login' ? '/auth/login' : '/auth/register';
      const payload = passwordMode === 'login' 
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, phone: formData.phone, password: formData.password, role: 'tenant' };
      
      const res = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Authentication failed');

      // Update global auth state
      if (data.data?.token && data.data?.user) {
        login(data.data.token, data.data.user);
      }

      // Success
      setSuccess(passwordMode === 'login' ? 'Logged in successfully!' : 'Account created successfully!');
      
      // If signed up, and they provided an address, we could theoretically update it via /auth/me here
      // using data.token, but we'll skip for brevity as it requires the PUT /auth/me route.

      // Close modal after success
      setTimeout(() => {
        onClose();
        router.push('/explore');
      }, 1500);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const isEmail = contact.includes('@');
    
    // Validation
    if (isEmail) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
         setError("Please enter a valid email address.");
         setIsLoading(false);
         return;
      }
    } else {
      if (!/^[6-9]\d{9}$/.test(contact)) {
         setError("Please enter a valid 10-digit mobile number.");
         setIsLoading(false);
         return;
      }
    }

    try {
      const payload = {
        contact,
        type: isEmail ? 'email' : 'phone',
        sendWhatsApp: true
      };

      const res = await fetch(`${apiUrl}/auth/otp/send-unified`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Failed to send OTP');
      
      setOtpStep('verify');
      setSuccess(`OTP sent to your ${isEmail ? 'email' : 'mobile'}`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/auth/otp/verify-unified`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact, otp, isMobile: false })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Invalid OTP');
      
      // If it's a new user on web, it returns a tempToken. For simplicity here, we assume full login if user object exists.
      if (data.data?.token && data.data?.user) {
        login(data.data.token, data.data.user);
        setSuccess('Verified successfully!');
        setTimeout(() => {
          onClose();
          router.push('/explore');
        }, 1500);
      } else {
        setError("Account not found. Please create an account with a password first.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Render Helpers ---
  const renderPasswordTab = () => (
    <motion.div
      key="password-tab"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col h-full"
    >
      <form onSubmit={handlePasswordSubmit} className="space-y-4 flex-1">
        {passwordMode === 'signup' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:bg-white outline-none transition-all" placeholder="John Doe" />
              </div>
            </div>
          </motion.div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:bg-white outline-none transition-all" placeholder="john@example.com" />
          </div>
        </div>

        {passwordMode === 'signup' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 overflow-hidden">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:bg-white outline-none transition-all" placeholder="9876543210" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:bg-white outline-none transition-all" placeholder="123 Main St, City" />
              </div>
            </div>
          </motion.div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input required type="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:bg-white outline-none transition-all" placeholder="••••••••" />
          </div>
        </div>

        {error && <p className="text-red-500 text-xs mt-2 bg-red-50 p-2 rounded-md border border-red-100">{error}</p>}
        {success && <p className="text-green-600 text-xs mt-2 flex items-center gap-1 bg-green-50 p-2 rounded-md border border-green-100"><CheckCircle2 className="w-4 h-4" /> {success}</p>}

        <button 
          disabled={isLoading}
          type="submit" 
          className="w-full mt-6 bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-secondary)] text-white font-medium py-3 rounded-xl transition-all shadow-md shadow-[var(--color-brand-primary)]/20 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing...' : passwordMode === 'login' ? 'Sign In' : 'Create Account'}
          {!isLoading && <ArrowRight className="w-4 h-4" />}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        {passwordMode === 'login' ? (
          <p>Don't have an account? <button type="button" onClick={() => {setPasswordMode('signup'); setError(null);}} className="text-[var(--color-brand-primary)] font-semibold hover:underline">Sign up</button></p>
        ) : (
          <p>Already have an account? <button type="button" onClick={() => {setPasswordMode('login'); setError(null);}} className="text-[var(--color-brand-primary)] font-semibold hover:underline">Sign in</button></p>
        )}
      </div>
    </motion.div>
  );

  const renderOtpTab = () => (
    <motion.div
      key="otp-tab"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col h-full justify-center pb-8"
    >
      {otpStep === 'send' ? (
        <form onSubmit={handleSendOtp} className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-serif text-gray-900 mb-2">Passwordless Entry</h3>
            <p className="text-sm text-gray-500">Enter your email or mobile number to receive a one-time passcode.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email or Mobile Number</label>
            <div className="relative">
              {contact.includes('@') ? (
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors" />
              ) : (
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors" />
              )}
              <input 
                required 
                type="text" 
                value={contact} 
                onChange={(e) => {setContact(e.target.value); setError(null);}} 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:bg-white outline-none transition-all tracking-wide" 
                placeholder="example@mail.com or 9876543210" 
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs text-center bg-red-50 p-2 rounded-md">{error}</p>}
          {success && <p className="text-green-600 text-xs text-center bg-green-50 p-2 rounded-md">{success}</p>}

          <button 
            disabled={isLoading || !contact}
            type="submit" 
            className="w-full bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-secondary)] text-white font-medium py-3 rounded-xl transition-all shadow-md shadow-[var(--color-brand-primary)]/20 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-xl font-serif text-gray-900 mb-2">Enter Verification Code</h3>
            <p className="text-sm text-gray-500">We sent a 4-digit code to <span className="font-semibold text-gray-900">{contact}</span></p>
          </div>

          <div>
            <input 
              required 
              type="text" 
              maxLength={4}
              value={otp} 
              onChange={(e) => {setOtp(e.target.value.replace(/\D/g, '')); setError(null);}} 
              className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-2xl font-bold tracking-[1em] text-center focus:ring-2 focus:ring-[var(--color-brand-primary)] focus:bg-white outline-none transition-all" 
              placeholder="••••" 
            />
          </div>

          {error && <p className="text-red-500 text-xs text-center bg-red-50 p-2 rounded-md">{error}</p>}
          {success && <p className="text-green-600 text-xs text-center bg-green-50 p-2 rounded-md flex items-center justify-center gap-1"><CheckCircle2 className="w-4 h-4"/> {success}</p>}

          <button 
            disabled={isLoading || otp.length !== 4}
            type="submit" 
            className="w-full bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-secondary)] text-white font-medium py-3 rounded-xl transition-all shadow-md shadow-[var(--color-brand-primary)]/20 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Verifying...' : 'Verify & Proceed'}
          </button>

          <button type="button" onClick={() => setOtpStep('send')} className="w-full text-sm text-gray-500 hover:text-gray-900 transition-colors">
            Change email/mobile
          </button>
        </form>
      )}
    </motion.div>
  );

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header / Tabs */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif text-gray-900">Welcome</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex p-1 bg-gray-100 rounded-xl relative">
                <button 
                  onClick={() => {setActiveTab('otp'); setError(null); setSuccess(null);}}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg z-10 transition-colors ${activeTab === 'otp' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Quick OTP
                </button>
                <button 
                  onClick={() => {setActiveTab('password'); setError(null); setSuccess(null);}}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg z-10 transition-colors ${activeTab === 'password' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Password Auth
                </button>
                
                {/* Sliding Background indicator for tabs */}
                <motion.div 
                  className="absolute inset-y-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm"
                  initial={false}
                  animate={{ left: activeTab === 'otp' ? '4px' : 'calc(50% + 0px)' }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              </div>
            </div>

            {/* Content Area */}
            <div className="p-6 overflow-y-auto scrollbar-hide flex-1">
              <AnimatePresence mode="wait">
                {activeTab === 'password' ? renderPasswordTab() : renderOtpTab()}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(modalContent, document.body);
}
