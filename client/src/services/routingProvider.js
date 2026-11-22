import polyline from '@mapbox/polyline';

// Abstract routing provider interface
const ROUTING_PROVIDER = import.meta.env.VITE_ROUTING_PROVIDER || 'osrm'; // 'osrm', 'mapbox', 'none'
const ROUTING_API_KEY = import.meta.env.VITE_ROUTING_API_KEY || '';

export const getRoute = async (origin, destinations) => {
  if (ROUTING_PROVIDER === 'none') {
    return null;
  }

  try {
    if (ROUTING_PROVIDER === 'osrm') {
      // OSRM public demo server (development only). For production, run own instance.
      // Format: longitude,latitude
      const coords = [
        \,\,
        ...destinations.map(d => \,\)
      ].join(';');

      const url = https://router.project-osrm.org/route/v1/driving/\?overview=full&geometries=geojson;
      const res = await fetch(url);
      const data = await res.json();

      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        // OSRM geojson returns array of [lng, lat]
        const pathCoords = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
        return {
          path: pathCoords,
          distance: route.distance / 1000, // meters to km
          duration: route.duration / 60, // seconds to min
        };
      }
    } else if (ROUTING_PROVIDER === 'mapbox') {
      // Implementation for mapbox
    }
    
    return null;
  } catch (error) {
    console.error('Routing error:', error);
    return null;
  }
};
