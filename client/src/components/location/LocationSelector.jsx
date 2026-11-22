import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Search, Map as MapIcon, Check, Loader2, AlertTriangle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

// Map Events component to handle clicks
function LocationMarker({ position, setPosition }) {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

import { searchLocation } from './locationProvider';

export function LocationSelector({ location, setLocation, error }) {
  const [mode, setMode] = useState('browser'); // browser, map, search
  const [position, setPosition] = useState(location ? { lat: location.lat, lng: location.lng } : null);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [localError, setLocalError] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 3) {
        setIsSearching(true);
        const results = await searchLocation(searchQuery);
        setSearchResults(results);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSelectSearchResult = (res) => {
    const coords = { lat: res.lat, lng: res.lng };
    setPosition(coords);
    setLocation(coords);
    setSearchQuery(res.label);
    setSearchResults([]);
    setMode('map');
  };

  // 3. USE BROWSER GEOLOCATION
  const requestBrowserLocation = () => {
    setLoadingMsg('Requesting location access...');
    setLocalError('');
    
    if (!navigator.geolocation) {
      setLocalError('Geolocation is not supported by your browser.');
      setLoadingMsg('');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPosition(coords);
        setLocation(coords);
        setMode('map'); // switch to map to show "You are here"
        setLoadingMsg('');
      },
      (err) => {
        setLoadingMsg('');
        if (err.code === 1) {
          setLocalError("We couldn't access your current location. You can choose a location on the map instead.");
        } else if (err.code === 2) {
          setLocalError("Position unavailable. Please select on map.");
        } else {
          setLocalError("Location request timed out. Please select on map.");
        }
        setMode('map'); // Fallback to map mode
      },
      { timeout: 10000 }
    );
  };

  const handleConfirmLocation = () => {
    if (position) {
      setLocation({ lat: position.lat, lng: position.lng });
      setLocalError('');
    }
  };

  return (
    <div className="space-y-4">
      {/* 2. ADD A REAL LOCATION SELECTOR */}
      <div className="flex gap-2 mb-3">
        <Button 
          variant={mode === 'browser' ? 'default' : 'outline'} 
          onClick={() => { setMode('browser'); requestBrowserLocation(); }}
          className="flex-1 text-xs sm:text-sm h-10"
        >
          <Navigation className="h-4 w-4 mr-2" />
          Current location
        </Button>
        <Button 
          variant={mode === 'search' ? 'default' : 'outline'} 
          onClick={() => setMode('search')}
          className="flex-1 text-xs sm:text-sm h-10"
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
        <Button 
          variant={mode === 'map' ? 'default' : 'outline'} 
          onClick={() => setMode('map')}
          className="flex-1 text-xs sm:text-sm h-10"
        >
          <MapIcon className="h-4 w-4 mr-2" />
          Map
        </Button>
      </div>

      {mode === 'search' && (
        <div className="relative mb-3">
          <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search for an address or area..." 
            className="pl-10 h-10 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {isSearching && <Loader2 className="absolute right-3.5 top-3 h-4 w-4 animate-spin text-gray-400" />}
          
          {searchResults.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-[var(--color-border-subtle)] rounded-lg shadow-lg overflow-hidden">
              {searchResults.map((res, i) => (
                <button
                  key={i}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 text-sm text-[var(--color-text-primary)]"
                  onClick={() => handleSelectSearchResult(res)}
                >
                  {res.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {(error || localError) && (
        <div className="text-red-500 text-sm flex items-start gap-2 bg-red-50 p-3 rounded-md border border-red-100">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <p>{error || localError}</p>
        </div>
      )}

      {loadingMsg && (
        <div className="flex items-center gap-2 text-sm text-[var(--color-primary)]">
          <Loader2 className="h-4 w-4 animate-spin" /> {loadingMsg}
        </div>
      )}

      {/* 5. REAL MAP */}
      {mode === 'map' && (
        <div className="border border-[var(--color-border-subtle)] rounded-xl overflow-hidden relative shadow-sm">
          <div className="h-[250px] w-full relative z-0">
            <MapContainer 
              center={position || [20.5937, 78.9629]} // India default
              zoom={position ? 15 : 4} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker position={position} setPosition={setPosition} />
            </MapContainer>
          </div>
          
          <div className="p-3 bg-white flex items-center justify-between z-10 relative">
            <div className="text-sm text-gray-600">
              {position ? (
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <Check className="h-4 w-4" /> Location pinned
                </span>
              ) : (
                "Click on the map to set location"
              )}
            </div>
            <Button 
              size="sm" 
              onClick={handleConfirmLocation} 
              disabled={!position}
            >
              Confirm location
            </Button>
          </div>
        </div>
      )}

      {location && mode !== 'map' && (
        <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-800">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-medium">Location selected</span>
          </div>
          <span className="text-xs text-emerald-600 font-mono">
            {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
          </span>
        </div>
      )}
    </div>
  );
}
