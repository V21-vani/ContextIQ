import { create } from 'zustand'

/**
 * Derives context signals from a given hour (0-23).
 */
function contextFromHour(hour) {
  let period, periodLabel, periodIcon
  if (hour >= 5 && hour < 12)  { period = 'morning';     periodLabel = 'Morning';    periodIcon = '🌅' }
  else if (hour >= 12 && hour < 17) { period = 'midday';  periodLabel = 'Midday';     periodIcon = '☀️' }
  else if (hour >= 17 && hour < 21) { period = 'evening'; periodLabel = 'Evening';    periodIcon = '🌇' }
  else                              { period = 'late-night'; periodLabel = 'Late Night'; periodIcon = '🌙' }

  let location, locationIcon
  if (hour >= 9 && hour < 17)                             { location = 'office';  locationIcon = '🏢' }
  else if ((hour >= 7 && hour < 9) || (hour >= 17 && hour < 19)) { location = 'commute'; locationIcon = '🚇' }
  else if (hour >= 19 || hour < 7)                        { location = 'home';    locationIcon = '🏠' }
  else                                                    { location = 'out';     locationIcon = '🌍' }

  let mood, moodIcon
  if (hour >= 9 && hour < 13)       { mood = 'focused';   moodIcon = '🎯' }
  else if (hour >= 13 && hour < 18) { mood = 'browsing';  moodIcon = '👀' }
  else                              { mood = 'relaxed';   moodIcon = '😌' }

  return { period, periodLabel, periodIcon, location, locationIcon, mood, moodIcon }
}

/**
 * Returns a warm-cool hue config for the storefront.
 *  morning  → cool teal
 *  midday   → neutral sky
 *  evening  → warm orange
 *  late-night → warm amber / deep
 */
function themeFromPeriod(period) {
  switch (period) {
    case 'morning':
      return { accent: '#0ea5e9', accentLight: '#7dd3fc', glow: 'rgba(14,165,233,0.3)', bg: '#071a2b', label: 'Cool Teal' }
    case 'midday':
      return { accent: '#38bdf8', accentLight: '#bae6fd', glow: 'rgba(56,189,248,0.25)', bg: '#0b1628', label: 'Sky Blue' }
    case 'evening':
      return { accent: '#f59e0b', accentLight: '#fcd34d', glow: 'rgba(245,158,11,0.3)', bg: '#1a1008', label: 'Warm Orange' }
    case 'late-night':
      return { accent: '#f97316', accentLight: '#fdba74', glow: 'rgba(249,115,22,0.35)', bg: '#160d06', label: 'Amber Glow' }
    default:
      return { accent: '#6c5ce7', accentLight: '#a29bfe', glow: 'rgba(108,92,231,0.3)', bg: '#0b0f1a', label: 'Default' }
  }
}

/**
 * Adaptive copy tone per period.
 */
function copyTone(period) {
  switch (period) {
    case 'morning':
      return {
        headline: 'Start your day right',
        sub: 'Fresh picks to fuel your morning routine.',
        cta: 'Explore morning essentials',
      }
    case 'midday':
      return {
        headline: 'Power through your afternoon',
        sub: 'Curated for focus and productivity.',
        cta: 'See top midday picks',
      }
    case 'evening':
      return {
        headline: 'Unwind & enjoy',
        sub: 'Handpicked treats for a cozy evening.',
        cta: 'Browse evening favourites',
      }
    case 'late-night':
      return {
        headline: 'Late-night specials',
        sub: 'Comfort finds for the night owls.',
        cta: 'Discover late-night deals',
      }
    default:
      return {
        headline: 'Explore our store',
        sub: 'All products in one place.',
        cta: 'Shop all',
      }
  }
}

const useStorefrontStore = create((set, get) => ({
  /** The simulated hour (8-23) controlled by the slider */
  simulatedHour: new Date().getHours(),

  /** Whether side-by-side comparison mode is active */
  compareMode: false,

  /** Derived context (recomputed when hour changes) */
  context: contextFromHour(new Date().getHours()),

  /** Colour theme for current period */
  theme: themeFromPeriod(contextFromHour(new Date().getHours()).period),

  /** Adaptive copy */
  copy: copyTone(contextFromHour(new Date().getHours()).period),

  /* ── actions ── */
  setHour: (hour) => {
    const ctx = contextFromHour(hour)
    set({
      simulatedHour: hour,
      context: ctx,
      theme: themeFromPeriod(ctx.period),
      copy: copyTone(ctx.period),
    })
  },

  toggleCompare: () => set((s) => ({ compareMode: !s.compareMode })),
}))

export default useStorefrontStore
