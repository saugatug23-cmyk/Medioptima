import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Navigation2, CheckCircle2, ChevronLeft, MapPin, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { routingAPI } from '../../services/api';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const userIcon = L.divIcon({
  className: 'custom-user-icon',
  html: `<div style="background-color: #3b82f6; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 8px rgba(59,130,246,0.8);"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const createNumberedIcon = (num) => L.divIcon({
  className: 'custom-number-icon',
  html: `<div style="background-color: #047857; color: white; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">${num}</div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

function MapFitter({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, bounds]);
  return null;
}

export function MapView() {
  const location = useLocation();
  const navigate = useNavigate();
  const plan = location.state?.plan;
  const userLocation = location.state?.userLocation;

  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!plan || !plan.selectedPharmacies || !userLocation) {
      navigate('/search');
      return;
    }

    const fetchRoute = async () => {
      try {
        setLoading(true);
        const res = await routingAPI.calculateRoute(userLocation, plan.selectedPharmacies);
        if (res && res.data && res.data.route) {
          setRouteData(res.data.route);
        } else {
          setError('Routing service unavailable.');
        }
      } catch (err) {
        console.error('Failed to calculate route:', err);
        setError('Could not connect to routing service.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [plan, userLocation, navigate]);

  if (loading) {
    return (
      <div className="h-[calc(100vh-100px)] flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[var(--color-primary)] mb-4" />
        <p>Calculating your optimal route...</p>
      </div>
    );
  }

  if (error || !routeData) {
    return (
      <div className="h-[calc(100vh-100px)] flex flex-col items-center justify-center text-center p-4">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h2 className="text-xl font-medium">Route could not be calculated</h2>
        <p className="text-gray-500 mb-6">{error || 'An unexpected error occurred.'}</p>
        <Button onClick={() => navigate('/results')}>Back to Results</Button>
      </div>
    );
  }

  // Calculate Bounds
  const allPoints = [];
  if (userLocation?.lat) allPoints.push([userLocation.lat, userLocation.lng]);
  routeData.orderedStops.forEach(p => {
    if (p.latitude && p.longitude) allPoints.push([p.latitude, p.longitude]);
  });
  if (routeData.geometry && routeData.geometry.length > 0) {
    routeData.geometry.forEach(p => allPoints.push([p[0], p[1]]));
  }
  const bounds = allPoints.length > 1 ? L.latLngBounds(allPoints) : null;
  const center = userLocation?.lat ? [userLocation.lat, userLocation.lng] : [20.59, 78.96];

  const totalTimeStr = routeData.duration ? `${Math.round(routeData.duration)} min drive` : (plan.maxDeliveryTime ? `${plan.maxDeliveryTime} min est.` : 'Time unknown');
  const totalDistStr = routeData.distance ? `${routeData.distance.toFixed(1)} km` : (plan.totalDistance ? `${plan.totalDistance.toFixed(1)} km` : 'Dist unknown');

  // Multi-pharmacy route header
  const headerPharmacyName = routeData.orderedStops.length > 1 
    ? `${routeData.orderedStops.length} Pharmacies` 
    : (routeData.orderedStops[0]?.name || 'Pharmacy');

  return (
    <div className="h-full flex flex-col -m-4 md:-m-8 animate-fade-in bg-[var(--color-bg-base)]">
      {/* Top Bar */}
      <div className="bg-white border-b border-[var(--color-border-subtle)] p-4 flex items-center gap-4 z-10 shadow-sm relative">
        <Button variant="ghost" size="icon" asChild>
          <button onClick={() => navigate(-1)}><ChevronLeft className="h-5 w-5" /></button>
        </Button>
        <div>
          <h1 className="font-medium text-[var(--color-text-primary)]">Active Route</h1>
          <p className="text-xs text-[var(--color-text-secondary)]">{headerPharmacyName} Ã¢â‚¬Â¢ {totalTimeStr}</p>
        </div>
        <div className="ml-auto">
          <Button size="sm" className="gap-2 px-6">
            <Navigation2 className="h-4 w-4" /> Start
          </Button>
        </div>
      </div>

            {!plan.isComplete && (
        <div className="bg-amber-50 border-b border-amber-200 p-3 flex items-start gap-3 z-10 relative">
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
          <div className="text-sm text-amber-800">
            <strong>Complete fulfilment is not currently available nearby.</strong><br />
            {plan.missingMedicines?.map(m => (
              <span key={m.id} className="block mt-1">â€¢ Missing {m.missingQty} units of {m.name}</span>
            ))}
          </div>
        </div>
      )}

      {/* Map Area */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center z-0">
        <MapContainer 
          center={center} 
          zoom={13} 
          style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapFitter bounds={bounds} />

          {userLocation?.lat && (
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
              <Popup><strong>Current Location</strong></Popup>
            </Marker>
          )}

          {routeData.orderedStops.map((pharm, index) => {
            const allocs = plan.allocation.filter(a => a.pharmacyId === pharm.id || a.pharmacyId === pharm.pharmacyId);
            return (
              <Marker 
                key={pharm.id || pharm.pharmacyId} 
                position={[pharm.latitude, pharm.longitude]} 
                icon={createNumberedIcon(index + 1)}
              >
                <Popup>
                  <div className="text-sm font-bold mb-1">{pharm.name}</div>
                  <div className="text-xs text-gray-600 mb-2">{pharm.address}</div>
                  <div className="text-xs border-t pt-1">
                    <strong>Pick up:</strong>
                    <ul className="list-disc pl-3 mt-1">
                      {allocs.map(a => (
                        <li key={a.medicineId}>{a.quantity}x {a.medicineName}</li>
                      ))}
                    </ul>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {routeData.geometry && (
            <Polyline 
              positions={routeData.geometry} 
              pathOptions={{ color: '#047857', weight: 5, opacity: 0.8 }} 
            />
          )}
        </MapContainer>

        {/* Route Card overlay */}
        <Card className="absolute bottom-6 left-6 right-6 md:left-auto md:w-96 shadow-elevated border-[var(--color-border-subtle)] z-20 max-h-[60vh] overflow-y-auto">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-6 pb-4 border-b border-[var(--color-border-subtle)]">
              <h3 className="font-medium text-[var(--color-text-primary)]">Route Summary</h3>
              <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-50 text-blue-700">Visit Plan: {routeData.orderedStops.length > 1 ? 'Multi-Stop' : 'Single-Stop'}</span>
              <div className="text-right">
                <span className="text-lg font-medium text-[var(--color-primary-dark)]">{totalTimeStr.split(' ')[0]} {totalTimeStr.split(' ')[1]}</span>
                <p className="text-xs text-[var(--color-text-secondary)]">{totalDistStr}</p>
              </div>
            </div>
            
            <div className="space-y-6 relative">
              <div className="absolute left-[13px] top-4 bottom-4 w-px bg-[var(--color-border-subtle)] border-dashed border-l"></div>
              
              <div className="flex gap-5 relative z-10">
                <div className="w-7 h-7 rounded-full bg-white text-[var(--color-text-secondary)] flex items-center justify-center text-xs font-bold border-2 border-[var(--color-border-subtle)] shrink-0">
                  <MapPin className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">Current Location</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">Start Route</p>
                </div>
              </div>
              
              {routeData.orderedStops.map((pharm, idx) => {
                const allocs = plan.allocation.filter(a => a.pharmacyId === pharm.id || a.pharmacyId === pharm.pharmacyId);
                return (
                  <div key={pharm.id || pharm.pharmacyId} className="flex gap-5 relative z-10">
                    <div className="w-7 h-7 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-xs font-bold shadow-soft shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">{pharm.name}</p>
                      <p className="text-xs text-[var(--color-text-secondary)] mb-2 truncate">
                        Pick up: {allocs.map(a => a.medicineName).join(', ')}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-[var(--color-emerald-accent)] font-medium bg-[var(--color-soft-green)] w-fit px-2 py-1 rounded-md">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Ready for pickup
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
