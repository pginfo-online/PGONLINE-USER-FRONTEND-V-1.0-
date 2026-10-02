/**
 * Centralized Design System Tokens
 * Defines the unified visual identity for PGInfo Web Platform.
 * Note: Zero orange used; pure, high-contrast, modern accessible palette.
 */

export const tokens = {
  colors: {
    brand: {
      // Primary Teal Navy
      primary: '#0F766E',
      primaryHover: '#0D9488',
      primaryLight: '#F0FDFA',
      primaryBorder: '#CCFBF1',

      // Royal Blue / Sapphire CTA Accent
      accent: '#2563EB',
      accentHover: '#1D4ED8',
      accentLight: '#EFF6FF',
      accentBorder: '#BFDBFE',

      // Deep Navy Text / Headlines
      navy: '#0F172A',
      navyMuted: '#334155',

      // Verified / Success Emerald
      emerald: '#059669',
      emeraldLight: '#ECFDF5',
      emeraldBorder: '#A7F3D0',

      // Warning Amber
      amber: '#D97706',
      amberLight: '#FFFBEB',
      amberBorder: '#FDE68A',

      // Danger / Rose
      rose: '#E11D48',
      roseLight: '#FFF1F2',
      roseBorder: '#FECDD3',

      // Neutrals
      canvas: '#F8FAFC',
      surface: '#FFFFFF',
      surfaceMuted: '#F1F5F9',
      border: '#E2E8F0',
      borderStrong: '#CBD5E1',
      textMuted: '#64748B',
      textLight: '#94A3B8',
    },
  },
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    full: '9999px',
  },
  shadows: {
    xs: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
    sm: '0 2px 4px -1px rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
    md: '0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)',
    lg: '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.03)',
    xl: '0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
    cardHover: '0 20px 30px -10px rgba(15, 23, 42, 0.12), 0 10px 15px -5px rgba(15, 23, 42, 0.04)',
    primaryGlow: '0 10px 25px -5px rgba(15, 118, 110, 0.25)',
    accentGlow: '0 10px 25px -5px rgba(37, 99, 235, 0.25)',
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
} as const;

export default tokens;
