import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { install401Handler } from './install401Handler';
import { createSessionChannel } from './sessionChannel';
import { fetchSession } from '../api/authApi';
import { globalLogout } from './globalLogout';

const LOGIN_ROUTE = '/login'; 

const WARN_MS = 5 * 60 * 1000;   // show banner ≤ 5 min
const MODAL_MS = 60 * 1000;      // escalate modal ≤ 1 min
const TICK_MS = 1000;

export default function SessionManager() {
  const navigate = useNavigate();
  const location = useLocation();

  const [expiresAt, setExpiresAt] = useState(null);  // ms epoch
  const [skew, setSkew] = useState(0);               // serverTimeMs - Date.now()
  const [loading, setLoading] = useState(true);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const tickRef = useRef(null);
  const channelRef = useRef(null);

  // Compute time-left safely
  const nowMs = () => Date.now() + skew;
  const timeLeft = useMemo(() => {
    if (!expiresAt) return null;
    return Math.max(0, expiresAt - nowMs());
  }, [expiresAt, skew]);

  const showBanner = useMemo(() => {
    if (bannerDismissed) return false;
    if (timeLeft == null) return false;
    return timeLeft > 0 && timeLeft <= WARN_MS && timeLeft > MODAL_MS;
  }, [timeLeft, bannerDismissed]);

  const showModal = useMemo(() => {
    if (timeLeft == null) return false;
    return timeLeft > 0 && timeLeft <= MODAL_MS;
  }, [timeLeft]);

  const formatTime = (ms) => {
    const s = Math.max(0, Math.floor(ms / 1000));
    const mm = String(Math.floor(s / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  };

  const redirectAfterLogin = useMemo(() => {
    // Where to return the user after logging back in
    return location.pathname + location.search;
  }, [location.pathname, location.search]);

  const hardLogout = useCallback(async (reason = 'expired') => {
    // Broadcast to other tabs first
    channelRef.current?.post({ type: 'logout', reason });
    await globalLogout({ redirect: LOGIN_ROUTE + `?from=${encodeURIComponent(redirectAfterLogin)}&reason=${reason}`, navigate, reason });
  }, [navigate, redirectAfterLogin]);

  const syncSession = useCallback(async () => {
    try {
      const data = await fetchSession(); // throws on 401
      if (typeof data.serverTimeMs === 'number') {
        setSkew(data.serverTimeMs - Date.now());
      } else {
        setSkew(0);
      }
      if (typeof data.sessionExpiresAt === 'number') {
        setExpiresAt(data.sessionExpiresAt);
        // share with other tabs
        channelRef.current?.post({ type: 'session', expiresAt: data.sessionExpiresAt, serverTimeMs: data.serverTimeMs || Date.now() });
      }
      setLoading(false);
    } catch (err) {
      // 401 (no/invalid/expired) -> force logout
      await hardLogout(err?.code || 'unauthorized');
    }
  }, [hardLogout]);

  // Install the 401 handler once
  useEffect(() => {
    install401Handler(async () => {
      await hardLogout('unauthorized');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Create cross-tab channel
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ch = createSessionChannel(async (msg) => {
      if (!msg || !msg.type) return;
      if (msg.type === 'logout') {
        await hardLogout(msg.reason || 'expired');
      } else if (msg.type === 'session') {
        // Accept fresher expiry only
        if (typeof msg.expiresAt === 'number' && (!expiresAt || msg.expiresAt > expiresAt)) {
          setExpiresAt(msg.expiresAt);
        }
        if (typeof msg.serverTimeMs === 'number') {
          setSkew(msg.serverTimeMs - Date.now());
        }
      }
    });
    channelRef.current = ch;
    return () => ch.close();
  }, [hardLogout, expiresAt]);

  // Initial load
  useEffect(() => {
    syncSession();
  }, [syncSession]);

  // Focus/visibility resync
  useEffect(() => {
    const onFocus = () => syncSession();
    const onVis = () => { if (document.visibilityState === 'visible') syncSession(); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [syncSession]);

  // Tick timer
  useEffect(() => {
    if (!expiresAt) return;
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = setInterval(async () => {
      const left = Math.max(0, expiresAt - nowMs());
      if (left <= 0) {
        clearInterval(tickRef.current);
        await hardLogout('expired');
      }
    }, TICK_MS);
    return () => tickRef.current && clearInterval(tickRef.current);
  }, [expiresAt, skew, hardLogout]);

  if (loading) return null;

  return (
    <>
      {/* Warning banner (non-blocking) */}
      {showBanner && (
        <div className="fixed bottom-4 inset-x-0 mx-auto max-w-xl z-[1000]">
          <div className="mx-4 rounded-xl bg-amber-50 border border-amber-200 shadow p-4 flex items-start gap-3">
            <div className="flex-1">
              <p className="text-amber-800 font-medium">Your session will expire soon</p>
              <p className="text-amber-700 text-sm">
                Time remaining: <span className="font-mono">{formatTime(timeLeft)}</span>. Save your work to avoid losing changes.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setBannerDismissed(true)}
                className="text-amber-900/70 hover:text-amber-900 text-sm"
              >
                Dismiss
              </button>
              <button
                onClick={() => hardLogout('manual')}
                className="px-3 py-1.5 rounded-md bg-amber-600 text-white text-sm hover:bg-amber-700"
              >
                Log in again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Final modal (blocking-ish) */}
      {showModal && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md mx-4 rounded-2xl bg-white shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900">Session expiring</h3>
            <p className="mt-2 text-gray-700">
              Your session will end in <span className="font-mono">{formatTime(timeLeft)}</span>.
            </p>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                onClick={() => setBannerDismissed(true)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Keep working
              </button>
              <button
                onClick={() => hardLogout('manual')}
                className="px-4 py-2 rounded-lg bg-[#00b39b] text-white hover:opacity-95"
              >
                Log in again
              </button>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              When the timer hits zero you’ll be signed out for your security.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
