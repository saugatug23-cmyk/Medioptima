import React, { useEffect, useState } from 'react';
import { Store, Pill, Database, Users, AlertTriangle, Activity } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { adminAPI } from '../../services/api';

export function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getMetrics()
      .then(res => setMetrics(res.data?.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Loading dashboard metrics...</div>;
  if (!metrics) return <div className="p-8 text-red-500">Failed to load metrics.</div>;

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-tight mb-2">System Overview</h1>
        <p className="text-[var(--color-text-secondary)] text-sm">Real-time operational status from MongoDB.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Registered Pharmacies', value: metrics.totalPharmacies, subtitle: `${metrics.activePharmacies} active`, icon: Store },
          { title: 'Medicine Catalog', value: metrics.totalMedicines, subtitle: `${metrics.activeMedicines} active`, icon: Pill },
          { title: 'Inventory Records', value: metrics.totalInventory, subtitle: `${metrics.availableInventory} in stock`, icon: Database },
          { title: 'Registered Users', value: metrics.totalUsers, subtitle: 'All roles', icon: Users },
        ].map((stat, i) => (
          <Card key={i} className="border-[var(--color-border-subtle)]">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 bg-[var(--color-soft-green)] rounded-xl text-[var(--color-primary)]">
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">{stat.title}</p>
                <p className="text-2xl font-semibold tracking-tight mb-2">{stat.value}</p>
                <p className="text-xs font-medium text-emerald-600">{stat.subtitle}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-[var(--color-border-subtle)]">
          <CardContent className="p-6">
            <h3 className="font-medium mb-5 flex items-center gap-2 text-[var(--color-text-primary)]">
              <AlertTriangle className="h-4 w-4 text-[var(--color-warning)]" />
              Inventory Health (Network-wide)
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-3">
                <span className="font-medium">Fully Available (&gt; 5 units)</span>
                <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md font-medium text-xs">{metrics.availableInventory} items</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-3">
                <span className="font-medium">Limited Stock (1-5 units)</span>
                <span className="text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md font-medium text-xs">{metrics.limitedInventory} items</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Out of Stock (0 units)</span>
                <span className="text-red-700 bg-red-50 px-2.5 py-1 rounded-md font-medium text-xs">{metrics.outOfStockInventory} items</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[var(--color-border-subtle)]">
          <CardContent className="p-6">
            <h3 className="font-medium mb-5 flex items-center gap-2 text-[var(--color-text-primary)]">
              <Activity className="h-4 w-4 text-blue-500" />
              Data Health & Warnings
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="font-medium">Pharmacies missing Geo-coordinates</span>
                {metrics.dataHealth.pharmaciesMissingCoords > 0 ? (
                  <span className="text-red-700 bg-red-50 px-2.5 py-1 rounded-md text-xs font-medium">{metrics.dataHealth.pharmaciesMissingCoords} Action Required</span>
                ) : (
                  <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md text-xs font-medium">All Valid</span>
                )}
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span className="font-medium">Inactive Pharmacies</span>
                <span className="text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md text-xs font-medium">{metrics.totalPharmacies - metrics.activePharmacies} Disabled</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Inactive Medicines</span>
                <span className="text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md text-xs font-medium">{metrics.totalMedicines - metrics.activeMedicines} Disabled</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
