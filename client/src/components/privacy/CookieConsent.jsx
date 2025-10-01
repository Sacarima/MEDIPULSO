import { useEffect, useRef, useState, useCallback } from "react";

const STORAGE_KEY = "mp-consent";

function loadConsent() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null; }
  catch { return null; }
}
function saveConsent(consent) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  // Optional cookie for server usage
  document.cookie = `mp_consent=${encodeURIComponent(JSON.stringify(consent))};path=/;max-age=${60*60*24*365}`;
}

/** Lock body scroll while modal is open */
function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) return;
    const { overflow, paddingRight } = document.body.style;
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = scrollBarWidth ? `${scrollBarWidth}px` : paddingRight;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [locked]);
}

export default function CookieConsent() {
  const [consent, setConsent] = useState(null);
  const [openPrefs, setOpenPrefs] = useState(false);
  const [prefs, setPrefs] = useState({ analytics: false, marketing: false });
  const dialogRef = useRef(null);
  const lastActiveRef = useRef(null);

  // Brand color variable (optional; remove if you set it globally in CSS)
  const brandStyle = { ["--mp-primary"]: "#00c3a5" };

  // Load existing consent
  useEffect(() => {
    const c = loadConsent();
    if (c) {
      setConsent(c);
      setPrefs({ analytics: !!c.analytics, marketing: !!c.marketing });
    }
  }, []);

  // Manage focus + ESC in modal
  useEffect(() => {
    if (!openPrefs) return;
    lastActiveRef.current = document.activeElement;
    const node = dialogRef.current;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpenPrefs(false);
      } else if (e.key === "Tab") {
        const focusables = node?.querySelectorAll(
          'a[href],area[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    // focus first element
    setTimeout(() => node?.querySelector("button, input, [tabindex]")?.focus?.(), 0);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      lastActiveRef.current?.focus?.();
    };
  }, [openPrefs]);

  useLockBodyScroll(openPrefs);

  const showBanner = consent === null;

  const acceptAll = () => {
    const c = { necessary: true, analytics: true, marketing: true, date: new Date().toISOString() };
    saveConsent(c); setConsent(c);
  };
  const rejectAll = () => {
    const c = { necessary: true, analytics: false, marketing: false, date: new Date().toISOString() };
    saveConsent(c); setConsent(c);
  };
  const savePrefs = () => {
    const c = { necessary: true, analytics: prefs.analytics, marketing: prefs.marketing, date: new Date().toISOString() };
    saveConsent(c); setConsent(c); setOpenPrefs(false);
  };

  const onBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) setOpenPrefs(false);
  }, []);

  return (
    <>
      {/* Banner */}
      {showBanner && (
        <div className="fixed inset-x-0 bottom-0 z-[90] " style={brandStyle}>
          <div className="mx-auto mb-3 w-[min(100%-1rem,980px)] rounded-2xl border border-slate-200  bg-slate-900 p-4 shadow-lg ">
            <p className="text-sm text-slate-50 ">
              We use cookies to improve your experience. Necessary cookies run by default. You can accept, reject, or manage preferences.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                onClick={() => setOpenPrefs(true)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-50 hover:bg-slate-50 hover:text-slate-700 "
              >
                Manage preferences
              </button>
              <button
                onClick={rejectAll}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-50 hover:bg-slate-50 hover:text-slate-700 "
              >
                Reject all
              </button>
              <button
                onClick={acceptAll}
                className="ml-auto inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white"
                style={{ background: "var(--mp-primary)" }}
              >
                Accept all
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {openPrefs && (
        <div
          aria-hidden={!openPrefs}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
          onMouseDown={onBackdropClick}
        >
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/40  supports-[backdrop-filter]:backdrop-blur-[2px] transition-opacity motion-safe:animate-fadeIn" />

          {/* panel */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-prefs-title"
            ref={dialogRef}
            tabIndex={-1}
            className="relative m-2 sm:mx-auto w-[calc(100%-1rem)] sm:w-auto sm:max-w-md
                       rounded-2xl bg-white  shadow-2xl outline outline-1 outline-black/5
                       motion-safe:animate-popIn focus:outline-none max-h-[85vh] flex flex-col"
            style={brandStyle}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* accent */}
            <div className="absolute -top-1 left-6 right-6 h-1 rounded-full" style={{ background: "var(--mp-primary)" }} />

            {/* header */}
            <div className="flex items-start gap-3 px-5 pt-5 pb-3 bg-slate-900">
              <h2 id="cookie-prefs-title" className="text-lg font-semibold tracking-tight text-slate-50 ">
                Cookie preferences
              </h2>
              <div className="ml-auto" />
              <button
                onClick={() => setOpenPrefs(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5">
                  <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* body */}
            <div className="px-5 pb-5 pt-1 text-slate-800 bg-slate-900  overflow-y-auto" style={{ maxHeight: "60vh" }}>
              <p className="text-sm text-slate-400  mb-4">
                Enable additional categories to help us improve MediPulso.
              </p>

              <div className="rounded-xl border border-slate-200 p-3 mb-3">
                <div className="flex items-start gap-3">
                  <input type="checkbox" checked readOnly className="mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Necessary</p>
                    <p className="text-xs text-slate-400">Required for the site to function. Always on.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-3 mb-3">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={prefs.analytics}
                    onChange={(e) => setPrefs(p => ({ ...p, analytics: e.target.checked }))}
                    className="mt-1 cursor-pointer"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Analytics</p>
                    <p className="text-xs text-slate-400">Helps us understand usage to improve features.</p>
                  </div>
                </label>
              </div>

              <div className="rounded-xl border border-slate-200 p-3">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={prefs.marketing}
                    onChange={(e) => setPrefs(p => ({ ...p, marketing: e.target.checked }))}
                    className="mt-1 cursor-pointer"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">Marketing</p>
                    <p className="text-xs text-slate-400 ">Personalized content and offers.</p>
                  </div>
                </label>
              </div>
            </div>

            {/* footer */}
            <div className="px-5 pb-5 pt-3 border-t border-slate-100 bg-slate-900 rounded-b-2xl">
              <div className="flex justify-end gap-2">
                <button
                  className="rounded-xl border border-slate-200 px-4 py-2 text-slate-200 text-sm"
                  onClick={() => setOpenPrefs(false)}
                >
                  Cancel
                </button>
                <button
                  className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white"
                  style={{ background: "var(--mp-primary)" }}
                  onClick={savePrefs}
                >
                  Save preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
