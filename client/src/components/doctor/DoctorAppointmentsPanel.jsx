// DoctorAppointmentsPanel.jsx
import { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";
import moment from "moment";
import Modal from "react-modal";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const statusColor = (s) => {
  switch (s) {
    case "pending": return "bg-amber-100 text-amber-800 border border-amber-300";
    case "confirmed": return "bg-teal-100 text-teal-800 border border-teal-300";
    case "canceled": return "bg-red-100 text-red-800 border border-red-300 line-through";
    case "completed": return "bg-blue-100 text-blue-800 border border-blue-300";
    default: return "bg-gray-100 text-gray-700 border border-gray-300";
  }
};

export default function DoctorAppointmentsPanel({ doctorId }) {
  // react-modal accessibility binding
  useEffect(() => {
    Modal.setAppElement("#root"); // adjust if your root id differs
  }, []);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // filters / search / pagination
  const [statusFilter, setStatusFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // modals
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [reschedOpen, setReschedOpen] = useState(false);

  // selection + form state
  const [selected, setSelected] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const fetchAppointments = useCallback(async () => {
    if (!doctorId) return;
    setLoading(true);
    setErr("");
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/appointments/doctor/${doctorId}`,
        { withCredentials: true }
      );
      setAppointments(res.data.appointments || []);
    } catch (e) {
      console.error(e);
      setErr(e?.response?.data?.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  // counters
  const counts = useMemo(() => {
    const by = (s) => appointments.filter(a => a.status === s).length;
    return {
      total: appointments.length,
      pending: by("pending"),
      confirmed: by("confirmed"),
      canceled: by("canceled"),
      completed: by("completed"),
    };
  }, [appointments]);

  // client-side filter/search (you can move this server-side later if needed)
  const filtered = useMemo(() => {
    return appointments.filter(appt => {
      if (statusFilter !== "all" && appt.status !== statusFilter) return false;

      const dateStr = moment(appt.date).format("YYYY-MM-DD");
      if (dateFrom && moment(dateStr).isBefore(moment(dateFrom))) return false;
      if (dateTo && moment(dateStr).isAfter(moment(dateTo))) return false;

      const patientName = [
        appt?.patient?.firstName || "",
        appt?.patient?.lastName || ""
      ].join(" ").trim().toLowerCase();

      const q = query.trim().toLowerCase();
      if (q && !patientName.includes(q) && !dateStr.includes(q)) return false;

      return true;
    });
  }, [appointments, statusFilter, query, dateFrom, dateTo]);

  // sorting (optional): newest first by date+time
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aDT = moment(`${moment(a.date).format("YYYY-MM-DD")} ${a.time}`, "YYYY-MM-DD HH:mm").valueOf();
      const bDT = moment(`${moment(b.date).format("YYYY-MM-DD")} ${b.time}`, "YYYY-MM-DD HH:mm").valueOf();
      return bDT - aDT;
    });
  }, [filtered]);

  // pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  useEffect(() => { setPage(1); }, [statusFilter, query, dateFrom, dateTo, pageSize]);

  // Actions
  const openDetails = (appt) => { setSelected(appt); setDetailsOpen(true); };
  const openCancel = (appt) => { setSelected(appt); setCancelReason(""); setCancelOpen(true); };
  const openReschedule = (appt) => {
    setSelected(appt);
    setNewDate(moment(appt.date).format("YYYY-MM-DD"));
    setNewTime(appt.time);
    setReschedOpen(true);
  };

  const confirmAppointment = async (appt) => {
    if (!appt) return;
    try {
      await axios.patch(
        `${API_BASE_URL}/api/appointments/${appt._id}/status`,
        { status: "confirmed" },
        { withCredentials: true }
      );
      await fetchAppointments();
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Failed to confirm");
    }
  };

  const cancelAppointment = async () => {
    if (!selected) return;
    try {
      await axios.patch(
        `${API_BASE_URL}/api/appointments/cancel/${selected._id}`,
        { reason: cancelReason },
        { withCredentials: true }
      );
      setCancelOpen(false);
      await fetchAppointments();
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Failed to cancel");
    }
  };

  const rescheduleAppointment = async () => {
    if (!selected || !newDate || !newTime) return;
    const when = moment(`${newDate} ${newTime}`, "YYYY-MM-DD HH:mm");
    if (when.isBefore(moment())) {
      alert("Pick a future date/time.");
      return;
    }
    try {
      await axios.put(
        `${API_BASE_URL}/api/appointments/reschedule/${selected._id}`,
        { newDate, newTime },
        { withCredentials: true }
      );
      setReschedOpen(false);
      await fetchAppointments();
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "Failed to reschedule");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Appointments</h3>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="px-3 py-1 rounded-full bg-gray-100 border text-gray-700">All: {counts.total}</span>
          <span className="px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-800">Pending: {counts.pending}</span>
          <span className="px-3 py-1 rounded-full bg-teal-100 border border-teal-300 text-teal-800">Confirmed: {counts.confirmed}</span>
          <span className="px-3 py-1 rounded-full bg-red-100 border border-red-300 text-red-800">Canceled: {counts.canceled}</span>
          <span className="px-3 py-1 rounded-full bg-blue-100 border border-blue-300 text-blue-800">Completed: {counts.completed}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
        <input
          className="md:col-span-2 border rounded px-3 py-2 text-sm"
          placeholder="Search by patient or date (YYYY-MM-DD)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="border rounded px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="canceled">Canceled</option>
          <option value="completed">Completed</option>
        </select>
        <input
          type="date"
          className="border rounded px-3 py-2 text-sm"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
        />
        <input
          type="date"
          className="border rounded px-3 py-2 text-sm"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-3 py-2 text-left">Patient</th>
              <th className="px-3 py-2 text-left">Date</th>
              <th className="px-3 py-2 text-left">Time</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Reason</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} className="px-3 py-6 text-center text-gray-500">Loading…</td></tr>
            )}
            {err && !loading && (
              <tr><td colSpan={6} className="px-3 py-6 text-center text-red-600">{err}</td></tr>
            )}
            {!loading && !err && pageItems.length === 0 && (
              <tr><td colSpan={6} className="px-3 py-6 text-center text-gray-500">No appointments found.</td></tr>
            )}
            {pageItems.map((a) => {
              const dateStr = moment(a.date).format("YYYY-MM-DD");
              const patientName = [a?.patient?.firstName, a?.patient?.lastName].filter(Boolean).join(" ") || "Patient";
              return (
                <tr key={a._id} className="border-t">
                  <td className="px-3 py-2">{patientName}</td>
                  <td className="px-3 py-2">{dateStr}</td>
                  <td className="px-3 py-2">{a.time}</td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${statusColor(a.status)}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 max-w-[220px] truncate" title={a.reason || ""}>
                    {a.reason || "—"}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex justify-end gap-2">
                      <button className="px-2 py-1 border rounded" onClick={() => openDetails(a)}>View</button>
                      {a.status === "pending" && (
                        <button className="px-2 py-1 border rounded bg-teal-600 text-white" onClick={() => confirmAppointment(a)}>
                          Confirm
                        </button>
                      )}
                      {(a.status === "pending" || a.status === "confirmed") && (
                        <>
                          <button className="px-2 py-1 border rounded bg-blue-600 text-white" onClick={() => openReschedule(a)}>
                            Reschedule
                          </button>
                          <button className="px-2 py-1 border rounded bg-red-600 text-white" onClick={() => openCancel(a)}>
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Page {page} of {totalPages} • Showing {pageItems.length} of {sorted.length}
        </div>
        <div className="flex items-center gap-2">
          <select
            className="border rounded px-2 py-1 text-sm"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[10, 20, 50].map(n => <option key={n} value={n}>{n}/page</option>)}
          </select>
          <div className="flex gap-1">
            <button disabled={page <= 1} className="px-2 py-1 border rounded disabled:opacity-50" onClick={() => setPage(p => p - 1)}>Prev</button>
            <button disabled={page >= totalPages} className="px-2 py-1 border rounded disabled:opacity-50" onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={detailsOpen}
        onRequestClose={() => setDetailsOpen(false)}
        contentLabel="Appointment Details"
        className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-[10000]"
      >
        {selected && (
          <div>
            <h4 className="text-lg font-semibold mb-3">Appointment Details</h4>
            <p><strong>Patient:</strong> {[selected?.patient?.firstName, selected?.patient?.lastName].filter(Boolean).join(" ") || "Patient"}</p>
            <p><strong>Date:</strong> {moment(selected.date).format("YYYY-MM-DD")}</p>
            <p><strong>Time:</strong> {selected.time}</p>
            <p><strong>Status:</strong> {selected.status}</p>
            <p><strong>Reason:</strong> {selected.reason || "—"}</p>
            <p><strong>Notes:</strong> {selected.specialNotes || "—"}</p>
            {/* Optional extras if you have them: consultationType, duration, price, paymentStatus, location */}
            <div className="mt-4 flex justify-end">
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setDetailsOpen(false)}>Close</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Cancel Modal */}
      <Modal
        isOpen={cancelOpen}
        onRequestClose={() => setCancelOpen(false)}
        contentLabel="Cancel Appointment"
        className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-[10000]"
      >
        <h4 className="text-lg font-semibold mb-2">Cancel appointment</h4>
        <p className="text-sm text-gray-600 mb-3">You can provide a reason (optional).</p>
        <textarea
          rows={4}
          className="w-full p-2 border rounded mb-4"
          placeholder="Reason for cancellation"
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setCancelOpen(false)}>Back</button>
          <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={cancelAppointment}>Confirm Cancel</button>
        </div>
      </Modal>

      {/* Reschedule Modal */}
      <Modal
        isOpen={reschedOpen}
        onRequestClose={() => setReschedOpen(false)}
        contentLabel="Reschedule Appointment"
        className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-[10000]"
      >
        <h4 className="text-lg font-semibold mb-3">Reschedule</h4>
        <label className="block text-sm mb-1">New date</label>
        <input type="date" className="w-full p-2 border rounded mb-3" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
        <label className="block text-sm mb-1">New time</label>
        <input type="time" className="w-full p-2 border rounded mb-4" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setReschedOpen(false)}>Cancel</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={rescheduleAppointment}>Confirm</button>
        </div>
      </Modal>
    </div>
  );
}
