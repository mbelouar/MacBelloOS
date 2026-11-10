'use client';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';

/** Subscribes to a CSS media query. Returns `false` during SSR. */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', cb);
      return () => mql.removeEventListener('change', cb);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const useIsMobile = () => useMediaQuery('(max-width: 767px)');
export const useCoarsePointer = () => useMediaQuery('(hover: none), (pointer: coarse)');

/** Current time, refreshed every `interval` ms. `null` during SSR/hydration (avoids mismatches). */
export function useNow(interval = 1000) {
  const subscribe = useCallback(
    (cb: () => void) => {
      const t = window.setInterval(cb, interval);
      return () => window.clearInterval(t);
    },
    [interval],
  );
  const tick = useSyncExternalStore(
    subscribe,
    () => Math.floor(Date.now() / interval),
    () => -1,
  );
  return tick < 0 ? null : new Date(tick * interval);
}

/** Window size, `null` until mounted. */
export function useViewport() {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  useEffect(() => {
    const update = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return size;
}

/** Sets --mx/--my CSS vars on the element under the pointer (pairs with the `.spotlight` class). */
export function trackPointer(e: React.PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
  el.style.setProperty('--my', `${e.clientY - r.top}px`);
}

export const isMac = () =>
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

const noopSubscribe = () => () => {};
/** True on Apple platforms (client only; `false` during SSR). */
export const useIsMac = () => useSyncExternalStore(noopSubscribe, isMac, () => false);
