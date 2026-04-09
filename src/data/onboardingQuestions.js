const onboardingQuestions = [
  {
    id: 'shoppingTime',
    question: 'When do you prefer to shop?',
    subtitle: 'We\'ll tailor recommendations to your schedule',
    icon: '🕐',
    options: [
      { label: 'Morning',    value: 'morning',    icon: '🌅', desc: '6 AM – 12 PM' },
      { label: 'Afternoon',  value: 'afternoon',  icon: '☀️', desc: '12 PM – 5 PM' },
      { label: 'Evening',    value: 'evening',    icon: '🌇', desc: '5 PM – 9 PM' },
      { label: 'Late Night', value: 'late_night', icon: '🌙', desc: '9 PM – 6 AM' },
    ],
  },
  {
    id: 'mood',
    question: 'What\'s your current vibe?',
    subtitle: 'This helps us match your energy',
    icon: '✨',
    options: [
      { label: 'Relaxed',     value: 'relaxed',     icon: '😌', desc: 'Calm & easy-going' },
      { label: 'Adventurous', value: 'adventurous', icon: '🚀', desc: 'Ready to explore' },
      { label: 'Focused',     value: 'focused',     icon: '🎯', desc: 'Know what I want' },
      { label: 'Spontaneous', value: 'spontaneous', icon: '🎲', desc: 'Surprise me!' },
    ],
  },
  {
    id: 'locationType',
    question: 'What\'s your scene?',
    subtitle: 'Location shapes the experience',
    icon: '📍',
    options: [
      { label: 'Urban',     value: 'urban',     icon: '🏙️', desc: 'City life' },
      { label: 'Suburban',  value: 'suburban',  icon: '🏡', desc: 'Neighborhood vibes' },
      { label: 'Rural',     value: 'rural',     icon: '🌾', desc: 'Wide open spaces' },
      { label: 'Traveling', value: 'traveling', icon: '✈️', desc: 'On the move' },
    ],
  },
  {
    id: 'contentDensity',
    question: 'How much detail do you want?',
    subtitle: 'Control the information you see',
    icon: '📊',
    options: [
      { label: 'Minimal',    value: 'minimal',    icon: '💎', desc: 'Just the essentials' },
      { label: 'Balanced',   value: 'balanced',   icon: '⚖️', desc: 'A healthy mix' },
      { label: 'Detailed',   value: 'detailed',   icon: '📋', desc: 'Give me the facts' },
      { label: 'Everything', value: 'everything', icon: '🌊', desc: 'I want it all' },
    ],
  },
  {
    id: 'notificationStyle',
    question: 'How should we reach you?',
    subtitle: 'Set your notification comfort level',
    icon: '🔔',
    options: [
      { label: 'Silent',   value: 'silent',   icon: '🔕', desc: 'I\'ll check manually' },
      { label: 'Gentle',   value: 'gentle',   icon: '🍃', desc: 'Soft nudges only' },
      { label: 'Standard', value: 'standard', icon: '📬', desc: 'Normal notifications' },
      { label: 'Instant',  value: 'instant',  icon: '⚡', desc: 'Real-time updates' },
    ],
  },
]

export default onboardingQuestions
