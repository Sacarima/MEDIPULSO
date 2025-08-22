import React, { createContext, useContext, useMemo, useState } from "react";

const Ctx = createContext(null);

export function PublicSearchUIProvider({ children, initial = {} }) {
  const [showSpecialtyFilter, setShowSpecialtyFilter] =
    useState(!!initial.showSpecialtyFilter);

  const value = useMemo(
    () => ({
      showSpecialtyFilter,
      setShowSpecialtyFilter,
      openSpecialtyFilter: () => setShowSpecialtyFilter(true),
      closeSpecialtyFilter: () => setShowSpecialtyFilter(false),
      toggleSpecialtyFilter: () => setShowSpecialtyFilter(v => !v),
    }),
    [showSpecialtyFilter]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePublicSearchUI() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePublicSearchUI must be used within a PublicSearchUIProvider");
  return ctx;
}
