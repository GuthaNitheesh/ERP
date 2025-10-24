
import { Sidebar } from '../components/Sidebar';
import { Button, Card } from '@euroasian/shared-components';

export const TenantsPage = () => {
  const tenants = [
    { id: 1, name: 'TechCorp', users: 50 },
    { id: 2, name: 'DataVision', users: 30 },
    { id: 3, name: 'SoftLink', users: 20 },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-10 bg-gray-50 ml-64 min-h-screen">
        <h1 className="text-2xl font-bold mb-6 text-blue-600">Tenants</h1>

        <Card className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="p-3 text-left">Tenant Name</th>
                <th className="p-3 text-left">Users</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((tenant) => (
                <tr key={tenant.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{tenant.name}</td>
                  <td className="p-3">{tenant.users}</td>
                  <td className="p-3">
                    <Button color="blue">View</Button>
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
