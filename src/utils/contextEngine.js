/**
 * Derives browser time-of-day context.
 * Returns { label, icon, period }
 */
export function getTimeOfDay() {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return { label: 'Morning', icon: '🌅', period: 'morning' }
  if (hour >= 12 && hour < 17) return { label: 'Midday', icon: '☀️', period: 'midday' }
  if (hour >= 17 && hour < 21) return { label: 'Evening', icon: '🌇', period: 'evening' }
  return { label: 'Late Night', icon: '🌙', period: 'late-night' }
}

/**
 * Simulates a location type based on time-of-day heuristics.
 * In a real app this would use geolocation / Wi-Fi SSID.
 */
export function simulateLocation() {
  const hour = new Date().getHours()
  if (hour >= 9 && hour < 17) return { label: 'Office', icon: '🏢' }
  if ((hour >= 7 && hour < 9) || (hour >= 17 && hour < 19))
    return { label: 'Commute', icon: '🚇' }
  if (hour >= 19 || hour < 7) return { label: 'Home', icon: '🏠' }
  return { label: 'Out', icon: '🌍' }
}

/**
 * Infers mood based on time-of-day pattern.
 * In a real app this would use interaction cadence, scroll speed, etc.
 */
export function inferMood() {
  const hour = new Date().getHours()
  if (hour >= 9 && hour < 13) return { label: 'Focused', icon: '🎯' }
  if (hour >= 13 && hour < 18) return { label: 'Browsing', icon: '👀' }
  return { label: 'Relaxed', icon: '😌' }
}

/** Returns a formatted time string like "11:44 PM" */
export function getFormattedTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

/** Returns a greeting based on time of day */
export function getGreeting() {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'Good morning'
  if (hour >= 12 && hour < 17) return 'Good afternoon'
  if (hour >= 17 && hour < 21) return 'Good evening'
  return 'Late night mode'
}
