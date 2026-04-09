# ContextIQ — Frontend Developer Reference

> **Zero backend knowledge required.** This doc tells you everything you need to build all four screens. Use mock hooks during development; swap to real hooks with a one-line change when ready.

---

## Quick Start

```bash
npm run dev   # starts at http://localhost:5173
```

The app auto-redirects:
- No onboarding → lands on `/`  (OnboardingScreen)
- Onboarding done → lands on `/dashboard`

---

## Hook Import Cheatsheet

### During development (mock data, no API calls)

```js
import {
  useContextEngine,
  useGamification,
  useRecommendations,
} from '@/mocks/mockHooks'
```

### Switching to live hooks (one line change per hook)

```js
// Replace each mock import with the real one:
import useContextEngine   from '@/hooks/useContextEngine'
import useGamification    from '@/hooks/useGamification'
import useRecommendations from '@/hooks/useRecommendations'
```

That's it. The return shapes are **identical**.

---

## Hook API Reference

### `useContextEngine()`

Detects time, location, and scroll mood. Updates every 10 seconds.

```ts
{
  context: {
    timeOfDay:    'morning' | 'midday' | 'evening' | 'latenight'
    hour:         number                 // 0–23
    locationType: 'home' | 'commute' | 'office' | 'out' | 'unknown'
    mood:         'focused' | 'browsing' | 'relaxed'
    scrollSpeed:  number | null          // average px/s, null if no scroll yet
  }
  isReady: boolean                       // false until first read completes
}
```

**Usage:**
```jsx
const { context, isReady } = useContextEngine()
if (!isReady) return <LoadingSpinner />
```

---

### `useGamification()`

All scoring, XP, streaks, and badge logic in one hook.

```ts
{
  // Raw values
  contextPoints:     number              // total XP accumulated
  privacyScore:      number              // 0–100

  // Derived display values
  privacyScoreLabel: {
    label: string                        // e.g. 'Mostly Trusted'
    color: string                        // Tailwind text class
    bg:    string                        // Tailwind bg class
  }
  xpProgress: {
    level:             number            // starts at 1
    progressPercent:   number            // 0–99 (current level progress)
    pointsToNextLevel: number
  }
  streakStatus: {
    count:         number
    badgeUnlocked: boolean               // true when streak ≥ 3
    label:         string                // e.g. '2 in a row'
    nextMilestone: number                // 3 → 7 → 10
  }

  // Badge modal (fires once when streak hits 3)
  showBadgeModal:    boolean
  dismissBadgeModal: () => void

  // Actions — call these on user interactions
  addPoints:         (amount: number) => void
  confirmPrediction: () => void          // user says AI was right  → +15 pts, streak++
  correctPrediction: () => void          // user corrects AI        → +20 pts, streak resets
}
```

**Privacy score labels:**

| Score | Label | Tailwind color | Tailwind bg |
|---|---|---|---|
| 100 | Fully Trusted | `text-emerald-500` | `bg-emerald-50` |
| 70–99 | Mostly Trusted | `text-blue-500` | `bg-blue-50` |
| 40–69 | Partial Trust | `text-amber-500` | `bg-amber-50` |
| 0–39 | Inferred Only | `text-red-500` | `bg-red-50` |

---

### `useRecommendations()`

Fetches Claude-ranked product list. Fires automatically when `context.timeOfDay` changes; debounced to max once per 30 s.

```ts
{
  recommendations: Product[]    // top 8 products in ranked order
  toneHint:        'energetic' | 'calm' | 'focused' | 'neutral'
  contextReason:   string       // one-sentence explanation from Claude
  loading:         boolean
  error:           string | null
}
```

**Product shape:**
```ts
{
  id:          string            // 'prod_001' – 'prod_030'
  name:        string
  category:    'wellness' | 'tech' | 'food' | 'fashion' | 'home' | 'fitness'
  price:       number
  image:       string            // https://picsum.photos/seed/{id}/300/300
  description: string
  contextTags: {
    timeOfDay:    string[]
    mood:         string[]
    locationType: string[]
  }
  baseRank: number               // 1–30, fallback sort
}
```

---

## Theming System

### How it works

`App.jsx` reads `context.timeOfDay` and sets a `data-theme` attribute on `<html>`:

```js
document.documentElement.setAttribute('data-theme', timeOfDay || 'morning')
```

This activates one of four CSS custom property sets.

### CSS Variables (available everywhere)

```css
var(--accent)       /* primary colour for buttons, highlights */
var(--accent-soft)  /* lighter tint for badges, tags */
var(--bg-warm)      /* page background colour */
var(--bg-card)      /* card background (white in light themes) */
var(--gradient)     /* linear-gradient string for hero elements */
```

**Usage example:**
```jsx
<button style={{ background: 'var(--accent)', color: '#fff' }}>
  Shop Now
</button>
```

### Tailwind Skin Classes by Time of Day

Use these to colour UI components contextually:

| Time | `data-theme` | Background | Text | Border | Ring (focus) |
|---|---|---|---|---|---|
| 8 am | `morning` | `bg-sky-50` | `text-sky-700` | `border-sky-200` | `ring-sky-400` |
| 12 pm | `midday` | `bg-green-50` | `text-green-700` | `border-green-200` | `ring-green-400` |
| 7 pm | `evening` | `bg-amber-50` | `text-amber-700` | `border-amber-200` | `ring-amber-400` |
| 11 pm | `latenight` | `bg-purple-50` | `text-purple-700` | `border-purple-200` | `ring-purple-400` |

**Pattern to apply the right classes dynamically:**

```jsx
const THEME_CLASSES = {
  morning  : { bg: 'bg-sky-50',    text: 'text-sky-700',    border: 'border-sky-200',    ring: 'ring-sky-400' },
  midday   : { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200',  ring: 'ring-green-400' },
  evening  : { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  ring: 'ring-amber-400' },
  latenight: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', ring: 'ring-purple-400' },
}

const theme = THEME_CLASSES[context.timeOfDay] ?? THEME_CLASSES.morning

<div className={`${theme.bg} ${theme.border} border rounded-xl p-4`}>
  <p className={theme.text}>Good evening!</p>
</div>
```

---

## Key User Flows

### 1. AI Prediction Feedback (+20 pts correction flow)

The dashboard shows Claude's predicted context. When the user disagrees:

```jsx
import { useGamification } from '@/mocks/mockHooks' // or real hook

const { correctPrediction, confirmPrediction } = useGamification()

// User says "Yes, that's right" → +15 pts, streak++
<button onClick={confirmPrediction}>✓ That's right</button>

// User says "Actually, I'm at work" → +20 pts, streak resets, +2 privacy score
<button onClick={correctPrediction}>✗ Correct it</button>
```

Points are awarded automatically inside the store action — no extra logic needed.

### 2. Streak Badge Modal

When `streakStatus.count` reaches 3, `showBadgeModal` flips to `true` automatically (fires once per session):

```jsx
const { showBadgeModal, dismissBadgeModal, streakStatus } = useGamification()

{showBadgeModal && (
  <BadgeModal
    streak={streakStatus.count}
    onDismiss={dismissBadgeModal}
  />
)}
```

### 3. XP Bar

```jsx
const { contextPoints, xpProgress } = useGamification()

<div className="w-full bg-gray-200 rounded-full h-2">
  <div
    className="h-2 rounded-full transition-all duration-500"
    style={{
      width: `${xpProgress.progressPercent}%`,
      background: 'var(--accent)',
    }}
  />
</div>
<p>Level {xpProgress.level} · {xpProgress.pointsToNextLevel} pts to next level</p>
```

### 4. Consent Signals

Read from the Zustand store directly (no hook needed):

```jsx
import useContextIQStore from '@/store/useContextIQStore'

const consent   = useContextIQStore(s => s.consent)
const setConsent = useContextIQStore(s => s.setConsent)

// Toggle a consent signal (updates privacy score automatically)
<button onClick={() => setConsent('locationConsented', true)}>
  Allow Location
</button>
```

---

## File Map

```
src/
├── screens/
│   ├── OnboardingScreen.jsx   → '/'          quiz + consent setup
│   ├── DashboardScreen.jsx    → '/dashboard' context display + prediction feedback
│   ├── StorefrontScreen.jsx   → '/store'     ranked product grid
│   └── ImpactScreen.jsx       → '/impact'    privacy score + consent history
│
├── hooks/           (real hooks — import after dev)
│   ├── useContextEngine.js
│   ├── useGamification.js
│   ├── useConsentSync.js
│   └── useRecommendations.js
│
├── mocks/           (use during development)
│   └── mockHooks.js
│
├── store/
│   └── useContextIQStore.js   (Zustand — can also read directly)
│
├── data/
│   └── products.js            (getProductById, getProductsByIds)
│
└── utils/
    ├── contextHelpers.js      (getTimeContext, getLocationContext, getMoodFromScroll)
    ├── gamification.js        (POINTS_CONFIG, computePrivacyScore, getXPBarProgress…)
    └── consentStorage.js      (saveConsentProfile, loadConsentProfile…)
```

---

> **Remember:** When you're done building a screen, swap the import from `@/mocks/mockHooks` to the real hook — that's the only change needed. The return shape is guaranteed identical.
