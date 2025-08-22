// import React, { useEffect, useState } from "react";
// import ReactDOM from 'react-dom/client'
// import App from './App.jsx'
// import './index.css'
// import { store, persistor } from './redux/store.js'
// import { Provider } from 'react-redux'
// import { PersistGate } from 'redux-persist/integration/react'
// import ThemeProvider from './components/ThemeProvider.jsx'
// import LoadingOverlay from './components/loaders/LoadingOverlay.jsx'

// ReactDOM.createRoot(document.getElementById('root')).render(
//     <Provider store={store}>
//     <PersistGate
//       persistor={persistor}
//       loading={<LoadingOverlay open label="Starting Medi Pulso…" />}
//       onBeforeLift={() => {
//         // Fires when rehydration completes
//         if (import.meta.env.DEV) console.log("[persist] rehydrated");
//       }}
//     >
//       <ThemeProvider>
//         <App />
//       </ThemeProvider>
//     </PersistGate>
//   </Provider>

// )

// src/main.jsx
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import App from "./App.jsx";
import "./index.css";

import { store, persistor } from "./redux/store.js";
import ThemeProvider from "./components/ThemeProvider.jsx";
import LoadingOverlay from "./components/loaders/LoadingOverlay.jsx";

// Tweak to taste
const SPLASH_MIN_MS = 600;  // keep splash visible at least this long
const SPLASH_DELAY_MS = 0;  // show immediately (no debounce)

function Root() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const start = Date.now();

    const hideAfterMin = () => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, SPLASH_MIN_MS - elapsed);
      const t = setTimeout(() => setShowSplash(false), remaining);
      return () => clearTimeout(t);
    };

    // If already bootstrapped (ultra fast), still show splash for min duration
    let cleanup = () => {};
    const now = persistor.getState?.();
    if (now?.bootstrapped) {
      cleanup = hideAfterMin();
      return cleanup;
    }

    // Otherwise wait for rehydration to finish
    const unsubscribe = persistor.subscribe(() => {
      const st = persistor.getState?.();
      if (st?.bootstrapped) {
        cleanup = hideAfterMin();
        unsubscribe();
      }
    });

    return () => {
      unsubscribe?.();
      cleanup?.();
    };
  }, []);

  return (
    <Provider store={store}>
      {/* Full-screen LifeLine splash (outside the gate) */}
      <LoadingOverlay
        open={showSplash}
        label="Starting Medi Pulso…"
        showAfter={SPLASH_DELAY_MS}
        minDuration={SPLASH_MIN_MS}
        color="#00c3a5"
        size="large"
        textColor=""
      />

      {/* App mounts when rehydration completes; no extra loader here */}
      <PersistGate persistor={persistor} loading={null}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);

