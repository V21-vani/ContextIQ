/**
 * @fileoverview useContextEngine — Custom React hook that detects all context
 * signals (time, location, scroll behaviour) and writes them into the
 * ContextIQ Zustand store every 10 seconds.
 *
 * Signal sources:
 *  • Time    — new Date().getHours() (always consented automatically)
 *  • Location — navigator.geolocation (user prompt; consent tracked)
 *  • Scroll  — window scroll events (passive; consent tracked)
 *
 * Guarantees:
 *  – Never throws: every async/sync path is wrapped in try/catch.
 *  – All intervals and event listeners are cleaned up on unmount.
 *  – context and recommendations are NOT persisted (Zustand config).
 */

import { useEffect, useRef, useState } from 'react';
import useContextIQStore from '../store/useContextIQStore';
import {
  getTimeContext,
  getLocationContext,
  getMoodFromScroll,
} from '../utils/contextHelpers';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const POLL_INTERVAL_MS = 10_000; // 10 seconds
const MAX_SCROLL_SAMPLES = 5;   // keep last N samples

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Detect and stream context signals into the global store.
 *
 * @returns {{ context: Object, isReady: boolean }}
 */
function useContextEngine() {
  const setContext = useContextIQStore((s) => s.setContext);
  const setConsent = useContextIQStore((s) => s.setConsent);
  const context   = useContextIQStore((s) => s.context);

  const [isReady, setIsReady] = useState(false);

  // Refs survive re-renders without causing them
  const coordsRef        = useRef({ lat: null, lng: null });
  const scrollSamplesRef = useRef([]); // array of px/s readings
  const lastScrollYRef   = useRef(window.scrollY);
  const lastScrollTimeRef= useRef(Date.now());
  const hasScrolledRef   = useRef(false);

  // -------------------------------------------------------------------------
  // Geolocation — request once on mount
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!navigator?.geolocation) {
      // API unavailable; treat as denied
      setConsent('locationConsented', false);
      return;
    }

    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          try {
            coordsRef.current = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setConsent('locationConsented', true);
          } catch {
            // ignore
          }
        },
        () => {
          // User denied or error
          coordsRef.current = { lat: null, lng: null };
          setConsent('locationConsented', false);
        },
        { enableHighAccuracy: false, timeout: 8000 }
      );
    } catch {
      setConsent('locationConsented', false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // -------------------------------------------------------------------------
  // Scroll tracking — passive listener, keeps last MAX_SCROLL_SAMPLES samples
  // -------------------------------------------------------------------------
  useEffect(() => {
    const handleScroll = () => {
      try {
        const now      = Date.now();
        const currentY = window.scrollY;
        const deltaY   = Math.abs(currentY - lastScrollYRef.current);
        const deltaT   = (now - lastScrollTimeRef.current) / 1000; // seconds

        if (deltaT > 0) {
          const speed = deltaY / deltaT; // px/s

          // Keep a fixed-size sliding window
          const samples = scrollSamplesRef.current;
          if (samples.length >= MAX_SCROLL_SAMPLES) {
            samples.shift();
          }
          samples.push(speed);
        }

        lastScrollYRef.current  = currentY;
        lastScrollTimeRef.current = now;
        hasScrolledRef.current  = true;
      } catch {
        // ignore
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // -------------------------------------------------------------------------
  // Poll & write — runs immediately then every POLL_INTERVAL_MS
  // -------------------------------------------------------------------------
  useEffect(() => {
    const computeAndWrite = () => {
      try {
        const now  = new Date();
        const hour = now.getHours();

        // --- Time ---
        const timeCtx = getTimeContext(hour);
        setConsent('timeConsented', true); // time is never restricted

        // --- Location ---
        const { lat, lng } = coordsRef.current;
        const locationCtx  = getLocationContext(lat, lng, hour);

        // --- Scroll / Mood ---
        const samples  = [...scrollSamplesRef.current];
        const moodCtx  = getMoodFromScroll(samples);
        const avgSpeed =
          samples.length > 0
            ? samples.reduce((s, v) => s + v, 0) / samples.length
            : null;

        // Behaviour consent: only if actual scrolling was detected
        if (hasScrolledRef.current) {
          setConsent('behaviourConsented', true);
          hasScrolledRef.current = false; // reset gate; re-evaluated next cycle
        } else {
          setConsent('behaviourConsented', false);
        }

        // --- Write to store ---
        setContext({
          timeOfDay   : timeCtx.timeOfDay,
          hour,
          locationType: locationCtx.locationType,
          mood        : moodCtx.mood,
          scrollSpeed : avgSpeed,
        });

        if (!isReady) {
          setIsReady(true);
        }
      } catch {
        // Never throw; silently degrade
        setIsReady(true);
      }
    };

    // Run once immediately, then on an interval
    computeAndWrite();
    const intervalId = setInterval(computeAndWrite, POLL_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { context, isReady };
}

export default useContextEngine;
