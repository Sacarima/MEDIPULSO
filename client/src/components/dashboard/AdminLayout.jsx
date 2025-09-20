// AdminLayout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import Sidebar from "./Sidebar";
import useMediaQuery from "../../hooks/useMediaQuery"; // adjust path if needed

export default function AdminLayout() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Top bar (mobile only) */}
      {!isDesktop && (
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200">
          <div className="h-14 flex items-center gap-3 px-4">
            <button
              aria-label="Open menu"
              className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-gray-200 hover:bg-gray-50 active:scale-95 transition"
              onClick={() => setMobileOpen(true)}
            >
              <FiMenu className="text-xl" />
            </button>
            <div className="font-semibold text-gray-800">Admin</div>
          </div>
        </header>
      )}

      {/* Sidebar handles: desktop fixed aside, mobile drawer */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main content:
          - top padding for mobile top bar
          - left margin for desktop sidebar width via CSS var
      */}
      <main className="pt-2 pb-6 lg:pt-6 lg:pb-8 transition-[margin] lg:ml-[var(--sidebar-w,16rem)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
