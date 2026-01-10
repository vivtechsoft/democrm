// src/pages/settings/RoleSettings.jsx
import React, { useState } from 'react';

const RoleSettings = () => {
  const [roles, setRoles] = useState([
    { id: 1, name: 'Admin', description: 'Full system access', userCount: 3, permissions: ['all'] },
    { id: 2, name: 'Manager', description: 'Team management access', userCount: 5, permissions: ['leads', 'contacts', 'reports'] },
    { id: 3, name: 'User', description: 'Basic user access', userCount: 12, permissions: ['leads', 'contacts'] },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Role Settings</h1>
        <p className="text-gray-600">Manage user roles and permissions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div key={role.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{role.description}</p>
              </div>
              <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full">
                {role.userCount} users
              </span>
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Permissions</h4>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((permission, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                    {permission}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                Edit
              </button>
              <button className="flex-1 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          Add New Role
        </button>
      </div>
    </div>
  );
};

export default RoleSettings;