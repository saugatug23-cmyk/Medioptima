import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  Loader2, ArrowLeft, CheckCircle2, 
  AlertTriangle, XCircle, Store, Clock, MapPin
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { searchAPI, optimizationAPI } from '../../services/api';
import { ResultsMap } from '../../components/ResultsMap';

export function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchRequest = location.state?.searchRequest;

  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [backendMessage, setBackendMessage] = useState('');
  const [activePharmacyId, setActivePharmacyId] = useState(null);
  const [optimizing, setOptimizing] = useState(false);

  const handleOptimize = async () => {
    try {
      setOptimizing(true);
      const res = await optimizationAPI.getPharmacyPlan({
        medicines: searchRequest.medicines,
        location: searchRequest.location
      });
      navigate('/map', { state: { plan: res.data.plan, userLocation: searchRequest.location } });
    } catch (err) {
      console.error('Optimization failed:', err);
      setError(err.response?.data?.message || 'Failed to calculate optimized route.');
    } finally {
      setOptimizing(false);
    }
  };

  useEffect(() => {
    if (!searchRequest || !searchRequest.medicines || searchRequest.medicines.length === 0) {
      navigate('/search', { replace: true });
      return;
    }
    fetchAvailability();
  }, [searchRequest, navigate]);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await searchAPI.searchMedicines(searchRequest);
      setPharmacies(res.data?.pharmacies || []);
      if (res.message && res.message !== 'success') {
        setBackendMessage(res.message);
      }
    } catch (err) {
      console.error('Availability check failed:', err);
      if (err.response?.status === 400 && err.response?.data?.message?.includes('location')) {
        setError('Please select your location to find nearby pharmacies.');
      } else {
        setError("We couldn't load pharmacy availability right now. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <Loader2 className="h-10 w-10 animate-spin text-[var(--color-primary)] mb-4" />
        <h2 className="text-xl font-medium text-[var(--color-text-primary)]">Searching nearby pharmacies...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in text-center p-4">
        <AlertTriangle className="h-12 w-12 text-red-400 mb-4" />
        <h2 className="text-xl font-medium">{error}</h2>
        <Button onClick={() => navigate('/search')} className="mt-6">Modify Search</Button>
      </div>
    );
  }

  if (pharmacies.length === 0 || backendMessage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in text-center p-4">
        <Store className="h-12 w-12 text-gray-400 mb-4" />
        <h2 className="text-xl font-medium">
          {backendMessage || 'No nearby pharmacies were found in your selected area.'}
        </h2>
        <Button onClick={() => navigate('/search')} className="mt-6">Modify Search</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-100px)] flex flex-col animate-fade-in pb-4">
      <div className="flex items-center gap-3 mb-6 shrink-0">
        <Link to="/search" className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Availability Results</h1>
          <p className="text-[var(--color-text-secondary)] text-sm flex items-center gap-1 mt-1">
            <MapPin className="h-3.5 w-3.5" />
            Showing inventory near your location
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Left Column: Results List */}
        <div className="w-full lg:w-1/2 flex flex-col min-h-0">
          <div className="overflow-y-auto pr-2 space-y-4 pb-12">
            {pharmacies.map((pharmacy) => (
              <Card 
                key={pharmacy.pharmacyId} 
                className={`border transition-all cursor-pointer ${
                  activePharmacyId === pharmacy.pharmacyId 
                    ? 'border-[var(--color-primary)] shadow-md ring-1 ring-[var(--color-primary)]' 
                    : 'border-[var(--color-border-subtle)] hover:border-gray-300'
                }`}
                onClick={() => setActivePharmacyId(pharmacy.pharmacyId)}
              >
                <CardContent className="p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-1">
                    <h2 className="text-lg font-medium">{pharmacy.name}</h2>
                    <div className="mt-2 sm:mt-0">
                      <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-md border ${
                        pharmacy.availabilitySummary === 'Fully Available' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
                        pharmacy.availabilitySummary === 'Partially Available' ? 'text-amber-700 bg-amber-50 border-amber-200' :
                        pharmacy.availabilitySummary === 'Not Reported' ? 'text-gray-600 bg-gray-100 border-gray-200' :
                        'text-red-700 bg-red-50 border-red-200'
                      }`}>
                        {pharmacy.availabilitySummary}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-text-secondary)] mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> 
                      {pharmacy.distance !== null ? `${pharmacy.distance.toFixed(1)} km away` : 'Distance unavailable'}
                    </span>
                    {pharmacy.inventoryLastUpdated && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span className="flex items-center gap-1 text-gray-600 font-medium">
                          <Clock className="h-3.5 w-3.5" />
                          Updated: {new Date(pharmacy.inventoryLastUpdated).toLocaleString()}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="space-y-2 mt-4">
                    {pharmacy.requestedMedicines.map((med) => (
                      <div key={med.medicineId} className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 bg-gray-50 rounded border border-gray-100">
                        <div className="flex items-center gap-2">
                          {med.status === 'available' ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                          ) : med.status === 'partial' ? (
                            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                          ) : med.status === 'not_reported' ? (
                            <AlertTriangle className="h-4 w-4 text-gray-400 shrink-0" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                          )}
                          <span className="font-medium text-sm text-gray-800">
                            {med.medicineName}
                          </span>
                        </div>
                        
                        <div className="flex flex-col items-end mt-2 sm:mt-0">
                          <div className="flex items-center gap-2">
                            {med.status === 'not_reported' ? (
                              <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                                Not Reported
                              </span>
                            ) : med.status === 'out_of_stock' ? (
                              <span className="text-xs font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                                Out of Stock
                              </span>
                            ) : (
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${med.status === 'available' ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 'text-amber-700 bg-amber-50 border-amber-100'}`}>
                                {med.availableQuantity} available (Req. {med.requestedQuantity})
                              </span>
                            )}
                          </div>
                          {(med.status === 'available' || med.status === 'partial') && (
                            <span className="text-xs text-gray-500 mt-1">
                              â‚¹{med.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="sticky bottom-0 bg-white p-4 border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] mt-auto z-10 rounded-b-xl">
            <Button 
              className="w-full h-12 text-base font-semibold shadow-sm"
              onClick={handleOptimize}
              disabled={optimizing}
            >
              {optimizing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Calculating Best Route...
                </>
              ) : 'Find Best Route & Pick up'}
            </Button>
          </div>
        </div>

        {/* Right Column: Map */}
        <div className="w-full lg:w-1/2 h-[400px] lg:h-full min-h-[400px]">
          <ResultsMap 
            pharmacies={pharmacies} 
            userLocation={searchRequest.location} 
            activePharmacyId={activePharmacyId}
            onMarkerClick={setActivePharmacyId}
          />
        </div>
      </div>
    </div>
  );
}
