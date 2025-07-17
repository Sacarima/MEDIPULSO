import React, { useState } from "react";
import { FaHome, FaUsers, FaChartBar, FaCog, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom"; // To enable navigation
import WithLogout from "../WithLogout";


const Sidebar = ({ handleLogout, role }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`flex h-screen bg-gray-800 text-white ${isCollapsed ? "w-20" : "w-64"} transition-all`}>
      <div className="flex flex-col w-full">
        <div className="flex justify-between items-center p-4 bg-gray-900">
          <div className="text-lg font-semibold">Admin Dashboard</div>
          <button
            className="text-2xl"
            onClick={toggleSidebar}
          >
            {isCollapsed ? ">" : "<"}
          </button>
        </div>
        <div className="flex-grow overflow-y-auto">
          <ul className="space-y-2 mt-6">
            <SidebarLink to="/" icon={<FaHome />} label="Home" isCollapsed={isCollapsed} />
            <SidebarLink to="/users" icon={<FaUsers />} label="Users" isCollapsed={isCollapsed} />
            <SidebarLink to="/analytics" icon={<FaChartBar />} label="Analytics" isCollapsed={isCollapsed} />
            <SidebarLink to="/settings" icon={<FaCog />} label="Settings" isCollapsed={isCollapsed} />
            <SidebarLink onClick={() => handleLogout(role)} icon={<FaSignOutAlt />} label="Logout" isCollapsed={isCollapsed} />
          </ul>
        </div>
      </div>
    </div>
  );
};

// Sidebar link component
const SidebarLink = ({ to, icon, label, isCollapsed, onClick }) => {
  return (
    <li>
      <Link to={to} onClick={onClick} className={`flex items-center px-4 py-2 space-x-4 hover:bg-gray-700 rounded-md ${!isCollapsed ? "text-lg" : "text-xl"}`}>
        <span>{icon}</span>
        {!isCollapsed && <span>{label}</span>}
      </Link>
    </li>
  );
};

export default WithLogout(Sidebar);
