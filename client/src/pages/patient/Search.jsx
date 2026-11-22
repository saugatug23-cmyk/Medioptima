import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { Search as SearchIcon, X, ArrowRight, Loader2, MapPin, Pill, Info, Plus, Map, Minus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { medicineAPI } from '../../services/api';
import { cn } from '../../lib/utils';
import { LocationSelector } from '../../components/location/LocationSelector';

export function Search() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch] = useDebounce(searchTerm, 300);
  
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [locationObj, setLocationObj] = useState(null);
  const [locationError, setLocationError] = useState('');
  
  const [errorMessage, setErrorMessage] = useState('');
  
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch medicines when debounced search changes
  useEffect(() => {
    const fetchMedicines = async () => {
      if (!debouncedSearch.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        setSearchError(false);
        return;
      }
      
      setIsSearching(true);
      setSearchError(false);
      try {
        const response = await medicineAPI.search(debouncedSearch);
        setSearchResults(response.data?.medicines || []);
      } catch (err) {
        console.error("Search failed:", err);
        setSearchError(true);
      } finally {
        setIsSearching(false);
      }
    };

    fetchMedicines();
  }, [debouncedSearch]);

  const handleSelectMedicine = (medicine) => {
    // Check if already added
    if (selectedMedicines.some(m => m._id === medicine._id)) {
      setErrorMessage(`${medicine.name} is already in your request.`);
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    setSelectedMedicines([
      ...selectedMedicines,
      { ...medicine, quantity: 1 }
    ]);
    
    setSearchTerm('');
    setShowDropdown(false);
    setErrorMessage('');
  };

  const handleRemoveMedicine = (id) => {
    setSelectedMedicines(selectedMedicines.filter(m => m._id !== id));
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setSelectedMedicines(selectedMedicines.map(m => 
      m._id === id ? { ...m, quantity: newQuantity } : m
    ));
  };

  const handleSubmit = () => {
    setErrorMessage('');
    setLocationError('');
    
    if (selectedMedicines.length === 0) {
      setErrorMessage('Please add at least one medicine.');
      return;
    }

    if (!locationObj || !locationObj.lat) {
      setLocationError('Please select your location.');
      return;
    }
    
    // Pass the payload in state
    navigate('/results', { 
      state: { 
        searchRequest: {
          medicines: selectedMedicines.map(m => ({
            id: m._id,
            name: m.name,
            quantity: m.quantity
          })),
          location: locationObj
        }
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col animate-fade-in pb-10">
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-tight mb-2">Find your medicines</h1>
        <p className="text-[var(--color-text-secondary)] text-sm max-w-xl">
          Search for the medicines you need and we'll help you find nearby pharmacies.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Search & Location */}
        <div className="flex-1 space-y-6">
          <Card className="border-[var(--color-border-subtle)] shadow-sm overflow-visible z-20">
            <div className="p-6">
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Search medicines</label>
              
              <div className="relative" ref={dropdownRef}>
                <div className="relative">
                  <SearchIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search medicine name..." 
                    className="pl-10 h-12 bg-white focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-base"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                  />
                  {isSearching && (
                    <div className="absolute right-3.5 top-3.5">
                      <Loader2 className="h-4 w-4 animate-spin text-[var(--color-primary)]" />
                    </div>
                  )}
                </div>

                {errorMessage && (
                  <div className="mt-2 text-sm text-[var(--color-warning)] bg-[var(--color-warning-bg)] border border-[var(--color-warning)]/20 px-3 py-2 rounded-md animate-fade-in">
                    {errorMessage}
                  </div>
                )}

                {/* Dropdown Results */}
                {showDropdown && searchTerm.trim().length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[var(--color-border-subtle)] rounded-xl shadow-elevated overflow-hidden z-50">
                    <div className="max-h-[300px] overflow-y-auto">
                      {isSearching ? (
                        <div className="p-4 text-center flex flex-col items-center justify-center gap-2 text-[var(--color-text-secondary)]">
                          <Loader2 className="h-5 w-5 animate-spin text-[var(--color-primary)]" />
                          <p className="text-sm">Searching medicines...</p>
                        </div>
                      ) : searchError ? (
                        <div className="p-6 text-center text-[var(--color-text-secondary)]">
                          <p className="font-medium text-[var(--color-text-primary)] mb-1">We couldn't load medicines right now.</p>
                          <button onClick={() => setSearchTerm(searchTerm + ' ')} className="text-sm text-[var(--color-primary)] hover:underline font-medium">Try again</button>
                        </div>
                      ) : searchResults.length === 0 ? (
                        <div className="p-6 text-center text-[var(--color-text-secondary)]">
                          <p className="font-medium text-[var(--color-text-primary)] mb-1">No matching medicines found.</p>
                          <p className="text-sm">Try searching again with a different name.</p>
                        </div>
                      ) : (
                        searchResults.map(medicine => (
                          <div 
                            key={medicine._id}
                            className="p-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 cursor-pointer flex items-center justify-between group transition-colors"
                            onClick={() => handleSelectMedicine(medicine)}
                          >
                            <div>
                              <p className="font-medium text-sm text-[var(--color-text-primary)]">{medicine.name}</p>
                              <div className="flex items-center gap-2 mt-0.5 text-xs text-[var(--color-text-secondary)]">
                                <span>{medicine.genericName}</span>
                                {medicine.strength && (
                                  <>
                                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                                    <span>{medicine.strength}</span>
                                  </>
                                )}
                                {medicine.dosageForm && (
                                  <>
                                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                                    <span>{medicine.dosageForm}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 text-[var(--color-primary)] hover:bg-[var(--color-soft-green)]">
                              <Plus className="h-4 w-4 mr-1" /> Add
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card className="border-[var(--color-border-subtle)] shadow-sm">
            <div className="p-6">
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Choose your location</label>
              <LocationSelector 
                location={locationObj} 
                setLocation={setLocationObj} 
                error={locationError} 
              />
            </div>
          </Card>
        </div>

        {/* Right Column: Selected Medicines */}
        <div className="w-full lg:w-[400px]">
          <Card className="border-[var(--color-border-subtle)] shadow-elevated h-full flex flex-col">
            <CardHeader className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] rounded-t-xl pb-4">
              <CardTitle className="text-lg flex items-center justify-between">
                Your medicines
                {selectedMedicines.length > 0 && (
                  <span className="bg-[var(--color-soft-green)] text-[var(--color-primary-dark)] text-xs font-semibold px-2.5 py-1 rounded-full">
                    {selectedMedicines.length} items
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-0 flex-1 flex flex-col">
              {selectedMedicines.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-10 text-center bg-gray-50/50 min-h-[300px]">
                  <div className="h-12 w-12 rounded-full bg-[var(--color-bg-base)] flex items-center justify-center mb-4 border border-[var(--color-border-subtle)]">
                    <Pill className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">Start by adding the medicines you need.</p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                    Search for them on the left.
                  </p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto max-h-[400px]">
                  <div className="divide-y divide-[var(--color-border-subtle)]">
                    {selectedMedicines.map(medicine => (
                      <div key={medicine._id} className="p-5 bg-white group animate-fade-in">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-medium text-sm text-[var(--color-text-primary)] leading-tight">{medicine.name}</p>
                            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                              {medicine.dosageForm} {medicine.strength && `Ã‚Â· ${medicine.strength}`}
                            </p>
                          </div>
                          <button 
                            onClick={() => handleRemoveMedicine(medicine._id)}
                            className="text-gray-400 hover:text-[var(--color-danger)] transition-colors p-1 -mr-1"
                            title="Remove"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3 bg-gray-50 rounded-lg p-2 border border-gray-100">
                          <span className="text-xs font-medium text-gray-500 pl-1">Quantity</span>
                          <div className="flex items-center gap-3">
                            <button 
                              className="h-6 w-6 flex items-center justify-center rounded-md bg-white border border-gray-200 text-gray-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors disabled:opacity-50"
                              onClick={() => handleUpdateQuantity(medicine._id, medicine.quantity - 1)}
                              disabled={medicine.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-sm font-medium w-4 text-center">{medicine.quantity}</span>
                            <button 
                              className="h-6 w-6 flex items-center justify-center rounded-md bg-white border border-gray-200 text-gray-600 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
                              onClick={() => handleUpdateQuantity(medicine._id, medicine.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        
                        {medicine.prescriptionRequired && (
                          <div className="mt-3 flex items-start gap-1.5 text-xs text-[var(--color-text-secondary)] bg-blue-50/50 p-2 rounded-md">
                            <Info className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                            <span>Prescription required for this item</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="p-5 bg-white border-t border-[var(--color-border-subtle)] rounded-b-xl">
                {errorMessage && <p className="text-sm text-red-500 mb-3 text-center">{errorMessage}</p>}
                <Button 
                  className="w-full h-12 text-base" 
                  disabled={selectedMedicines.length === 0 || !locationObj}
                  onClick={handleSubmit}
                >
                  Find My Medicines
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
