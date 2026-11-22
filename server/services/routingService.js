const axios = require('axios');

exports.calculateRoute = async (origin, destinations) => {
  const provider = process.env.ROUTING_PROVIDER || 'osrm';
  
  // Basic Nearest Neighbor to order destinations based on straight-line distance
  let currentPos = { lat: origin.lat, lng: origin.lng };
  let unvisited = [...destinations];
  let orderedStops = [];
  
  function calcDist(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 2.0; 
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;  
    const dLon = (lon2 - lon1) * Math.PI / 180; 
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c;
  }

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

    const nextStop = unvisited[nearestIdx];
    orderedStops.push(nextStop);
    currentPos = { lat: nextStop.latitude, lng: nextStop.longitude };
    unvisited.splice(nearestIdx, 1);
  }

  if (provider === 'none') {
    return { geometry: null, distance: null, duration: null, orderedStops };
  }

  try {
    if (provider === 'osrm') {
      const coords = [
        `${origin.lng},${origin.lat}`,
        ...orderedStops.map(d => `${d.longitude},${d.latitude}`)
      ].join(';');

      const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;
      const res = await axios.get(url);
      const data = res.data;

      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const pathCoords = route.geometry.coordinates.map(coord => [coord[1], coord[0]]); // Leaflet uses [lat, lng]
        
        return {
          geometry: pathCoords,
          distance: route.distance / 1000, // km
          duration: route.duration / 60, // minutes
          orderedStops
        };
      }
    }
  } catch (error) {
    console.error('Routing provider error:', error.message);
  }

  // Fallback if routing fails
  return { geometry: null, distance: null, duration: null, orderedStops };
};
