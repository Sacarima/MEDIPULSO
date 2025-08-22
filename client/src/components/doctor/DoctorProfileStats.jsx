// src/components/doctor/DoctorProfileStats.jsx
import { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";
import moment from "moment";
import {
  ResponsiveContainer,
  AreaChart, Area,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function DoctorProfileStats({ doctorId }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const fetchAppointments = useCallback(async () => {
    if (!doctorId) return;
    setLoading(true);
    setErr("");
    try {
      const res = await axios.get(`${API_BASE_URL}/api/appointments/doctor/${doctorId}`, { withCredentials: true });
      setAppointments(res.data.appointments || []);
    } catch (e) {
      console.error(e);
      setErr(e?.response?.data?.message || "Failed to load statistics.");
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  // ---- Derived stats ----
  const last30 = useMemo(
    () => appointments.filter(a => moment(a.date).isSameOrAfter(moment().subtract(30, "days"), "day")),
    [appointments]
  );

  const kpis = useMemo(() => {
    const by = (arr, s) => arr.filter(a => a.status === s).length;
    return {
      pending: by(last30, "pending"),
      confirmed: by(last30, "confirmed"),
      canceled: by(last30, "canceled"),
      completed: by(last30, "completed"),
    };
  }, [last30]);

  // Weekly trend (last 12 weeks)
  const weeklyTrend = useMemo(() => {
    const start = moment().startOf("isoWeek").subtract(11, "weeks");
    const buckets = Array.from({ length: 12 }, (_, i) => ({
      label: start.clone().add(i, "weeks").format("DD MMM"),
      weekStart: start.clone().add(i, "weeks"),
      weekEnd: start.clone().add(i, "weeks").endOf("isoWeek"),
      count: 0,
    }));
    appointments.forEach(a => {
      const d = moment(a.date);
      const b = buckets.find(b => d.isBetween(b.weekStart, b.weekEnd, "day", "[]"));
      if (b) b.count += 1;
    });
    return buckets;
  }, [appointments]);

  // Top reasons (from appointment.reason)
  const topReasons = useMemo(() => {
    const map = new Map();
    appointments.forEach(a => {
      const key = (a.reason || "").trim();
      if (!key) return;
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([reason, count]) => ({ reason, count }));
  }, [appointments]);

  // Upcoming workload by weekday
  const byWeekday = useMemo(() => {
    const arr = [
      { day: "Mon", count: 0 },
      { day: "Tue", count: 0 },
      { day: "Wed", count: 0 },
      { day: "Thu", count: 0 },
      { day: "Fri", count: 0 },
      { day: "Sat", count: 0 },
      { day: "Sun", count: 0 },
    ];
    const now = moment();
    appointments.forEach(a => {
      const d = moment(a.date);
      if (d.isAfter(now, "day") && (a.status === "pending" || a.status === "confirmed")) {
        const idx = (d.isoWeekday() + 6) % 7; // 1..7 -> 0..6
        arr[idx].count += 1;
      }
    });
    return arr;
  }, [appointments]);

  return (
    <div className="space-y-6 md:p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold">Profile statistics</h3>
        <button onClick={fetchAppointments} className="px-3 py-1.5 text-sm border-[1px] borer-[#00b39be6] bg-white rounded hover:bg-gray-50 shadow-lg">
          Refresh
        </button>
      </div>

      {loading && <div className="flex items-center justify-center py-10 text-gray-500">Loading…</div>}
      {err && !loading && <div className="p-3 bg-red-100 text-red-700 rounded">{err}</div>}

      {!loading && !err && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KpiCard label="Pending (30d)" value={kpis.pending} />
            <KpiCard label="Confirmed (30d)" value={kpis.confirmed} />
            <KpiCard label="Canceled (30d)" value={kpis.canceled} />
            <KpiCard label="Completed (30d)" value={kpis.completed} />
          </div>

          {/* Weekly bookings trend */}
          <section className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">Bookings — last 12 weeks</h4>
              <span className="text-xs text-gray-500">
                Total: {weeklyTrend.reduce((s,b)=>s+b.count,0)}
              </span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyTrend} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="url(#colorBookings)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Top reasons */}
            <section className="bg-white rounded-lg border p-4">
              <h4 className="font-semibold mb-3">Top reasons / treatments</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[...topReasons].reverse()} // show top at bottom in vertical layout
                    layout="vertical"
                    margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis type="category" dataKey="reason" width={120} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10b981" radius={[4, 4, 4, 4]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Workload by weekday */}
            <section className="bg-white rounded-lg border p-4">
              <h4 className="font-semibold mb-3">Upcoming workload by weekday</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byWeekday} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Appointments" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

function KpiCard({ label, value }) {
  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}
