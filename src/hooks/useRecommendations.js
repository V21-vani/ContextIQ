/**
 * @fileoverview useRecommendations.js
 * React hook that drives the full AI recommendation lifecycle:
 *
 *  1. Watches context.timeOfDay for changes
 *  2. Debounces Claude calls to at most 1 per 30 seconds
 *  3. Aborts any in-flight fetch before starting a new one
 *  4. Writes ranked products + tone hint into the Zustand store
 *  5. Exposes loading / error / contextReason for the UI layer
 *
 * Returns:
 *   { recommendations, toneHint, contextReason, loading, error }
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import useContextIQStore from '../store/useContextIQStore';
import { getContextualRecommendations } from '../services/claudeService';
import products from '../data/products';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Minimum gap (ms) between consecutive Claude API calls. */
const DEBOUNCE_MS = 30_000;

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * @returns {{
 *   recommendations: Object[],
 *   toneHint: string,
 *   contextReason: string,
 *   loading: boolean,
 *   error: string|null
 * }}
 */
function useRecommendations() {
  // ── Zustand selectors ──────────────────────────────────────────────────────
  const context        = useContextIQStore((s) => s.context);
  const consent        = useContextIQStore((s) => s.consent);
  const preferences    = useContextIQStore((s) => s.user.preferences);
  const storeRecs      = useContextIQStore((s) => s.recommendations);
  const toneHint       = useContextIQStore((s) => s.aiToneHint);
  const setRecs        = useContextIQStore((s) => s.setRecommendations);

  // ── Local state ────────────────────────────────────────────────────────────
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState(null);
  const [contextReason, setContextReason] = useState('');

  // ── Refs (survive re-renders, do not cause them) ───────────────────────────
  const abortControllerRef = useRef(null);
  const lastCallTimeRef    = useRef(0);      // epoch ms of last successful call
  const debounceTimerRef   = useRef(null);   // pending setTimeout id

  // ── Core fetch function ────────────────────────────────────────────────────
  const fetchRecommendations = useCallback(async () => {
    // Abort any previous in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const result = await getContextualRecommendations(
        context,
        consent,
        preferences,
        products,
        controller.signal
      );

      // Abort signal fired before we got here — do nothing
      if (controller.signal.aborted) return;

      // Map ranked IDs back to full product objects (preserves rank order)
      const ranked = result.rankedProductIds
        .map((id) => products.find((p) => p.id === id))
        .filter(Boolean)                     // drop IDs Claude hallucinated
        .slice(0, 8);

      setRecs(ranked, result.toneHint);
      setContextReason(result.contextReason ?? '');
      lastCallTimeRef.current = Date.now();
    } catch (err) {
      if (err?.name === 'AbortError') return; // normal cancellation — ignore
      console.error('[useRecommendations] Fetch failed:', err);
      setError(err.message ?? 'Failed to fetch recommendations.');
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [context, consent, preferences, setRecs]);

  // ── Debounced trigger — fires when context.timeOfDay changes ──────────────
  useEffect(() => {
    // Skip until we have a meaningful context reading
    if (!context.timeOfDay) return;

    // Clear any pending debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const msSinceLast = Date.now() - lastCallTimeRef.current;
    const remainingMs = Math.max(0, DEBOUNCE_MS - msSinceLast);

    if (remainingMs === 0) {
      // Enough time has elapsed — call immediately
      fetchRecommendations();
    } else {
      // Schedule after the remaining debounce window
      debounceTimerRef.current = setTimeout(fetchRecommendations, remainingMs);
    }

    // Cleanup: cancel pending timer and abort any in-flight request on unmount
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [context.timeOfDay]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Cleanup on unmount ─────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    recommendations: storeRecs,
    toneHint,
    contextReason,
    loading,
    error,
  };
}

export default useRecommendations;
