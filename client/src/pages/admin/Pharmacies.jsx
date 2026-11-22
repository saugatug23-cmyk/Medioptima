import React, { useEffect, useState } from 'react';
import { Search, Plus, MoreHorizontal, Store, MapPin, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { inventoryAPI, medicineAPI } from '../../services/api';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { pharmacyAPI } from '../../services/api';
import { LocationSelector } from '../../components/location/LocationSelector';

export function Pharmacies() {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingPharmacy, setEditingPharmacy] = useState(null);
  const [inventoryModalOpen, setInventoryModalOpen] = useState(false);
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [currentStock, setCurrentStock] = useState([]);
  const [inventoryForm, setInventoryForm] = useState({ medicineId: '', availableQuantity: 0, price: 0 });
  const [medicines, setMedicines] = useState([]);
  const [editLocation, setEditLocation] = useState(null);

  useEffect(() => {
    medicineAPI.getAll({ limit: 1000 }).then(res => setMedicines(res.data?.medicines || []));
  }, []);

  const fetchPharmacies = () => {
    setLoading(true);
    pharmacyAPI.getAll().then(res => {
      setPharmacies(res.data?.pharmacies || res.data?.data?.pharmacies || []);
    }).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const openStockModal = async (pharmacy) => {
    setEditingPharmacy(pharmacy);
    setStockModalOpen(true);
    try {
      const res = await inventoryAPI.getAll({ pharmacyId: pharmacy._id });
      setCurrentStock(res.data?.inventory || []);
    } catch(err) {
      console.error(err);
    }
  };

  const openInventoryModal = (pharmacy) => {
    setEditingPharmacy(pharmacy);
    setInventoryForm({ medicineId: '', availableQuantity: 0, price: 0 });
    setInventoryModalOpen(true);
  };

  const openEditModal = (pharmacy) => {
    setEditingPharmacy(pharmacy);
    setEditLocation(pharmacy.latitude && pharmacy.longitude ? { lat: pharmacy.latitude, lng: pharmacy.longitude } : null);
    setIsEditing(true);
  };

  const saveLocation = async () => {
    if (!editLocation) return;
    try {
      await pharmacyAPI.update(editingPharmacy._id, {
        latitude: editLocation.lat,
        longitude: editLocation.lng
      });
      setIsEditing(false);
      fetchPharmacies();
    } catch (error) {
      console.error("Failed to save pharmacy location", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-full animate-fade-in relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-medium tracking-tight mb-2">Pharmacy Network</h1>
          <p className="text-[var(--color-text-secondary)] text-sm">Manage connected pharmacies from MongoDB.</p>
        </div>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border-[var(--color-border-subtle)]">
        <div className="p-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] flex gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
            <Input placeholder="Search pharmacy by name..." className="pl-10 h-10 bg-white" />
          </div>
        </div>
        
        <div className="flex-1 overflow-auto bg-white">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[var(--color-text-secondary)] uppercase bg-[var(--color-bg-base)] sticky top-0 border-b border-[var(--color-border-subtle)] z-10">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">Name</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Location</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Geo (Lat/Lng)</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)]">
              {loading && <tr><td colSpan={5} className="p-6 text-center text-gray-500">Loading pharmacies...</td></tr>}
              {!loading && pharmacies.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-gray-500">No pharmacies found.</td></tr>}
              {!loading && pharmacies.map((item) => (
                <tr key={item._id} className="hover:bg-[var(--color-soft-green)] hover:bg-opacity-30 transition-colors group">
                  <td className="px-6 py-4 font-medium text-[var(--color-text-primary)] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
                      <Store className="h-4 w-4" />
                    </div>
                    {item.name}
                  </td>
                  <td className="px-6 py-4 text-[var(--color-text-secondary)]">
                    {item.address}, {item.city} {item.pincode}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500 font-mono flex items-center gap-1">
                    {item.latitude && item.longitude ? (
                      <><MapPin className="h-3 w-3 text-emerald-500"/> {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}</>
                    ) : (
                      <><MapPin className="h-3 w-3 text-red-500"/> Missing Coords</>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={item.isActive ? "success" : "destructive"}>
                      {item.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button size="sm" variant="outline" onClick={() => openEditModal(item)}>
                      Edit Location
                    </Button>
                    <Button size="sm" className="ml-2" onClick={() => openInventoryModal(item)}>
                      Add Inventory
                    </Button>
                    <Button size="sm" variant="outline" className="ml-2" onClick={() => openStockModal(item)}>
                      View Stock
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Location Modal */}
      {isEditing && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-2xl bg-white shadow-xl">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Edit Location: {editingPharmacy?.name}</h2>
              <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-black">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <p className="text-sm text-gray-600 mb-4">Set the exact map coordinates for this pharmacy. This will be used in the geospatial availability search.</p>
              
              <LocationSelector 
                location={editLocation}
                setLocation={setEditLocation}
              />
              
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button onClick={saveLocation} disabled={!editLocation}>Save Coordinates</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
                {stockModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-2xl bg-white shadow-xl flex flex-col max-h-[80vh]">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Stock: {editingPharmacy?.name}</h2>
              <button onClick={() => setStockModalOpen(false)} className="text-gray-500 hover:text-black">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-0 flex-1 overflow-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-[var(--color-text-secondary)] uppercase bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3">Medicine</th>
                    <th className="px-4 py-3">Quantity</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentStock.length === 0 ? (
                    <tr><td colSpan={4} className="p-4 text-center text-gray-500">No stock recorded.</td></tr>
                  ) : currentStock.map(inv => (
                    <tr key={inv._id}>
                      <td className="px-4 py-3 font-medium">{inv.medicine?.name || 'Unknown'}</td>
                      <td className="px-4 py-3">{inv.availableQuantity}</td>
                      <td className="px-4 py-3">â‚¹{inv.price}</td>
                      <td className="px-4 py-3">{new Date(inv.lastUpdated).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
      {inventoryModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md bg-white shadow-xl">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Add Inventory: {editingPharmacy?.name}</h2>
              <button onClick={() => setInventoryModalOpen(false)} className="text-gray-500 hover:text-black">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await inventoryAPI.create({
                    pharmacyId: editingPharmacy._id,
                    medicineId: inventoryForm.medicineId,
                    availableQuantity: Number(inventoryForm.availableQuantity),
                    price: Number(inventoryForm.price)
                  });
                  setInventoryModalOpen(false);
                  alert('Inventory saved successfully!');
                } catch (err) {
                  alert(err.response?.data?.message || 'Failed to save inventory');
                }
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medicine</label>
                  <select 
                    required 
                    className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    value={inventoryForm.medicineId}
                    onChange={(e) => setInventoryForm({...inventoryForm, medicineId: e.target.value})}
                  >
                    <option value="">Select a medicine...</option>
                    {medicines.map(m => (
                      <option key={m._id} value={m._id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <Input type="number" min="0" required value={inventoryForm.availableQuantity} onChange={(e) => setInventoryForm({...inventoryForm, availableQuantity: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <Input type="number" min="0" step="0.01" required value={inventoryForm.price} onChange={(e) => setInventoryForm({...inventoryForm, price: e.target.value})} />
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setInventoryModalOpen(false)}>Cancel</Button>
                  <Button type="submit">Save Inventory</Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}