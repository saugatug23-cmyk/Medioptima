import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreHorizontal, Pill, Upload, X, Check, FileJson } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { medicineAPI } from '../../services/api';

function MedicineModal({ isOpen, onClose, medicine, onSaved }) {
  const [formData, setFormData] = useState({
    name: '', genericName: '', brandName: '', activeIngredient: '', strength: '',
    dosageForm: '', manufacturer: '', category: '', price: '', description: '',
    searchableAliases: '', prescriptionRequired: false, isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (medicine) {
      setFormData({
        ...medicine,
        price: medicine.price || '',
        searchableAliases: medicine.searchableAliases ? medicine.searchableAliases.join(', ') : ''
      });
    } else {
      setFormData({
        name: '', genericName: '', brandName: '', activeIngredient: '', strength: '',
        dosageForm: '', manufacturer: '', category: '', price: '', description: '',
        searchableAliases: '', prescriptionRequired: false, isActive: true
      });
    }
    setError('');
  }, [medicine, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const payload = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      searchableAliases: formData.searchableAliases.split(',').map(s => s.trim()).filter(Boolean)
    };

    try {
      if (medicine && medicine._id) {
        await medicineAPI.update(medicine._id, payload);
      } else {
        await medicineAPI.create(payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save medicine');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border-subtle)]">
          <h2 className="text-xl font-medium">{medicine ? 'Edit Medicine' : 'Add New Medicine'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Medicine Name *</label>
              <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Dolo 650" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Generic Name</label>
              <Input value={formData.genericName} onChange={e => setFormData({...formData, genericName: e.target.value})} placeholder="e.g. Paracetamol" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Brand Name</label>
              <Input value={formData.brandName} onChange={e => setFormData({...formData, brandName: e.target.value})} placeholder="e.g. Micro Labs" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Active Ingredient</label>
              <Input value={formData.activeIngredient} onChange={e => setFormData({...formData, activeIngredient: e.target.value})} placeholder="e.g. Acetaminophen" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Strength</label>
              <Input value={formData.strength} onChange={e => setFormData({...formData, strength: e.target.value})} placeholder="e.g. 650mg" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Dosage Form</label>
              <Input value={formData.dosageForm} onChange={e => setFormData({...formData, dosageForm: e.target.value})} placeholder="e.g. Tablet" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Manufacturer</label>
              <Input value={formData.manufacturer} onChange={e => setFormData({...formData, manufacturer: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Category</label>
              <Input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="e.g. Analgesic" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Price (INR)</label>
              <Input type="number" step="0.01" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Search Aliases (Comma separated)</label>
              <Input value={formData.searchableAliases} onChange={e => setFormData({...formData, searchableAliases: e.target.value})} placeholder="e.g. fever, headache" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Description</label>
            <textarea 
              className="w-full rounded-lg border border-[var(--color-border-subtle)] p-3 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] bg-gray-50 text-sm"
              rows={3} 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.prescriptionRequired} onChange={e => setFormData({...formData, prescriptionRequired: e.target.checked})} className="rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
              <span className="text-sm font-medium">Prescription Required</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
              <span className="text-sm font-medium">Active (Visible)</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border-subtle)]">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Medicine'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ImportModal({ isOpen, onClose, onImported }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError('');
    try {
      const text = await file.text();
      let data = [];
      if (file.name.endsWith('.json')) {
        data = JSON.parse(text);
      } else if (file.name.endsWith('.csv')) {
        // Simple CSV parser (assuming no quotes/commas inside values for demo)
        const lines = text.split('\n').filter(Boolean);
        const headers = lines[0].split(',').map(h => h.trim());
        data = lines.slice(1).map(line => {
          const values = line.split(',');
          let obj = {};
          headers.forEach((h, i) => { obj[h] = values[i] ? values[i].trim() : ''; });
          return obj;
        });
      } else {
        throw new Error("Unsupported file format. Use .json or .csv");
      }

      const res = await medicineAPI.importMedicines({ medicines: data });
      setResult(res.data);
      onImported();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Import failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border-subtle)]">
          <h2 className="text-xl font-medium">Import Medicines</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          {!result ? (
            <>
              {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
              <p className="text-sm text-gray-500">Upload a JSON or CSV file containing medicine records.</p>
              <div className="border-2 border-dashed border-[var(--color-border-subtle)] rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors relative">
                <FileJson className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-600">{loading ? 'Processing...' : 'Click to select file'}</span>
                <input type="file" accept=".json,.csv" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileUpload} disabled={loading} />
              </div>
            </>
          ) : (
            <div className="space-y-4 text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="font-medium text-lg">Import Complete</h3>
              <div className="grid grid-cols-2 gap-4 text-left bg-gray-50 p-4 rounded-lg">
                <div><span className="text-gray-500 text-sm">Total Processed:</span> <p className="font-medium">{result.total}</p></div>
                <div><span className="text-green-600 text-sm">Successful:</span> <p className="font-medium">{result.successful}</p></div>
                <div><span className="text-yellow-600 text-sm">Skipped (Dupes):</span> <p className="font-medium">{result.skipped}</p></div>
                <div><span className="text-red-600 text-sm">Failed:</span> <p className="font-medium">{result.failed}</p></div>
              </div>
              <Button className="w-full" onClick={onClose}>Close</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingMed, setEditingMed] = useState(null);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const res = await medicineAPI.getAll({ page, limit: 20, search, isActive: undefined }); // undefined to get all
      setMedicines(res.data?.medicines || []);
      setTotalPages(res.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(fetchMedicines, 300);
    return () => clearTimeout(delay);
  }, [search, page]);

  const toggleStatus = async (id) => {
    try {
      await medicineAPI.toggleStatus(id);
      fetchMedicines();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-full animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-medium tracking-tight mb-2">Medicine Catalog</h1>
          <p className="text-[var(--color-text-secondary)] text-sm">Manage standard medicine dictionary and alternatives.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => setIsImportOpen(true)}>
            <Upload className="h-4 w-4" /> Import
          </Button>
          <Button className="gap-2" onClick={() => { setEditingMed(null); setIsModalOpen(true); }}>
            <Plus className="h-4 w-4" /> Add Medicine
          </Button>
        </div>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border-[var(--color-border-subtle)] min-h-[500px]">
        <div className="p-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] flex gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
            <Input 
              value={search} 
              onChange={e => { setSearch(e.target.value); setPage(1); }} 
              placeholder="Search by name, generic, or brand..." 
              className="pl-10 h-10 bg-white" 
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-auto bg-white">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[var(--color-text-secondary)] uppercase bg-[var(--color-bg-base)] sticky top-0 border-b border-[var(--color-border-subtle)] z-10">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">Medicine</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Generic/Brand</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Price (INR)</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
                <th className="px-6 py-4 text-right font-semibold tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)]">
              {loading ? (
                <tr><td colSpan={5} className="text-center p-8 text-gray-500">Loading medicines...</td></tr>
              ) : medicines.length === 0 ? (
                <tr><td colSpan={5} className="text-center p-8 text-gray-500">No medicines found.</td></tr>
              ) : medicines.map((med) => (
                <tr key={med._id} className="hover:bg-[var(--color-soft-green)] hover:bg-opacity-30 transition-colors group">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
                      <Pill className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium text-[var(--color-text-primary)]">{med.name}</div>
                      <div className="text-xs text-gray-500">{med.strength} • {med.dosageForm}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-700">{med.genericName || '-'}</div>
                    <div className="text-xs text-gray-400">{med.brandName}</div>
                  </td>
                  <td className="px-6 py-4 font-medium">₹{med.price?.toFixed(2) || '0.00'}</td>
                  <td className="px-6 py-4">
                    <Badge variant={med.isActive ? "success" : "default"}>
                      {med.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="outline" size="sm" onClick={() => toggleStatus(med._id)}>
                        {med.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => { setEditingMed(med); setIsModalOpen(true); }}>
                        Edit
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-[var(--color-border-subtle)] flex items-center justify-between bg-white text-sm">
          <span className="text-gray-500">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      </Card>

      <MedicineModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        medicine={editingMed}
        onSaved={fetchMedicines}
      />
      <ImportModal 
        isOpen={isImportOpen}
        onClose={() => { setIsImportOpen(false); fetchMedicines(); }}
        onImported={fetchMedicines}
      />
    </div>
  );
}
