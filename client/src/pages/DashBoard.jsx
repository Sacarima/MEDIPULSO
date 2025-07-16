import React from 'react'
import AdminDashboard from '../components/dashboard/AdminDashboard'
import DoctorTable from '../components/dashboard/DoctorTable'
import Sidebar from '../components/dashboard/Sidebar'

export default function DashBoard() {
  return (
    <div className='flex'>
      {/* Sidebar will be sticky on the left */}
      <div className='w-64 bg-gray-800 text-white fixed top-0 left-0 h-screen'>
        <Sidebar />
      </div>

      {/* Main content section */}
      <div className='flex-1 ml-64 p-6 bg-gray-100'>
        <AdminDashboard />
        <DoctorTable />
      </div>
    </div>
  )
}
