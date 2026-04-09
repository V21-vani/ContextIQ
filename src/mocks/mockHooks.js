/**
 * @fileoverview mockHooks.js
 * Drop-in mock versions of every ContextIQ hook.
 *
 * HOW TO USE:
 *   // During development — import from here:
 *   import { useContextEngine, useGamification, useRecommendations } from '@/mocks/mockHooks'
 *
 *   // When ready to go live — change the import path:
 *   import useContextEngine   from '@/hooks/useContextEngine'
 *   import useGamification    from '@/hooks/useGamification'
 *   import useRecommendations from '@/hooks/useRecommendations'
 *
 * All mocks are pure functions — no side effects, no store mutations.
 */

import products from '@/data/products'

// ─── 1. useContextEngine ──────────────────────────────────────────────────

/**
 * @returns {{
 *   context: {
 *     timeOfDay:    'morning' | 'midday' | 'evening' | 'latenight',
 *     hour:         number,
 *     locationType: 'home' | 'commute' | 'office' | 'out' | 'unknown',
 *     mood:         'focused' | 'browsing' | 'relaxed',
 *     scrollSpeed:  number | null,
 *   },
 *   isReady: boolean
 * }}
 */
export function useContextEngine() {
  return {
    context: {
      timeOfDay   : 'evening',
      hour        : 19,
      locationType: 'home',
      mood        : 'browsing',
      scrollSpeed : 80,
    },
    isReady: true,
  }
}

// ─── 2. useGamification ──────────────────────────────────────────────────

/**
 * @returns {{
 *   contextPoints:     number,
 *   privacyScore:      number,
 *   privacyScoreLabel: { label: string, color: string, bg: string },
 *   xpProgress:        { level: number, progressPercent: number, pointsToNextLevel: number },
 *   streakStatus:      { count: number, badgeUnlocked: boolean, label: string, nextMilestone: number },
 *   showBadgeModal:    boolean,
 *   dismissBadgeModal: () => void,
 *   addPoints:         (amount: number) => void,
 *   confirmPrediction: () => void,
 *   correctPrediction: () => void,
 * }}
 */
export function useGamification() {
  return {
    contextPoints    : 85,
    privacyScore     : 80,
    privacyScoreLabel: {
      label: 'Mostly Trusted',
      color: 'text-blue-500',
      bg   : 'bg-blue-50',
    },
    xpProgress: {
      level           : 1,
      progressPercent : 85,
      pointsToNextLevel: 15,
    },
    streakStatus: {
      count        : 2,
      badgeUnlocked: false,
      label        : '2 in a row',
      nextMilestone: 3,
    },
    showBadgeModal   : false,
    dismissBadgeModal: () => {},
    addPoints        : (n) => console.log('[mock] addPoints', n),
    confirmPrediction: ()  => console.log('[mock] confirmPrediction'),
    correctPrediction: ()  => console.log('[mock] correctPrediction'),
  }
}

// ─── 3. useRecommendations ────────────────────────────────────────────────

/**
 * @returns {{
 *   recommendations: Object[],   // array of product objects (top 8)
 *   toneHint:        'energetic' | 'calm' | 'focused' | 'neutral',
 *   contextReason:   string,
 *   loading:         boolean,
 *   error:           string | null,
 * }}
 */
export function useRecommendations() {
  return {
    recommendations: products.slice(0, 8),
    toneHint       : 'calm',
    contextReason  : 'Mock: evening home context — showing relaxation and lifestyle picks.',
    loading        : false,
    error          : null,
  }
}
