import { useEffect, useRef } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useDoctorDashboard } from "../components/context/DoctorDashboardContext";

/**
 * Keeps the dashboard "active" tab in sync with the URL (?tab=...).
 * - On first mount, prefers the URL if present/valid; otherwise writes the current active (or default).
 * - After init, reflects active -> URL (replace by default to avoid history spam).
 */
export default function useDashboardTabSync({
  allowedTabs,              // array or Set of valid tabs (optional)
  defaultTab = "home",      // fallback when URL has no tab or it's invalid
  param = "tab",            // query param name
  writeOnInitIfMissing = true,
  replaceOnChange = true,
} = {}) {
  const { active, setActive } = useDoctorDashboard();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const initRef = useRef(false);

  const isAllowed = (t) => {
    if (!t) return false;
    if (!allowedTabs) return true;
    const list = Array.isArray(allowedTabs) ? allowedTabs : Array.from(allowedTabs);
    return list.includes(t);
  };

  // INIT ONCE
  useEffect(() => {
    if (initRef.current) return;

    const urlTab = searchParams.get(param);

    if (isAllowed(urlTab) && urlTab !== active) {
      // Trust URL on first load
      setActive(urlTab);
    } else if (writeOnInitIfMissing && (!urlTab || !isAllowed(urlTab))) {
      // No/invalid tab in URL -> write current active or default
      const tabToWrite = isAllowed(active) ? active : defaultTab;
      const sp = new URLSearchParams(location.search);
      sp.set(param, tabToWrite);
      setSearchParams(sp, { replace: true });
    }

    initRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // AFTER INIT: reflect active -> URL
  useEffect(() => {
    if (!initRef.current) return;

    const current = searchParams.get(param);
    if (active && isAllowed(active) && current !== active) {
      const sp = new URLSearchParams(location.search);
      sp.set(param, active);
      setSearchParams(sp, { replace: replaceOnChange });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return { active, setActive };
}
