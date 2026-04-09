/**
 * @fileoverview products.js — ContextIQ synthetic product catalogue
 *
 * 30 products across 6 categories (5 each):
 *   wellness | tech | food | fashion | home | fitness
 *
 * Each product carries contextTags so Claude can apply context-aware ranking.
 *
 * Usage:
 *   import products, { getProductById, getProductsByIds } from './products';
 */

/** @type {Object[]} */
const products = [

  // ═══════════════════════════════════════════════════════════════════════════
  // WELLNESS  (5)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'prod_001',
    name: 'Morning Flow Yoga Mat',
    category: 'wellness',
    price: 54.99,
    image: 'https://picsum.photos/seed/prod_001/300/300',
    description: 'A non-slip, eco-friendly yoga mat designed for grounding morning flow sessions.',
    contextTags: {
      timeOfDay: ['morning'],
      mood: ['focused', 'relaxed'],
      locationType: ['home'],
    },
    baseRank: 1,
  },
  {
    id: 'prod_002',
    name: 'Calm Mind Meditation App — 3 Month Pass',
    category: 'wellness',
    price: 29.99,
    image: 'https://picsum.photos/seed/prod_002/300/300',
    description: 'Guided meditations, sleep stories, and breathing exercises for daily mindfulness.',
    contextTags: {
      timeOfDay: ['morning', 'latenight'],
      mood: ['relaxed'],
      locationType: ['home', 'commute'],
    },
    baseRank: 2,
  },
  {
    id: 'prod_003',
    name: 'AromaZen Essential Oil Diffuser',
    category: 'wellness',
    price: 42.99,
    image: 'https://picsum.photos/seed/prod_003/300/300',
    description: 'Ultrasonic aromatherapy diffuser with 7-colour ambient glow for calming evenings.',
    contextTags: {
      timeOfDay: ['evening', 'latenight'],
      mood: ['relaxed'],
      locationType: ['home'],
    },
    baseRank: 3,
  },
  {
    id: 'prod_004',
    name: 'DreamTrack Sleep Journal',
    category: 'wellness',
    price: 18.99,
    image: 'https://picsum.photos/seed/prod_004/300/300',
    description: 'A structured nightly journal to track sleep quality and morning mood patterns.',
    contextTags: {
      timeOfDay: ['latenight', 'morning'],
      mood: ['focused', 'relaxed'],
      locationType: ['home'],
    },
    baseRank: 4,
  },
  {
    id: 'prod_005',
    name: 'Luxe Lavender Bath & Body Set',
    category: 'wellness',
    price: 38.99,
    image: 'https://picsum.photos/seed/prod_005/300/300',
    description: 'A curated set of lavender bath salts, body scrub, and lotion for evening unwinding.',
    contextTags: {
      timeOfDay: ['evening', 'latenight'],
      mood: ['relaxed'],
      locationType: ['home'],
    },
    baseRank: 5,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TECH  (5)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'prod_006',
    name: 'AeroPulse Pro Noise-Cancelling Earbuds',
    category: 'tech',
    price: 129.99,
    image: 'https://picsum.photos/seed/prod_006/300/300',
    description: 'True wireless earbuds with adaptive noise cancellation and 36-hour battery life.',
    contextTags: {
      timeOfDay: ['morning', 'midday', 'commute'],
      mood: ['focused', 'browsing'],
      locationType: ['commute', 'office'],
    },
    baseRank: 6,
  },
  {
    id: 'prod_007',
    name: 'QuickCharge 20 000mAh Power Bank',
    category: 'tech',
    price: 49.99,
    image: 'https://picsum.photos/seed/prod_007/300/300',
    description: 'Slim, high-capacity power bank supporting 45W USB-C fast charging for all devices.',
    contextTags: {
      timeOfDay: ['morning', 'midday'],
      mood: ['focused', 'browsing'],
      locationType: ['commute', 'office', 'out'],
    },
    baseRank: 7,
  },
  {
    id: 'prod_008',
    name: 'HydroTrack Smart Water Bottle',
    category: 'tech',
    price: 59.99,
    image: 'https://picsum.photos/seed/prod_008/300/300',
    description: 'LED hydration reminder bottle that syncs with your phone to hit daily water goals.',
    contextTags: {
      timeOfDay: ['morning', 'midday'],
      mood: ['focused'],
      locationType: ['office', 'home', 'commute'],
    },
    baseRank: 8,
  },
  {
    id: 'prod_009',
    name: 'RingLux Selfie Ring Light & Phone Stand',
    category: 'tech',
    price: 34.99,
    image: 'https://picsum.photos/seed/prod_009/300/300',
    description: 'Adjustable ring light with flexible phone mount for video calls and social content.',
    contextTags: {
      timeOfDay: ['midday', 'evening'],
      mood: ['browsing'],
      locationType: ['home', 'office'],
    },
    baseRank: 9,
  },
  {
    id: 'prod_010',
    name: 'MagDrop Wireless Charging Pad',
    category: 'tech',
    price: 29.99,
    image: 'https://picsum.photos/seed/prod_010/300/300',
    description: 'MagSafe-compatible 15W wireless charging pad with anti-slip surface.',
    contextTags: {
      timeOfDay: ['latenight', 'morning'],
      mood: ['relaxed'],
      locationType: ['home'],
    },
    baseRank: 10,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // FOOD  (5)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'prod_011',
    name: 'PressedPerk Cold Brew Coffee Kit',
    category: 'food',
    price: 27.99,
    image: 'https://picsum.photos/seed/prod_011/300/300',
    description: 'Everything you need to brew smooth, café-quality cold brew coffee at home.',
    contextTags: {
      timeOfDay: ['morning', 'midday'],
      mood: ['focused'],
      locationType: ['home', 'office'],
    },
    baseRank: 11,
  },
  {
    id: 'prod_012',
    name: 'BlendFuel Protein Smoothie Bundle',
    category: 'food',
    price: 44.99,
    image: 'https://picsum.photos/seed/prod_012/300/300',
    description: 'Pre-portioned smoothie packs with 25 g of plant protein for fast morning prep.',
    contextTags: {
      timeOfDay: ['morning'],
      mood: ['focused'],
      locationType: ['home', 'commute'],
    },
    baseRank: 12,
  },
  {
    id: 'prod_013',
    name: 'MidnightMunch Snack Crate',
    category: 'food',
    price: 32.99,
    image: 'https://picsum.photos/seed/prod_013/300/300',
    description: 'A curated box of 20 indulgent late-night snacks from global artisan makers.',
    contextTags: {
      timeOfDay: ['latenight', 'evening'],
      mood: ['relaxed', 'browsing'],
      locationType: ['home'],
    },
    baseRank: 13,
  },
  {
    id: 'prod_014',
    name: 'TrailBlaze Commuter Granola Bars 12-Pack',
    category: 'food',
    price: 19.99,
    image: 'https://picsum.photos/seed/prod_014/300/300',
    description: 'Wholesome oat-and-nut bars with no added sugar, perfect for busy morning commutes.',
    contextTags: {
      timeOfDay: ['morning', 'midday'],
      mood: ['focused', 'browsing'],
      locationType: ['commute', 'out'],
    },
    baseRank: 14,
  },
  {
    id: 'prod_015',
    name: 'PopCraft Gourmet Popcorn Trio',
    category: 'food',
    price: 22.99,
    image: 'https://picsum.photos/seed/prod_015/300/300',
    description: 'Three bold flavours of small-batch gourmet popcorn ideal for movie night at home.',
    contextTags: {
      timeOfDay: ['evening', 'latenight'],
      mood: ['relaxed'],
      locationType: ['home'],
    },
    baseRank: 15,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // FASHION  (5)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'prod_016',
    name: 'LensFlare Polarised Sunglasses',
    category: 'fashion',
    price: 69.99,
    image: 'https://picsum.photos/seed/prod_016/300/300',
    description: 'Lightweight polarised sunglasses with UV400 protection and a retro-modern frame.',
    contextTags: {
      timeOfDay: ['morning', 'midday'],
      mood: ['browsing'],
      locationType: ['commute', 'out'],
    },
    baseRank: 16,
  },
  {
    id: 'prod_017',
    name: 'SweatWick Sport Headband',
    category: 'fashion',
    price: 14.99,
    image: 'https://picsum.photos/seed/prod_017/300/300',
    description: 'Moisture-wicking, double-layer headband for workouts and outdoor morning runs.',
    contextTags: {
      timeOfDay: ['morning'],
      mood: ['focused'],
      locationType: ['out', 'home'],
    },
    baseRank: 17,
  },
  {
    id: 'prod_018',
    name: 'UrbanChic Canvas Tote Bag',
    category: 'fashion',
    price: 39.99,
    image: 'https://picsum.photos/seed/prod_018/300/300',
    description: 'Durable, roomy canvas tote with a water-resistant lining for work and daily errands.',
    contextTags: {
      timeOfDay: ['morning', 'midday'],
      mood: ['focused', 'browsing'],
      locationType: ['commute', 'office', 'out'],
    },
    baseRank: 18,
  },
  {
    id: 'prod_019',
    name: 'CloudStep Memory Foam Slippers',
    category: 'fashion',
    price: 34.99,
    image: 'https://picsum.photos/seed/prod_019/300/300',
    description: 'Plush memory-foam house slippers with a non-slip rubber sole for all-day comfort.',
    contextTags: {
      timeOfDay: ['evening', 'latenight'],
      mood: ['relaxed'],
      locationType: ['home'],
    },
    baseRank: 19,
  },
  {
    id: 'prod_020',
    name: 'CommuterFleece Zip Hoodie',
    category: 'fashion',
    price: 79.99,
    image: 'https://picsum.photos/seed/prod_020/300/300',
    description: 'Brushed-fleece, commuter-fit hoodie with a hidden earphone port and magnetic zip.',
    contextTags: {
      timeOfDay: ['morning', 'evening'],
      mood: ['focused', 'browsing'],
      locationType: ['commute', 'out'],
    },
    baseRank: 20,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // HOME  (5)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'prod_021',
    name: 'WarmGlow Soy Wax Candle Set',
    category: 'home',
    price: 36.99,
    image: 'https://picsum.photos/seed/prod_021/300/300',
    description: 'Hand-poured soy candles in amber, cedar and vanilla — perfect for cosy evenings.',
    contextTags: {
      timeOfDay: ['evening', 'latenight'],
      mood: ['relaxed'],
      locationType: ['home'],
    },
    baseRank: 21,
  },
  {
    id: 'prod_022',
    name: 'AmbientGlo Smart Desk Lamp',
    category: 'home',
    price: 64.99,
    image: 'https://picsum.photos/seed/prod_022/300/300',
    description: 'App-controlled LED desk lamp with circadian lighting modes and wireless charging base.',
    contextTags: {
      timeOfDay: ['morning', 'midday', 'latenight'],
      mood: ['focused'],
      locationType: ['home', 'office'],
    },
    baseRank: 22,
  },
  {
    id: 'prod_023',
    name: 'MugHug USB Mug Warmer',
    category: 'home',
    price: 22.99,
    image: 'https://picsum.photos/seed/prod_023/300/300',
    description: 'Auto-temperature desktop mug warmer that keeps your coffee or tea at the perfect sip.',
    contextTags: {
      timeOfDay: ['morning', 'midday'],
      mood: ['focused'],
      locationType: ['home', 'office'],
    },
    baseRank: 23,
  },
  {
    id: 'prod_024',
    name: 'CloudSoft 8 kg Weighted Blanket',
    category: 'home',
    price: 89.99,
    image: 'https://picsum.photos/seed/prod_024/300/300',
    description: 'Therapeutic weighted blanket with glass-bead fill for deep pressure and better sleep.',
    contextTags: {
      timeOfDay: ['evening', 'latenight'],
      mood: ['relaxed'],
      locationType: ['home'],
    },
    baseRank: 24,
  },
  {
    id: 'prod_025',
    name: 'SproutKit Indoor Herb Garden',
    category: 'home',
    price: 47.99,
    image: 'https://picsum.photos/seed/prod_025/300/300',
    description: 'Self-watering indoor herb garden with basil, mint and chive seed pods included.',
    contextTags: {
      timeOfDay: ['morning', 'evening'],
      mood: ['relaxed', 'browsing'],
      locationType: ['home'],
    },
    baseRank: 25,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // FITNESS  (5)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'prod_026',
    name: 'FlexBand Pro Resistance Band Set',
    category: 'fitness',
    price: 29.99,
    image: 'https://picsum.photos/seed/prod_026/300/300',
    description: 'Five graduated resistance bands with handles and a carrying bag for home workouts.',
    contextTags: {
      timeOfDay: ['morning', 'evening'],
      mood: ['focused'],
      locationType: ['home', 'out'],
    },
    baseRank: 26,
  },
  {
    id: 'prod_027',
    name: 'ProStride Ultra Running Shoes',
    category: 'fitness',
    price: 129.99,
    image: 'https://picsum.photos/seed/prod_027/300/300',
    description: 'Responsive-cushioned running shoes with carbon-fibre plate for speed on any surface.',
    contextTags: {
      timeOfDay: ['morning'],
      mood: ['focused'],
      locationType: ['out', 'commute'],
    },
    baseRank: 27,
  },
  {
    id: 'prod_028',
    name: 'FrostPeak Insulated Gym Bottle',
    category: 'fitness',
    price: 24.99,
    image: 'https://picsum.photos/seed/prod_028/300/300',
    description: 'Double-wall insulated 1-litre bottle that keeps drinks ice cold for 24 hours.',
    contextTags: {
      timeOfDay: ['morning', 'midday'],
      mood: ['focused'],
      locationType: ['out', 'commute', 'office'],
    },
    baseRank: 28,
  },
  {
    id: 'prod_029',
    name: 'RollEase High-Density Foam Roller',
    category: 'fitness',
    price: 34.99,
    image: 'https://picsum.photos/seed/prod_029/300/300',
    description: 'Textured foam roller for deep-tissue muscle recovery and post-workout soreness relief.',
    contextTags: {
      timeOfDay: ['evening', 'morning'],
      mood: ['relaxed', 'focused'],
      locationType: ['home'],
    },
    baseRank: 29,
  },
  {
    id: 'prod_030',
    name: 'SpeedCord Weighted Jump Rope',
    category: 'fitness',
    price: 19.99,
    image: 'https://picsum.photos/seed/prod_030/300/300',
    description: 'Adjustable steel cable jump rope with weighted handles for cardio and coordination training.',
    contextTags: {
      timeOfDay: ['morning'],
      mood: ['focused'],
      locationType: ['home', 'out'],
    },
    baseRank: 30,
  },
];

// ---------------------------------------------------------------------------
// Named utility exports
// ---------------------------------------------------------------------------

/**
 * Retrieve a single product by its ID.
 * @param {string} id
 * @returns {Object|undefined}
 */
export function getProductById(id) {
  return products.find((p) => p.id === id);
}

/**
 * Retrieve an ordered array of products matching the given IDs.
 * The result order matches the input `ids` array (preserves Claude's ranking).
 * IDs not found in the catalogue are silently omitted.
 *
 * @param {string[]} ids
 * @returns {Object[]}
 */
export function getProductsByIds(ids) {
  return ids.map((id) => getProductById(id)).filter(Boolean);
}

// ---------------------------------------------------------------------------
// Default export
// ---------------------------------------------------------------------------

export default products;
