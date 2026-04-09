import { create } from 'zustand'
import {
  getTimeOfDay,
  simulateLocation,
  inferMood,
} from '../utils/contextEngine'

const useDashboardStore = create((set, get) => ({
  /* ── context signals ── */
  timeOfDay: getTimeOfDay(),
  location: simulateLocation(),
  mood: inferMood(),

  /* ── metrics ── */
  privacyScore: 92,
  contextPoints: 1240,
  activeStreak: 7,

  /* ── signal metadata (consented vs inferred) ── */
  signalMeta: {
    timeOfDay:  { source: 'consented', detail: 'Browser clock' },
    location:   { source: 'inferred',  detail: 'Time-based heuristic' },
    mood:       { source: 'inferred',  detail: 'Interaction pattern' },
  },

  /* ── actions ── */
  refreshContext: () =>
    set({
      timeOfDay: getTimeOfDay(),
      location: simulateLocation(),
      mood: inferMood(),
    }),

  addPoints: (pts) =>
    set((s) => ({ contextPoints: s.contextPoints + pts })),

  incrementStreak: () =>
    set((s) => ({ activeStreak: s.activeStreak + 1 })),

  setPrivacyScore: (score) =>
    set({ privacyScore: Math.max(0, Math.min(100, score)) }),
}))

export default useDashboardStore
