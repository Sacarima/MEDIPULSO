import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AdminLayout() {
  return (
    <div className="flex bg-slate-100 min-h-screen">
      <div className="w-64 bg-gray-800 text-white fixed top-0 left-0 h-screen">
        <Sidebar />
      </div>

      <div className="flex-1 ml-64 p-6 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
}
