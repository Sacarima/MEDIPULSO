// components/loaders/RouteProgressBar.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function RouteProgressBar({ showAfter = 120, minDuration = 250 }) {
  const { pathname, search } = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let showT, hideT;
    // Start after a tiny delay (so quick transitions don't show it)
    showT = setTimeout(() => setVisible(true), showAfter);

    // Fallback auto-hide (since classic BrowserRouter doesn't know data-loading state)
    hideT = setTimeout(() => setVisible(false), showAfter + minDuration + 200);

    return () => {
      clearTimeout(showT);
      clearTimeout(hideT);
      setVisible(false);
    };
  }, [pathname, search, showAfter, minDuration]);

  return visible ? (
    <div className="fixed left-0 right-0 top-0 z-[9998]">
      <div className="h-1 w-full bg-gradient-to-r from-[#00c3a5] via-[#5ad2c0] to-[#00c3a5] animate-[pulse_1.2s_ease-in-out_infinite]" />
    </div>
  ) : null;
}
