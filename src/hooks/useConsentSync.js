/**
 * @fileoverview useConsentSync.js
 * Synchronises the Zustand store ↔ localStorage consent profile.
 *
 * On mount:
 *   - Loads any saved profile and hydrates the store
 *
 * On every change to consent / contextPoints / privacyScore:
 *   - Debounces a save (500ms) so we never thrash localStorage on rapid updates
 *
 * Returns: { isSynced: boolean }
 */

import { useEffect, useRef, useState } from 'react';
import useContextIQStore from '../store/useContextIQStore';
import {
  loadConsentProfile,
  saveConsentProfile,
} from '../utils/consentStorage';

const DEBOUNCE_MS = 500;

/**
 * @returns {{ isSynced: boolean }}
 */
function useConsentSync() {
  const [isSynced, setIsSynced] = useState(false);

  // ── Store selectors ────────────────────────────────────────────────────────
  const consent       = useContextIQStore((s) => s.consent);
  const contextPoints = useContextIQStore((s) => s.contextPoints);
  const privacyScore  = useContextIQStore((s) => s.privacyScore);
  const user          = useContextIQStore((s) => s.user);

  // Store setters needed for hydration
  const setConsent    = useContextIQStore((s) => s.setConsent);
  const addPoints     = useContextIQStore((s) => s.addPoints);

  // ── Hydrate on mount ───────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const saved = loadConsentProfile();

      if (saved) {
        // Hydrate consent signals
        const { signals } = saved;
        if (typeof signals?.timeConsented      === 'boolean') setConsent('timeConsented',      signals.timeConsented);
        if (typeof signals?.locationConsented  === 'boolean') setConsent('locationConsented',  signals.locationConsented);
        if (typeof signals?.behaviourConsented === 'boolean') setConsent('behaviourConsented', signals.behaviourConsented);

        // Hydrate points — only if stored value exceeds current (avoid overwriting a fresh session)
        if (typeof saved.contextPoints === 'number' && saved.contextPoints > contextPoints) {
          addPoints(saved.contextPoints - contextPoints);
        }
      }
    } catch {
      // Never block rendering
    } finally {
      setIsSynced(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Debounced save on change ───────────────────────────────────────────────
  const timerRef = useRef(null);

  useEffect(() => {
    // Skip until the initial hydration is done to avoid overwriting a valid save
    // with stale defaults before the mount effect has run its comparison
    if (!isSynced) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      saveConsentProfile({ user, consent, contextPoints, privacyScore });
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [consent, contextPoints, privacyScore, isSynced, user]);

  return { isSynced };
}

export default useConsentSync;
