import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Button, Card, Input } from '@euroasian/shared-components';

interface User {
  id: number;
  name: string;
  role: string;
  tenant: string;
}

export const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'Gutha', role: 'Admin', tenant: 'TechCorp' },
    { id: 2, name: 'Nitheesh', role: 'User', tenant: 'DataVision' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [newUser, setNewUser] = useState({ name: '', role: '', tenant: '' });

  const handleInputChange = (field: string, value: string) => {
    setNewUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateOrUpdateUser = () => {
    if (!newUser.name || !newUser.role || !newUser.tenant) return;

    if (editingUserId !== null) {
      // Update existing user
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUserId ? { id: u.id, ...newUser } : u))
      );
    } else {
      // Create new user
      const nextId = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
      setUsers([...users, { id: nextId, ...newUser }]);
    }

    setNewUser({ name: '', role: '', tenant: '' });
    setEditingUserId(null);
    setShowModal(false);
  };

  const handleEditUser = (user: User) => {
    setNewUser({ name: user.name, role: user.role, tenant: user.tenant });
    setEditingUserId(user.id);
    setShowModal(true);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-10 bg-gray-50 ml-64 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600">Users</h1>
          <Button color="green" onClick={() => setShowModal(true)}>
            + Create User
          </Button>
        </div>

        <Card className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Tenant</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.role}</td>
                  <td className="p-3">{u.tenant}</td>
                  <td className="p-3 flex gap-2">
                    <Button color="blue" onClick={() => handleEditUser(u)}>
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-96">
            <h2 className="text-xl font-bold mb-4">
              {editingUserId ? 'Edit User' : 'Create User'}
            </h2>

            <Input
              label="Name"
              value={newUser.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              fullWidth
              className="mb-3"
            />
            <Input
              label="Role"
              value={newUser.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              fullWidth
              className="mb-3"
            />
            <Input
              label="Tenant"
              value={newUser.tenant}
              onChange={(e) => handleInputChange('tenant', e.target.value)}
              fullWidth
              className="mb-4"
            />

            <div className="flex justify-end gap-2">
              <Button color="gray" onClick={() => {
                setShowModal(false);
                setEditingUserId(null);
                setNewUser({ name: '', role: '', tenant: '' });
              }}>
                Cancel
              </Button>
              <Button color="green" onClick={handleCreateOrUpdateUser}>
                {editingUserId ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
