/**
 * @fileoverview products.js — ContextIQ synthetic product catalogue
 *
 * 30 synthetic products tagged with context signals.
 * Tags: morning, midday, evening, late-night, commute, office, home, out,
 *       focused, browsing, relaxed, adventurous, spontaneous
 */
const products = [
  // ── Coffee & Drinks ──
  { id: 1,  name: 'Cold Brew Concentrate',       price: 14.99, emoji: '☕', category: 'Drinks',       tags: ['morning', 'focused', 'office'],            desc: 'Smooth, low-acid cold brew for sharp mornings.' },
  { id: 2,  name: 'Matcha Latte Kit',             price: 22.00, emoji: '🍵', category: 'Drinks',       tags: ['morning', 'relaxed', 'home'],               desc: 'Ceremonial-grade matcha with a bamboo whisk.' },
  { id: 3,  name: 'Sparkling Water Variety Pack',  price: 9.99,  emoji: '💧', category: 'Drinks',       tags: ['midday', 'office', 'focused'],              desc: '12-can mix of lime, grapefruit & plain.' },
  { id: 4,  name: 'Chamomile Sleep Tea',           price: 8.50,  emoji: '🫖', category: 'Drinks',       tags: ['late-night', 'relaxed', 'home'],            desc: 'Organic chamomile blend for winding down.' },
  { id: 5,  name: 'Protein Smoothie Mix',          price: 29.99, emoji: '🥤', category: 'Drinks',       tags: ['morning', 'commute', 'focused'],            desc: 'Whey isolate + greens, just add water.' },

  // ── Snacks & Food ──
  { id: 6,  name: 'Overnight Oats Cup',            price: 4.99,  emoji: '🥣', category: 'Food',         tags: ['morning', 'commute', 'relaxed'],            desc: 'Grab-and-go oats with chia and berries.' },
  { id: 7,  name: 'Trail Mix Energy Bites',        price: 12.99, emoji: '🥜', category: 'Food',         tags: ['midday', 'commute', 'adventurous'],         desc: 'Date-cashew bites for an afternoon boost.' },
  { id: 8,  name: 'Artisan Dark Chocolate Bar',    price: 7.50,  emoji: '🍫', category: 'Food',         tags: ['evening', 'relaxed', 'home'],               desc: '72% single-origin with sea salt flakes.' },
  { id: 9,  name: 'Gourmet Popcorn Trio',          price: 15.00, emoji: '🍿', category: 'Food',         tags: ['evening', 'relaxed', 'home'],               desc: 'Truffle, caramel & classic butter flavours.' },
  { id: 10, name: 'Instant Ramen Bowl Pack',       price: 18.99, emoji: '🍜', category: 'Food',         tags: ['late-night', 'home', 'spontaneous'],        desc: 'Premium tonkotsu, miso & shoyu — 6 pack.' },

  // ── Tech & Gadgets ──
  { id: 11, name: 'Noise-Cancelling Earbuds',      price: 79.99, emoji: '🎧', category: 'Tech',         tags: ['commute', 'focused', 'office'],             desc: 'ANC earbuds with 30 h battery & transparency mode.' },
  { id: 12, name: 'Portable Charger 10K',          price: 24.99, emoji: '🔋', category: 'Tech',         tags: ['commute', 'out', 'adventurous'],            desc: 'Slim 10 000 mAh bank with fast charging.' },
  { id: 13, name: 'Smart Desk Lamp',               price: 45.00, emoji: '💡', category: 'Tech',         tags: ['evening', 'focused', 'office'],             desc: 'Colour-temp adjustable LED with USB port.' },
  { id: 14, name: 'Mini Bluetooth Speaker',         price: 34.99, emoji: '🔊', category: 'Tech',         tags: ['evening', 'relaxed', 'out'],                desc: 'Waterproof speaker that fits in your palm.' },
  { id: 15, name: 'E-Reader Paperwhite',           price: 129.99,emoji: '📱', category: 'Tech',         tags: ['late-night', 'relaxed', 'home'],            desc: 'Glare-free display for comfortable night reading.' },

  // ── Wellness ──
  { id: 16, name: 'Foam Roller Set',               price: 19.99, emoji: '🧘', category: 'Wellness',     tags: ['morning', 'home', 'relaxed'],               desc: 'Textured foam roller + lacrosse ball.' },
  { id: 17, name: 'Focus Nootropic Capsules',      price: 32.00, emoji: '🧠', category: 'Wellness',     tags: ['morning', 'office', 'focused'],             desc: "Lion's mane + L-theanine for calm clarity." },
  { id: 18, name: 'Lavender Pillow Mist',          price: 11.99, emoji: '🌿', category: 'Wellness',     tags: ['late-night', 'home', 'relaxed'],            desc: 'Aromatherapy spray for deeper sleep.' },
  { id: 19, name: 'Vitamin D3 Gummies',            price: 14.50, emoji: '☀️', category: 'Wellness',     tags: ['morning', 'home', 'relaxed'],               desc: 'Sunshine vitamin in a tasty citrus gummy.' },
  { id: 20, name: 'Posture Corrector Band',        price: 21.00, emoji: '🩹', category: 'Wellness',     tags: ['midday', 'office', 'focused'],              desc: 'Discreet band that trains upright posture.' },

  // ── Entertainment ──
  { id: 21, name: 'Pocket Puzzle Cube',            price: 6.99,  emoji: '🧩', category: 'Entertainment', tags: ['commute', 'browsing', 'spontaneous'],       desc: 'Speed cube for idle hands on the train.' },
  { id: 22, name: 'Watercolour Sketch Set',        price: 28.00, emoji: '🎨', category: 'Entertainment', tags: ['evening', 'relaxed', 'home'],               desc: '24 pans + travel brush + cotton paper pad.' },
  { id: 23, name: 'Board Game Night Bundle',       price: 39.99, emoji: '🎲', category: 'Entertainment', tags: ['evening', 'home', 'adventurous'],           desc: '3 party games for 4-8 players.' },
  { id: 24, name: 'Streaming Gift Card $25',       price: 25.00, emoji: '🎬', category: 'Entertainment', tags: ['late-night', 'home', 'relaxed'],            desc: 'Works on all major streaming platforms.' },
  { id: 25, name: 'Daily Journal Notebook',        price: 16.00, emoji: '📓', category: 'Entertainment', tags: ['morning', 'focused', 'home'],               desc: 'Guided prompts + dot-grid pages, 90 days.' },

  // ── Fashion & Lifestyle ──
  { id: 26, name: 'Merino Wool Beanie',            price: 28.00, emoji: '🧢', category: 'Fashion',      tags: ['commute', 'out', 'adventurous'],            desc: 'Breathable merino, perfect for brisk mornings.' },
  { id: 27, name: 'UV-Block Sunglasses',           price: 35.00, emoji: '🕶️', category: 'Fashion',      tags: ['midday', 'out', 'adventurous'],             desc: 'Polarised lenses, lightweight titanium frame.' },
  { id: 28, name: 'Cozy Lounge Socks (3-pk)',      price: 12.00, emoji: '🧦', category: 'Fashion',      tags: ['late-night', 'home', 'relaxed'],            desc: 'Sherpa-lined socks for maximum comfort.' },
  { id: 29, name: 'Canvas Tote Bag',               price: 18.00, emoji: '👜', category: 'Fashion',      tags: ['midday', 'commute', 'browsing'],            desc: 'Heavy-duty organic cotton with zip pocket.' },
  { id: 30, name: 'Silk Sleep Mask',               price: 15.99, emoji: '😴', category: 'Fashion',      tags: ['late-night', 'home', 'relaxed'],            desc: '100% mulberry silk, adjustable strap.' },
]

// ---------------------------------------------------------------------------
// Named utility exports (used by backend recommendation engine)
// ---------------------------------------------------------------------------

/**
 * Retrieve a single product by its ID.
 * @param {number} id
 * @returns {Object|undefined}
 */
export function getProductById(id) {
  return products.find((p) => p.id === id)
}

/**
 * Retrieve products whose tags intersect with the given context tags.
 * @param {string[]} contextTags
 * @returns {Object[]}
 */
export function getProductsByTags(contextTags = []) {
  return products.filter((p) =>
    p.tags.some((t) => contextTags.includes(t))
  )
}

/**
 * Retrieve an ordered array of products matching the given IDs.
 * @param {number[]} ids
 * @returns {Object[]}
 */
export function getProductsByIds(ids) {
  return ids.map((id) => getProductById(id)).filter(Boolean)
}

export default products
