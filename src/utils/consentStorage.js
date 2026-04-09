/**
 * @fileoverview consentStorage.js
 * Belt-and-suspenders localStorage persistence for the user's consent profile.
 * Operates independently of Zustand — safe to call from any context.
 *
 * Storage key: 'contextiq_consent_v1'
 * Schema version: '1.0'
 */

const STORAGE_KEY      = 'contextiq_consent_v1';
const SCHEMA_VERSION   = '1.0';

// ---------------------------------------------------------------------------
// generateUserId
// ---------------------------------------------------------------------------

/**
 * Generate a UUID using the Web Crypto API with a Math.random fallback.
 * Should be called once on first app load if no userId exists in storage.
 *
 * @returns {string}
 */
export function generateUserId() {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
  } catch {
    // fall through to manual UUID
  }

  // Manual UUID v4 fallback (RFC 4122 compliant enough for a demo)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ---------------------------------------------------------------------------
// saveConsentProfile
// ---------------------------------------------------------------------------

/**
 * Serialise the relevant Zustand store slices into localStorage.
 *
 * @param {{
 *   user:         { id: string, preferences: Object },
 *   consent:      { timeConsented: boolean, locationConsented: boolean, behaviourConsented: boolean },
 *   contextPoints: number,
 *   privacyScore:  number
 * }} storeState
 * @returns {boolean} true on success, false on any error
 */
export function saveConsentProfile(storeState) {
  try {
    const profile = {
      userId         : storeState?.user?.id ?? generateUserId(),
      consentVersion : SCHEMA_VERSION,
      timestamp      : new Date().toISOString(),
      signals        : {
        timeConsented      : storeState?.consent?.timeConsented      ?? false,
        locationConsented  : storeState?.consent?.locationConsented  ?? false,
        behaviourConsented : storeState?.consent?.behaviourConsented ?? false,
      },
      preferences    : storeState?.user?.preferences   ?? {},
      contextPoints  : storeState?.contextPoints        ?? 0,
      privacyScore   : storeState?.privacyScore         ?? 100,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// loadConsentProfile
// ---------------------------------------------------------------------------

/**
 * Parse and validate the stored consent profile.
 * Returns null if the key is missing, unparseable, or the schema version
 * doesn't match.
 *
 * @returns {Object|null}
 */
export function loadConsentProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    // Schema version guard — reject stale/incompatible payloads
    if (parsed?.consentVersion !== SCHEMA_VERSION) return null;

    // Minimal structural validation
    if (
      typeof parsed.userId !== 'string'  ||
      typeof parsed.signals !== 'object' ||
      parsed.signals === null
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// clearConsentProfile
// ---------------------------------------------------------------------------

/**
 * Remove the consent profile from localStorage.
 * Never throws.
 *
 * @returns {void}
 */
export function clearConsentProfile() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
