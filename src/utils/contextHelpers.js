/**
 * @fileoverview contextHelpers.js
 * Pure functions for computing context signal objects from raw sensor data.
 * All functions are side-effect-free and safe to call in any environment.
 */

// ---------------------------------------------------------------------------
// 1. Time Context
// ---------------------------------------------------------------------------

/**
 * Map a 0–23 hour value to a time-of-day context object.
 *
 * @param {number} hour - integer 0–23
 * @returns {{ timeOfDay: 'morning'|'midday'|'evening'|'latenight', label: string, emoji: string }}
 */
export function getTimeContext(hour) {
  try {
    const h = Number(hour);
    if (h >= 5 && h <= 9) {
      return { timeOfDay: 'morning', label: 'Morning focus', emoji: '🌅' };
    }
    if (h >= 10 && h <= 13) {
      return { timeOfDay: 'midday', label: 'Midday active', emoji: '☀️' };
    }
    if (h >= 14 && h <= 19) {
      return { timeOfDay: 'evening', label: 'Evening social', emoji: '🌆' };
    }
    // 20–23 and 0–4
    return { timeOfDay: 'latenight', label: 'Late-night browse', emoji: '🌙' };
  } catch {
    return { timeOfDay: 'latenight', label: 'Late-night browse', emoji: '🌙' };
  }
}

// ---------------------------------------------------------------------------
// 2. Location Context
// ---------------------------------------------------------------------------

/**
 * Derive a location type from coordinates and current hour.
 *
 * Real coordinates are used to prove the geolocation API was called, but the
 * *type* label is simulated (safe for demo purposes — avoids reverse geocoding).
 *
 * @param {number|null} lat  - latitude from navigator.geolocation, or null if denied
 * @param {number|null} lng  - longitude
 * @param {number}      hour - current hour 0–23 (used for type simulation)
 * @returns {{ locationType: 'home'|'commute'|'office'|'out'|'unknown', label: string }}
 */
export function getLocationContext(lat, lng, hour) {
  try {
    if (lat === null || lng === null) {
      return { locationType: 'unknown', label: 'Location unknown' };
    }

    const h = Number(hour);
    const { timeOfDay } = getTimeContext(h);

    if (timeOfDay === 'morning') {
      return { locationType: 'commute', label: 'On the move' };
    }
    if (timeOfDay === 'midday') {
      return { locationType: 'office', label: 'At the office' };
    }
    if (timeOfDay === 'evening' || timeOfDay === 'latenight') {
      return { locationType: 'home', label: 'At home' };
    }

    return { locationType: 'out', label: 'Out and about' };
  } catch {
    return { locationType: 'unknown', label: 'Location unknown' };
  }
}

// ---------------------------------------------------------------------------
// 3. Mood from Scroll Behaviour
// ---------------------------------------------------------------------------

/**
 * Infer user mood from an array of scroll-speed samples (px/s).
 *
 * @param {number[]} scrollSamples - recent scroll speed readings
 * @returns {{ mood: 'focused'|'browsing'|'relaxed', label: string }}
 */
export function getMoodFromScroll(scrollSamples) {
  try {
    if (!Array.isArray(scrollSamples) || scrollSamples.length === 0) {
      return { mood: 'browsing', label: 'Browsing' };
    }

    const avg =
      scrollSamples.reduce((sum, v) => sum + Math.abs(v), 0) /
      scrollSamples.length;

    if (avg < 50) {
      return { mood: 'focused', label: 'Focused' };
    }
    if (avg <= 150) {
      return { mood: 'browsing', label: 'Browsing' };
    }
    return { mood: 'relaxed', label: 'Relaxed' };
  } catch {
    return { mood: 'browsing', label: 'Browsing' };
  }
}
