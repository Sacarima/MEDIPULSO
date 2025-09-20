import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FiSearch,
  FiDownload,
  FiTrash2,
  FiUsers,
  FiUser,
  FiUserCheck,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiMail,
  FiPhone,
  FiCalendar,
  FiFilter,
  FiX,
  FiCopy,
} from "react-icons/fi";



const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// -----------------------------
// Utility helpers
// -----------------------------
const classNames = (...arr) => arr.filter(Boolean).join(" ");

const formatDate = (iso) => {
  try {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "—";
  }
};

const csvEscape = (val) => {
  if (val == null) return "";
  const s = String(val);
  if (s.includes(",") || s.includes("\n") || s.includes('"')) {
    return '"' + s.replaceAll('"', '""') + '"';
  }
  return s;
};

const exportToCSV = (rows, filename = "users.csv") => {
  const header = [
    "id",
    "email",
    "firstName",
    "lastName",
    "role",
    "isAdmin",
    "phoneNumber",
    "createdAt",
    "updatedAt",
  ];
  const data = rows.map((r) => [
    r._id,
    r.email,
    r.firstName,
    r.lastName,
    r.role,
    r.isAdmin ? "true" : "false",
    r.phoneNumber,
    r.createdAt,
    r.updatedAt,
  ]);

  const csv = [header, ...data]
    .map((row) => row.map(csvEscape).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// -----------------------------
// Small UI atoms
// -----------------------------
const StatCard = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50">
      <Icon className="text-teal-600" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-semibold text-gray-800">{value ?? "—"}</p>
    </div>
  </div>
);

const Badge = ({ children }) => (
  <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-600">
    {children}
  </span>
);

const PillButton = ({ children, onClick, variant = "ghost", disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={classNames(
      "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm transition-all",
      disabled && "opacity-50 cursor-not-allowed",
      variant === "ghost" &&
        "border-gray-200 text-gray-700 hover:bg-gray-50",
      variant === "primary" &&
        "border-teal-600 bg-teal-600 text-white hover:bg-teal-700",
      variant === "danger" &&
        "border-red-600 bg-red-600 text-white hover:bg-red-700"
    )}
  >
    {children}
  </button>
);

const Divider = () => <div className="h-px w-full bg-gray-200" />;

// -----------------------------
// Confirm Dialog
// -----------------------------
const ConfirmDialog = ({ open, title, description, confirmText, onCancel, onConfirm, loading }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button onClick={onCancel} className="rounded-full p-1 hover:bg-gray-100">
            <FiX />
          </button>
        </div>
        <p className="mb-5 text-sm text-gray-600">{description}</p>
        <div className="flex justify-end gap-2">
          <PillButton onClick={onCancel}>Cancel</PillButton>
          <PillButton variant="danger" onClick={onConfirm} disabled={loading}>
            {loading ? (
              <span className="inline-flex items-center gap-2"><FiRefreshCw className="animate-spin" /> Working…</span>
            ) : (
              confirmText || "Delete"
            )}
          </PillButton>
        </div>
      </div>
    </div>
  );
};

// -----------------------------
// Drawer (slideover)
// -----------------------------
const Drawer = ({ open, onClose, user }) => {
  return (
    <div
      className={classNames(
        "fixed inset-0 z-40 transition-opacity",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
    >
      {/* backdrop */}
      <div
        onClick={onClose}
        className={classNames(
          "absolute inset-0 bg-black/40 transition-opacity",
          open ? "opacity-100" : "opacity-0"
        )}
      />

      {/* panel */}
      <aside
        className={classNames(
          "absolute right-0 top-0 h-full w-full max-w-md transform bg-white shadow-xl transition-transform",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-800">User details</h3>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-gray-100">
            <FiX />
          </button>
        </div>

        {user ? (
          <div className="space-y-4 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl">
                <FiUser />
              </div>
              <div>
                <div className="text-base font-medium text-gray-800">
                  {user.firstName || "—"} {user.lastName || ""}
                </div>
                <div className="text-sm text-gray-500">Role: {user.role || "user"}</div>
              </div>
            </div>

            <Divider />

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <FiMail /> {user.email || "—"}
                </div>
                <CopyButton text={user.email} />
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <FiPhone /> {user.phoneNumber || "—"}
                </div>
                <CopyButton text={user.phoneNumber} />
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiCalendar /> Created: {formatDate(user.createdAt)}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiCalendar /> Updated: {formatDate(user.updatedAt)}
              </div>
              <div className="pt-2">
                <Badge>{user.isAdmin ? "Admin" : "Standard"}</Badge>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 text-sm text-gray-500">No user selected.</div>
        )}
      </aside>
    </div>
  );
};

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(String(text ?? ""));
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        } catch {}
      }}
      className="rounded-full border border-gray-200 p-1 text-xs text-gray-600 hover:bg-gray-50"
    >
      {copied ? "Copied" : <FiCopy />}
    </button>
  );
};

// -----------------------------
// Main component
// -----------------------------
export default function AdminUsersPanel() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ui state
  const [q, setQ] = useState("");
  const [role, setRole] = useState("ALL");
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc"); // 'asc' | 'desc'
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState(new Set());

  const [drawerUser, setDrawerUser] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const deletingIdsRef = useRef([]);

  // toast
  const [toast, setToast] = useState(null);
  const showToast = (msg, tone = "success") => {
    setToast({ msg, tone });
    setTimeout(() => setToast(null), 2500);
  };

  // fetch stats + users
  useEffect(() => {
    let abort = new AbortController();
    const run = async () => {
      try {
        setLoading(true);
        setError("");

        const [dashRes, usersRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/admin/dashboard`, {
            credentials: "include",
            signal: abort.signal,
          }),
          fetch(`${API_BASE_URL}/api/admin/users`, {
            credentials: "include",
            signal: abort.signal,
          }),
        ]);

        if (!dashRes.ok) throw new Error(`Dashboard ${dashRes.status}`);
        if (!usersRes.ok) throw new Error(`Users ${usersRes.status}`);

        const dash = await dashRes.json();
        const list = await usersRes.json();
        setStats(dash?.data || null);
        setUsers(Array.isArray(list) ? list : []);
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    };

    run();
    return () => abort.abort();
  }, []);

  // derived list
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let rows = users;

    if (needle) {
      rows = rows.filter((u) => {
        return (
          String(u.email || "").toLowerCase().includes(needle) ||
          String(u.firstName || "").toLowerCase().includes(needle) ||
          String(u.lastName || "").toLowerCase().includes(needle) ||
          String(u.phoneNumber || "").toLowerCase().includes(needle)
        );
      });
    }

    if (role !== "ALL") {
      rows = rows.filter((u) => String(u.role || "user") === role);
    }

    const dir = sortDir === "asc" ? 1 : -1;
    rows = [...rows].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (sortKey === "createdAt" || sortKey === "updatedAt") {
        return (new Date(av).getTime() - new Date(bv).getTime()) * dir;
      }
      return String(av).localeCompare(String(bv)) * dir;
    });

    return rows;
  }, [users, q, role, sortKey, sortDir]);

  // pagination
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageSafe = Math.min(page, pageCount);
  const start = (pageSafe - 1) * pageSize;
  const end = start + pageSize;
  const pageRows = filtered.slice(start, end);

  // selection
  const allVisibleSelected = pageRows.length > 0 && pageRows.every((r) => selected.has(r._id));
  const toggleAllVisible = () => {
    const next = new Set(selected);
    if (allVisibleSelected) {
      pageRows.forEach((r) => next.delete(r._id));
    } else {
      pageRows.forEach((r) => next.add(r._id));
    }
    setSelected(next);
  };

  const toggleOne = (id) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const confirmBulkDelete = () => {
    if (selected.size === 0) return;
    deletingIdsRef.current = Array.from(selected);
    setConfirmOpen(true);
  };

  const confirmSingleDelete = (id) => {
    deletingIdsRef.current = [id];
    setConfirmOpen(true);
  };

  const executeDelete = async () => {
    const ids = deletingIdsRef.current || [];
    if (ids.length === 0) return;

    try {
      setConfirmLoading(true);
      for (const id of ids) {
        // eslint-disable-next-line no-await-in-loop
        const res = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (!res.ok) throw new Error(`Delete ${id} -> ${res.status}`);
      }

      setUsers((prev) => prev.filter((u) => !ids.includes(u._id)));
      setSelected(new Set());
      showToast(`${ids.length} user${ids.length > 1 ? "s" : ""} deleted`);
    } catch (e) {
      showToast(e.message || "Delete failed", "error");
    } finally {
      setConfirmLoading(false);
      setConfirmOpen(false);
      deletingIdsRef.current = [];
    }
  };

  const resetFilters = () => {
    setQ("");
    setRole("ALL");
    setSortKey("createdAt");
    setSortDir("desc");
    setPage(1);
    setPageSize(10);
  };

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6">
      {/* header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500">Manage your platform users with search, filters, bulk actions and exports.</p>
        </div>
        <div className="flex items-center gap-2">
          <PillButton onClick={() => exportToCSV(filtered)}>
            <FiDownload /> Export CSV
          </PillButton>
          <PillButton variant="danger" onClick={confirmBulkDelete} disabled={selected.size === 0}>
            <FiTrash2 /> Delete selected
          </PillButton>
        </div>
      </div>

      {/* stats */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FiUsers} label="Total users" value={stats?.totalUsers} />
        <StatCard icon={FiUserCheck} label="Doctors" value={stats?.totalDoctors} />
        <StatCard icon={FiUser} label="Clinics" value={stats?.totalClinics} />
        <StatCard icon={FiCalendar} label="Appointments" value={stats?.totalAppointments} />
      </div>

      {/* controls */}
      <div className="mb-4 grid grid-cols-1 gap-3 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <div className="relative">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, email, phone…"
              className="w-full rounded-xl border border-gray-200 py-2 pl-10 pr-3 text-sm outline-none ring-0 placeholder:text-gray-400 focus:border-teal-600"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 lg:col-span-6 lg:justify-end">
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-500" />
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-teal-600"
            >
              <option value="ALL">All roles</option>
              <option value="user">User</option>
              <option value="doctor">Doctor</option>
              <option value="clinic">Clinic</option>
            </select>
          </div>

          <select
            value={`${sortKey}:${sortDir}`}
            onChange={(e) => {
              const [k, d] = e.target.value.split(":");
              setSortKey(k);
              setSortDir(d);
            }}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-teal-600"
          >
            <option value="createdAt:desc">Newest</option>
            <option value="createdAt:asc">Oldest</option>
            <option value="email:asc">Email A→Z</option>
            <option value="email:desc">Email Z→A</option>
            <option value="firstName:asc">First name A→Z</option>
            <option value="firstName:desc">First name Z→A</option>
          </select>

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-teal-600"
          >
            <option value={10}>10 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
          </select>

          <PillButton onClick={resetFilters}>
            <FiRefreshCw /> Reset
          </PillButton>
        </div>
      </div>

      {/* table / cards */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {/* Desktop table */}
        <div className="hidden md:block">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  <input type="checkbox" checked={allVisibleSelected} onChange={toggleAllVisible} />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Created</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-10 text-center text-sm text-gray-500">
                    Loading users…
                  </td>
                </tr>
              ) : pageRows.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-10 text-center text-sm text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                pageRows.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/60">
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.has(u._id)} onChange={() => toggleOne(u._id)} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                          <FiUser className="text-gray-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {u.firstName || "—"} {u.lastName || ""}
                          </div>
                          <div className="text-xs text-gray-500">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <Badge>{u.isAdmin ? "admin" : u.role || "user"}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{u.phoneNumber || "—"}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <PillButton onClick={() => setDrawerUser(u)}>View</PillButton>
                        <PillButton variant="danger" onClick={() => confirmSingleDelete(u._id)}>
                          <FiTrash2 /> Delete
                        </PillButton>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden">
          {loading ? (
            <div className="p-6 text-center text-sm text-gray-500">Loading users…</div>
          ) : pageRows.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-500">No users found.</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {pageRows.map((u) => (
                <li key={u._id} className="flex items-center gap-3 p-4">
                  <input
                    type="checkbox"
                    checked={selected.has(u._id)}
                    onChange={() => toggleOne(u._id)}
                    className="mt-0.5"
                  />
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-gray-100">
                    <FiUser className="text-gray-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-gray-900">
                      {u.firstName || "—"} {u.lastName || ""}
                    </div>
                    <div className="truncate text-xs text-gray-500">{u.email}</div>
                    <div className="mt-1 text-xs text-gray-500">{u.phoneNumber || "—"}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge>{u.isAdmin ? "admin" : u.role || "user"}</Badge>
                    <div className="flex gap-2">
                      <PillButton onClick={() => setDrawerUser(u)}>View</PillButton>
                      <PillButton variant="danger" onClick={() => confirmSingleDelete(u._id)}>
                        <FiTrash2 />
                      </PillButton>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-700">{filtered.length === 0 ? 0 : start + 1}</span>
          –<span className="font-medium text-gray-700">{Math.min(end, filtered.length)}</span> of
          <span className="ml-1 font-medium text-gray-700">{filtered.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={pageSafe <= 1}
          >
            <FiChevronLeft />
          </button>
          <span className="text-sm text-gray-700">
            Page <span className="font-medium">{pageSafe}</span> / {pageCount}
          </span>
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            disabled={pageSafe >= pageCount}
          >
            <FiChevronRight />
          </button>
        </div>
      </div>

      {/* drawer & confirm */}
      <Drawer open={!!drawerUser} onClose={() => setDrawerUser(null)} user={drawerUser} />
      <ConfirmDialog
        open={confirmOpen}
        title="Delete user(s)?"
        description="This action cannot be undone. The selected user(s) will be permanently removed."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={executeDelete}
        loading={confirmLoading}
      />

      {/* toast */}
      {toast && (
        <div
          className={classNames(
            "fixed bottom-6 right-6 z-50 rounded-xl px-4 py-2 shadow-lg",
            toast.tone === "error"
              ? "border border-red-200 bg-red-50 text-red-700"
              : "border border-teal-200 bg-teal-50 text-teal-700"
          )}
        >
          {toast.msg}
        </div>
      )}

      {/* error state */}
      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
