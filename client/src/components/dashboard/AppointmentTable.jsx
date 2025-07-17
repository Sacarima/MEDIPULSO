import React, { useEffect, useState } from 'react';
import { useTable } from 'react-table';
import axios from 'axios';

const AppointmentTable = ({ doctorId }) => {
  const [appointments, setAppointments] = useState([]);

  // Fetch appointments on component mount
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(`http://localhost:7500/api/appointments/doctor/${doctorId}`);
        setAppointments(res.data.appointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, [doctorId]);

  // Define the columns for the table
  const columns = React.useMemo(
    () => [
      {
        Header: 'Patient Name',
        accessor: 'patientName', 
      },
      {
        Header: 'Date',
        accessor: 'appointmentDate', 
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Actions',
        Cell: ({ row }) => {
          return (
            <button
              onClick={() => rescheduleAppointment(row.original._id)} 
              className="btn btn-primary"
            >
              Reschedule
            </button>
          );
        },
      },
    ],
    []
  );

  // Create an instance of the table using the columns and data
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: appointments,
  });

  return (
    <div className="overflow-x-auto">
      <table {...getTableProps()} className="min-w-full table-auto">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-100">
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()} className="p-2 text-left font-semibold">
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="border-b">
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()} className="p-2">
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentTable;
