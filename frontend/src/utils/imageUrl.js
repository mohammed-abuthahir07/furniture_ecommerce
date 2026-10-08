/**
 * Resolves backend image path to a full accessible URL.
 * Handles missing/null images and provides fallback SVGs.
 */

import { API_BASE_URL } from '../services/api';

// Fallback placeholder image for furniture
export const FALLBACK_FURNITURE_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='450' viewBox='0 0 600 450' fill='none'%3E%3Crect width='600' height='450' fill='%23f3f2ee'/%3E%3Cpath d='M180 280h240v-40H180v40zm0-60h240c11 0 20-9 20-20v-40c0-22-18-40-40-40H200c-22 0-40 18-40 40v40c0 11 9 20 20 20zm-20 80h280v20H160v-20z' fill='%23a46d49' opacity='0.5'/%3E%3Ctext x='50%25' y='360' text-anchor='middle' fill='%23787367' font-family='sans-serif' font-size='16' font-weight='600'%3EWoodCraft Furniture%3C/text%3E%3C/svg%3E";

export const FALLBACK_USER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150' fill='none'%3E%3Ccircle cx='75' cy='75' r='75' fill='%23e8d3c1'/%3E%3Ccircle cx='75' cy='60' r='30' fill='%23895337'/%3E%3Cpath d='M25 130c0-27.6 22.4-50 50-50s50 22.4 50 50' fill='%23895337'/%3E%3C/svg%3E";

export function getImageUrl(path, fallback = FALLBACK_FURNITURE_IMAGE) {
  if (!path) return fallback;
  if (typeof path !== 'string') return fallback;

  const trimmed = path.trim();
  if (trimmed === '') return fallback;

  // If already absolute URL or data URI
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }

  // Ensure path starts with leading slash
  const normalizedPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  
  return `${API_BASE_URL}${normalizedPath}`;
}

export function handleImageError(e, fallback = FALLBACK_FURNITURE_IMAGE) {
  if (e?.target) {
    e.target.onerror = null; // Prevent infinite fallback loops
    e.target.src = fallback;
  }
}

export default getImageUrl;
