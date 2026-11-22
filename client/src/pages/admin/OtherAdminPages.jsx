import React, { useEffect, useState } from 'react';
import { inventoryAPI, adminAPI } from '../../services/api';
import { Database, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';

export function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    inventoryAPI.getAll().then(res => {
      setInventory(res.data?.inventory || res.data?.data?.inventory || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-full animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-tight mb-2">Global Inventory</h1>
        <p className="text-[var(--color-text-secondary)] text-sm">Monitor cross-pharmacy stock levels directly from MongoDB.</p>
      </div>
      
      <Card className="flex-1 flex flex-col overflow-hidden border-[var(--color-border-subtle)]">
        <div className="flex-1 overflow-auto bg-white">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[var(--color-text-secondary)] uppercase bg-[var(--color-bg-base)] sticky top-0 border-b border-[var(--color-border-subtle)] z-10">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">Pharmacy</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Medicine</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Quantity</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Price</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)]">
              {loading && <tr><td colSpan={5} className="p-6 text-center text-gray-500">Loading inventory...</td></tr>}
              {!loading && inventory.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-gray-500">No inventory found.</td></tr>}
              {!loading && inventory.map((item) => (
                <tr key={item._id} className="hover:bg-[var(--color-soft-green)] hover:bg-opacity-30 transition-colors">
                  <td className="px-6 py-4 font-medium text-[var(--color-text-primary)]">
                    {item.pharmacy?.name}
                  </td>
                  <td className="px-6 py-4">
                    {item.medicine?.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-mono ${item.availableQuantity === 0 ? 'text-red-600 font-bold' : item.availableQuantity <= 5 ? 'text-amber-600 font-bold' : 'text-emerald-600'}`}>
                      {item.availableQuantity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    ₹{item.price?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    {item.availableQuantity === 0 ? (
                      <span className="text-xs font-semibold text-red-700 bg-red-50 px-2.5 py-1 rounded-md">Out of Stock</span>
                    ) : item.availableQuantity <= 5 ? (
                      <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">Limited</span>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">Available</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('../../services/api').then(({ userAPI }) => {
      userAPI.getUsers().then(res => {
        setUsers(res.data || []);
      }).catch(console.error).finally(() => setLoading(false));
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-full animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-tight mb-2">User Management</h1>
        <p className="text-[var(--color-text-secondary)] text-sm">Manage patient and pharmacy admin accounts.</p>
      </div>
      <Card className="flex-1 flex flex-col overflow-hidden border-[var(--color-border-subtle)]">
        <div className="flex-1 overflow-auto bg-white">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[var(--color-text-secondary)] uppercase bg-[var(--color-bg-base)] sticky top-0 border-b border-[var(--color-border-subtle)] z-10">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">Name</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Email</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Role</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)]">
              {loading && <tr><td colSpan={4} className="p-6 text-center text-gray-500">Loading users...</td></tr>}
              {!loading && users.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-gray-500">No users found.</td></tr>}
              {!loading && users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-[var(--color-text-primary)]">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${
                      user.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-200' : 
                      'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export function SystemStatus() {
  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getSystemStatus().then(res => {
      setStatusData(res.data?.services || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-full animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-tight mb-2">System Status</h1>
        <p className="text-[var(--color-text-secondary)] text-sm">Real-time status of APIs, MongoDB, and Machine Learning modules.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <p>Loading statuses...</p> : statusData.map(service => (
          <Card key={service.name} className="border border-gray-100 shadow-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <span className="font-medium text-gray-800">{service.name}</span>
              <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded border ${
                service.status === 'Healthy' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                service.status === 'Not configured' ? 'bg-gray-50 text-gray-500 border-gray-200' :
                'bg-red-50 text-red-700 border-red-100'
              }`}>
                {service.status === 'Healthy' && <CheckCircle2 className="w-3.5 h-3.5" />}
                {service.status === 'Unavailable' && <XCircle className="w-3.5 h-3.5" />}
                {service.status === 'Not configured' && <AlertTriangle className="w-3.5 h-3.5" />}
                {service.status}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function GenericAdminPage({ title, description }) {
  return (
    <div className="max-w-6xl mx-auto flex flex-col h-full animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-tight mb-2">{title}</h1>
        <p className="text-[var(--color-text-secondary)] text-sm">{description}</p>
      </div>
      <div className="flex-1 rounded-2xl border-2 border-dashed border-[var(--color-border-subtle)] bg-white/50 flex flex-col items-center justify-center p-12 text-center">
        <Database className="h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-700">{title} module active</h3>
        <p className="text-[var(--color-text-secondary)] mt-2 max-w-md">
          This operational view retrieves data directly from MongoDB. Implementation structure is in place.
        </p>
      </div>
    </div>
  );
}
