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

  // Meetups & Circles
  MEETUPS: '/meetups',
  MEETUP_BY_ID: (id: string) => `/meetups/${id}`,
  MEETUP_CATEGORIES: '/meetup-categories',
  MEETUP_JOIN: (id: string) => `/meetups/${id}/join`,
  MEETUP_INTEREST: (id: string) => `/meetups/${id}/interest`,

  // Buffets & Hot Deals
  BUFFETS: '/buffet',
  HOT_DEALS: '/hot-deals',
} as const;
