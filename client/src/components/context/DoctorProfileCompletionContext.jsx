import React, { createContext, useContext, useMemo, useState } from "react";

const Ctx = createContext(null);

export function DoctorProfileCompletionProvider({
  children,
  initialStep = 1,
  initialCompletedSteps = [],
}) {
  const [step, setStep] = useState(initialStep);
  const [completedSteps, setCompletedSteps] = useState(initialCompletedSteps);

  const value = useMemo(
    () => ({ step, setStep, completedSteps, setCompletedSteps }),
    [step, completedSteps]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// Safe hook: returns null if provider not mounted (so we can fallback to props)
export function useDoctorProfileCompletion() {
  return useContext(Ctx);
}

// Convenience wrapper: only creates a provider if one isn't already present
export function EnsureDoctorProfileCompletionProvider({
  children,
  initialStep = 1,
  initialCompletedSteps = [],
}) {
  const existing = useContext(Ctx);
  if (existing) return children;
  return (
    <DoctorProfileCompletionProvider
      initialStep={initialStep}
      initialCompletedSteps={initialCompletedSteps}
    >
      {children}
    </DoctorProfileCompletionProvider>
  );
}
