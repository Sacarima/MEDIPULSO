// // src/components/admin/AppointmentTable.jsx
// import React, { useEffect, useMemo, useState } from 'react';
// import { useTable } from 'react-table';
// import axios from 'axios';
// import { Toaster, toast } from 'react-hot-toast';

// export default function AppointmentTable({ doctorId: propDoctorId }) {
//   const RAW_BASE = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:7500')
//   .trim()
//   .replace(/\/+$/, ''); // strip trailing slashes


//   function computeAdminBase(base) {
//   // strip a trailing "/api" if present, then always append "/api/admin"
//   const root = base.replace(/\/api$/i, '');
//   return `${root}/api/admin`;
// }

//   const ADMIN_BASE = computeAdminBase(RAW_BASE);

//   const [doctors, setDoctors] = useState([]);
//   const [selectedDoctorId, setSelectedDoctorId] = useState(propDoctorId || '');
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [fetchError, setFetchError] = useState('');

//   // Sync internal selection if parent prop changes
//   useEffect(() => {
//     if (propDoctorId && propDoctorId !== selectedDoctorId) {
//       setSelectedDoctorId(propDoctorId);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [propDoctorId]);

//   // Load doctors only if no doctorId was provided
//   useEffect(() => {
//     if (propDoctorId) return;
//     const fetchDoctors = async () => {
//       try {
//         setFetchError('');
//         const url = `${ADMIN_BASE}/doctors`;
//         const res = await axios.get(url, { withCredentials: true });
//         const list = res.data?.doctors ?? res.data ?? [];
//         setDoctors(list);
//       } catch (e) {
//         console.error('Failed to fetch doctors:', e);
//         toast.error(e?.response?.data?.message || 'Failed to load doctors.');
//         setFetchError(e?.response?.data?.message || 'Failed to load doctors.');
//       }
//     };
//     fetchDoctors();
//   }, [propDoctorId, ADMIN_BASE]);

//   // Load appointments whenever we have a selected doctor
//   useEffect(() => {
//     if (!selectedDoctorId) return;
//     const fetchAppointments = async () => {
//       try {
//         setLoading(true);
//         setFetchError('');
//         const url = `${ADMIN_BASE}/appointments/doctor/${selectedDoctorId}`;
//         const res = await axios.get(url, { withCredentials: true });
//         setAppointments(res.data?.appointments || []);
//       } catch (e) {
//         console.error('Error fetching appointments:', e);
//         toast.error(e?.response?.data?.message || 'Failed to load appointments.');
//         setFetchError(e?.response?.data?.message || 'Failed to load appointments.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAppointments();
//   }, [selectedDoctorId, ADMIN_BASE]);

//   // Soft delete (cancel) – keeps history
//   const handleCancel = async (appointmentId) => {
//     if (!appointmentId) return;
//     if (!window.confirm('Cancel this appointment?')) return;

//     try {
//       await toast.promise(
//         axios.patch(
//           `${ADMIN_BASE}/appointments/cancel/${appointmentId}`,
//           { reason: 'admin canceled' },
//           { withCredentials: true }
//         ),
//         {
//           loading: 'Canceling appointment…',
//           success: 'Appointment canceled',
//           error: 'Cancel failed',
//         }
//       );
//       // update row status locally
//       setAppointments((prev) =>
//         prev.map((a) => (a._id === appointmentId ? { ...a, status: 'canceled' } : a))
//       );
//     } catch {
//       /* toast.promise already handled UI */
//     }
//   };

//   // Hard delete – removes record
//   const handleDelete = async (appointmentId) => {
//     if (!appointmentId) return;
//     if (!window.confirm('Permanently delete this appointment?')) return;

//     try {
//       await toast.promise(
//         axios.delete(`${ADMIN_BASE}/appointments/${appointmentId}`, {
//           withCredentials: true,
//         }),
//         {
//           loading: 'Deleting appointment…',
//           success: 'Appointment deleted',
//           error: 'Delete failed',
//         }
//       );
//       setAppointments((prev) => prev.filter((a) => a._id !== appointmentId));
//     } catch {
//       /* toast.promise already handled UI */
//     }
//   };

//   const columns = useMemo(
//     () => [
//       {
//         Header: 'Patient',
//         accessor: (row) =>
//           `${row?.patient?.firstName || ''} ${row?.patient?.lastName || ''}`.trim(),
//       },
//       { Header: 'Date', accessor: (row) => row?.date },
//       { Header: 'Time', accessor: (row) => row?.time },
//       { Header: 'Status', accessor: 'status' },
//       {
//         Header: 'Actions',
//         Cell: ({ row }) => (
//           <div className="flex gap-2">
//             <button
//               onClick={() => handleCancel(row.original._id)}
//               className="px-3 py-1 rounded bg-amber-500 text-white hover:bg-amber-600"
//               title="Cancel (soft delete)"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={() => handleDelete(row.original._id)}
//               className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
//               title="Delete (hard delete)"
//             >
//               Delete
//             </button>
//           </div>
//         ),
//       },
//     ],
//     []
//   );

//   const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
//     useTable({ columns, data: appointments });

//   return (
//     <div className="space-y-4">
//       {/* Local toaster (or move one global <Toaster /> to App.jsx) */}
//       <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

//       {/* Doctor picker only if no prop doctorId */}
//       {!propDoctorId && (
//         <div className="flex items-center gap-3">
//           <label className="text-sm text-gray-700">Select doctor:</label>
//           <select
//             className="border rounded px-2 py-1"
//             value={selectedDoctorId}
//             onChange={(e) => setSelectedDoctorId(e.target.value)}
//           >
//             <option value="">— choose —</option>
//             {doctors.map((d) => (
//               <option key={d._id} value={d._id}>
//                 {d.firstName} {d.lastName}
//                 {d.medicalSpecialtyCategory ? ` — ${d.medicalSpecialtyCategory}` : ''}
//               </option>
//             ))}
//           </select>
//         </div>
//       )}

//       {fetchError && <div className="text-red-600 text-sm">{fetchError}</div>}

//       {!selectedDoctorId ? (
//         <div className="text-gray-600">Pick a doctor to view appointments.</div>
//       ) : (
//         <div className="overflow-x-auto">
//           {loading && <div className="p-2 text-gray-600">Loading…</div>}
//           <table {...getTableProps()} className="min-w-full table-auto">
//             <thead>
//               {headerGroups.map((hg) => (
//                 <tr {...hg.getHeaderGroupProps()} className="bg-gray-100">
//                   {hg.headers.map((col) => (
//                     <th
//                       {...col.getHeaderProps()}
//                       className="p-2 text-left font-semibold whitespace-nowrap"
//                     >
//                       {col.render('Header')}
//                     </th>
//                   ))}
//                 </tr>
//               ))}
//             </thead>
//             <tbody {...getTableBodyProps()}>
//               {rows.map((row) => {
//                 prepareRow(row);
//                 return (
//                   <tr {...row.getRowProps()} className="border-b">
//                     {row.cells.map((cell) => (
//                       <td {...cell.getCellProps()} className="p-2 whitespace-nowrap">
//                         {cell.render('Cell')}
//                       </td>
//                     ))}
//                   </tr>
//                 );
//               })}
//               {!loading && rows.length === 0 && (
//                 <tr>
//                   <td
//                     className="p-3 text-gray-500"
//                     colSpan={headerGroups[0]?.headers?.length || 5}
//                   >
//                     No appointments found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

//           {!loading && rows.length > 0 && (
//             <div className="text-sm text-gray-500 mt-2">
//               {rows.length} appointment{rows.length === 1 ? '' : 's'}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }


// src/components/admin/AppointmentTable.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useTable, useSortBy, usePagination, useRowSelect } from 'react-table';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import {
  FiSearch,
  FiRefreshCw,
  FiDownload,
  FiTrash2,
  FiXCircle,
  FiCalendar,
  FiClock,
  FiUser,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';

// ——— small helpers ——— //
const Badge = ({ tone = 'gray', children }) => {
  const map = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    red: 'bg-rose-50 text-rose-700 border-rose-100',
    gray: 'bg-gray-50 text-gray-700 border-gray-200',
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${map[tone]}`}>
      {children}
    </span>
  );
};

function IndeterminateCheckbox({ indeterminate, ...rest }) {
  const ref = React.useRef();
  React.useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return (
    <input
      type="checkbox"
      ref={ref}
      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      {...rest}
    />
  );
}

function formatDate(d) {
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return String(d ?? '');
  }
}

function computeAdminBase(base) {
  const root = base.replace(/\/api$/i, '');
  return `${root}/api/admin`;
}

export default function AppointmentTable({ doctorId: propDoctorId }) {
  const RAW_BASE = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:7500').trim().replace(/\/+$/, '');
  const ADMIN_BASE = computeAdminBase(RAW_BASE);

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(propDoctorId || '');
  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  // UI filters
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all|pending|confirmed|canceled|completed
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // pagination size
  const [pageSize, setPageSize] = useState(10);

  // keep prop in sync
  useEffect(() => {
    if (propDoctorId && propDoctorId !== selectedDoctorId) setSelectedDoctorId(propDoctorId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propDoctorId]);

  // load doctors if doctor not forced by prop
  useEffect(() => {
    if (propDoctorId) return;
    (async () => {
      try {
        setFetchError('');
        const url = `${ADMIN_BASE}/doctors`;
        const res = await axios.get(url, { withCredentials: true });
        const list = res.data?.doctors ?? res.data ?? [];
        setDoctors(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error('Failed to fetch doctors:', e);
        const msg = e?.response?.data?.message || 'Failed to load doctors.';
        setFetchError(msg);
        toast.error(msg);
      }
    })();
  }, [propDoctorId, ADMIN_BASE]);

  // load appointments for doctor
  const loadAppointments = async (id) => {
    if (!id) return;
    try {
      setLoading(true);
      setFetchError('');
      const url = `${ADMIN_BASE}/appointments/doctor/${id}`;
      const res = await axios.get(url, { withCredentials: true });
      setAppointments(res.data?.appointments || []);
    } catch (e) {
      console.error('Error fetching appointments:', e);
      const msg = e?.response?.data?.message || 'Failed to load appointments.';
      setFetchError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDoctorId) loadAppointments(selectedDoctorId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDoctorId, ADMIN_BASE]);

  // actions
  const handleCancel = async (appointmentId) => {
    if (!appointmentId) return;
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await toast.promise(
        axios.patch(`${ADMIN_BASE}/appointments/cancel/${appointmentId}`, { reason: 'admin canceled' }, { withCredentials: true }),
        { loading: 'Canceling appointment…', success: 'Appointment canceled', error: 'Cancel failed' }
      );
      setAppointments((prev) => prev.map((a) => (a._id === appointmentId ? { ...a, status: 'canceled' } : a)));
    } catch {
      /* handled */
    }
  };

  const handleDelete = async (appointmentId) => {
    if (!appointmentId) return;
    if (!window.confirm('Permanently delete this appointment?')) return;
    try {
      await toast.promise(
        axios.delete(`${ADMIN_BASE}/appointments/${appointmentId}`, { withCredentials: true }),
        { loading: 'Deleting appointment…', success: 'Appointment deleted', error: 'Delete failed' }
      );
      setAppointments((prev) => prev.filter((a) => a._id !== appointmentId));
    } catch {
      /* handled */
    }
  };

  // bulk actions (loop existing endpoints; no API changes)
  const cancelSelected = async (rows) => {
    const ids = rows.map((r) => r.original._id);
    if (!ids.length) return;
    if (!confirm(`Cancel ${ids.length} appointment(s)?`)) return;
    try {
      await toast.promise(
        Promise.all(
          ids.map((id) =>
            axios.patch(`${ADMIN_BASE}/appointments/cancel/${id}`, { reason: 'admin bulk canceled' }, { withCredentials: true })
          )
        ),
        { loading: 'Canceling…', success: 'Canceled', error: 'Some cancellations failed' }
      );
      setAppointments((prev) => prev.map((a) => (ids.includes(a._id) ? { ...a, status: 'canceled' } : a)));
    } catch {
      /* handled */
    }
  };

  const deleteSelected = async (rows) => {
    const ids = rows.map((r) => r.original._id);
    if (!ids.length) return;
    if (!confirm(`Delete ${ids.length} appointment(s)? This cannot be undone.`)) return;
    try {
      await toast.promise(
        Promise.all(ids.map((id) => axios.delete(`${ADMIN_BASE}/appointments/${id}`, { withCredentials: true }))),
        { loading: 'Deleting…', success: 'Deleted', error: 'Some deletions failed' }
      );
      setAppointments((prev) => prev.filter((a) => !ids.includes(a._id)));
    } catch {
      /* handled */
    }
  };

  // filter + search
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const from = fromDate ? new Date(fromDate).setHours(0, 0, 0, 0) : null;
    const to = toDate ? new Date(toDate).setHours(23, 59, 59, 999) : null;

    return appointments.filter((a) => {
      // text search on patient & email
      const fullName = `${a?.patient?.firstName || ''} ${a?.patient?.lastName || ''}`.toLowerCase();
      const email = (a?.patient?.email || '').toLowerCase();
      const matchQ = !q || fullName.includes(q) || email.includes(q);

      // status
      const matchStatus = statusFilter === 'all' || a?.status === statusFilter;

      // date range (a.date is a Date or ISO)
      let matchDate = true;
      if (from || to) {
        const when = new Date(a.date).getTime();
        if (from && when < from) matchDate = false;
        if (to && when > to) matchDate = false;
      }

      return matchQ && matchStatus && matchDate;
    });
  }, [appointments, query, statusFilter, fromDate, toDate]);

  // quick stats
  const stats = useMemo(() => {
    const total = filtered.length;
    const by = { pending: 0, confirmed: 0, canceled: 0, completed: 0 };
    filtered.forEach((a) => {
      if (by[a.status] != null) by[a.status] += 1;
    });
    return { total, ...by };
  }, [filtered]);

  // columns
  const columns = useMemo(
    () => [
      {
        id: 'selection',
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
        Header: 'Patient',
        accessor: (row) => ({
          name: `${row?.patient?.firstName || ''} ${row?.patient?.lastName || ''}`.trim(),
          email: row?.patient?.email,
        }),
        id: 'patient',
        Cell: ({ value }) => (
          <div className="min-w-0">
            <div className="truncate font-medium text-gray-800 flex items-center gap-2">
              <FiUser className="text-gray-400" />
              {value.name || '—'}
            </div>
            {value.email && <div className="truncate text-xs text-gray-500">{value.email}</div>}
          </div>
        ),
      },
      {
        Header: 'Date',
        accessor: 'date',
        Cell: ({ value }) => (
          <span className="inline-flex items-center gap-2">
            <FiCalendar className="text-gray-400" />
            {formatDate(value)}
          </span>
        ),
      },
      {
        Header: 'Time',
        accessor: 'time',
        Cell: ({ value }) => (
          <span className="inline-flex items-center gap-2">
            <FiClock className="text-gray-400" />
            {value}
          </span>
        ),
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => {
          const tone =
            value === 'confirmed'
              ? 'green'
              : value === 'pending'
              ? 'blue'
              : value === 'canceled'
              ? 'red'
              : 'gray';
          return <Badge tone={tone}>{value}</Badge>;
        },
      },
      {
        Header: 'Actions',
        id: 'actions',
        Cell: ({ row }) => {
          const a = row.original;
          const canCancel = a.status !== 'canceled' && a.status !== 'completed';
          return (
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => canCancel && handleCancel(a._id)}
                disabled={!canCancel}
                className={`px-3 py-1 rounded text-white text-sm inline-flex items-center gap-2 ${
                  canCancel ? 'bg-amber-500 hover:bg-amber-600' : 'bg-gray-300 cursor-not-allowed'
                }`}
                title="Cancel (soft delete)"
              >
                <FiXCircle /> Cancel
              </button>
              <button
                onClick={() => handleDelete(a._id)}
                className="px-3 py-1 rounded bg-red-600 text-white text-sm inline-flex items-center gap-2 hover:bg-red-700"
                title="Delete (hard delete)"
              >
                <FiTrash2 /> Delete
              </button>
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // table
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // paginated rows
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    gotoPage,
    pageOptions,
    state: tableState,
    setPageSize: setTablePageSize,
    selectedFlatRows,
  } = useTable(
    {
      columns,
      data: filtered,
      initialState: { pageIndex: 0, pageSize, sortBy: [{ id: 'date', desc: false }] },
    },
    useSortBy,
    usePagination,
    useRowSelect
  );

  useEffect(() => {
    setTablePageSize(pageSize);
  }, [pageSize, setTablePageSize]);

  // export CSV of filtered list
  const exportCSV = () => {
    const rows = filtered.map((a) => ({
      id: a._id,
      patientFirstName: a?.patient?.firstName || '',
      patientLastName: a?.patient?.lastName || '',
      patientEmail: a?.patient?.email || '',
      date: a?.date || '',
      time: a?.time || '',
      status: a?.status || '',
    }));
    const header = Object.keys(rows[0] || { id: '', patientFirstName: '', patientLastName: '', patientEmail: '', date: '', time: '', status: '' });
    const csv = [header.join(','), ...rows.map((r) => header.map((h) => `"${String(r[h]).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appointments_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* header / toolbar */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Appointments</h3>
            <p className="text-xs text-gray-500">
              Total: <strong>{stats.total}</strong> • Pending: <strong>{stats.pending}</strong> • Confirmed:{' '}
              <strong>{stats.confirmed}</strong> • Canceled: <strong>{stats.canceled}</strong> • Completed:{' '}
              <strong>{stats.completed}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* doctor selector (only if not provided) */}
            {!propDoctorId && (
              <select
                className="rounded-full border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
              >
                <option value="">— choose doctor —</option>
                {doctors.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.firstName} {d.lastName}
                    {d.medicalSpecialtyCategory ? ` — ${d.medicalSpecialtyCategory}` : ''}
                  </option>
                ))}
              </select>
            )}

            {/* search */}
            <div className="relative">
              <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search patient name or email"
                className="w-64 rounded-full border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-full border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              {['all', 'pending', 'confirmed', 'canceled', 'completed'].map((s) => (
                <option key={s} value={s}>
                  {s === 'all' ? 'All statuses' : s}
                </option>
              ))}
            </select>

            {/* date range */}
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="rounded-full border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              title="From date"
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="rounded-full border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              title="To date"
            />

            {/* page size */}
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="rounded-full border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n} / page
                </option>
              ))}
            </select>

            {/* export */}
            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              title="Export CSV (filtered)"
            >
              <FiDownload />
              Export
            </button>

            {/* refresh */}
            <button
              onClick={() => selectedDoctorId && loadAppointments(selectedDoctorId)}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              title="Refresh"
            >
              <FiRefreshCw />
              Refresh
            </button>
          </div>
        </div>

        {/* bulk actions */}
        <BulkActions
          rowsCount={selectedFlatRows.length}
          onCancel={() => cancelSelected(selectedFlatRows)}
          onDelete={() => deleteSelected(selectedFlatRows)}
        />
      </div>

      {fetchError && <div className="text-red-600 text-sm">{fetchError}</div>}

      {!selectedDoctorId ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-600">
          Pick a doctor to view appointments.
        </div>
      ) : (
        <>
          {/* mobile cards */}
          <div className="grid gap-3 sm:hidden">
            {loading && <CardSkeleton />}
            {!loading && page.length === 0 && (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-gray-500">
                No appointments found.
              </div>
            )}
            {!loading &&
              page.map((row) => {
                prepareRow(row);
                const a = row.original;
                return (
                  <div key={row.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="font-semibold text-gray-800">
                        {(a?.patient?.firstName || '') + ' ' + (a?.patient?.lastName || '')}
                      </div>
                      <Badge
                        tone={
                          a.status === 'confirmed' ? 'green' : a.status === 'pending' ? 'blue' : a.status === 'canceled' ? 'red' : 'gray'
                        }
                      >
                        {a.status}
                      </Badge>
                    </div>
                    {a?.patient?.email && <div className="text-xs text-gray-500">{a.patient.email}</div>}
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-700">
                      <span className="inline-flex items-center gap-1">
                        <FiCalendar /> {formatDate(a.date)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <FiClock /> {a.time}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => a.status !== 'canceled' && a.status !== 'completed' && handleCancel(a._id)}
                        disabled={a.status === 'canceled' || a.status === 'completed'}
                        className={`px-3 py-1 rounded text-white text-sm inline-flex items-center gap-2 ${
                          a.status !== 'canceled' && a.status !== 'completed'
                            ? 'bg-amber-500 hover:bg-amber-600'
                            : 'bg-gray-300 cursor-not-allowed'
                        }`}
                      >
                        <FiXCircle /> Cancel
                      </button>
                      <button
                        onClick={() => handleDelete(a._id)}
                        className="px-3 py-1 rounded bg-red-600 text-white text-sm inline-flex items-center gap-2 hover:bg-red-700"
                      >
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* table (sm+) */}
          <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm sm:block">
            <table {...getTableProps()} className="min-w-full">
              <thead className="bg-gray-50">
                {headerGroups.map((hg, i) => (
                  <tr key={i} {...hg.getHeaderGroupProps()}>
                    {hg.headers.map((col) => (
                      <th
                        key={col.id}
                        {...col.getHeaderProps(col.getSortByToggleProps?.())}
                        className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600"
                      >
                        <div className="inline-flex items-center gap-1">
                          {col.render('Header')}
                          {col.isSorted ? <span className="text-gray-400">{col.isSortedDesc ? '▼' : '▲'}</span> : null}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => <TableSkeletonRow key={i} />)
                ) : page.length === 0 ? (
                  <tr>
                    <td className="py-10 text-center text-gray-500" colSpan={headerGroups[0]?.headers?.length || 6}>
                      No appointments found.
                    </td>
                  </tr>
                ) : (
                  page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr key={row.id} {...row.getRowProps()} className="border-t border-gray-100 hover:bg-gray-50">
                        {row.cells.map((cell) => (
                          <td key={cell.column.id} {...cell.getCellProps()} className="px-3 py-3 text-sm text-gray-700">
                            {cell.render('Cell')}
                          </td>
                        ))}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* pagination */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Page <strong>{tableState.pageIndex + 1}</strong> of <strong>{pageOptions.length || 1}</strong>
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
        </>
      )}
    </div>
  );
}

// ——— UI bits ——— //
function BulkActions({ rowsCount, onCancel, onDelete }) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <span className="text-xs text-gray-500">Selected: {rowsCount}</span>
      <button
        disabled={!rowsCount}
        onClick={onCancel}
        className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm ${
          rowsCount ? 'border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100' : 'border border-gray-200 bg-white text-gray-400'
        }`}
      >
        <FiXCircle /> Cancel selected
      </button>
      <button
        disabled={!rowsCount}
        onClick={onDelete}
        className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm ${
          rowsCount ? 'border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100' : 'border border-gray-200 bg-white text-gray-400'
        }`}
      >
        <FiTrash2 /> Delete selected
      </button>
    </div>
  );
}

function TableSkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-3 py-3"><div className="h-4 w-4 rounded border bg-gray-100" /></td>
      <td className="px-3 py-3">
        <div className="h-3 w-40 rounded bg-gray-100" />
        <div className="mt-2 h-3 w-24 rounded bg-gray-100" />
      </td>
      <td className="px-3 py-3"><div className="h-3 w-24 rounded bg-gray-100" /></td>
      <td className="px-3 py-3"><div className="h-3 w-16 rounded bg-gray-100" /></td>
      <td className="px-3 py-3"><div className="h-5 w-20 rounded-full bg-gray-100" /></td>
      <td className="px-3 py-3"><div className="h-8 w-28 rounded bg-gray-100" /></td>
    </tr>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="h-4 w-40 animate-pulse rounded bg-gray-100" />
      <div className="mt-2 h-3 w-24 animate-pulse rounded bg-gray-100" />
      <div className="mt-3 h-3 w-48 animate-pulse rounded bg-gray-100" />
      <div className="mt-3 flex gap-2">
        <div className="h-8 w-24 animate-pulse rounded bg-gray-100" />
        <div className="h-8 w-24 animate-pulse rounded bg-gray-100" />
      </div>
    </div>
  );
}
