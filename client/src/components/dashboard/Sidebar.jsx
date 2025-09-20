
import useMediaQuery from "../../hooks/useMediaQuery";
import React, { useEffect, useMemo, useState } from "react";
import { FaHome, FaUsers, FaChartBar, FaCog, FaSignOutAlt } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import WithLogout from "../WithLogout";


const Sidebar = ({ handleLogout, role, mobileOpen = false, setMobileOpen = () => {} }) => {
  const location = useLocation();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // Persisted collapse state for desktop
  const [isCollapsed, setIsCollapsed] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("adminSidebarCollapsed");
    if (saved === "true") setIsCollapsed(true);
  }, []);
  useEffect(() => {
    localStorage.setItem("adminSidebarCollapsed", String(isCollapsed));
  }, [isCollapsed]);

  // Maintain a CSS variable for content margin on desktop
  useEffect(() => {
    const w = isDesktop ? (isCollapsed ? "5rem" : "16rem") : "0px";
    document.documentElement.style.setProperty("--sidebar-w", w);
  }, [isDesktop, isCollapsed]);

  const toggleCollapse = () => setIsCollapsed((v) => !v);
  const closeMobile = () => setMobileOpen(false);
  const onNavClick = () => {
    if (!isDesktop) closeMobile();
  };

  // Keep your original links & paths (duplicates left intact to avoid changing behavior)
  const links = useMemo(
    () => [
      { to: "/admin/dashboard", icon: <FaHome />, label: "Dashboard" },
      { to: "/admin/analytics", icon: <FaChartBar />, label: "Analytics" },
      { to: "/admin/settings", icon: <FaCog />, label: "Settings" },
      { to: "/admin/users", icon: <FaChartBar />, label: "Users" }, // duplicate kept intentionally
      // { to: "/admin/dashboard", icon: <FaHome />, label: "Dashboard" },
      { to: "/admin/treatments", icon: <FaCog />, label: "Treatments" },
      { to: "/admin/doctor-table", icon: <FaUsers />, label: "Doctor Table" },
      { to: "/admin/appointments", icon: <FaUsers />, label: "Doctor Appointments" },
    ],
    []
  );

  // Shared nav list
  const NavList = () => (
    <ul className="space-y-1">
      {links.map((item, idx) => (
        <SidebarLink
          key={`${item.to}-${idx}`}
          to={item.to}
          icon={item.icon}
          label={item.label}
          isCollapsed={isDesktop ? isCollapsed : false}
          currentPath={location.pathname}
          onClick={onNavClick}
        />
      ))}

      {/* Logout (same behavior) */}
      <SidebarLink
        icon={<FaSignOutAlt />}
        label="Logout"
        isCollapsed={isDesktop ? isCollapsed : false}
        onClick={() => {
          handleLogout?.(role);
          onNavClick();
        }}
      />
    </ul>
  );

  return (
    <>
      {/* Desktop: fixed left aside, full height */}
      {isDesktop && (
        <aside
          className={[
            "fixed inset-y-0 left-0 z-40 bg-gray-900 text-white border-r border-white/10",
            "transition-[width] duration-300 ease-out",
            isCollapsed ? "w-20" : "w-64",
          ].join(" ")}
          aria-label="Admin navigation"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-3 bg-gray-950/40">
            <Link to="/admin/dashboard" onClick={onNavClick} className="flex items-center gap-2">
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

            <button
              onClick={toggleCollapse}
              className="hidden lg:inline-flex items-center justify-center h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 ring-1 ring-white/10"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={isCollapsed ? "Expand" : "Collapse"}
            >
              {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
            </button>
          </div>

          {/* Nav */}
          <nav className={["px-2 py-4", isCollapsed ? "" : ""].join(" ")}>
            <NavList />
          </nav>

          {/* Footer */}
          <div className="absolute bottom-0 inset-x-0 px-3 py-3 border-t border-white/10 text-xs text-gray-400">
            {isCollapsed ? (
              <div className="text-center">v1.0</div>
            ) : (
              <div className="flex items-center justify-between">
                <span>v1.0</span>
                <span className="opacity-80">© {new Date().getFullYear()}</span>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* Mobile: slide-in drawer + overlay */}
      {!isDesktop && (
        <>
          {/* Overlay */}
          <div
            className={[
              "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity",
              mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
            ].join(" ")}
            aria-hidden={!mobileOpen}
            onClick={closeMobile}
          />

          {/* Drawer */}
          <div
            className={[
              "fixed inset-y-0 left-0 z-50 w-72 max-w-[85%] bg-gray-900 text-white border-r border-white/10",
              "transition-transform duration-300 ease-out",
              mobileOpen ? "translate-x-0" : "-translate-x-full",
            ].join(" ")}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="flex items-center justify-between px-3 py-3 bg-gray-950/40">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/90 grid place-items-center font-bold">
                  A
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-semibold">Admin</div>
                  <div className="text-[11px] text-gray-400">MEDIPULSO</div>
                </div>
              </div>

              <button
                onClick={closeMobile}
                className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 ring-1 ring-white/10"
                aria-label="Close menu"
              >
                <FiX />
              </button>
            </div>

            <nav className="px-2 py-4">
              <NavList />
            </nav>
          </div>
        </>
      )}
    </>
  );
};

// Sidebar link (active state + tooltips on desktop collapse)
const SidebarLink = ({ to, icon, label, isCollapsed, currentPath = "", onClick }) => {
  const isActive = to ? currentPath === to : false;
  const Wrapper = to ? Link : "button";
  const wrapperProps = to ? { to, onClick } : { onClick, type: "button" };

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

      {/* Tooltip when collapsed (desktop only) */}
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

