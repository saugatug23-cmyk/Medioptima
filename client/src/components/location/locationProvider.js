// locationProvider.js
// Abstracts geocoding behind an environment variable configuration
const GEOCODING_PROVIDER = import.meta.env.VITE_GEOCODING_PROVIDER || 'none';
const GEOCODING_API_KEY = import.meta.env.VITE_GEOCODING_API_KEY || '';

// Simple in-memory cache
const cache = new Map();

export const searchLocation = async (query) => {
  if (!query || query.length < 3) return [];
  
  if (cache.has(query)) {
    return cache.get(query);
  }

  if (GEOCODING_PROVIDER === 'none') {
    return []; // Graceful degradation as requested
  }

  try {
    let results = [];
    
    // Abstract interface handling different providers
    if (GEOCODING_PROVIDER === 'mapbox') {
      const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${GEOCODING_API_KEY}`);
      const data = await res.json();
      results = (data.features || []).map(f => ({
        label: f.place_name,
        lat: f.center[1],
        lng: f.center[0]
      }));
    } else if (GEOCODING_PROVIDER === 'google') {
       // Future expansion
    }
    
    cache.set(query, results);
    return results;
  } catch (error) {
    console.error('Geocoding error:', error);
    return [];
  }
};
