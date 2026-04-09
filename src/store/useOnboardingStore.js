import { create } from 'zustand'

const useOnboardingStore = create((set, get) => ({
  answers: {},
  currentStep: 0,
  isComplete: false,

  setAnswer: (questionId, answer) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer },
    })),

  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, 4),
    })),

  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 0),
    })),

  completeOnboarding: () => set({ isComplete: true }),

  getProgress: () => {
    const answered = Object.keys(get().answers).length
    return (answered / 5) * 100
  },

  reset: () => set({ answers: {}, currentStep: 0, isComplete: false }),
}))

export default useOnboardingStore
