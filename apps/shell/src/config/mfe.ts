/**
 * Centralized MFE Configuration
 * These values are injected via environment variables at build/runtime.
 * Default values are provided for local development.
 */

export const MFE_URLS = {
  SHELL: import.meta.env.VITE_SHELL_URL || 'http://localhost:5173',
  DASHBOARD: (import.meta.env.VITE_ANALYTICS_URL || 'http://localhost:5175') + '/dashboard',
  ANALYTICS: (import.meta.env.VITE_ANALYTICS_URL || 'http://localhost:5175') + '/analytics',
  PATIENTS: import.meta.env.VITE_PATIENTS_URL || 'http://localhost:5174',
} as const

export const MFE_ORIGINS = {
  SHELL: new URL(MFE_URLS.SHELL).origin,
  ANALYTICS: new URL(import.meta.env.VITE_ANALYTICS_URL || 'http://localhost:5175').origin,
  PATIENTS: new URL(MFE_URLS.PATIENTS).origin,
} as const

export const ALLOWED_MFE_ORIGINS = new Set([MFE_ORIGINS.ANALYTICS, MFE_ORIGINS.PATIENTS])
