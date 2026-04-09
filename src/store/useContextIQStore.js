/**
 * @fileoverview ContextIQ Global State Store
 *
 * Full state shape:
 *
 * @typedef {Object} UserProfile
 * @property {string|null} id               - UUID generated on first load
 * @property {boolean}     onboardingComplete
 * @property {Object}      preferences      - filled during onboarding quiz
 *
 * @typedef {Object} Context
 * @property {'morning'|'midday'|'evening'|'latenight'|null} timeOfDay
 * @property {number|null}  hour            - raw hour 0–23
 * @property {'home'|'commute'|'office'|'out'|null} locationType
 * @property {'focused'|'browsing'|'relaxed'|null}  mood
 * @property {number|null}  scrollSpeed     - average px/s
 *
 * @typedef {Object} Consent
 * @property {boolean} timeConsented
 * @property {boolean} locationConsented
 * @property {boolean} behaviourConsented
 *
 * @typedef {Object} ContextIQState
 * @property {UserProfile}  user
 * @property {number}       contextPoints
 * @property {number}       privacyScore          - 0–100, starts at 100
 * @property {number}       streak                - consecutive correct predictions
 * @property {boolean}      streakBadgeUnlocked
 * @property {Context}      context
 * @property {Consent}      consent
 * @property {Object[]}     recommendations       - ranked by Claude
 * @property {'energetic'|'calm'|'focused'|'neutral'} aiToneHint
 * @property {Context|null} lastPrediction
 * @property {boolean|null} predictionCorrect
 *
 * Persisted keys: contextPoints, privacyScore, streak, streakBadgeUnlocked, user, consent
 * NOT persisted:  recommendations, context (always freshly computed)
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';

// ---------------------------------------------------------------------------
// Initial state slices
// ---------------------------------------------------------------------------

const initialUser = {
  id: uuidv4(),
  onboardingComplete: false,
  preferences: {},
};

const initialContext = {
  timeOfDay: null,
  hour: null,
  locationType: null,
  mood: null,
  scrollSpeed: null,
};

const initialConsent = {
  timeConsented: false,
  locationConsented: false,
  behaviourConsented: false,
};

const initialState = {
  // --- USER PROFILE ---
  user: initialUser,

  // --- GAMIFICATION ---
  contextPoints: 0,
  privacyScore: 100,
  streak: 0,
  streakBadgeUnlocked: false,

  // --- CONTEXT SIGNALS (never persisted; freshly computed each session) ---
  context: initialContext,

  // --- CONSENT ---
  consent: initialConsent,

  // --- AI / RECOMMENDATIONS (never persisted) ---
  recommendations: [],
  aiToneHint: 'neutral',
  lastPrediction: null,
  predictionCorrect: null,
};

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

const useContextIQStore = create(
  persist(
    immer((set, get) => ({
      ...initialState,

      // -----------------------------------------------------------------------
      // GAMIFICATION ACTIONS
      // -----------------------------------------------------------------------

      /** Add a positive number of Context Points */
      addPoints: (amount) =>
        set((state) => {
          state.contextPoints += amount;
        }),

      /**
       * Adjust privacyScore by delta; clamped to [0, 100].
       * @param {number} delta - positive or negative
       */
      updatePrivacyScore: (delta) =>
        set((state) => {
          state.privacyScore = Math.min(
            100,
            Math.max(0, state.privacyScore + delta)
          );
        }),

      // -----------------------------------------------------------------------
      // CONSENT ACTIONS
      // -----------------------------------------------------------------------

      /**
       * Toggle a single consent signal.
       * Privacy score = 100 − (inferred signals × 10).
       * @param {'timeConsented'|'locationConsented'|'behaviourConsented'} signalKey
       * @param {boolean} value
       */
      setConsent: (signalKey, value) =>
        set((state) => {
          state.consent[signalKey] = value;
          const inferredCount = Object.values(state.consent).filter(
            (v) => !v
          ).length;
          state.privacyScore = 100 - inferredCount * 10;
        }),

      // -----------------------------------------------------------------------
      // CONTEXT ACTIONS
      // -----------------------------------------------------------------------

      /**
       * Merge partial context update into current context.
       * @param {Partial<Context>} contextUpdate
       */
      setContext: (contextUpdate) =>
        set((state) => {
          Object.assign(state.context, contextUpdate);
        }),

      // -----------------------------------------------------------------------
      // AI / RECOMMENDATION ACTIONS
      // -----------------------------------------------------------------------

      /**
       * Replace recommendations from Claude with an optional tone hint.
       * @param {Object[]} recs
       * @param {'energetic'|'calm'|'focused'|'neutral'} toneHint
       */
      setRecommendations: (recs, toneHint) =>
        set((state) => {
          state.recommendations = recs;
          state.aiToneHint = toneHint ?? 'neutral';
        }),

      // -----------------------------------------------------------------------
      // PREDICTION FEEDBACK ACTIONS
      // -----------------------------------------------------------------------

      /**
       * User confirms the AI prediction was correct.
       * +15 context points, streak increments, badges unlock at 3+.
       */
      confirmPrediction: () =>
        set((state) => {
          const newStreak = state.streak + 1;
          state.predictionCorrect = true;
          state.streak = newStreak;
          state.streakBadgeUnlocked = newStreak >= 3;
          state.contextPoints += 15;
        }),

      /**
       * User corrects the AI prediction.
       * +20 context points, +2 privacy score (honesty reward), streak resets.
       */
      correctPrediction: () =>
        set((state) => {
          state.predictionCorrect = false;
          state.streak = 0;
          state.contextPoints += 20;
          state.privacyScore = Math.min(100, state.privacyScore + 2);
        }),

      // -----------------------------------------------------------------------
      // ONBOARDING
      // -----------------------------------------------------------------------

      /**
       * Mark onboarding complete and store user preferences.
       * Awards 10 context points.
       * @param {Object} preferences
       */
      completeOnboarding: (preferences) =>
        set((state) => {
          state.user.onboardingComplete = true;
          state.user.preferences = preferences;
          state.contextPoints += 10;
        }),

      // -----------------------------------------------------------------------
      // RESET
      // -----------------------------------------------------------------------

      /** Reset every key back to its initial value (generates a fresh UUID). */
      resetStore: () =>
        set((state) => {
          Object.assign(state, {
            ...initialState,
            user: { ...initialUser, id: uuidv4() },
            context: { ...initialContext },
            consent: { ...initialConsent },
            recommendations: [],
          });
        }),
    })),

    // -------------------------------------------------------------------------
    // Persist middleware config
    // -------------------------------------------------------------------------
    {
      name: 'contextiq-store',
      storage: createJSONStorage(() => localStorage),

      // Only persist these keys; context and recommendations are excluded
      partialize: (state) => ({
        user: state.user,
        contextPoints: state.contextPoints,
        privacyScore: state.privacyScore,
        streak: state.streak,
        streakBadgeUnlocked: state.streakBadgeUnlocked,
        consent: state.consent,
      }),
    }
  )
);

export default useContextIQStore;
