import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreHorizontal, Database, AlertTriangle, Pill } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { inventoryAPI, medicineAPI, authAPI } from '../../services/api';

function InventoryModal({ isOpen, onClose, item, onSaved }) {
  const [medicines, setMedicines] = useState([]);
  const [formData, setFormData] = useState({
    medicineId: '',
    availableQuantity: 0,
    price: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && !item) {
      // Fetch medicines for the dropdown
      medicineAPI.getAll({ limit: 1000 }).then(res => setMedicines(res.data?.medicines || []));
    }
    
    if (item) {
      setFormData({
        medicineId: item.medicine._id,
        availableQuantity: item.availableQuantity,
        price: item.price
      });
    } else {
      setFormData({ medicineId: '', availableQuantity: 0, price: 0 });
    }
    setError('');
  }, [item, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (item && item._id) {
        await inventoryAPI.update(item._id, {
          availableQuantity: Number(formData.availableQuantity),
          price: Number(formData.price)
        });
      } else {
        await inventoryAPI.create({
          medicineId: formData.medicineId,
          availableQuantity: Number(formData.availableQuantity),
          price: Number(formData.price)
        });
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save inventory');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border-subtle)]">
          <h2 className="text-xl font-medium">{item ? 'Update Inventory' : 'Add to Inventory'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">x</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Medicine</label>
            {item ? (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                {item.medicine?.name} - {item.medicine?.strength} {item.medicine?.dosageForm}
              </div>
            ) : (
              <select 
                required
                className="w-full h-10 px-3 rounded-lg border border-[var(--color-border-subtle)] bg-white text-sm"
                value={formData.medicineId}
                onChange={e => setFormData({...formData, medicineId: e.target.value})}
              >
                <option value="">Select a medicine...</option>
                {medicines.map(m => (
                  <option key={m._id} value={m._id}>{m.name} {m.strength} {m.dosageForm} ({m.brandName || m.genericName})</option>
                ))}
              </select>
            )}
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Available Quantity</label>
            <Input 
              type="number" required min="0" 
              value={formData.availableQuantity} 
              onChange={e => setFormData({...formData, availableQuantity: e.target.value})} 
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Price (INR)</label>
            <Input 
              type="number" step="0.01" required min="0" 
              value={formData.price} 
              onChange={e => setFormData({...formData, price: e.target.value})} 
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border-subtle)] mt-6">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function PharmacyDashboard() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [me, setMe] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const userRes = await authAPI.getMe();
      setMe(userRes.data?.user);

      const invRes = await inventoryAPI.getAll();
      const items = invRes.data?.inventory || [];
      // Client-side active filter for UI simplicity, though backend supports it
      setInventory(items.filter(i => i.isActive !== false)); 
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deactivateItem = async (id) => {
    if(confirm("Remove this medicine from your active inventory?")) {
      try {
        await inventoryAPI.delete(id);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const totalMedicines = inventory.length;
  const lowStock = inventory.filter(i => i.availableQuantity > 0 && i.availableQuantity <= 5).length;
  const outOfStock = inventory.filter(i => i.availableQuantity === 0).length;
  const lastUpdate = inventory.length > 0 
    ? new Date(Math.max(...inventory.map(i => new Date(i.lastUpdated)))).toLocaleString()
    : 'Never';

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-full animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-tight mb-2">Pharmacy Dashboard</h1>
        <p className="text-[var(--color-text-secondary)] text-sm">
          {me?.name ? `Managing inventory for ${me.name}` : 'Manage your real-time stock levels and prices.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Tracked Medicines', value: totalMedicines, icon: Database, color: 'text-blue-600', bg: 'bg-blue-50' },
          { title: 'Low Stock (<= 5)', value: lowStock, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
          { title: 'Out of Stock', value: outOfStock, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
          { title: 'Last Global Update', value: lastUpdate.split(',')[0], subtitle: lastUpdate.split(',')[1], icon: Database, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((stat, i) => (
          <Card key={i} className="border-[var(--color-border-subtle)]">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">{stat.title}</p>
                <p className="text-2xl font-semibold tracking-tight mb-0">{stat.value}</p>
                {stat.subtitle && <p className="text-xs text-gray-400">{stat.subtitle}</p>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border-[var(--color-border-subtle)] min-h-[500px]">
        <div className="p-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] flex items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
            <Input placeholder="Search inventory..." className="pl-10 h-10 bg-white" />
          </div>
          <Button className="gap-2" onClick={() => { setEditingItem(null); setIsModalOpen(true); }}>
            <Plus className="h-4 w-4" /> Add to Inventory
          </Button>
        </div>
        
        <div className="flex-1 overflow-auto bg-white">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[var(--color-text-secondary)] uppercase bg-[var(--color-bg-base)] sticky top-0 border-b border-[var(--color-border-subtle)] z-10">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">Medicine</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Price (INR)</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Stock Level</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Last Updated</th>
                <th className="px-6 py-4 text-right font-semibold tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)]">
              {loading ? (
                <tr><td colSpan={5} className="text-center p-8 text-gray-500">Loading inventory...</td></tr>
              ) : inventory.length === 0 ? (
                <tr><td colSpan={5} className="text-center p-8 text-gray-500">No inventory found.</td></tr>
              ) : inventory.map((item) => (
                <tr key={item._id} className="hover:bg-[var(--color-soft-green)] hover:bg-opacity-30 transition-colors group">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
                      <Pill className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium text-[var(--color-text-primary)]">{item.medicine?.name}</div>
                      <div className="text-xs text-gray-500">{item.medicine?.strength} • {item.medicine?.dosageForm}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">₹{item.price?.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    {item.availableQuantity === 0 ? (
                       <Badge variant="destructive">Out of Stock</Badge>
                    ) : item.availableQuantity <= 5 ? (
                       <Badge variant="warning">{item.availableQuantity} Left (Low)</Badge>
                    ) : (
                       <Badge variant="success">{item.availableQuantity} in Stock</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-[var(--color-text-secondary)] text-xs">
                    {new Date(item.lastUpdated).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="outline" size="sm" onClick={() => deactivateItem(item._id)}>
                        Remove
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => { setEditingItem(item); setIsModalOpen(true); }}>
                        Update
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <InventoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        item={editingItem}
        onSaved={fetchData}
      />
    </div>
  );
}
