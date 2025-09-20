import React from 'react'
import AdminDashboard from '../components/dashboard/AdminDashboard'
import DoctorTable from '../components/dashboard/DoctorTable'
import Sidebar from '../components/dashboard/Sidebar'

export default function DashBoard() {
  return (
    <div className=''>
      {/* Main content section */}
      <div className=' '>
        <AdminDashboard />
        <DoctorTable />
      </div>
    </div>
  )
}
