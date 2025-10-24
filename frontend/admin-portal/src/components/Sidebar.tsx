import React from 'react';
import { NavLink } from 'react-router-dom';

export const Sidebar = () => {
  return (
    <div
      className="w-64 bg-gray-900 text-white p-5 flex flex-col justify-start fixed h-screen top-0 left-0"
    >
      {/* Logo / Title */}
      <h1 className="text-2xl font-bold mb-10">Admin Portal</h1>

      {/* Navigation links */}
      <nav className="flex flex-col flex-1 gap-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `p-3 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
          }
        >
          🏠 Dashboard
        </NavLink>

        <NavLink
          to="/tenants"
          className={({ isActive }) =>
            `p-3 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
          }
        >
          👥 Tenants
        </NavLink>

        <NavLink
          to="/users"
          className={({ isActive }) =>
            `p-3 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
          }
        >
          👩‍💻 Users
        </NavLink>

        <NavLink
          to="/roles"
          className={({ isActive }) =>
            `p-3 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
          }
        >
          ⚙️ Roles
        </NavLink>
      </nav>
    </div>
  );
};