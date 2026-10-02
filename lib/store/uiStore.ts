import { create } from 'zustand';
import { Property } from '../types/property';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface UIState {
  // Mobile / Modal states
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup' | 'otp';
  isFilterSheetOpen: boolean;
  isMobileMenuOpen: boolean;
  viewMode: 'grid' | 'list';

  // Contact Owner Modal
  isContactModalOpen: boolean;
  contactProperty: Property | null;

  // Toasts
  toasts: ToastItem[];

  // Actions
  openAuthModal: (mode?: 'login' | 'signup' | 'otp') => void;
  closeAuthModal: () => void;
  openContactModal: (property: Property) => void;
  closeContactModal: () => void;
  setFilterSheetOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isAuthModalOpen: false,
  authModalMode: 'otp',
  isFilterSheetOpen: false,
  isMobileMenuOpen: false,
  viewMode: 'grid',
  isContactModalOpen: false,
  contactProperty: null,
  toasts: [],

  openAuthModal: (mode = 'otp') => set({ isAuthModalOpen: true, authModalMode: mode }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  openContactModal: (property: Property) => set({ isContactModalOpen: true, contactProperty: property }),
  closeContactModal: () => set({ isContactModalOpen: false, contactProperty: null }),

  setFilterSheetOpen: (open) => set({ isFilterSheetOpen: open }),
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setViewMode: (viewMode) => set({ viewMode }),

  addToast: (message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 4000);
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
