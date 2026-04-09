/**
 * @fileoverview gamification.js — Pure scoring and progression utilities.
 *
 * All functions are side-effect-free and importable without a store.
 * This makes them individually unit-testable.
 *
 * Usage:
 *   import { POINTS_CONFIG, computePrivacyScore, getXPBarProgress, ... }
 *     from './gamification';
 */

// ---------------------------------------------------------------------------
// Points configuration
// ---------------------------------------------------------------------------

/**
 * Canonical point values for every game event in ContextIQ.
 * @type {{ ONBOARDING_ANSWER: number, CORRECT_PREDICTION: number, USER_CORRECTION: number, CONSENT_GIVEN: number, STREAK_BONUS: number }}
 */
export const POINTS_CONFIG = Object.freeze({
  ONBOARDING_ANSWER  : 10,
  CORRECT_PREDICTION : 15,
  USER_CORRECTION    : 20,
  CONSENT_GIVEN      : 5,
  STREAK_BONUS       : 25,
});

// ---------------------------------------------------------------------------
// Privacy score
// ---------------------------------------------------------------------------

/**
 * Compute the user's privacy score from their current consent state.
 * Starts at 100; each un-consented (inferred) signal deducts 10 points.
 *
 * @param {{ timeConsented: boolean, locationConsented: boolean, behaviourConsented: boolean }} consent
 * @returns {number} 0–100
 */
export function computePrivacyScore(consent) {
  if (!consent || typeof consent !== 'object') return 100;
  const inferredCount = Object.values(consent).filter((v) => !v).length;
  return Math.max(0, 100 - inferredCount * 10);
}

/**
 * Map a numeric privacy score to a human-readable label and UI colour tokens.
 *
 * @param {number} score
 * @returns {{ label: string, color: string, bg: string }}
 */
export function getPrivacyScoreLabel(score) {
  if (score >= 100) {
    return { label: 'Fully Trusted',  color: 'text-emerald-500', bg: 'bg-emerald-50' };
  }
  if (score >= 70) {
    return { label: 'Mostly Trusted', color: 'text-blue-500',    bg: 'bg-blue-50'    };
  }
  if (score >= 40) {
    return { label: 'Partial Trust',  color: 'text-amber-500',   bg: 'bg-amber-50'   };
  }
  return   { label: 'Inferred Only',  color: 'text-red-500',     bg: 'bg-red-50'     };
}

// ---------------------------------------------------------------------------
// XP / Level progression
// ---------------------------------------------------------------------------

/**
 * Derive the user's level and XP bar progress from their total context points.
 * Each level requires 100 points.
 *
 * @param {number} contextPoints
 * @returns {{ level: number, progressPercent: number, pointsToNextLevel: number }}
 */
export function getXPBarProgress(contextPoints) {
  const points   = Math.max(0, contextPoints);
  const level    = Math.floor(points / 100) + 1;
  const progress = points % 100;
  return {
    level,
    progressPercent  : progress,          // 0–99
    pointsToNextLevel: 100 - progress,
  };
}

// ---------------------------------------------------------------------------
// Streak status
// ---------------------------------------------------------------------------

/**
 * Derive streak display information from the raw streak count.
 *
 * @param {number} streak
 * @returns {{ count: number, badgeUnlocked: boolean, label: string, nextMilestone: number }}
 */
export function getStreakStatus(streak) {
  const count = Math.max(0, streak);
  return {
    count,
    badgeUnlocked : count >= 3,
    label         : count === 0 ? 'No streak' : `${count} in a row`,
    nextMilestone : count < 3 ? 3 : count < 7 ? 7 : 10,
  };
}
