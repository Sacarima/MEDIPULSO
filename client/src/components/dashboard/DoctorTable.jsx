import React, { useState, useEffect } from "react";
import { useTable } from "react-table";

const DoctorTable = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctors, setSelectedDoctors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 

  // Fetching doctor data with pagination
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/doctor-form/recently-added-public?page=${currentPage}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP Error! status: ${response.status}`);
        }

        const data = await response.json();
        setDoctors(data.data.doctors); // Ensure the doctors data is being set correctly
        setTotalPages(data.data.totalPages); // Set the total number of pages
        setFilteredDoctors(data.data.doctors); // Initially display all doctors
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      }
    };
    fetchDoctors();
  }, [currentPage]);

  // Handle checkbox selection
  const handleCheckboxChange = (e, doctorId) => {
    if (e.target.checked) {
      setSelectedDoctors([...selectedDoctors, doctorId]);
    } else {
      setSelectedDoctors(selectedDoctors.filter(id => id !== doctorId));
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter doctors based on the search query
  useEffect(() => {
    const filteredData = doctors.filter((doctor) =>
      doctor.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.medicalCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDoctors(filteredData);
  }, [searchQuery, doctors]);

  const columns = React.useMemo(
    () => [
      {
        Header: "Select",
        accessor: "select",
        Cell: ({ row }) => (
          <input
            type="checkbox"
            onChange={(e) => handleCheckboxChange(e, row.original._id)}
            checked={selectedDoctors.includes(row.original._id)}
          />
        ),
      },
      {
        Header: "Profile",
        accessor: "profile",
        Cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <img
              src={row.original.profilePicture || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
              alt={`Doctor ${row.original.firstName} ${row.original.lastName}`}
              className="w-12 h-12 rounded-full object-cover"
            />
            <span>{row.original.firstName} {row.original.lastName}</span>
          </div>
        ),
      },
      {
        Header: "Medical Category",
        accessor: "medicalCategory",
      },
      {
        Header: "Location",
        accessor: "city",
      },
    ],
    [selectedDoctors]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: filteredDoctors,
  });

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg ">
      <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Doctor List</h2>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search doctors, city, medicalcategory..."
          className="px-4 py-2 border-[.5px] border-gray-300 rounded-lg w-[330px] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[13px]"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Doctor Table */}
      <table {...getTableProps()} className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
        <thead className="bg-gray-200">
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps()}
                  className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider"
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-4 text-gray-500">
                No doctors available
              </td>
            </tr>
          ) : (
            rows.map(row => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  className="hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                >
                  {row.cells.map(cell => (
                    <td
                      {...cell.getCellProps()}
                      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b border-gray-200 ${
                        cell.column.Header === "Profile" ? "border-r border-gray-200" : ""
                      }`}
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageChange(1)}
          className="px-4 py-2 mx-1 bg-gray-800 text-white rounded-md"
          disabled={currentPage === 1}
        >
          First
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-4 py-2 mx-1 bg-gray-800 text-white rounded-md"
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 mx-1 bg-gray-800 text-white rounded-md"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          className="px-4 py-2 mx-1 bg-gray-800 text-white rounded-md"
          disabled={currentPage === totalPages}
        >
          Last
        </button>
      </div>
    </div>
  );
};

export default DoctorTable;
