import { useSyncExternalStore } from 'react';

const FALLBACK_IMAGE = '/static/rose_bg.jpeg';

let currentUrl = FALLBACK_IMAGE;
const listeners = new Set();

// The navbar has to out-stack the page's fixed PageBackdrop to stay on top,
// and a z-index makes it a stacking context, which cuts its `backdrop-filter`
// off from that wallpaper entirely: the glass then has nothing to sample and
// renders as a flat bar. The way out is to paint a viewport-aligned copy of
// the *same* wallpaper inside the header, which means the navbar needs to know
// which image the current page settled on. usePixabayBackground publishes it
// here; nothing about what that hook returns to its callers changes.
export function publishAppBackground(url) {
  if (url === currentUrl) {
    return;
  }
  currentUrl = url;
  listeners.forEach((listener) => listener());
}

export function useAppBackground() {
  return useSyncExternalStore(
    (onStoreChange) => {
      listeners.add(onStoreChange);
      return () => listeners.delete(onStoreChange);
    },
    () => currentUrl,
    () => FALLBACK_IMAGE,
  );
}
