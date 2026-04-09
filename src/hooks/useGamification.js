/**
 * @fileoverview useGamification.js
 * React hook that bridges the Zustand store with the pure gamification engine.
 *
 * Responsibilities:
 *  - Reads raw values from the store
 *  - Derives richer display data using pure gamification utilities
 *  - Detects the moment streakBadgeUnlocked flips to true and surfaces
 *    a one-shot modal flag (no external toast library required)
 *  - Re-exports relevant store actions for convenience
 *
 * Returns:
 *  {
 *    contextPoints, privacyScore, privacyScoreLabel,
 *    xpProgress, streakStatus,
 *    showBadgeModal, dismissBadgeModal,
 *    addPoints, confirmPrediction, correctPrediction
 *  }
 */

import { useEffect, useRef, useState } from 'react';
import useContextIQStore from '../store/useContextIQStore';
import {
  getPrivacyScoreLabel,
  getXPBarProgress,
  getStreakStatus,
} from './gamification';

/**
 * @returns {{
 *   contextPoints: number,
 *   privacyScore: number,
 *   privacyScoreLabel: { label: string, color: string, bg: string },
 *   xpProgress: { level: number, progressPercent: number, pointsToNextLevel: number },
 *   streakStatus: { count: number, badgeUnlocked: boolean, label: string, nextMilestone: number },
 *   showBadgeModal: boolean,
 *   dismissBadgeModal: () => void,
 *   addPoints: (amount: number) => void,
 *   confirmPrediction: () => void,
 *   correctPrediction: () => void,
 * }}
 */
function useGamification() {
  // ── Store selectors ────────────────────────────────────────────────────────
  const contextPoints      = useContextIQStore((s) => s.contextPoints);
  const privacyScore       = useContextIQStore((s) => s.privacyScore);
  const streak             = useContextIQStore((s) => s.streak);
  const streakBadgeUnlocked = useContextIQStore((s) => s.streakBadgeUnlocked);

  // Store actions
  const addPoints          = useContextIQStore((s) => s.addPoints);
  const confirmPrediction  = useContextIQStore((s) => s.confirmPrediction);
  const correctPrediction  = useContextIQStore((s) => s.correctPrediction);

  // ── Derived values (pure, no side effects) ─────────────────────────────────
  const privacyScoreLabel = getPrivacyScoreLabel(privacyScore);
  const xpProgress        = getXPBarProgress(contextPoints);
  const streakStatus      = getStreakStatus(streak);

  // ── Badge modal state ──────────────────────────────────────────────────────
  const [showBadgeModal, setShowBadgeModal] = useState(false);

  // Track whether the badge was already shown this session to avoid repeat
  const badgeShownRef = useRef(false);

  useEffect(() => {
    if (streakBadgeUnlocked && !badgeShownRef.current) {
      badgeShownRef.current = true;
      setShowBadgeModal(true);
    }
  }, [streakBadgeUnlocked]);

  const dismissBadgeModal = () => setShowBadgeModal(false);

  return {
    // Raw values
    contextPoints,
    privacyScore,

    // Derived display values
    privacyScoreLabel,
    xpProgress,
    streakStatus,

    // Badge modal
    showBadgeModal,
    dismissBadgeModal,

    // Store action passthroughs
    addPoints,
    confirmPrediction,
    correctPrediction,
  };
}

export default useGamification;
