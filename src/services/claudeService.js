/**
 * @fileoverview claudeService.js
 * Thin wrapper around the Anthropic Messages API for ContextIQ.
 *
 * Usage:
 *   import { getContextualRecommendations } from './claudeService';
 *   const result = await getContextualRecommendations(context, consent, preferences, products, signal);
 *
 * Environment variable required:
 *   VITE_CLAUDE_API_KEY — Anthropic API key (set in .env.local)
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL             = 'claude-sonnet-4-20250514';
const MAX_TOKENS        = 500;
const API_VERSION       = '2023-06-01';

// ---------------------------------------------------------------------------
// Prompt builders
// ---------------------------------------------------------------------------

/**
 * Build the static system prompt.
 * @returns {string}
 */
function buildSystemPrompt() {
  return (
    'You are a personalisation engine for a retail experience called ContextIQ. ' +
    'You receive a user\'s context signals and return ranked product recommendations ' +
    'with a UI tone hint. Always respond with valid JSON only. No explanation.'
  );
}

/**
 * Build the dynamic user prompt from live context data.
 *
 * @param {Object}   context     - current context signals
 * @param {Object}   consent     - consent flags map
 * @param {Object}   preferences - user preferences from onboarding
 * @param {Object[]} products    - full product catalogue
 * @returns {string}
 */
function buildUserPrompt(context, consent, preferences, products) {
  const consentedSignals = Object.entries(consent)
    .filter(([, v]) => v)
    .map(([k]) => k)
    .join(', ') || 'none';

  const inferredSignals = Object.entries(consent)
    .filter(([, v]) => !v)
    .map(([k]) => k)
    .join(', ') || 'none';

  return `Context signals:
- Time of day: ${context.timeOfDay} (${context.hour}:00)
- Location type: ${context.locationType}
- Mood: ${context.mood}
- Consented signals: ${consentedSignals}
- Inferred signals: ${inferredSignals}

User preferences: ${JSON.stringify(preferences)}

Product catalogue (${products.length} items): ${JSON.stringify(products)}

Return JSON in this exact shape:
{
  "rankedProductIds": [array of product IDs in recommended order, top 8 only],
  "toneHint": "energetic" | "calm" | "focused" | "neutral",
  "contextReason": "one sentence explaining the personalisation logic"
}`;
}

// ---------------------------------------------------------------------------
// Response parser
// ---------------------------------------------------------------------------

/**
 * Strip optional markdown code fences then JSON.parse.
 * @param {string} raw
 * @returns {Object}
 */
function parseClaudeResponse(raw) {
  const stripped = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  return JSON.parse(stripped);
}

// ---------------------------------------------------------------------------
// Default / fallback response
// ---------------------------------------------------------------------------

/**
 * Safe fallback when the API call fails or returns unparseable data.
 * @param {Object[]} products
 * @returns {{ rankedProductIds: string[], toneHint: string, contextReason: string }}
 */
function fallbackResponse(products) {
  return {
    rankedProductIds: products.map((p) => p.id),
    toneHint: 'neutral',
    contextReason: 'Default order — personalisation unavailable.',
  };
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Call the Claude API and return ranked product recommendations.
 *
 * @param {Object}      context     - current context signals from store
 * @param {Object}      consent     - consent map from store
 * @param {Object}      preferences - user.preferences from store
 * @param {Object[]}    products    - full product catalogue
 * @param {AbortSignal} [signal]    - optional AbortSignal for cancellation
 * @returns {Promise<{ rankedProductIds: string[], toneHint: string, contextReason: string }>}
 */
export async function getContextualRecommendations(
  context,
  consent,
  preferences,
  products,
  signal
) {
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY;

  if (!apiKey) {
    console.warn('[claudeService] VITE_CLAUDE_API_KEY is not set — using fallback.');
    return fallbackResponse(products);
  }

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      signal,
      headers: {
        'Content-Type'      : 'application/json',
        'x-api-key'         : apiKey,
        'anthropic-version' : API_VERSION,
        // Required for CORS from browser clients
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model     : MODEL,
        max_tokens: MAX_TOKENS,
        system    : buildSystemPrompt(),
        messages  : [
          {
            role   : 'user',
            content: buildUserPrompt(context, consent, preferences, products),
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      console.error(`[claudeService] API error ${response.status}:`, errorBody);
      return fallbackResponse(products);
    }

    const data = await response.json();
    const rawText = data?.content?.[0]?.text ?? '';

    if (!rawText) {
      console.error('[claudeService] Empty content from API.');
      return fallbackResponse(products);
    }

    const parsed = parseClaudeResponse(rawText);

    // Validate minimum required shape
    if (!Array.isArray(parsed.rankedProductIds) || !parsed.toneHint) {
      console.error('[claudeService] Unexpected response shape:', parsed);
      return fallbackResponse(products);
    }

    return {
      rankedProductIds: parsed.rankedProductIds,
      toneHint        : parsed.toneHint ?? 'neutral',
      contextReason   : parsed.contextReason ?? '',
    };
  } catch (err) {
    // AbortError is normal flow (new context arrived); do not log as error
    if (err?.name === 'AbortError') {
      throw err; // re-throw so the hook can distinguish it
    }
    console.error('[claudeService] Unexpected error:', err);
    return fallbackResponse(products);
  }
}
