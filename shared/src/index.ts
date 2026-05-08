export interface HealthResponse {
  status: string;
  lastUpdated: string;
  // legacy alias: some branches still use `timestamp`
  timestamp?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

// Convenience display helper used by frontend tests and older branches
export function formatDisplayTimestamp(iso: string | undefined | null) {
  if (!iso) return 'unknown';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

// Re-export config helpers for convenience
export { resolveApiBaseUrl, resolveFeatureFlags } from './config';
