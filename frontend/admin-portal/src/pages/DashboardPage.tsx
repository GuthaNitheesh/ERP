
import { Sidebar } from '../components/Sidebar';
import { Card } from '@euroasian/shared-components';

export const DashboardPage = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-10 bg-gray-50 ml-64 min-h-screen">
        <h1 className="text-2xl font-bold mb-6 text-blue-600">Dashboard Overview</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="flex items-center space-x-3">
            <span className="text-2xl">👥</span>
            <div>
              <div className="font-bold text-lg">Total Tenants</div>
              <div className="text-gray-600">45</div>
            </div>
          </Card>

          <Card className="flex items-center space-x-3">
            <span className="text-2xl">👩‍💻</span>
            <div>
              <div className="font-bold text-lg">Total Users</div>
              <div className="text-gray-600">230</div>
            </div>
          </Card>

          <Card className="flex items-center space-x-3">
            <span className="text-2xl">⚙️</span>
            <div>
              <div className="font-bold text-lg">Active Roles</div>
              <div className="text-gray-600">3</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
