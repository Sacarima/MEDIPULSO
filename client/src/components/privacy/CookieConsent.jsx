import { useEffect, useRef, useState, useCallback } from "react";
import { IoClose, IoChevronDown } from "react-icons/io5";

const STORAGE_KEY = "mp-consent";

function loadConsent() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null; }
  catch { return null; }
}
function saveConsent(consent) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
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
  const [expanded, setExpanded] = useState({ necessary: true, functional: false, analytics: false, performance: false });
  const [prefs, setPrefs] = useState({ functional: false, analytics: false, performance: false });
  const dialogRef = useRef(null);
  const lastActiveRef = useRef(null);

  // Brand color (you can move this to :root in index.css if you prefer)
  const brandStyle = { ["--mp-primary"]: "#00c3a5" };

  // Load existing consent
  useEffect(() => {
    const c = loadConsent();
    if (c) {
      setConsent(c);
      setPrefs({
        functional: !!c.functional,
        analytics: !!c.analytics,
        performance: !!c.performance,
      });
    }
  }, []);

  // Focus trap + ESC
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
    setTimeout(() => node?.querySelector("button, input, [tabindex]")?.focus?.(), 0);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      lastActiveRef.current?.focus?.();
    };
  }, [openPrefs]);

  useLockBodyScroll(openPrefs);

  const showBanner = consent === null;

  // Actions
  const acceptAll = () => {
    const c = {
      necessary: true,
      functional: true,
      analytics: true,
      performance: true,
      date: new Date().toISOString()
    };
    saveConsent(c); setConsent(c); setOpenPrefs(false);
  };
  const rejectAll = () => {
    const c = {
      necessary: true,
      functional: false,
      analytics: false,
      performance: false,
      date: new Date().toISOString()
    };
    saveConsent(c); setConsent(c); setOpenPrefs(false);
  };
  const saveOnlyPrefs = () => {
    const c = {
      necessary: true,
      functional: prefs.functional,
      analytics: prefs.analytics,
      performance: prefs.performance,
      date: new Date().toISOString()
    };
    saveConsent(c); setConsent(c); setOpenPrefs(false);
  };

  const onBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) setOpenPrefs(false);
  }, []);

  // UI helpers
  const Toggle = ({ checked, onChange, disabled }) => (
    <button
      type="button"
      onClick={!disabled ? () => onChange(!checked) : undefined}
      aria-pressed={checked}
      aria-disabled={disabled}
      className={`relative h-6 w-11 rounded-full transition-colors
        ${disabled ? "bg-slate-300 cursor-not-allowed" : checked ? "bg-[color:var(--mp-primary)]" : "bg-slate-300"}
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--mp-primary)]/40`}
      style={brandStyle}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform
          ${checked ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  );

  const Section = ({ id, title, desc, note, alwaysOn, value, onChange }) => (
    <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-4">
      <button
        type="button"
        className="flex w-full items-center gap-3 text-left"
        onClick={() => setExpanded((s) => ({ ...s, [id]: !s[id] }))}
        aria-expanded={!!expanded[id]}
      >
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</p>
            {alwaysOn ? (
              <span className="ml-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                Always Active
              </span>
            ) : null}
          </div>
          <p className="mt-1 line-clamp-2 text-xs text-slate-600 dark:text-slate-300">
            {desc}
          </p>
        </div>

        {!alwaysOn && (
          <Toggle checked={!!value} onChange={onChange} />
        )}
        <IoChevronDown
          className={`ml-2 shrink-0 text-slate-500 transition-transform ${expanded[id] ? "rotate-180" : "rotate-0"}`}
          aria-hidden="true"
        />
      </button>

      {expanded[id] && (
        <div className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-600 dark:text-slate-300">
          {note ? <p className="mb-2">{note}</p> : null}
          <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3 text-[11px] leading-5">
            These cookies help provide the described functionality for this category. You can change or withdraw your
            consent at any time from this dialog.
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Banner */}
      {showBanner && (
        <div className="fixed inset-x-0 bottom-0 z-[90]" style={brandStyle}>
          <div className="mx-auto mb-3w-[min(100%-1rem,980px)] rounded-2l borer border-slate-200 bg-slate-900 p-4 shadow-lg">
            <p className="text-sm text-slate-50">
              We use cookies to improve your experience. Necessary cookies run by default. You can accept, reject, or manage preferences.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                onClick={() => setOpenPrefs(true)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-50 hover:bg-slate-50 hover:text-slate-700"
              >
                Manage preferences
              </button>
              <button
                onClick={rejectAll}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-50 hover:bg-slate-50 hover:text-slate-700"
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
          <div className="absolute inset-0 bg-black/40 supports-[backdrop-filter]:backdrop-blur-[2px] transition-opacity motion-safe:animate-fadeIn" />

          {/* panel */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-prefs-title"
            ref={dialogRef}
            tabIndex={-1}
            className="relative m-2 sm:mx-auto w-[min(100%-1rem,1000px)]
                       rounded-2xl bg-white dark:bg-slate-900 shadow-2xl outline outline-1 outline-black/5 dark:outline-white/10
                       motion-safe:animate-popIn focus:outline-none max-h-[90vh] flex flex-col"
            style={brandStyle}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* header */}
            <div className="flex items-start gap-3 px-6 pt-6 pb-4 border-b border-slate-100 dark:border-white/10">
              <div className="flex-1">
                <h2 id="cookie-prefs-title" className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                  Customize Consent Preferences
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  We use cookies to help you navigate efficiently and perform certain functions. Manage categories below.
                </p>
              </div>
              <button
                onClick={() => setOpenPrefs(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--mp-primary)]/40"
                aria-label="Close"
                style={brandStyle}
              >
                <IoClose className="h-5 w-5" />
              </button>
            </div>

            {/* content: 2-column on md+ */}
            <div className="grid gap-4 px-6 py-5 overflow-y-auto" style={{ maxHeight: "calc(90vh - 64px - 72px)" }}>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <Section
                    id="necessary"
                    title="Necessary"
                    desc="Essential for core features like secure log-in and remembering your preferences."
                    note="These do not store personally identifiable information."
                    alwaysOn
                    value
                    onChange={() => {}}
                  />
                  <Section
                    id="functional"
                    title="Functional"
                    desc="Enhances features like social sharing, feedback collection, and third-party widgets."
                    value={prefs.functional}
                    onChange={(v) => setPrefs((p) => ({ ...p, functional: v }))}
                  />
                </div>

                <div className="space-y-4">
                  <Section
                    id="analytics"
                    title="Analytics"
                    desc="Helps us understand site usage (visitors, bounce rate, traffic sources) to improve the product."
                    value={prefs.analytics}
                    onChange={(v) => setPrefs((p) => ({ ...p, analytics: v }))}
                  />
                  <Section
                    id="performance"
                    title="Performance"
                    desc="Measures performance to deliver a better experience (load times, responsiveness)."
                    value={prefs.performance}
                    onChange={(v) => setPrefs((p) => ({ ...p, performance: v }))}
                  />
                </div>
              </div>
            </div>

            {/* sticky footer */}
            <div className="sticky bottom-0 z-10 rounded-b-2xl border-t border-slate-100 bg-white/90 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-white/10 dark:bg-slate-900/90">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={rejectAll}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200"
                >
                  Reject All
                </button>
                <button
                  onClick={saveOnlyPrefs}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-200"
                >
                  Save My Preferences
                </button>
                <button
                  onClick={acceptAll}
                  className="ml-auto inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white"
                  style={{ background: "var(--mp-primary)" }}
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
