type Listener = () => void;

let pendingRequests = 0;
let visibleLoading = false;
let showTimer: number | null = null;
const SHOW_DELAY_MS = 150;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeLoading(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getIsLoadingSnapshot() {
  return visibleLoading;
}

export function startLoading() {
  pendingRequests += 1;
  if (visibleLoading) return;
  if (showTimer !== null) return;

  showTimer = window.setTimeout(() => {
    showTimer = null;
    if (pendingRequests > 0) {
      visibleLoading = true;
      emit();
    }
  }, SHOW_DELAY_MS);
}

export function stopLoading() {
  pendingRequests = Math.max(0, pendingRequests - 1);
  if (pendingRequests > 0) return;

  if (showTimer !== null) {
    window.clearTimeout(showTimer);
    showTimer = null;
  }

  if (visibleLoading) {
    visibleLoading = false;
    emit();
  }
}

export function installFetchLoadingTracker() {
  const trackedFlag = '__prognosov_fetch_tracked__';
  const maybeWindow = window as unknown as Record<string, unknown>;

  if (maybeWindow[trackedFlag]) return;
  maybeWindow[trackedFlag] = true;

  const nativeFetch = window.fetch.bind(window);

  window.fetch = async (...args: Parameters<typeof fetch>) => {
    startLoading();
    try {
      return await nativeFetch(...args);
    } finally {
      stopLoading();
    }
  };
}
