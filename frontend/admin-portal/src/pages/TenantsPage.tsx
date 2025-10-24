import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Button, Card } from '@euroasian/shared-components';

interface Tenant {
  id: number;
  name: string;
  users: number;
  details?: string; // additional info to show on view
}

export const TenantsPage = () => {
const [tenants] = useState<Tenant[]>([
  { 
    id: 1, 
    name: 'Google', 
    users: 120, 
    details: 'Headquarters in Mountain View. Active projects: Search, Cloud, AI' 
  },
  { 
    id: 2, 
    name: 'Amazon', 
    users: 100, 
    details: 'Headquarters in Seattle. Active projects: AWS, E-commerce, Logistics' 
  },
  { 
    id: 3, 
    name: 'Microsoft', 
    users: 80, 
    details: 'Headquarters in Redmond. Active projects: Azure, Office 365, AI' 
  },
]);


  const [showModal, setShowModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  const handleView = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setShowModal(true);
  };

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
                    <Button color="blue" onClick={() => handleView(tenant)}>View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Modal */}
      {showModal && selectedTenant && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-96">
            <h2 className="text-xl font-bold mb-4">{selectedTenant.name}</h2>
            <p className="mb-2">Users: {selectedTenant.users}</p>
            <p>{selectedTenant.details}</p>

            <div className="flex justify-end mt-4">
              <Button color="gray" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
