

import { useEffect, useMemo, useState } from "react";
import { Modal, Button } from "flowbite-react";
import { toast } from "react-hot-toast";
import {
  FiSearch,
  FiRefreshCw,
  FiDownload,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiEdit2,
  FiX,
  FiAlertTriangle,
  FiLoader,
} from "react-icons/fi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ---------- Small UI helpers ----------
const StatusBadge = ({ status = "pending" }) => {
  const map = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-emerald-100 text-emerald-800",
    completed: "bg-sky-100 text-sky-800",
    canceled: "bg-rose-100 text-rose-800",
  };
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${map[status] || "bg-gray-100 text-gray-700"}`}>
      {label}
    </span>
  );
};

const SectionCard = ({ title, actions, className = "", children }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${className}`}>
    <div className="flex items-center justify-between p-4 border-b">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="flex items-center gap-2">{actions}</div>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

const EmptyState = ({ icon, title, subtitle, action }) => (
  <div className="text-center py-12">
    <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
      {icon}
    </div>
    <h3 className="mt-4 text-gray-900 font-semibold">{title}</h3>
    {subtitle ? <p className="mt-1 text-sm text-gray-500">{subtitle}</p> : null}
    {action ? <div className="mt-6">{action}</div> : null}
  </div>
);

const LoadingSkeleton = () => (
  <div className="space-y-2">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />
    ))}
  </div>
);

// ---------- Modals ----------
function CancelModal({ open, onClose, onConfirm, loading }) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!open) setReason("");
  }, [open]);

  return (
    <Modal show={open} onClose={loading ? undefined : onClose} size="md" popup>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <FiAlertTriangle className="mx-auto mb-4 w-12 h-12 text-rose-500" />
          <h3 className="text-lg font-semibold">Cancel appointment?</h3>
          <p className="text-sm text-gray-500 mt-1">You can optionally add a reason.</p>
        </div>
        <div className="mt-4">
          <label className="text-sm text-gray-700">Reason (optional)</label>
          <textarea
            className="mt-1 w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-[#00c3a5] focus:border-[#00c3a5]"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button color="gray" onClick={onClose} disabled={!!loading}>
            Close
          </Button>
          <Button color="failure" onClick={() => onConfirm(reason)} disabled={!!loading}>
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <FiLoader className="animate-spin" /> Canceling…
              </span>
            ) : (
              "Cancel appointment"
            )}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

function RescheduleModal({ open, onClose, onConfirm, loading, bookedForDay = [] }) {
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  useEffect(() => {
    if (!open) {
      setNewDate("");
      setNewTime("");
    }
  }, [open]);

  const warnBooked = newDate && bookedForDay.includes(newTime);

  return (
    <Modal show={open} onClose={loading ? undefined : onClose} size="md" popup>
      <Modal.Header />
      <Modal.Body>
        <h3 className="text-lg font-semibold text-center">Reschedule appointment</h3>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-700">New date</label>
            <input
              type="date"
              className="mt-1 w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-[#00c3a5] focus:border-[#00c3a5]"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-700">New time (HH:mm)</label>
            <input
              type="time"
              className="mt-1 w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-[#00c3a5] focus:border-[#00c3a5]"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              required
            />
          </div>
        </div>
        {warnBooked && (
          <p className="mt-3 text-xs text-rose-600">
            This time appears to be booked. Choose a different slot.
          </p>
        )}
        <p className="mt-3 text-xs text-gray-500">
          The server will validate availability (working days and allowed times).
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button color="gray" onClick={onClose} disabled={!!loading}>
            Close
          </Button>
          <Button
            onClick={() => onConfirm({ newDate, newTime })}
            disabled={!!loading || !newDate || !newTime || warnBooked}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <FiLoader className="animate-spin" /> Rescheduling…
              </span>
            ) : (
              "Reschedule"
            )}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

// ---------- Main component ----------
export default function DoctorAppointmentsdashboard({ doctorId, pageSize = 10 }) {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [booked, setBooked] = useState({});
  const [error, setError] = useState(null);

  // UI state
  const [tab, setTab] = useState("upcoming"); // 'upcoming' | 'all' | 'past'
  const [statusFilter, setStatusFilter] = useState("any"); // 'any' | 'pending' | 'confirmed' | 'completed' | 'canceled'
  const [query, setQuery] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);

  // action state
  const [actingId, setActingId] = useState(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [rescheduleBookedDay, setRescheduleBookedDay] = useState([]);

  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const headersAuth = token ? { Authorization: `Bearer ${token}` } : {};

  // fetch data
  const fetchAll = async () => {
    if (!doctorId) return;
    try {
      setLoading(true);
      setError(null);

      // Appointments for doctor
      const res = await fetch(`${API_BASE_URL}/api/appointments/doctor/${doctorId}`, {
        credentials: "include",
        headers: { "Content-Type": "application/json", ...headersAuth },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load appointments");
      setAppointments(data?.appointments ?? []);

      // Booked slots (public)
      const res2 = await fetch(`${API_BASE_URL}/api/appointments/doctor/${doctorId}/slots/public`, {
        headers: { "Content-Type": "application/json" },
      });
      const data2 = await res2.json();
      setBooked(res2.ok && data2?.success ? data2.booked ?? {} : {});
    } catch (err) {
      const msg = err?.message || "Failed to load appointments";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId]);

  const isPast = (d, t) => {
    if (!d) return false;
    const dt = new Date(`${d}T${(t ?? "00:00")}:00`);
    return dt.getTime() < Date.now();
  };

  // filtered + sorted view
  const filtered = useMemo(() => {
    let arr = [...appointments];

    // logical tab
    arr = arr.filter((a) => {
      const past = isPast(a.date, a.time);
      if (tab === "upcoming") return !past && a.status !== "canceled";
      if (tab === "past") return past || a.status === "completed";
      return true; // all
    });

    // status filter
    if (statusFilter !== "any") {
      arr = arr.filter((a) => a.status === statusFilter);
    }

    // date range
    if (from) arr = arr.filter((a) => a.date >= from);
    if (to) arr = arr.filter((a) => a.date <= to);

    // search (patient name/email or reason)
    const q = query.trim().toLowerCase();
    if (q) {
      arr = arr.filter((a) => {
        const p = a.patient ?? {};
        const name = `${p.firstName ?? ""} ${p.lastName ?? ""}`.toLowerCase();
        const email = (p.email ?? "").toLowerCase();
        return (
          name.includes(q) ||
          email.includes(q) ||
          (a.reason ?? "").toLowerCase().includes(q)
        );
      });
    }

    // sort by date+time ascending
    arr.sort((a, b) => {
      const da = new Date(`${a.date}T${(a.time ?? "00:00")}:00`).getTime();
      const db = new Date(`${b.date}T${(b.time ?? "00:00")}:00`).getTime();
      return da - db;
    });

    return arr;
  }, [appointments, tab, statusFilter, from, to, query]);

  // pagination
  const size = Math.max(1, pageSize);
  const totalPages = Math.max(1, Math.ceil(filtered.length / size));
  const pageData = filtered.slice((page - 1) * size, page * size);
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  // actions (renamed from setStatus to avoid clash)
  const updateApptStatus = async (appointmentId, newStatus) => {
    try {
      setActingId(appointmentId);
      const res = await fetch(`${API_BASE_URL}/api/appointments/${appointmentId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...headersAuth },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to update status");
      toast.success(`Marked as ${newStatus}`);
      setAppointments((prev) =>
        prev.map((a) => (a._id === appointmentId ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      toast.error(err?.message || "Error updating status");
    } finally {
      setActingId(null);
    }
  };

  const openCancel = (appointmentId) => {
    setActingId(appointmentId);
    setCancelOpen(true);
  };

  const confirmCancel = async (reason) => {
    try {
      const id = actingId;
      if (!id) return;
      const res = await fetch(`${API_BASE_URL}/api/appointments/cancel/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...headersAuth },
        credentials: "include",
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to cancel");
      toast.success("Appointment canceled");
      setAppointments((prev) =>
        prev.map((a) =>
          a._id === id
            ? {
                ...a,
                status: "canceled",
                cancelReason: reason || a.cancelReason,
                canceledAt: new Date().toISOString(),
              }
            : a
        )
      );
    } catch (err) {
      toast.error(err?.message || "Error canceling appointment");
    } finally {
      setCancelOpen(false);
      setActingId(null);
    }
  };

  const openReschedule = (appointmentId, date) => {
    setActingId(appointmentId);
    setRescheduleBookedDay(booked?.[date] ?? []);
    setRescheduleOpen(true);
  };

  const confirmReschedule = async ({ newDate, newTime }) => {
    try {
      const id = actingId;
      if (!id) return;
      const res = await fetch(`${API_BASE_URL}/api/appointments/reschedule/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...headersAuth },
        credentials: "include",
        body: JSON.stringify({ newDate, newTime }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to reschedule");
      toast.success("Appointment rescheduled");
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, date: newDate, time: newTime } : a))
      );
      setRescheduleOpen(false);
      setActingId(null);
      fetchAll();
    } catch (err) {
      toast.error(err?.message || "Error rescheduling");
    }
  };

  const exportCSV = () => {
    const cols = ["Date", "Time", "Status", "Patient", "Email", "Reason"];
    const rows = filtered.map((a) => [
      a.date,
      a.time ?? "",
      a.status,
      `${a.patient?.firstName ?? ""} ${a.patient?.lastName ?? ""}`.trim(),
      a.patient?.email ?? "",
      (a.reason ?? "").replace(/\n/g, " "),
    ]);
    const csv = [cols, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `appointments-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---------- UI ----------
  return (
    <div className="space-y-6">
      <SectionCard
        title="Appointments"
        actions={
          <>
            <button
              onClick={fetchAll}
              className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
              title="Refresh"
            >
              <FiRefreshCw /> Refresh
            </button>
            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
              title="Export CSV"
            >
              <FiDownload /> Export
            </button>
          </>
        }
      >
        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Tabs */}
          <div className="lg:col-span-4 inline-flex rounded-xl bg-gray-100 p-1">
            {[
              { key: "upcoming", label: "Upcoming" },
              { key: "all", label: "All" },
              { key: "past", label: "Past" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm ${
                  tab === key ? "bg-white shadow-sm font-semibold" : "text-gray-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="lg:col-span-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
              <input
                className="w-full rounded-xl border pl-9 pr-3 py-2 text-sm border-gray-300 focus:ring-2 focus:ring-[#00c3a5] focus:border-[#00c3a5]"
                placeholder="Search patient or reason…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Status filter */}
          <div className="lg:col-span-2">
            <select
              className="w-full rounded-xl border px-3 py-2 text-sm border-gray-300 focus:ring-2 focus:ring-[#00c3a5] focus:border-[#00c3a5]"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="any">Any status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>

          {/* Date range */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-2">
            <input
              type="date"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border px-3 py-2 text-sm border-gray-300 focus:ring-2 focus:ring-[#00c3a5] focus:border-[#00c3a5]"
              placeholder="From"
            />
            <input
              type="date"
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border px-3 py-2 text-sm border-gray-300 focus:ring-2 focus:ring-[#00c3a5] focus:border-[#00c3a5]"
              placeholder="To"
            />
          </div>
        </div>

        {/* List */}
        <div className="mt-4">
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <EmptyState
              icon={<FiAlertTriangle />}
              title="Couldn’t load appointments"
              subtitle={error}
              action={
                <button
                  onClick={fetchAll}
                  className="rounded-xl bg-[#00c3a5] text-white px-4 py-2 text-sm hover:bg-[#00b39b]"
                >
                  Try again
                </button>
              }
            />
          ) : pageData.length === 0 ? (
            <EmptyState icon={<FiCalendar />} title="No appointments" subtitle="Try adjusting filters or date range." />
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="py-2">Patient</th>
                      <th className="py-2">Date</th>
                      <th className="py-2">Time</th>
                      <th className="py-2">Reason</th>
                      <th className="py-2">Status</th>
                      <th className="py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageData.map((a) => {
                      const name = `${a.patient?.firstName ?? ""} ${a.patient?.lastName ?? ""}`.trim() || "—";
                      const email = a.patient?.email ?? "—";
                      const past = isPast(a.date, a.time);

                      return (
                        <tr key={a._id} className="border-b last:border-none">
                          <td className="py-3">
                            <div className="font-medium">{name}</div>
                            <div className="text-xs text-gray-500">{email}</div>
                          </td>
                          <td className="py-3">{a.date}</td>
                          <td className="py-3">{a.time ?? "—"}</td>
                          <td className="py-3 max-w-[24rem] truncate">{a.reason ?? "—"}</td>
                          <td className="py-3"><StatusBadge status={a.status} /></td>
                          <td className="py-3">
                            <div className="flex items-center gap-2 justify-end">
                              {a.status === "pending" && (
                                <button
                                  onClick={() => updateApptStatus(a._id, "confirmed")}
                                  disabled={actingId === a._id}
                                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 border text-xs hover:bg-gray-50"
                                  title="Confirm"
                                >
                                  {actingId === a._id ? (
                                    <>
                                      <FiLoader className="animate-spin" /> Confirming…
                                    </>
                                  ) : (
                                    <>
                                      <FiCheckCircle /> Confirm
                                    </>
                                  )}
                                </button>
                              )}
                              {a.status === "confirmed" && !past && (
                                <button
                                  onClick={() => openReschedule(a._id, a.date)}
                                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 border text-xs hover:bg-gray-50"
                                  title="Reschedule"
                                >
                                  <FiEdit2 /> Reschedule
                                </button>
                              )}
                              {a.status !== "canceled" && a.status !== "completed" && (
                                <button
                                  onClick={() => openCancel(a._id)}
                                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 border text-xs hover:bg-gray-50 text-rose-600"
                                  title="Cancel"
                                >
                                  <FiX /> Cancel
                                </button>
                              )}
                              {a.status === "confirmed" && past && (
                                <button
                                  onClick={() => updateApptStatus(a._id, "completed")}
                                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 border text-xs hover:bg-gray-50"
                                  title="Complete"
                                >
                                  <FiCheckCircle /> Complete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-3">
                {pageData.map((a) => {
                  const name = `${a.patient?.firstName ?? ""} ${a.patient?.lastName ?? ""}`.trim() || "—";
                  const email = a.patient?.email ?? "—";
                  const past = isPast(a.date, a.time);

                  return (
                    <div key={a._id} className="rounded-2xl border p-3">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{name}</div>
                        <StatusBadge status={a.status} />
                      </div>
                      <div className="mt-1 text-xs text-gray-500">{email}</div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="text-gray-400" />
                          <span>{a.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiClock className="text-gray-400" />
                          <span>{a.time ?? "—"}</span>
                        </div>
                      </div>
                      {a.reason && <div className="mt-2 text-sm text-gray-700 line-clamp-3">{a.reason}</div>}

                      <div className="mt-3 flex items-center gap-2">
                        {a.status === "pending" && (
                          <button
                            onClick={() => updateApptStatus(a._id, "confirmed")}
                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 border text-xs"
                          >
                            <FiCheckCircle /> Confirm
                          </button>
                        )}
                        {a.status === "confirmed" && !past && (
                          <button
                            onClick={() => openReschedule(a._id, a.date)}
                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 border text-xs"
                          >
                            <FiEdit2 /> Reschedule
                          </button>
                        )}
                        {a.status !== "canceled" && a.status !== "completed" && (
                          <button
                            onClick={() => openCancel(a._id)}
                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 border text-xs text-rose-600"
                          >
                            <FiX /> Cancel
                          </button>
                        )}
                        {a.status === "confirmed" && past && (
                          <button
                            onClick={() => updateApptStatus(a._id, "completed")}
                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 border text-xs"
                          >
                            <FiCheckCircle /> Complete
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Page {page} of {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
                      disabled={page === 1}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
                      disabled={page === totalPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </SectionCard>

      {/* Modals */}
      <CancelModal
        open={cancelOpen}
        onClose={() => {
          setCancelOpen(false);
          setActingId(null);
        }}
        onConfirm={confirmCancel}
        loading={cancelOpen && !!actingId}
      />
      <RescheduleModal
        open={rescheduleOpen}
        onClose={() => {
          setRescheduleOpen(false);
          setActingId(null);
        }}
        onConfirm={confirmReschedule}
        loading={rescheduleOpen && !!actingId}
        bookedForDay={rescheduleBookedDay}
      />
    </div>
  );
}
