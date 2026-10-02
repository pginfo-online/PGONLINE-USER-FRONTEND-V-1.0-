/**
 * Centralized API endpoints for PGInfo platform
 */

export const API_ENDPOINTS = {
  // Cities
  CITIES: '/cities',
  CITIES_SEARCH: '/cities/search',

  // Areas
  AREAS: '/areas',

  // Properties (Unified: PGs, Residential Flats, Commercials)
  PROPERTIES: '/properties',
  PROPERTY_SUGGESTIONS: '/properties/suggestions',
  PROPERTY_BY_ID: (id: string) => `/properties/${id}`,

  // Legacy PG specific routes (if needed)
  PG: '/pg',
  PG_BY_ID: (id: string) => `/pg/${id}`,

  // Leads & Wishlist
  LEADS: '/lead',
  MY_LEADS: '/lead/my',

  // Visits
  VISITS: '/visit',
  MY_VISITS: '/visit/my',

  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  SEND_OTP: '/auth/send-otp',
  VERIFY_OTP: '/auth/verify-otp',
  ME: '/auth/me',
  UPDATE_PROFILE: '/auth/profile',

  // Notifications
  NOTIFICATIONS: '/notifications',
} as const;
