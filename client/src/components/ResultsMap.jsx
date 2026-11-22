import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet icon issue in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons
const createIcon = (color) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const userIcon = L.divIcon({
  className: 'custom-user-icon',
  html: `<div style="background-color: #3b82f6; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 8px rgba(59,130,246,0.8);"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

// Component to handle auto-fitting bounds
function MapFitter({ pharmacies, userLocation, activePharmacyId }) {
  const map = useMap();

  useEffect(() => {
    if (activePharmacyId) {
      const p = pharmacies.find(ph => ph.pharmacyId === activePharmacyId);
      if (p && p.latitude && p.longitude) {
        map.flyTo([p.latitude, p.longitude], 15);
      }
    } else {
      const bounds = L.latLngBounds();
      if (userLocation && userLocation.lat && userLocation.lng) {
        bounds.extend([userLocation.lat, userLocation.lng]);
      }
      pharmacies.forEach(p => {
        if (p.latitude && p.longitude) {
          bounds.extend([p.latitude, p.longitude]);
        }
      });
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [map, pharmacies, userLocation, activePharmacyId]);

  return null;
}

export function ResultsMap({ pharmacies, userLocation, activePharmacyId, onMarkerClick }) {
  const center = userLocation?.lat ? [userLocation.lat, userLocation.lng] : [20.5937, 78.9629];

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm relative z-0">
      <MapContainer 
        center={center} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapFitter pharmacies={pharmacies} userLocation={userLocation} activePharmacyId={activePharmacyId} />

        {userLocation?.lat && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>
              <strong>You are here</strong>
            </Popup>
          </Marker>
        )}

        {pharmacies.map((pharm) => {
          if (!pharm.latitude || !pharm.longitude) return null;
          
          let color = '#ef4444'; // red
          if (pharm.availabilitySummary === 'Fully Available') color = '#10b981'; // green
          else if (pharm.availabilitySummary === 'Partially Available') color = '#f59e0b'; // amber
          
          return (
            <Marker 
              key={pharm.pharmacyId} 
              position={[pharm.latitude, pharm.longitude]} 
              icon={createIcon(color)}
              eventHandlers={{
                click: () => onMarkerClick(pharm.pharmacyId)
              }}
            >
              <Popup>
                <div className="text-sm font-medium">
                  {pharm.name}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {pharm.distance !== null ? `${pharm.distance.toFixed(1)} km away` : ''}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
