import React, { useEffect, useMemo, useState } from "react";
import { FaHome, FaUsers, FaChartBar, FaCog, FaSignOutAlt } from "react-icons/fa";
import { FiMenu, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import WithLogout from "../WithLogout";

const Sidebar = ({ handleLogout, role }) => {
  // Desktop collapse (persisted)
  const [isCollapsed, setIsCollapsed] = useState(false);
  // Mobile drawer
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  // Persist collapse state
  useEffect(() => {
    const saved = localStorage.getItem("adminSidebarCollapsed");
    if (saved === "true") setIsCollapsed(true);
  }, []);
  useEffect(() => {
    localStorage.setItem("adminSidebarCollapsed", String(isCollapsed));
  }, [isCollapsed]);

  const toggleCollapse = () => setIsCollapsed((v) => !v);
  const openMobile = () => setIsMobileOpen(true);
  const closeMobile = () => setIsMobileOpen(false);
  const onNavClick = () => {
    // auto-close drawer on mobile after navigation
    if (isMobileOpen) closeMobile();
  };

  // Keep your original links & paths (note: duplicates preserved to avoid changing behavior)
  const links = useMemo(
    () => [
      { to: "/admin", icon: <FaHome />, label: "Dashboard" },
      { to: "/users", icon: <FaUsers />, label: "Users" },
      { to: "/analytics", icon: <FaChartBar />, label: "Analytics" },
      { to: "/settings", icon: <FaCog />, label: "Settings" },
      { to: "/users", icon: <FaChartBar />, label: "Users" }, // duplicate kept intentionally
      { to: "/admin/dashboard", icon: <FaHome />, label: "Dashboard" },
      { to: "/admin/treatments", icon: <FaCog />, label: "Treatments" },
      { to: "/admin/doctor-table", icon: <FaUsers />, label: "Doctor Table" },
      { to: "/admin/appointments", icon: <FaUsers />, label: "Doctor Appointments" },
    ],
    []
  );

  // Base styles
  const asideBase =
    "fixed z-40 inset-y-0 left-0 bg-gray-900/90 backdrop-blur supports-[backdrop-filter]:bg-gray-900/70 border-r border-white/10 text-white transition-[transform,width] duration-300 ease-out lg:static";
  const asideWidth = isCollapsed ? "lg:w-20" : "lg:w-64";
  const asideTransform = isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0";

  return (
    <>
      {/* Mobile top trigger (appears only on small screens) */}
      <button
        className="lg:hidden fixed top-3 left-3 z-50 inline-flex items-center gap-2 rounded-xl bg-gray-900/90 px-3 py-2 text-white shadow-md ring-1 ring-white/10"
        onClick={openMobile}
        aria-label="Open menu"
      >
        <FiMenu className="text-xl" />
        <span className="text-sm">Menu</span>
      </button>

      {/* Overlay for mobile drawer */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Aside */}
      <aside
        className={`${asideBase} ${asideWidth} ${asideTransform}`}
        aria-label="Admin navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-3 bg-gray-950/50">
          <Link to="/admin" onClick={onNavClick} className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/90 grid place-items-center font-bold">
              A
            </div>
            {!isCollapsed && (
              <div className="leading-tight">
                <div className="text-sm font-semibold">Admin Dashboard</div>
                <div className="text-[11px] text-gray-400">MEDIPULSO</div>
              </div>
            )}
          </Link>

          {/* Collapse toggle (desktop) */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:inline-flex items-center justify-center h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 ring-1 ring-white/10"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>

        {/* Nav list */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 min-h-screen">
          <ul className="space-y-1">
            {links.map((item, idx) => (
              <SidebarLink
                key={`${item.to}-${idx}`}
                to={item.to}
                icon={item.icon}
                label={item.label}
                isCollapsed={isCollapsed}
                currentPath={location.pathname}
                onClick={onNavClick}
              />
            ))}

            {/* Logout: same functionality */}
            <SidebarLink
              icon={<FaSignOutAlt />}
              label="Logout"
              isCollapsed={isCollapsed}
              onClick={() => {
                handleLogout(role);
                onNavClick();
              }}
            />
          </ul>
        </nav>

        {/* Footer (optional) */}
        <div className="px-3 py-3 border-t border-white/10 text-xs text-gray-400">
          {!isCollapsed ? (
            <div className="flex items-center justify-between">
              <span>v1.0</span>
              <span className="opacity-80">© {new Date().getFullYear()}</span>
            </div>
          ) : (
            <div className="text-center">v1.0</div>
          )}
        </div>
      </aside>
    </>
  );
};

// Sidebar link with active state + tooltips when collapsed
const SidebarLink = ({ to, icon, label, isCollapsed, currentPath = "", onClick }) => {
  const isActive = to ? currentPath === to : false;

  // Button or Link, depending on presence of `to`
  const Wrapper = to ? Link : "button";
  const wrapperProps = to
    ? { to, onClick }
    : { onClick, type: "button" };

  return (
    <li className="group relative">
      <Wrapper
        {...wrapperProps}
        className={[
          "flex items-center rounded-lg px-3 py-2 transition-colors",
          isActive
            ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/30"
            : "text-gray-300 hover:bg-white/5 hover:text-white",
          isCollapsed ? "justify-center" : "gap-3",
        ].join(" ")}
      >
        <span className="text-xl">{icon}</span>
        {!isCollapsed && <span className="text-sm font-medium">{label}</span>}
      </Wrapper>

      {/* Tooltip when collapsed */}
      {isCollapsed && label && (
        <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="whitespace-nowrap rounded-md bg-gray-800 px-2 py-1 text-xs text-white shadow-lg ring-1 ring-white/10">
            {label}
          </div>
        </div>
      )}
    </li>
  );
};

export default WithLogout(Sidebar);
