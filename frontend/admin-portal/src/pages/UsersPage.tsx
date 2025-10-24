
import { Sidebar } from '../components/Sidebar';
import { Button, Card } from '@euroasian/shared-components';

export const UsersPage = () => {
  const users = [
    { id: 1, name: 'Farhana', role: 'Admin', tenant: 'TechCorp' },
    { id: 2, name: 'Nitheesh', role: 'User', tenant: 'DataVision' },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-10 bg-gray-50 ml-64 min-h-screen">
        <h1 className="text-2xl font-bold mb-6 text-blue-600">Users</h1>

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
                  <td className="p-3">
                    <Button color="blue">Edit</Button>
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
