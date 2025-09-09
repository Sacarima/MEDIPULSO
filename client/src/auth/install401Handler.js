// Safe, idempotent patch of window.fetch to detect 401s.
// On any 401, it calls the provided onUnauthorized callback exactly once per response.

export function install401Handler(onUnauthorized) {
  if (typeof window === 'undefined' || window.__FETCH_401_PATCHED__) return;
  window.__FETCH_401_PATCHED__ = true;

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (...args) => {
    const res = await originalFetch(...args);
    try {
      if (res && res.status === 401) {
        // Clone once; don’t consume the body for your app.
        let payload = null;
        try {
          payload = await res.clone().json();
        } catch {
          // ignore body parse errors
        }
        // Fire and forget; don’t block the response flow
        setTimeout(() => onUnauthorized(payload || {}), 0);
      }
    } catch {
      // no-op
    }
    return res;
  };
}
