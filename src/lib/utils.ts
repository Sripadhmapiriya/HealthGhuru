import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Formats a date deterministically using UTC to guarantee 100% identical output
 * between Server-Side Rendering (Node.js) and Client-Side Hydration (Browser)
 * regardless of the user's locale or timezone.
 * Example output: "Sep 9, 2026"
 */
export function formatDate(dateInput: string | Date | undefined | null): string {
  if (!dateInput) return '';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '';
  return `${MONTHS_SHORT[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

/**
 * Formats month and year deterministically using UTC.
 * Example output: "September 2026"
 */
export function formatMonthYear(dateInput: string | Date | undefined | null): string {
  if (!dateInput) return '';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return '';
  return `${MONTHS_FULL[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/**
 * Formats a timestamp into an intuitive, real-time relative string:
 * - < 60 seconds: "Just now"
 * - < 60 minutes: "Xm ago"
 * - < 24 hours: "Xh ago"
 * - < 7 days: "Xd ago"
 * - Otherwise: formatted date
 */
export function formatTimeAgo(dateInput: string | Date | undefined | null): string {
  if (!dateInput) return 'Just now';
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const time = d.getTime();
  if (isNaN(time)) return 'Just now';

  const diffSec = Math.floor((Date.now() - time) / 1000);
  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
  return formatDate(dateInput);
}

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  cancer: '/images/nutrition_pillar.png',
  heart: '/images/fitness_pillar.png',
  diabetes: '/images/nutrition_pillar.png',
  fitness: '/images/exercise_plank.png',
  nutrition: '/images/nutrition_pillar.png',
  pediatrics: '/images/nutrition_pillar.png',
  mental: '/images/fitness_pillar.png',
  ayurveda: '/images/nutrition_pillar.png',
};

/**
 * Sanitizes and validates image URLs. If the URL is empty, or is an expired/blocked
 * hotlinking Instagram/Facebook CDN link, it returns a verified health placeholder image.
 */
export function getSafeImageUrl(
  url?: string | null,
  category?: string | null,
  defaultFallback: string = '/images/fitness_pillar.png'
): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    if (category && CATEGORY_FALLBACK_IMAGES[category.toLowerCase()]) {
      return CATEGORY_FALLBACK_IMAGES[category.toLowerCase()];
    }
    return defaultFallback;
  }

  const trimmed = url.trim();

  // Handle blocked/expired Meta/Instagram CDN hotlinks
  if (
    trimmed.includes('cdninstagram.com') ||
    trimmed.includes('fbcdn.net') ||
    trimmed.includes('instagram.f')
  ) {
    if (category && CATEGORY_FALLBACK_IMAGES[category.toLowerCase()]) {
      return CATEGORY_FALLBACK_IMAGES[category.toLowerCase()];
    }
    return defaultFallback;
  }

  return trimmed;
}
