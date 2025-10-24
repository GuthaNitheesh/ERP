import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Button, Card, Input } from '@euroasian/shared-components';

export const RolesPage = () => {
  // -----------------------------
  // State: existing roles
  // -----------------------------
  const [roles, setRoles] = useState([
    { id: 1, name: 'Admin', permissions: ['Manage Users', 'View Dashboard', 'Edit Tenants'] },
    { id: 2, name: 'User', permissions: ['View Dashboard'] },
  ]);

  // -----------------------------
  // Form state: new role
  // -----------------------------
  const [roleName, setRoleName] = useState('');
  const [permissions, setPermissions] = useState<string[]>([]);

  const allPermissions = [
    'View Dashboard',
    'Manage Users',
    'Edit Tenants',
    'Create Reports',
    'Manage Roles',
  ];

  const togglePermission = (perm: string) => {
    if (permissions.includes(perm)) setPermissions(permissions.filter((p) => p !== perm));
    else setPermissions([...permissions, perm]);
  };

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName) {
      alert('Please enter a role name');
      return;
    }
    setRoles([...roles, { id: roles.length + 1, name: roleName, permissions }]);
    setRoleName('');
    setPermissions([]);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-10 bg-gray-50 ml-64 min-h-screen">
        <h1 className="text-2xl font-bold mb-6 text-blue-600">Roles & Permissions</h1>

        {/* Create Role Section */}
        <Card className="mb-8 p-6">
          <h2 className="text-lg font-semibold mb-4 text-blue-600">Create Custom Role</h2>
          <form onSubmit={handleAddRole} className="space-y-4">
            {/* Role Name Input */}
            <Input
              placeholder="Enter Role Name (e.g., Manager)"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full"
            />

            {/* Permissions Checkboxes */}
            <div>
              <h3 className="font-semibold mb-2 text-blue-600">Select Permissions:</h3>
              <div className="grid grid-cols-2 gap-2">
                {allPermissions.map((perm) => (
                  <label key={perm} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={permissions.includes(perm)}
                      onChange={() => togglePermission(perm)}
                    />
                    <span>{perm}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" color="blue">
              ➕ Add Role
            </Button>
          </form>
        </Card>

        {/* Roles Table */}
        <Card className="p-6 overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4 text-blue-600">Existing Roles</h2>
          <table className="w-full min-w-max">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="p-3 text-left">Role Name</th>
                <th className="p-3 text-left">Permissions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((r) => (
                <tr key={r.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{r.name}</td>
                  <td className="p-3">
                    {r.permissions.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {r.permissions.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-500 italic">No permissions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
};
