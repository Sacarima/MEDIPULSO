// src/admin/DoctorTablePro.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import { useTable, useSortBy, usePagination, useRowSelect } from "react-table";
import {
  FiTrash2,
  FiSearch,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiSliders,
  FiDownload,
  FiExternalLink,
  FiX,
  FiCalendar,
  FiMail,
  FiMapPin,
  FiTag,
  FiUser,
} from "react-icons/fi";

// ----------------------------------
// Config / Theme
// ----------------------------------
const THEME = {
  accent: "#00c3a5",
  accentRing: "ring-[##00c3a5]",
};

const RAW_API = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:7500").trim();
const API = RAW_API.replace(/\/+$/, ""); // strip trailing slashes

// Do you have FE route: /profile/:firstName-:lastName/:medicalCategory/:city ?
// If yes, keep true; if not, set to false to fallback to /profile-info/:doctorId
const FRONTEND_PROFILE_SLUG_ROUTE_EXISTS = true;

// ----------------------------------
// Helpers
// ----------------------------------
const slugify = (s = "") =>
  String(s).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function buildDoctorSlugUrl(doc) {
  const fn = slugify(doc.firstName || "");
  const ln = slugify(doc.lastName || "");
  const category = encodeURIComponent(doc.medicalCategory || doc.medicalSpecialtyCategory || "");
  const city = encodeURIComponent(doc.city || "");
  return `/profile/${fn}-${ln}/${category}/${city}`;
}

function buildDoctorIdUrl(doc) {
  return `/profile-info/${doc._id}`;
}

function getPublicProfileUrl(doc) {
  return FRONTEND_PROFILE_SLUG_ROUTE_EXISTS ? buildDoctorSlugUrl(doc) : buildDoctorIdUrl(doc);
}

const Badge = ({ children, tone = "gray" }) => (
  <span
    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${
      tone === "blue"
        ? "bg-blue-50 text-blue-700 border-blue-100"
        : tone === "green"
        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
        : "bg-gray-50 text-gray-700 border-gray-200"
    }`}
  >
    {children}
  </span>
);

const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-3 py-3">
      <div className="h-4 w-4 rounded border" />
    </td>
    <td className="px-3 py-3">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gray-100" />
        <div>
          <div className="h-3 w-28 rounded bg-gray-100" />
          <div className="mt-1 h-3 w-20 rounded bg-gray-100" />
        </div>
      </div>
    </td>
    <td className="px-3 py-3"><div className="h-3 w-24 rounded bg-gray-100" /></td>
    <td className="px-3 py-3"><div className="h-3 w-20 rounded bg-gray-100" /></td>
    <td className="px-3 py-3"><div className="h-3 w-28 rounded bg-gray-100" /></td>
    <td className="px-3 py-3"><div className="h-8 w-24 rounded bg-gray-100" /></td>
  </tr>
);

function IndeterminateCheckbox({ indeterminate, ...rest }) {
  const ref = useRef();
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return (
    <input
      type="checkbox"
      ref={ref}
      className="h-4 w-4 rounded border-gray-300 text-[color:var(--accent-color)] focus:ring-[color:var(--accent-color)]"
      {...rest}
    />
  );
}

// ----------------------------------
// Component
// ----------------------------------
export default function DoctorTablePro() {
  // Expose theme color to CSS (for the checkbox ring)
  useEffect(() => {
    document.documentElement.style.setProperty("--accent-color", THEME.accent);
  }, []);

  // Data
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchErr, setFetchErr] = useState("");

  // Filters & UI
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("all");
  const [category, setCategory] = useState("all");
  const [pageSize, setPageSize] = useState(10);
  const [showColsMenu, setShowColsMenu] = useState(false);

  // Quick View drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [drawerError, setDrawerError] = useState("");
  const [doctorDetail, setDoctorDetail] = useState(null);
  const [doctorAppts, setDoctorAppts] = useState([]);

  // Load data
  const load = async () => {
    try {
      setLoading(true);
      setFetchErr("");
      const res = await fetch(`${API}/api/admin/doctors`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const list = await res.json();
      setDoctors(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error(e);
      setFetchErr("Failed to fetch doctors");
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Derived options
  const cityOptions = useMemo(() => {
    const set = new Set();
    doctors.forEach((d) => d?.city && set.add(d.city));
    return ["all", ...Array.from(set).sort()];
  }, [doctors]);

  const categoryOptions = useMemo(() => {
    const set = new Set();
    // support both keys you used across the app
    doctors.forEach((d) => (d?.medicalCategory || d?.medicalSpecialtyCategory) && set.add(d.medicalCategory || d.medicalSpecialtyCategory));
    return ["all", ...Array.from(set).sort()];
  }, [doctors]);

  // Filtering
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return doctors.filter((d) => {
      const matchQ =
        !q ||
        [d.firstName, d.lastName, d.email, d.medicalCategory || d.medicalSpecialtyCategory, d.city]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q));
      const matchCity = city === "all" || d.city === city;
      const cat = d.medicalCategory || d.medicalSpecialtyCategory;
      const matchCat = category === "all" || cat === category;
      return matchQ && matchCity && matchCat;
    });
  }, [doctors, query, city, category]);

  // Columns
  const columns = useMemo(
    () => [
      {
        id: "selection",
        Header: ({ getToggleAllRowsSelectedProps }) => (
          <div className="pl-1">
            <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
          </div>
        ),
        Cell: ({ row }) => (
          <div className="pl-1">
            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
          </div>
        ),
        disableSortBy: true,
        width: 48,
      },
      {
        Header: "Doctor",
        accessor: (row) => ({
          fullName: `${row.firstName || ""} ${row.lastName || ""}`.trim(),
          profilePicture: row.profilePicture,
          email: row.email,
        }),
        id: "doctor",
        Cell: ({ value }) => (
          <div className="flex items-center gap-3">
            <img
              src={
                value.profilePicture ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              }
              alt={value.fullName || "Doctor"}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="min-w-0">
              <div className="truncate font-medium text-gray-800">
                {value.fullName || "—"}
              </div>
              <div className="truncate text-xs text-gray-500">
                {value.email || "—"}
              </div>
            </div>
          </div>
        ),
      },
      {
        Header: "Specialty",
        accessor: (row) => row.medicalCategory || row.medicalSpecialtyCategory,
        id: "medicalCategory",
        Cell: ({ value }) => (value ? <Badge tone="blue">{value}</Badge> : "—"),
      },
      { Header: "City", accessor: "city", Cell: ({ value }) => (value ? <Badge tone="green">{value}</Badge> : "—") },
      {
        Header: "Created",
        accessor: "createdAt",
        Cell: ({ value }) => (value ? new Date(value).toLocaleDateString() : "—"),
      },
      {
        Header: "Actions",
        id: "actions",
        disableSortBy: true,
        Cell: ({ row }) => {
          const doc = row.original;
          return (
            <div className="flex items-center gap-2">
              <button
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                onClick={() => openQuickView(doc._id)}
                title="Quick view"
              >
                <FiExternalLink />
                View
              </button>
              <a
                href={getPublicProfileUrl(doc)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs"
                style={{ borderColor: THEME.accent, color: THEME.accent }}
                title="Open public profile"
              >
                <FiExternalLink />
                Profile
              </a>
              <button
                className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50"
                onClick={() => handleDeleteOne(doc._id)}
                title="Delete"
              >
                <FiTrash2 />
                Delete
              </button>
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Table
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    gotoPage,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state: tableState,
    setPageSize: setTablePageSize,
    selectedFlatRows,
    allColumns,
  } = useTable(
    {
      columns,
      data: filtered,
      initialState: {
        pageIndex: 0,
        pageSize,
        sortBy: [{ id: "createdAt", desc: true }],
      },
      getRowId: (row) => row._id ?? `${row.firstName}-${row.lastName}`,
      autoResetSelectedRows: true,
    },
    useSortBy,
    usePagination,
    useRowSelect
  );

  useEffect(() => {
    setTablePageSize(pageSize);
  }, [pageSize, setTablePageSize]);

  // Single delete
  const handleDeleteOne = async (id) => {
    const ok = confirm("Delete this doctor? This cannot be undone.");
    if (!ok) return;
    try {
      const res = await fetch(`${API}/api/admin/doctors/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setDoctors((prev) => prev.filter((d) => d._id !== id));
    } catch (e) {
      alert("Failed to delete doctor.");
      console.error(e);
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    const ids = selectedFlatRows.map((r) => r.original._id);
    if (!ids.length) return;
    const ok = confirm(`Delete ${ids.length} selected doctors?`);
    if (!ok) return;
    try {
      await Promise.all(
        ids.map((id) =>
          fetch(`${API}/api/admin/doctors/${id}`, {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          })
        )
      );
      setDoctors((prev) => prev.filter((d) => !ids.includes(d._id)));
    } catch (e) {
      alert("Some deletions failed. Check console.");
      console.error(e);
    }
  };

  // CSV export
  const exportCSV = () => {
    const rows = filtered.map((d) => ({
      id: d._id,
      firstName: d.firstName || "",
      lastName: d.lastName || "",
      email: d.email || "",
      medicalCategory: d.medicalCategory || d.medicalSpecialtyCategory || "",
      city: d.city || "",
      createdAt: d.createdAt || "",
    }));
    const header = Object.keys(
      rows[0] || {
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        medicalCategory: "",
        city: "",
        createdAt: "",
      }
    );
    const csv =
      [header.join(","), ...rows.map((r) => header.map((h) => `"${String(r[h]).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `doctors_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Drawer logic
  const openQuickView = async (doctorId) => {
    setDrawerOpen(true);
    setDrawerLoading(true);
    setDrawerError("");
    setDoctorDetail(null);
    setDoctorAppts([]);

    try {
      const [infoRes, apptRes] = await Promise.all([
        fetch(`${API}/api/doctor-form/profile-info/${doctorId}`, {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }),
        fetch(`${API}/api/admin/appointments/doctor/${doctorId}`, {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }),
      ]);

      if (!infoRes.ok) throw new Error(`Profile HTTP ${infoRes.status}`);
      const info = await infoRes.json();

      let appts = [];
      if (apptRes.ok) {
        const apptJson = await apptRes.json();
        appts = apptJson?.appointments || [];
      }

      setDoctorDetail(info || null);
      setDoctorAppts(appts);
    } catch (e) {
      console.error(e);
      setDrawerError("Failed to load doctor details.");
    } finally {
      setDrawerLoading(false);
    }
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setDoctorDetail(null);
    setDoctorAppts([]);
    setDrawerError("");
  };

  // Counts
  const total = doctors.length;
  const filteredCount = filtered.length;
  const selectedCount = selectedFlatRows.length;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 mb-4 rounded-2xl border border-gray-200 bg-white/90 backdrop-blur p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Doctors</h2>
            <p className="text-xs text-gray-500">
              Total: <strong>{total}</strong> • Filtered: <strong>{filteredCount}</strong> • Selected:{" "}
              <strong>{selectedCount}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, email, city, specialty…"
                className="w-64 rounded-full border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:ring-2"
                style={{ focusRingColor: THEME.accent }}
              />
            </div>

            {/* City */}
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="rounded-full border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[color:var(--accent-color)]"
            >
              {cityOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === "all" ? "All cities" : opt}
                </option>
              ))}
            </select>

            {/* Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-full border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[color:var(--accent-color)]"
            >
              {categoryOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === "all" ? "All specialties" : opt}
                </option>
              ))}
            </select>

            {/* Page size */}
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="rounded-full border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[color:var(--accent-color)]"
            >
              {[10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n} / page
                </option>
              ))}
            </select>

            {/* Column toggles */}
            <div className="relative">
              <button
                onClick={() => setShowColsMenu((s) => !s)}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <FiSliders />
                Columns
              </button>
              {showColsMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-200 bg-white p-2 shadow-lg z-20">
                  {allColumns
                    .filter((c) => c.id !== "selection" && c.id !== "actions")
                    .map((column) => (
                      <label key={column.id} className="flex items-center gap-2 px-2 py-1 text-sm">
                        <input type="checkbox" {...column.getToggleHiddenProps()} />
                        <span className="text-gray-700">{column.Header}</span>
                      </label>
                    ))}
                </div>
              )}
            </div>

            {/* Bulk actions */}
            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              title="Export CSV (filtered)"
            >
              <FiDownload />
              Export
            </button>

            <button
              disabled={!selectedCount}
              onClick={handleBulkDelete}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm ${
                selectedCount
                  ? "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                  : "border border-gray-200 bg-white text-gray-400 cursor-not-allowed"
              }`}
              title="Delete selected"
            >
              <FiTrash2 />
              Delete
            </button>

            {/* Refresh */}
            <button
              onClick={load}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              title="Refresh"
            >
              <FiRefreshCw />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table {...getTableProps()} className="min-w-full">
          <thead className="bg-gray-50">
            {headerGroups.map((headerGroup, i) => (
              <tr key={i} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    key={column.id}
                    {...column.getHeaderProps(column.getSortByToggleProps?.())}
                    className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600"
                  >
                    <div className="inline-flex items-center gap-1 select-none">
                      {column.render("Header")}
                      {column.isSorted ? (
                        <span className="text-gray-400">{column.isSortedDesc ? "▼" : "▲"}</span>
                      ) : null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
              : page.length === 0 ? (
                <tr>
                  <td colSpan={headerGroups[0]?.headers.length || 6} className="py-10 text-center text-gray-500">
                    No doctors match your filters.
                  </td>
                </tr>
              ) : (
                page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr key={row.id} {...row.getRowProps()} className="border-t border-gray-100 hover:bg-gray-50">
                      {row.cells.map((cell) => (
                        <td key={cell.column.id} {...cell.getCellProps()} className="px-3 py-3 text-sm text-gray-700">
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-gray-500">
          Page <strong>{tableState.pageIndex + 1}</strong> of{" "}
          <strong>{pageOptions.length || 1}</strong>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            className="rounded-full border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            First
          </button>
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FiChevronLeft /> Prev
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next <FiChevronRight />
          </button>
          <button
            onClick={() => gotoPage(pageOptions.length - 1)}
            disabled={!canNextPage}
            className="rounded-full border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Last
          </button>
        </div>
      </div>

      {fetchErr && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {fetchErr}
        </div>
      )}

      {/* QUICK VIEW DRAWER */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/30" onClick={closeDrawer} />
          {/* Panel */}
          <div className="absolute right-0 top-0 h-full w-full max-w-lg overflow-y-auto bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-800">Doctor</h3>
              <button
                onClick={closeDrawer}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4">
              {drawerLoading ? (
                <div className="space-y-4">
                  <div className="h-6 w-40 animate-pulse rounded bg-gray-100" />
                  <div className="h-4 w-72 animate-pulse rounded bg-gray-100" />
                  <div className="h-40 w-full animate-pulse rounded bg-gray-100" />
                </div>
              ) : drawerError ? (
                <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {drawerError}
                </div>
              ) : doctorDetail ? (
                <>
                  {/* Header card */}
                  <div className="mb-4 flex items-center gap-4">
                    <img
                      src={
                        doctorDetail?.profilePicture ||
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      }
                      alt="Avatar"
                      className="h-16 w-16 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <div className="truncate text-lg font-semibold text-gray-900">
                        {(doctorDetail?.firstName || "—") + " " + (doctorDetail?.lastName || "")}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                        <span className="inline-flex items-center gap-1">
                          <FiTag /> {doctorDetail?.medicalCategory || doctorDetail?.medicalSpecialtyCategory || "—"}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <FiMapPin /> {doctorDetail?.city || "—"}
                        </span>
                        {doctorDetail?.email && (
                          <a
                            href={`mailto:${doctorDetail.email}`}
                            className="inline-flex items-center gap-1 text-[color:var(--accent-color)] hover:underline"
                          >
                            <FiMail /> {doctorDetail.email}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick stats */}
                  <div className="mb-4 grid grid-cols-3 gap-3">
                    <div className="rounded-xl border border-gray-200 p-3 text-center">
                      <div className="text-xs text-gray-500">Specialty</div>
                      <div className="truncate text-sm font-medium">
                        {doctorDetail?.medicalCategory || doctorDetail?.medicalSpecialtyCategory || "—"}
                      </div>
                    </div>
                    <div className="rounded-xl border border-gray-200 p-3 text-center">
                      <div className="text-xs text-gray-500">City</div>
                      <div className="truncate text-sm font-medium">
                        {doctorDetail?.city || "—"}
                      </div>
                    </div>
                    <div className="rounded-xl border border-gray-200 p-3 text-center">
                      <div className="text-xs text-gray-500">Created</div>
                      <div className="truncate text-sm font-medium">
                        {doctorDetail?.createdAt ? new Date(doctorDetail.createdAt).toLocaleDateString() : "—"}
                      </div>
                    </div>
                  </div>

                  {/* Appointments */}
                  <div className="mb-6">
                    <div className="mb-2 flex items-center gap-2">
                      <FiCalendar className="text-gray-500" />
                      <h4 className="text-sm font-semibold text-gray-800">Appointments (admin)</h4>
                    </div>
                    {doctorAppts?.length ? (
                      <div className="overflow-hidden rounded-xl border border-gray-200">
                        <table className="min-w-full">
                          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                            <tr>
                              <th className="px-3 py-2 text-left">Date</th>
                              <th className="px-3 py-2 text-left">Time</th>
                              <th className="px-3 py-2 text-left">Patient</th>
                              <th className="px-3 py-2 text-left">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {doctorAppts.slice(0, 8).map((a) => (
                              <tr key={a._id} className="border-t text-sm">
                                <td className="px-3 py-2">{new Date(a.date).toLocaleDateString()}</td>
                                <td className="px-3 py-2">{a.time}</td>
                                <td className="px-3 py-2">
                                  <span className="inline-flex items-center gap-1">
                                    <FiUser /> {a?.patient?.firstName || "—"} {a?.patient?.lastName || ""}
                                  </span>
                                </td>
                                <td className="px-3 py-2">
                                  <Badge tone={a.status === "confirmed" ? "green" : "gray"}>{a.status}</Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {doctorAppts.length > 8 && (
                          <div className="bg-gray-50 px-3 py-2 text-xs text-gray-500">
                            Showing 8 of {doctorAppts.length}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-gray-200 p-4 text-sm text-gray-500">
                        No appointments found.
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={getPublicProfileUrl(doctorDetail)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
                      style={{ borderColor: THEME.accent, color: THEME.accent }}
                    >
                      <FiExternalLink />
                      Open public profile
                    </a>
                    <button
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100"
                      onClick={() => handleDeleteOne(doctorDetail._id)}
                    >
                      <FiTrash2 /> Delete doctor
                    </button>
                  </div>
                </>
              ) : (
                <div className="rounded border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
                  Not found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
