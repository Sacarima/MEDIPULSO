// src/components/context/DoctorDashboardContext.jsx
import React, { createContext, useContext, useMemo, useState } from "react";

export const DoctorDashboardContext = createContext(null);

// Optional: keep a whitelist so unknown ?tab values don’t break your UI
const ALLOWED_TABS = new Set([
  "home",
  "calendar",
  "news",
  "patients",
  "stats",
  "campaigns",
  "plans",
  "appointments",
  "profile/edit",
  "profile/public",
  "profile/addresses",
  "profile/appointment-dashboard",
  "profile/stats",
  "profile/promotions",
  "profile/certificates",
]);

function getInitialActiveFromURL() {
  try {
    // Safe in SPA; guard for SSR just in case
    const search = typeof window !== "undefined" ? window.location.search : "";
    const sp = new URLSearchParams(search);
    const urlTab = sp.get("tab");
    return urlTab && ALLOWED_TABS.has(urlTab) ? urlTab : "home";
  } catch {
    return "home";
  }
}

export function DoctorDashboardProvider({ children }) {
  // Initialize from ?tab=... to avoid the first-paint flicker
  const [active, setActive] = useState(getInitialActiveFromURL);

  const value = useMemo(() => ({ active, setActive }), [active]);

  return (
    <DoctorDashboardContext.Provider value={value}>
      {children}
    </DoctorDashboardContext.Provider>
  );
}

export function useDoctorDashboard() {
  const ctx = useContext(DoctorDashboardContext);
  if (!ctx) {
    throw new Error("useDoctorDashboard must be used within a DoctorDashboardProvider");
  }
  return ctx;
}

/**
 * Ensures children are wrapped in a DoctorDashboardProvider.
 * If a provider already exists up the tree, it won't add another.
 */
export function EnsureDoctorDashboardProvider({ children }) {
  const ctx = useContext(DoctorDashboardContext);
  return ctx ? children : <DoctorDashboardProvider>{children}</DoctorDashboardProvider>;
}
