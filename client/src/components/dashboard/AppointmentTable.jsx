// src/components/admin/AppointmentTable.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useTable } from 'react-table';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

export default function AppointmentTable({ doctorId: propDoctorId }) {
  const RAW_BASE = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:7500')
  .trim()
  .replace(/\/+$/, ''); // strip trailing slashes


  function computeAdminBase(base) {
  // strip a trailing "/api" if present, then always append "/api/admin"
  const root = base.replace(/\/api$/i, '');
  return `${root}/api/admin`;
}

  const ADMIN_BASE = computeAdminBase(RAW_BASE);

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(propDoctorId || '');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  // Sync internal selection if parent prop changes
  useEffect(() => {
    if (propDoctorId && propDoctorId !== selectedDoctorId) {
      setSelectedDoctorId(propDoctorId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propDoctorId]);

  // Load doctors only if no doctorId was provided
  useEffect(() => {
    if (propDoctorId) return;
    const fetchDoctors = async () => {
      try {
        setFetchError('');
        const url = `${ADMIN_BASE}/doctors`;
        const res = await axios.get(url, { withCredentials: true });
        const list = res.data?.doctors ?? res.data ?? [];
        setDoctors(list);
      } catch (e) {
        console.error('Failed to fetch doctors:', e);
        toast.error(e?.response?.data?.message || 'Failed to load doctors.');
        setFetchError(e?.response?.data?.message || 'Failed to load doctors.');
      }
    };
    fetchDoctors();
  }, [propDoctorId, ADMIN_BASE]);

  // Load appointments whenever we have a selected doctor
  useEffect(() => {
    if (!selectedDoctorId) return;
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setFetchError('');
        const url = `${ADMIN_BASE}/appointments/doctor/${selectedDoctorId}`;
        const res = await axios.get(url, { withCredentials: true });
        setAppointments(res.data?.appointments || []);
      } catch (e) {
        console.error('Error fetching appointments:', e);
        toast.error(e?.response?.data?.message || 'Failed to load appointments.');
        setFetchError(e?.response?.data?.message || 'Failed to load appointments.');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [selectedDoctorId, ADMIN_BASE]);

  // Soft delete (cancel) – keeps history
  const handleCancel = async (appointmentId) => {
    if (!appointmentId) return;
    if (!window.confirm('Cancel this appointment?')) return;

    try {
      await toast.promise(
        axios.patch(
          `${ADMIN_BASE}/appointments/cancel/${appointmentId}`,
          { reason: 'admin canceled' },
          { withCredentials: true }
        ),
        {
          loading: 'Canceling appointment…',
          success: 'Appointment canceled',
          error: 'Cancel failed',
        }
      );
      // update row status locally
      setAppointments((prev) =>
        prev.map((a) => (a._id === appointmentId ? { ...a, status: 'canceled' } : a))
      );
    } catch {
      /* toast.promise already handled UI */
    }
  };

  // Hard delete – removes record
  const handleDelete = async (appointmentId) => {
    if (!appointmentId) return;
    if (!window.confirm('Permanently delete this appointment?')) return;

    try {
      await toast.promise(
        axios.delete(`${ADMIN_BASE}/appointments/${appointmentId}`, {
          withCredentials: true,
        }),
        {
          loading: 'Deleting appointment…',
          success: 'Appointment deleted',
          error: 'Delete failed',
        }
      );
      setAppointments((prev) => prev.filter((a) => a._id !== appointmentId));
    } catch {
      /* toast.promise already handled UI */
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Patient',
        accessor: (row) =>
          `${row?.patient?.firstName || ''} ${row?.patient?.lastName || ''}`.trim(),
      },
      { Header: 'Date', accessor: (row) => row?.date },
      { Header: 'Time', accessor: (row) => row?.time },
      { Header: 'Status', accessor: 'status' },
      {
        Header: 'Actions',
        Cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleCancel(row.original._id)}
              className="px-3 py-1 rounded bg-amber-500 text-white hover:bg-amber-600"
              title="Cancel (soft delete)"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(row.original._id)}
              className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
              title="Delete (hard delete)"
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: appointments });

  return (
    <div className="space-y-4">
      {/* Local toaster (or move one global <Toaster /> to App.jsx) */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Doctor picker only if no prop doctorId */}
      {!propDoctorId && (
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-700">Select doctor:</label>
          <select
            className="border rounded px-2 py-1"
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
          >
            <option value="">— choose —</option>
            {doctors.map((d) => (
              <option key={d._id} value={d._id}>
                {d.firstName} {d.lastName}
                {d.medicalSpecialtyCategory ? ` — ${d.medicalSpecialtyCategory}` : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      {fetchError && <div className="text-red-600 text-sm">{fetchError}</div>}

      {!selectedDoctorId ? (
        <div className="text-gray-600">Pick a doctor to view appointments.</div>
      ) : (
        <div className="overflow-x-auto">
          {loading && <div className="p-2 text-gray-600">Loading…</div>}
          <table {...getTableProps()} className="min-w-full table-auto">
            <thead>
              {headerGroups.map((hg) => (
                <tr {...hg.getHeaderGroupProps()} className="bg-gray-100">
                  {hg.headers.map((col) => (
                    <th
                      {...col.getHeaderProps()}
                      className="p-2 text-left font-semibold whitespace-nowrap"
                    >
                      {col.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className="border-b">
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()} className="p-2 whitespace-nowrap">
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                );
              })}
              {!loading && rows.length === 0 && (
                <tr>
                  <td
                    className="p-3 text-gray-500"
                    colSpan={headerGroups[0]?.headers?.length || 5}
                  >
                    No appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {!loading && rows.length > 0 && (
            <div className="text-sm text-gray-500 mt-2">
              {rows.length} appointment{rows.length === 1 ? '' : 's'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
