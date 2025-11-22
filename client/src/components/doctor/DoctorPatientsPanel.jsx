import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import moment from "moment";
import { HiMiniUsers } from "react-icons/hi2";
import { IoSearch } from "react-icons/io5";
import { FiDownload } from "react-icons/fi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function DoctorPatientsPanel({ doctorId }) {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // UI state
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | active | inactive | new
  const [sortKey, setSortKey] = useState("lastSeen"); // lastSeen | name | visits
  const [sortDir, setSortDir] = useState("desc"); // asc | desc

  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchPatients = useCallback(async () => {
    if (!doctorId) return;
    setLoading(true);
    setErr("");
    try {
      // 1) Try a dedicated endpoint if you have it
      let plist = [];
      try {
        const pRes = await axios.get(
          `${API_BASE_URL}/api/patients/doctor/${doctorId}`,
          { withCredentials: true }
        );
        plist = pRes?.data?.patients || [];
      } catch (e) {
        // ignore; we’ll build from appointments below
      }

      // 2) Always fetch appointments (used for metrics + fallback)
      const aRes = await axios.get(
        `${API_BASE_URL}/api/appointments/doctor/${doctorId}`,
        { withCredentials: true }
      );
      const appts = aRes?.data?.appointments || [];
      setAppointments(appts);

      // 3) Build a unique patient map from either plist or appts
      const map = new Map();

      // seed from patients endpoint (if available)
      plist.forEach((p) => {
        if (!p?._id) return;
        map.set(p._id, {
          _id: p._id,
          firstName: p.firstName || "Patient",
          lastName: p.lastName || "",
          email: p.email || "",
          phoneNumber: p.phoneNumber || "",
          gender: p.gender || "",
          avatar: p.profilePicture || p.avatar || "",
          createdAt: p.createdAt,
          // metrics will be filled from appts
          visits: 0,
          lastSeen: null,
          nextAppt: null,
          upcomingCount: 0,
        });
      });

      // fill/construct from appointments
      appts.forEach((a) => {
        const pat = a?.patient;
        if (!pat?._id) return;
        if (!map.has(pat._id)) {
          map.set(pat._id, {
            _id: pat._id,
            firstName: pat.firstName || "Patient",
            lastName: pat.lastName || "",
            email: pat.email || "",
            phoneNumber: pat.phoneNumber || "",
            gender: pat.gender || "",
            avatar: pat.profilePicture || pat.avatar || "",
            createdAt: pat.createdAt || a.createdAt,
            visits: 0,
            lastSeen: null,
            nextAppt: null,
            upcomingCount: 0,
          });
        }
        const entry = map.get(pat._id);

        // visits
        entry.visits += 1;

        const start = moment(`${moment(a.date).format("YYYY-MM-DD")} ${a.time}`, "YYYY-MM-DD HH:mm");
        if (start.isBefore(moment())) {
          if (!entry.lastSeen || start.isAfter(entry.lastSeen)) entry.lastSeen = start;
        } else {
          entry.upcomingCount += 1;
          if (!entry.nextAppt || start.isBefore(entry.nextAppt)) entry.nextAppt = start;
        }
      });

      // finalize to array + compute status
      const out = Array.from(map.values()).map((p) => {
        const isActive = !!p.nextAppt || (p.lastSeen && moment().diff(p.lastSeen, "days") <= 180);
        const isNew = p.createdAt ? moment(p.createdAt).isSameOrAfter(moment().subtract(30, "days"), "day") : false;
        return { ...p, isActive, isNew };
      });

      setPatients(out);
    } catch (e) {
      console.error(e);
      setErr(e?.response?.data?.message || "Failed to load patients.");
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => { fetchPatients(); }, [fetchPatients]);

  // Derived
  const kpis = useMemo(() => {
    const total = patients.length;
    const active = patients.filter((p) => p.isActive).length;
    const inactive = total - active;
    const new30 = patients.filter((p) => p.isNew).length;
    return { total, active, inactive, new30 };
  }, [patients]);

  const filtered = useMemo(() => {
    let list = [...patients];

    // search
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((p) =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q) ||
        p.phoneNumber?.toLowerCase().includes(q)
      );
    }

    // filter
    if (statusFilter === "active") list = list.filter((p) => p.isActive);
    if (statusFilter === "inactive") list = list.filter((p) => !p.isActive);
    if (statusFilter === "new") list = list.filter((p) => p.isNew);

    // sort
    list.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "name") {
        const an = `${a.firstName} ${a.lastName}`.toLowerCase();
        const bn = `${b.firstName} ${b.lastName}`.toLowerCase();
        if (an < bn) return -1 * dir;
        if (an > bn) return 1 * dir;
        return 0;
      }
      if (sortKey === "visits") {
        return (a.visits - b.visits) * dir;
      }
      // lastSeen default (nulls last)
      const al = a.lastSeen ? a.lastSeen.valueOf() : -Infinity;
      const bl = b.lastSeen ? b.lastSeen.valueOf() : -Infinity;
      return (al - bl) * dir;
    });

    return list;
  }, [patients, query, statusFilter, sortKey, sortDir]);

  const openDetail = (p) => {
    setSelected(p);
    setDetailOpen(true);
  };

  const exportCsv = () => {
    const rows = [
      ["First name", "Last name", "Email", "Phone", "Visits", "Last visit", "Next appt", "Active", "New (30d)"],
      ...filtered.map((p) => [
        p.firstName,
        p.lastName,
        p.email || "",
        p.phoneNumber || "",
        String(p.visits || 0),
        p.lastSeen ? p.lastSeen.format("YYYY-MM-DD HH:mm") : "",
        p.nextAppt ? p.nextAppt.format("YYYY-MM-DD HH:mm") : "",
        p.isActive ? "Yes" : "No",
        p.isNew ? "Yes" : "No",
      ]),
    ];
    const csv = rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `patients-${moment().format("YYYYMMDD-HHmm")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HiMiniUsers className="text-2xl text-[#00b39be6]" />
          <h3 className="text-2xl font-semibold">Patients</h3>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCsv} className="inline-flex items-center gap-2 px-3 py-2 border rounded hover:bg-gray-50">
            <FiDownload /> <span className="text-sm">Export CSV</span>
          </button>
          <button onClick={fetchPatients} className="px-3 py-2 border-[1px] border-[#00b39be6] bg-white rounded hover:bg-gray-50 text-sm">
            Refresh
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi label="Total patients" value={kpis.total} />
        <Kpi label="Active" value={kpis.active} accent="bg-emerald-500" />
        <Kpi label="Inactive" value={kpis.inactive} accent="bg-gray-400" />
        <Kpi label="New (30d)" value={kpis.new30} accent="bg-amber-500" />
      </div>

      {/* Controls */}
      <div className="bg-white border rounded-lg p-3 flex flex-col md:flex-row md:items-center gap-3">
        <div className="relative md:flex-1">
          <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, or phone"
            className="w-full pl-9 pr-3 py-2 border rounded focus:ring-0 focus:border-gray-300"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded px-2 py-2 text-sm"
            title="Filter"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="new">New (30d)</option>
          </select>

          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="border rounded px-2 py-2 text-sm"
            title="Sort by"
          >
            <option value="lastSeen">Last visit</option>
            <option value="name">Name</option>
            <option value="visits">Visits</option>
          </select>

          <select
            value={sortDir}
            onChange={(e) => setSortDir(e.target.value)}
            className="border rounded px-2 py-2 text-sm"
            title="Direction"
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </div>
      </div>

      {/* Table / List */}
      <div className="bg-white border rounded-lg">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading…</div>
        ) : err ? (
          <div className="p-4 text-red-700 bg-red-50">{err}</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No patients found. Try adjusting filters or search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <Th>Patient</Th>
                  <Th>Last visit</Th>
                  <Th>Upcoming</Th>
                  <Th className="text-center">Visits</Th>
                  <Th>Contact</Th>
                  <Th></Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p._id} className="border-t hover:bg-gray-50">
                    <Td>
                      <div className="flex items-center gap-3">
                        <Avatar src={p.avatar} name={`${p.firstName} ${p.lastName}`} />
                        <div>
                          <div className="font-medium">{p.firstName} {p.lastName}</div>
                          <div className="text-xs text-gray-500">
                            {p.isActive ? (
                              <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Active</span>
                            ) : (
                              <span className="inline-block px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">Inactive</span>
                            )}
                            {p.isNew && (
                              <span className="inline-block ml-2 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">New</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      {p.lastSeen ? (
                        <>
                          <div>{p.lastSeen.format("YYYY-MM-DD")}</div>
                          <div className="text-xs text-gray-500">{p.lastSeen.format("HH:mm")}</div>
                        </>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </Td>
                    <Td>
                      {p.nextAppt ? (
                        <>
                          <div>{p.nextAppt.format("YYYY-MM-DD")}</div>
                          <div className="text-xs text-gray-500">{p.nextAppt.format("HH:mm")}</div>
                        </>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </Td>
                    <Td className="text-center">{p.visits || 0}</Td>
                    <Td>
                      <div className="text-xs">
                        <div className="truncate">{p.email || <span className="text-gray-400">—</span>}</div>
                        <div className="truncate">{p.phoneNumber || <span className="text-gray-400">—</span>}</div>
                      </div>
                    </Td>
                    <Td>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => openDetail(p)}
                          className="px-2.5 py-1.5 border rounded hover:bg-gray-50"
                        >
                          Open
                        </button>
                        <button className="px-2.5 py-1.5 border rounded hover:bg-gray-50">
                          Message
                        </button>
                        <button className="px-2.5 py-1.5 bg-[#00b39be6] text-white rounded hover:opacity-90">
                          Book
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail slide-over */}
      {detailOpen && selected && (
        <SlideOver onClose={() => setDetailOpen(false)} title="Patient details">
          <div className="flex items-center gap-3 mb-4">
            <Avatar large src={selected.avatar} name={`${selected.firstName} ${selected.lastName}`} />
            <div>
              <div className="text-lg font-semibold">
                {selected.firstName} {selected.lastName}
              </div>
              <div className="text-sm text-gray-500">{selected.email || "—"} • {selected.photoNumber || "—"}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <Stat label="Visits" value={selected.visits || 0} />
            <Stat label="Upcoming" value={selected.upcomingCount || 0} />
            <Stat label="Last visit" value={selected.lastSeen ? selected.lastSeen.format("YYYY-MM-DD") : "—"} />
            <Stat label="Next appt" value={selected.nextAppt ? selected.nextAppt.format("YYYY-MM-DD") : "—"} />
          </div>

          <h4 className="font-semibold mb-2">Timeline</h4>
          <div className="max-h-72 overflow-auto pr-1">
            {appointments
              .filter((a) => a?.patient?._id === selected._id)
              .sort((a, b) => moment(`${b.date} ${b.time}`) - moment(`${a.date} ${a.time}`))
              .map((a) => {
                const when = moment(`${moment(a.date).format("YYYY-MM-DD")} ${a.time}`, "YYYY-MM-DD HH:mm");
                return (
                  <div key={a._id} className="py-2 border-b last:border-b-0">
                    <div className="flex justify-between text-sm">
                      <div className="font-medium">{when.format("YYYY-MM-DD HH:mm")}</div>
                      <StatusPill status={a.status} />
                    </div>
                    <div className="text-xs text-gray-600 mt-0.5">
                      {a.reason || "—"}
                    </div>
                  </div>
                );
              })}
          </div>
        </SlideOver>
      )}
    </div>
  );
}

/* ---------- bits ---------- */

function Kpi({ label, value, accent = "bg-blue-500" }) {
  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-1 flex items-center gap-2">
        <span className={`inline-block w-2 h-2 rounded-full ${accent}`} />
        <div className="text-2xl font-semibold">{value}</div>
      </div>
    </div>
  );
}

function Th({ children, className = "" }) {
  return <th className={`text-left font-medium px-4 py-3 ${className}`}>{children}</th>;
}
function Td({ children, className = "" }) {
  return <td className={`px-4 py-3 align-top ${className}`}>{children}</td>;
}

function Avatar({ src, name, large }) {
  const initials = (name || "P").split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
  const cls = large ? "w-12 h-12 text-base" : "w-9 h-9 text-sm";
  return src ? (
    <img src={src} alt={name} className={`${cls} rounded-full object-cover`} />
  ) : (
    <div className={`${cls} rounded-full bg-gray-200 text-gray-700 flex items-center justify-center`}>
      {initials}
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-emerald-100 text-emerald-700",
    completed: "bg-indigo-100 text-indigo-700",
    canceled: "bg-rose-100 text-rose-700",
  };
  const cls = map[status] || "bg-gray-100 text-gray-600";
  return <span className={`px-2 py-0.5 rounded-full text-xs ${cls}`}>{status || "—"}</span>;
}

function Stat({ label, value }) {
  return (
    <div className="bg-gray-50 rounded p-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

function SlideOver({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-[9999]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full sm:w-[28rem] bg-white shadow-xl p-4 overflow-auto">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-semibold">{title}</h4>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">Close</button>
        </div>
        {children}
      </div>
    </div>
  );
}
