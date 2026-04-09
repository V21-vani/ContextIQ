import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useOnboardingStore from '../store/useOnboardingStore'
import onboardingQuestions from '../data/onboardingQuestions'

/* ───────────────────────── animation variants ───────────────────────── */
const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 420 : -420, opacity: 0, scale: 0.95 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir) => ({ x: dir < 0 ? 420 : -420, opacity: 0, scale: 0.95 }),
}

/* ───────────────────────── component ───────────────────────── */
export default function Onboarding() {
  const navigate = useNavigate()
  const {
    answers,
    currentStep,
    setAnswer,
    nextStep,
    prevStep,
    completeOnboarding,
    getProgress,
  } = useOnboardingStore()

  const question = onboardingQuestions[currentStep]
  const progress = getProgress()
  const privacyScore = 100                       // static 100 %
  const isLastStep = currentStep === onboardingQuestions.length - 1
  const selectedValue = answers[question.id]

  /* direction for slide animation: 1 = forward, -1 = back */
  const direction = useOnboardingStore((s) => s._dir ?? 1)

  const handleSelect = useCallback(
    (value) => {
      setAnswer(question.id, value)
    },
    [question.id, setAnswer],
  )

  const handleNext = useCallback(() => {
    if (!selectedValue) return
    useOnboardingStore.setState({ _dir: 1 })
    if (isLastStep) {
      completeOnboarding()
      navigate('/dashboard')
    } else {
      nextStep()
    }
  }, [selectedValue, isLastStep, completeOnboarding, navigate, nextStep])

  const handleBack = useCallback(() => {
    useOnboardingStore.setState({ _dir: -1 })
    prevStep()
  }, [prevStep])

  /* keyboard navigation */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Enter') handleNext()
      if (e.key === 'Backspace' && currentStep > 0) handleBack()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleNext, handleBack, currentStep])

  /* ────────────────────────── render ────────────────────────── */
  return (
    <div className="onboarding-root">
      {/* background blobs */}
      <div className="onboarding-blob onboarding-blob--1" />
      <div className="onboarding-blob onboarding-blob--2" />
      <div className="onboarding-blob onboarding-blob--3" />

      {/* ── top bar ── */}
      <header className="onboarding-topbar">
        <span className="onboarding-logo">ContextIQ</span>
        <div className="onboarding-privacy">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span>Privacy Score&ensp;<strong>{privacyScore}%</strong></span>
        </div>
      </header>

      {/* ── XP progress bar ── */}
      <div className="xp-bar-wrapper">
        <div className="xp-bar-track">
          <motion.div
            className="xp-bar-fill"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          />
        </div>
        <div className="xp-bar-labels">
          <span className="xp-bar-label">XP Progress</span>
          <span className="xp-bar-value">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* ── step indicator ── */}
      <div className="step-dots">
        {onboardingQuestions.map((_, i) => (
          <span
            key={i}
            className={`step-dot ${i === currentStep ? 'step-dot--active' : ''} ${
              answers[onboardingQuestions[i].id] !== undefined ? 'step-dot--done' : ''
            }`}
          />
        ))}
      </div>

      {/* ── question card with slide animation ── */}
      <div className="onboarding-card-area">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="question-card"
          >
            <span className="question-icon">{question.icon}</span>
            <h2 className="question-title">{question.question}</h2>
            <p className="question-subtitle">{question.subtitle}</p>

            <div className="options-grid">
              {question.options.map((opt) => {
                const isSelected = selectedValue === opt.value
                return (
                  <motion.button
                    key={opt.value}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className={`option-btn ${isSelected ? 'option-btn--selected' : ''}`}
                    onClick={() => handleSelect(opt.value)}
                  >
                    <span className="option-icon">{opt.icon}</span>
                    <span className="option-label">{opt.label}</span>
                    <span className="option-desc">{opt.desc}</span>
                    {isSelected && (
                      <motion.span
                        layoutId="check"
                        className="option-check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                      >
                        ✓
                      </motion.span>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── nav buttons ── */}
      <div className="onboarding-nav">
        {currentStep > 0 && (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="nav-btn nav-btn--back"
            onClick={handleBack}
          >
            ← Back
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className={`nav-btn nav-btn--next ${!selectedValue ? 'nav-btn--disabled' : ''}`}
          onClick={handleNext}
          disabled={!selectedValue}
        >
          {isLastStep ? 'Finish 🎉' : 'Continue →'}
        </motion.button>
      </div>
    </div>
  )
}
