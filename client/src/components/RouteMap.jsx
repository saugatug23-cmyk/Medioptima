import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Clock, Navigation, AlertTriangle } from 'lucide-react';

// Fix Leaflet's default icon path issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to recenter map when route changes
function ChangeView({ bounds }) {
  const map = useMap();
  if (bounds) {
    map.fitBounds(bounds, { padding: [50, 50] });
  }
  return null;
}

// Function to calculate Euclidean distance (heuristic for TSP)
const calcDist = (lat1, lon1, lat2, lon2) => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;  
  const dLon = (lon2 - lon1) * Math.PI / 180; 
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
};

// Custom numbered icon generator
const createNumberedIcon = (number) => {
  return L.divIcon({
    className: 'custom-numbered-marker',
    html: `<div style="
      background-color: #047857; 
      color: white; 
      border-radius: 50%; 
      width: 28px; 
      height: 28px; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      font-weight: bold;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    ">${number}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

  const createUserIcon = () => {
    return L.divIcon({
      className: 'custom-user-marker',
      html: `<div style="
        background-color: #3b82f6; 
        color: white; 
        border-radius: 50%; 
        width: 32px; 
        height: 32px; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
      "><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

export function RouteMap({ pharmacies, allocations, userLocation, missingMedicines }) {
  const [route, setRoute] = useState([]);
  const [totalDist, setTotalDist] = useState(0);
  const [mapBounds, setMapBounds] = useState(null);

  // Fallback user location if none provided (Mumbai)
  const defaultUser = { lat: 18.922, lng: 72.83 };
  const origin = (userLocation && userLocation.lat && userLocation.lng) ? userLocation : defaultUser;

  useEffect(() => {
    if (!pharmacies || pharmacies.length === 0) return;

    // Filter valid pharmacies
    const validPharmacies = pharmacies.filter(p => p.latitude && p.longitude);
    if (validPharmacies.length === 0) return;

    // Nearest Neighbor TSP Heuristic
    let currentPos = { lat: origin.lat, lng: origin.lng };
    let unvisited = [...validPharmacies];
    let orderedRoute = [];
    let calcTotalDist = 0;

    while (unvisited.length > 0) {
      let nearestIdx = 0;
      let minD = Infinity;

      for (let i = 0; i < unvisited.length; i++) {
        const d = calcDist(currentPos.lat, currentPos.lng, unvisited[i].latitude, unvisited[i].longitude);
        if (d < minD) {
          minD = d;
          nearestIdx = i;
        }
      }

      const nextPharmacy = unvisited[nearestIdx];
      calcTotalDist += minD;
      orderedRoute.push(nextPharmacy);
      currentPos = { lat: nextPharmacy.latitude, lng: nextPharmacy.longitude };
      unvisited.splice(nearestIdx, 1);
    }

    setRoute(orderedRoute);
    setTotalDist(calcTotalDist);

    // Calculate map bounds to fit route
    const coords = [
      [origin.lat, origin.lng],
      ...orderedRoute.map(p => [p.latitude, p.longitude])
    ];
    
    if (coords.length > 1) {
      setMapBounds(L.latLngBounds(coords));
    }
  }, [pharmacies, userLocation]);

  if (!pharmacies || pharmacies.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200">
        <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-800">No route available</h3>
        <p className="text-sm text-gray-500 mt-2">There are no selected pharmacies to route to.</p>
      </div>
    );
  }

  // Path coordinates
  const pathCoords = [
    [origin.lat, origin.lng],
    ...route.map(p => [p.latitude, p.longitude])
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-8 mb-8">
      <div className="p-5 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Navigation className="h-5 w-5 text-[#047857]" />
          Best Pharmacy Route
        </h2>
        {missingMedicines?.length > 0 && (
          <p className="text-sm text-amber-600 mt-2 flex items-start gap-1.5">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>This route covers available medicines only. Partial fulfillment detected.</span>
          </p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Map Container */}
        <div className="w-full lg:w-2/3 h-[400px] lg:h-[500px] relative z-0">
          {mapBounds && (
            <MapContainer 
              center={[origin.lat, origin.lng]} 
              zoom={13} 
              style={{ height: '100%', width: '100%', zIndex: 1 }}
              scrollWheelZoom={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              
              <ChangeView bounds={mapBounds} />

              <Marker position={[origin.lat, origin.lng]} icon={createUserIcon()}>
                <Popup>
                  <strong>Your Location</strong>
                </Popup>
              </Marker>

              {route.map((pharm, index) => (
                <Marker 
                  key={pharm.id} 
                  position={[pharm.latitude, pharm.longitude]} 
                  icon={createNumberedIcon(index + 1)}
                >
                  <Popup>
                    <div className="min-w-[200px]">
                      <h3 className="font-bold text-gray-900">{pharm.name}</h3>
                      <p className="text-xs text-gray-600 mb-2">{pharm.address}</p>
                      
                      {pharm.reliabilityScore && (
                        <div className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded inline-block mb-2">
                          Reliability: {(pharm.reliabilityScore * 100).toFixed(0)}%
                        </div>
                      )}

                      <div className="mt-2 border-t pt-2">
                        <h4 className="text-xs font-semibold text-gray-700 mb-1">Pick up here:</h4>
                        <ul className="text-xs text-gray-600 list-disc pl-3">
                          {allocations?.filter(a => a.pharmacyId === pharm.id).map(alloc => (
                            <li key={alloc.medicineId}>
                              {alloc.quantity}x {alloc.medicineName}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}

              <Polyline 
                positions={pathCoords} 
                pathOptions={{ color: '#047857', weight: 4, opacity: 0.7, dashArray: '10, 10' }} 
              />
            </MapContainer>
          )}
        </div>

        {/* Route Details Panel */}
        <div className="w-full lg:w-1/3 bg-white p-6 border-l border-gray-100 flex flex-col max-h-[500px] overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Pharmacy Route</h3>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-500 font-medium mb-1">Total Distance</p>
              <p className="text-lg font-bold text-gray-900">{totalDist.toFixed(1)} km</p>
            </div>
            
            {/* Find max estimated travel time from the pharmacies if available */}
            {route.some(p => p.estimatedDeliveryTime) ? (
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 font-medium mb-1">Est. Travel Time</p>
                <p className="text-lg font-bold text-gray-900 flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-emerald-600" />
                  {Math.max(...route.map(p => p.estimatedDeliveryTime || 0))} min
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 font-medium mb-1">Stops</p>
                <p className="text-lg font-bold text-gray-900">{route.length}</p>
              </div>
            )}
          </div>

          <div className="relative pl-6 pb-2">
            <div className="absolute top-2 bottom-0 left-[11px] w-0.5 bg-gray-200"></div>
            
            {/* Start Node */}
            <div className="relative mb-6">
              <div className="absolute -left-[29px] top-1 h-4 w-4 rounded-full border-2 border-blue-500 bg-white"></div>
              <p className="font-semibold text-gray-900 text-sm">Start: Your Location</p>
            </div>

            {/* Route Nodes */}
            {route.map((pharm, index) => (
              <div key={pharm.id} className="relative mb-6">
                <div className="absolute -left-[31px] top-0 h-5 w-5 rounded-full bg-[#047857] text-white flex items-center justify-center text-[10px] font-bold">
                  {index + 1}
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">{pharm.name}</h4>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{pharm.address}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
