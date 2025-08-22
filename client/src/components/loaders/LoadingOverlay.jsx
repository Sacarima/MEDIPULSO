// components/loaders/LoadingOverlay.jsx
import { useEffect, useRef, useState } from "react";
import { LifeLine } from "react-loading-indicators";

/**
 * Full-screen overlay meant for cold-start (initial page load).
 * - Debounced show (showAfter) to avoid flashes on fast loads
 * - Min visible time (minDuration) so it doesn't blink
 */
export default function LoadingOverlay({
  open,                 // boolean: should the overlay be active?
  showAfter = 150,      // ms before showing (prevents flashing on quick loads)
  minDuration = 400,    // ms to keep visible once shown
  label = "Loading...", // text shown by LifeLine
  color = "#00c3a5",    // LifeLine color
  size = "large",       // LifeLine size: "small" | "medium" | "large"
  textColor = "",       // LifeLine text color (empty = default)
  backdropClassName = "bg-[#f8f8f8]/90", // backdrop tailwind class
}) {
  const [visible, setVisible] = useState(false);
  const shownAtRef = useRef(0);
  const showTimer = useRef(null);
  const hideTimer = useRef(null);

  useEffect(() => {
    // cleanup any timers on unmount/prop change
    return () => {
      if (showTimer.current) clearTimeout(showTimer.current);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  useEffect(() => {
    if (showTimer.current) clearTimeout(showTimer.current);
    if (hideTimer.current) clearTimeout(hideTimer.current);

    if (open) {
      // Debounce before showing (avoids overlay for super fast loads)
      showTimer.current = setTimeout(() => {
        shownAtRef.current = Date.now();
        setVisible(true);
      }, showAfter);
    } else {
      // Enforce min visible duration (avoids blink)
      const elapsed = shownAtRef.current ? Date.now() - shownAtRef.current : 0;
      const remaining = Math.max(0, minDuration - elapsed);
      hideTimer.current = setTimeout(() => setVisible(false), remaining);
    }
  }, [open, showAfter, minDuration]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={`fixed inset-0 z-[9999] ${backdropClassName} grid place-items-center transition-opacity duration-300`}
    >
      <LifeLine color={color} size={size} text={label} textColor={textColor} />
    </div>
  );
}
