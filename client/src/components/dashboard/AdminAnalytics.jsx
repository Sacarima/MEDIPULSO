// src/admin/AdminAnalytics.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import {
  BiCalendar,
  BiBarChartAlt2,
  BiUser,
  BiTime,
  BiTrendingUp,
  BiRefresh,
} from "react-icons/bi";

const API = import.meta.env.VITE_API_BASE_URL;

// ----- Small UI atoms -------------------------------------------------------
const Card = ({ title, subtitle, right, children }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
    <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">{title}</h3>
        {subtitle ? <p className="text-xs text-gray-500">{subtitle}</p> : null}
      </div>
      {right}
    </div>
    {children}
  </div>
);

const Kpi = ({ icon: Icon, label, value, hint }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        <Icon className="text-xl" />
      </div>
      <div>
        <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
        <div className="text-xl font-semibold text-gray-800">{value}</div>
        {hint ? <div className="text-xs text-gray-500">{hint}</div> : null}
      </div>
    </div>
  </div>
);

const RangeButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`rounded-full px-3 py-1 text-sm border transition ${
      active
        ? "border-blue-300 bg-blue-50 text-blue-700"
        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
    }`}
  >
    {children}
  </button>
);

// ----- Helpers --------------------------------------------------------------
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const fmtDayKey = (d) => startOfDay(new Date(d)).toISOString().slice(0, 10);

function enumerateDays(from, to) {
  const days = [];
  const cur = startOfDay(new Date(from));
  const end = startOfDay(new Date(to));
  while (cur <= end) {
    days.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

const groupCountByDay = (items, getDate, filterFn = () => true) => {
  const map = new Map();
  for (const it of items) {
    if (!filterFn(it)) continue;
    const key = fmtDayKey(getDate(it));
    map.set(key, (map.get(key) || 0) + 1);
  }
  return map;
};

const statusPalette = {
  pending: "#94a3b8",
  confirmed: "#22c55e",
  canceled: "#ef4444",
  completed: "#3b82f6",
};

// Limit parallel fetches (for per-doctor appointments)
async function pMap(items, mapper, concurrency = 5) {
  const ret = [];
  let i = 0;
  const runners = new Array(concurrency).fill(0).map(async () => {
    while (i < items.length) {
      const idx = i++;
      // eslint-disable-next-line no-await-in-loop
      ret[idx] = await mapper(items[idx], idx);
    }
  });
  await Promise.all(runners);
  return ret;
}

// ----- Main component -------------------------------------------------------
export default function AdminAnalytics() {
  // Pull admin/user from store (your app keeps admin either in admin slice or user slice)
  const admin =
    useSelector((s) => s?.admin?.currentAdmin) ||
    useSelector((s) => s?.user?.currentUser) ||
    null;

  const controllerRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [overview, setOverview] = useState(null); // { totalUsers, totalDoctors, totalClinics, totalAppointments }
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appts, setAppts] = useState([]); // flattened appointments (across doctors)
  const [error, setError] = useState("");

  // Date range
  const [rangeKey, setRangeKey] = useState("30d"); // '7d' | '30d' | '90d' | 'ytd'
  const { from, to } = useMemo(() => {
    const now = new Date();
    const end = now;
    const pick = (days) => new Date(now.getFullYear(), now.getMonth(), now.getDate() - (days - 1));
    switch (rangeKey) {
      case "7d":
        return { from: pick(7), to: end };
      case "30d":
        return { from: pick(30), to: end };
      case "90d":
        return { from: pick(90), to: end };
      case "ytd":
        return { from: new Date(now.getFullYear(), 0, 1), to: end };
      default:
        return { from: pick(30), to: end };
    }
  }, [rangeKey]);

  // Fetch
  useEffect(() => {
    if (!admin) return;
    setLoading(true);
    setError("");
    controllerRef.current?.abort();
    const ac = new AbortController();
    controllerRef.current = ac;

    const safe = async (path, opts) => {
      const res = await fetch(`${API}${path}`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        signal: ac.signal,
        ...opts,
      });
      if (!res.ok) throw new Error(`GET ${path} -> ${res.status}`);
      return res.json();
    };

    (async () => {
      try {
        // 1) overview counts
        const ov = await safe(`/api/admin/dashboard`);

        // 2) users & doctors lists (no passwords)
        const [usersList, doctorsList] = await Promise.all([
          safe(`/api/admin/users`),
          safe(`/api/admin/doctors`),
        ]);

        // 3) appointments: we don’t have “get all” route, so aggregate per doctor
        //    Optimized with limited concurrency to avoid hammering the API
        const doctorIds = (doctorsList || []).map((d) => d._id);
        const perDoctor = await pMap(
          doctorIds,
          async (id) => {
            try {
              const r = await safe(`/api/admin/appointments/doctor/${id}`);
              // controller returns {success, appointments: [...]}
              return r?.appointments || [];
            } catch {
              return [];
            }
          },
          5
        );

        const flat = perDoctor.flat();

        setOverview(ov?.data || ov);
        setUsers(usersList || []);
        setDoctors(doctorsList || []);
        setAppts(flat);
      } catch (e) {
        console.error(e);
        setError("Failed to load analytics. Please try again.");
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [admin]);

  // Filter by date range on the client
  const usersInRange = useMemo(() => {
    const f = startOfDay(from).getTime();
    const t = startOfDay(to).getTime();
    return users.filter((u) => {
      const created = u?.createdAt ? startOfDay(new Date(u.createdAt)).getTime() : NaN;
      return !Number.isNaN(created) && created >= f && created <= t;
    });
  }, [users, from, to]);

  const apptsInRange = useMemo(() => {
    const f = startOfDay(from).getTime();
    const t = startOfDay(to).getTime();
    return appts.filter((a) => {
      // Appointment model stores `date` as Date; some code compares strings — normalize here.
      const d = a?.date ? startOfDay(new Date(a.date)).getTime() : NaN;
      return !Number.isNaN(d) && d >= f && d <= t;
    });
  }, [appts, from, to]);

  // KPIs
  const kpiUsers = usersInRange.length;
  const kpiAppts = apptsInRange.length;
  const kpiCanceled = apptsInRange.filter((a) => a.status === "canceled").length;
  const cancelRate = kpiAppts ? Math.round((kpiCanceled / kpiAppts) * 100) : 0;

  const activeDoctorIds = new Set(apptsInRange.map((a) => String(a.doctor)));
  const kpiActiveDoctors = activeDoctorIds.size;

  // Users line (daily)
  const userDailySeries = useMemo(() => {
    const base = groupCountByDay(usersInRange, (u) => new Date(u.createdAt));
    return enumerateDays(from, to).map((d) => ({
      day: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      count: base.get(fmtDayKey(d)) || 0,
    }));
  }, [usersInRange, from, to]);

  // Appointments stacked by status per day
  const apptDailySeries = useMemo(() => {
    const days = enumerateDays(from, to);
    const byStatus = {
      pending: groupCountByDay(apptsInRange, (a) => a.date, (a) => a.status === "pending"),
      confirmed: groupCountByDay(apptsInRange, (a) => a.date, (a) => a.status === "confirmed"),
      canceled: groupCountByDay(apptsInRange, (a) => a.date, (a) => a.status === "canceled"),
      completed: groupCountByDay(apptsInRange, (a) => a.date, (a) => a.status === "completed"),
    };
    return days.map((d) => {
      const key = fmtDayKey(d);
      return {
        day: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        pending: byStatus.pending.get(key) || 0,
        confirmed: byStatus.confirmed.get(key) || 0,
        canceled: byStatus.canceled.get(key) || 0,
        completed: byStatus.completed.get(key) || 0,
      };
    });
  }, [apptsInRange, from, to]);

  // Status breakdown
  const statusBreakdown = useMemo(() => {
    const counts = { pending: 0, confirmed: 0, canceled: 0, completed: 0 };
    for (const a of apptsInRange) counts[a.status] = (counts[a.status] || 0) + 1;
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [apptsInRange]);

  // Top doctors (by confirmed+pending appointments in range)
  const topDoctors = useMemo(() => {
    const scoreMap = new Map(); // doctorId -> score
    for (const a of apptsInRange) {
      if (a.status === "pending" || a.status === "confirmed") {
        const id = String(a.doctor);
        scoreMap.set(id, (scoreMap.get(id) || 0) + 1);
      }
    }
    const rows = Array.from(scoreMap.entries())
      .map(([id, value]) => {
        const doc = doctors.find((d) => String(d._id) === id);
        const name =
          (doc?.firstName || "Doctor") + " " + (doc?.lastName || "");
        return { id, name: name.trim() || id, value };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
    return rows;
  }, [apptsInRange, doctors]);

  // ----- Render --------------------------------------------------------------
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Analytics</h1>
          <p className="text-sm text-gray-500">
            Usage, appointments, and growth — filtered by date range.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <RangeButton active={rangeKey === "7d"} onClick={() => setRangeKey("7d")}>
            7d
          </RangeButton>
          <RangeButton active={rangeKey === "30d"} onClick={() => setRangeKey("30d")}>
            30d
          </RangeButton>
          <RangeButton active={rangeKey === "90d"} onClick={() => setRangeKey("90d")}>
            90d
          </RangeButton>
          <RangeButton active={rangeKey === "ytd"} onClick={() => setRangeKey("ytd")}>
            YTD
          </RangeButton>
          <button
            onClick={() => window.location.reload()}
            className="ml-2 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
            title="Refresh"
          >
            <BiRefresh />
            Refresh
          </button>
        </div>
      </div>

      {/* Errors / Loading */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Kpi icon={BiUser} label="Users" value={kpiUsers} hint={`in range`} />
        <Kpi icon={BiCalendar} label="Appointments" value={kpiAppts} hint={`in range`} />
        <Kpi icon={BiTime} label="Cancellation rate" value={`${cancelRate}%`} />
        <Kpi icon={BiTrendingUp} label="Active doctors" value={kpiActiveDoctors} hint="with bookings in range" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Users over time */}
        <Card
          title="Daily signups"
          subtitle="New users created per day"
          right={<span className="text-xs text-gray-400">{usersInRange.length} total in range</span>}
        >
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userDailySeries}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  fill="url(#g1)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Appointments stacked by status */}
        <Card
          title="Appointments by day"
          subtitle="Stacked by status"
          right={<span className="text-xs text-gray-400">{kpiAppts} total in range</span>}
        >
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={apptDailySeries}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="confirmed" stackId="a" fill={statusPalette.confirmed} />
                <Bar dataKey="pending" stackId="a" fill={statusPalette.pending} />
                <Bar dataKey="canceled" stackId="a" fill={statusPalette.canceled} />
                <Bar dataKey="completed" stackId="a" fill={statusPalette.completed} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Status breakdown */}
        <Card title="Status breakdown" subtitle="Share of appointments by status">
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip />
                <Legend />
                <Pie
                  data={statusBreakdown}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={45}
                  outerRadius={75}
                >
                  {statusBreakdown.map((entry) => (
                    <Cell key={entry.name} fill={statusPalette[entry.name]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Top doctors & trend */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card title="Top doctors" subtitle="Most bookings (pending + confirmed)">
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topDoctors}
                layout="vertical"
                margin={{ left: 24, right: 12 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={120} />
                <Tooltip />
                <Bar dataKey="value" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card
          title="Appointments trend"
          subtitle="All statuses (line)"
          right={<BiBarChartAlt2 className="text-gray-400" />}
        >
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={apptDailySeries}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="confirmed" stroke={statusPalette.confirmed} strokeWidth={2} />
                <Line type="monotone" dataKey="pending" stroke={statusPalette.pending} strokeWidth={2} />
                <Line type="monotone" dataKey="canceled" stroke={statusPalette.canceled} strokeWidth={2} />
                <Line type="monotone" dataKey="completed" stroke={statusPalette.completed} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Overview card (from your /api/admin/dashboard) */}
        <Card title="Overview (all-time)" subtitle="From server dashboard endpoint">
          <ul className="grid grid-cols-2 gap-3 text-sm">
            <li className="rounded-lg border border-gray-200 p-3">
              <div className="text-gray-500">Users</div>
              <div className="font-semibold text-gray-800">
                {overview?.totalUsers ?? "—"}
              </div>
            </li>
            <li className="rounded-lg border border-gray-200 p-3">
              <div className="text-gray-500">Doctors</div>
              <div className="font-semibold text-gray-800">
                {overview?.totalDoctors ?? "—"}
              </div>
            </li>
            <li className="rounded-lg border border-gray-200 p-3">
              <div className="text-gray-500">Clinics</div>
              <div className="font-semibold text-gray-800">
                {overview?.totalClinics ?? "—"}
              </div>
            </li>
            <li className="rounded-lg border border-gray-200 p-3">
              <div className="text-gray-500">Appointments</div>
              <div className="font-semibold text-gray-800">
                {overview?.totalAppointments ?? "—"}
              </div>
            </li>
          </ul>
        </Card>
      </div>

      {loading && (
        <div className="mt-6 text-center text-sm text-gray-500">Loading…</div>
      )}
    </div>
  );
}
