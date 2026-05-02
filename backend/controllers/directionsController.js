const axios = require('axios');

const ORS_KEY = process.env.OPENROUTESERVICE_API_KEY || process.env.ORS_API_KEY;

/**
 * OpenRouteService — preference: shortest (mesafe açısından en kısa rota).
 */
async function fetchOpenRouteService(coordinates, profile) {
  if (!ORS_KEY) return null;
  try {
    const { data } = await axios.post(
      `https://api.openrouteservice.org/v2/directions/${profile}/geojson`,
      {
        coordinates,
        preference: 'shortest',
        units: 'm',
      },
      {
        headers: {
          Authorization: ORS_KEY,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );
    const feature = data.features?.[0];
    if (!feature?.geometry?.coordinates) return null;
    const geometry = feature.geometry.coordinates.map((coord) => [coord[1], coord[0]]);
    return {
      distance: feature.properties.summary.distance,
      duration: feature.properties.summary.duration,
      geometry,
      source: 'openrouteservice',
    };
  } catch (err) {
    console.error(`ORS ${profile}:`, err.response?.data || err.message);
    return null;
  }
}

/**
 * Yürüyüş süresi, mesafeye göre makul mü? (ORS bazen araç verisine yakın süre döndürebilir → OSRM ile yeniden dene.)
 */
function footWalkingDurationSuspicious(distanceM, durationSec) {
  if (!distanceM || !durationSec || distanceM < 500) return false;
  const slowWalkSec = (distanceM / 1000) * (3600 / 5); // ~5 km/h
  return durationSec < slowWalkSec * 0.2;
}

/**
 * OSM Specialized Routing — Daha net araç/yaya ayrımı için özel sunucuları kullanır.
 */
async function fetchOsrm(coordinates, profile) {
  try {
    const isFoot = profile === 'foot-walking';
    
    // OSM DE specialized endpoints:
    // Car: routed-car subdomain, 'driving' profile
    // Foot: routed-foot subdomain, 'foot' profile
    const subdomain = isFoot ? 'routed-foot' : 'routed-car';
    const profilePath = isFoot ? 'foot' : 'driving';
    
    const coordStr = coordinates.map((c) => `${c[0]},${c[1]}`).join(';');
    const url = `https://routing.openstreetmap.de/${subdomain}/route/v1/${profilePath}/${coordStr}?overview=full&geometries=geojson&continue_straight=false`;
    
    console.log(`OSM Request [${profile}]: ${url}`);
    
    const { data } = await axios.get(url, { timeout: 20000 });
    const route = data.routes?.[0];
    
    if (!route) {
      // Fallback: Eğer özel sunucu hata verirse standart OSRM'yi dene
      return fetchStandardOsrm(coordinates, profile);
    }
    
    const geometry = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    let duration = route.duration;
    let distance = route.distance;

    // Yaya için süre kontrolü (Hala çok hızlı gelirse düzelt)
    if (isFoot) {
      const speedKmh = (distance / 1000) / (duration / 3600);
      if (speedKmh > 12) {
        duration = distance / 1.35; // 4.8 km/h
      }
    }

    return {
      distance,
      duration,
      geometry,
      source: `osm-de-${subdomain}`,
    };
  } catch (err) {
    console.error(`OSM Specialized ${profile} error:`, err.message);
    return fetchStandardOsrm(coordinates, profile);
  }
}

/** Fallback to standard OSRM if specialized ones fail */
async function fetchStandardOsrm(coordinates, profile) {
  try {
    const osrmProfile = profile === 'foot-walking' ? 'foot' : 'car';
    const coordStr = coordinates.map((c) => `${c[0]},${c[1]}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/${osrmProfile}/${coordStr}?overview=full&geometries=geojson`;
    
    const { data } = await axios.get(url, { timeout: 15000 });
    const route = data.routes?.[0];
    if (!route) return null;
    
    const geometry = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    return {
      distance: route.distance,
      duration: route.duration,
      geometry,
      source: 'osrm-fallback',
    };
  } catch (err) {
    return null;
  }
}

// POST /api/directions  body: { coordinates: [[lng,lat], ...], profile: 'driving-car' | 'foot-walking' }
const postDirections = async (req, res) => {
  try {
    const { coordinates, profile } = req.body;
    if (!Array.isArray(coordinates) || coordinates.length < 2) {
      return res.status(400).json({ message: 'En az iki koordinat gerekli.' });
    }
    const allowed = ['driving-car', 'foot-walking'];
    if (!allowed.includes(profile)) {
      return res.status(400).json({ message: 'Geçersiz profile.' });
    }

    let result = await fetchOpenRouteService(coordinates, profile);
    if (
      profile === 'foot-walking' &&
      result &&
      footWalkingDurationSuspicious(result.distance, result.duration)
    ) {
      console.warn('ORS foot-walking süresi şüpheli; OSRM deneniyor.');
      result = null;
    }
    if (!result) result = await fetchOsrm(coordinates, profile);

    if (!result) {
      return res.status(502).json({ message: 'Rota servisi şu an yanıt vermiyor.' });
    }
    res.json(result);
  } catch (err) {
    console.error('postDirections:', err);
    res.status(500).json({ message: err.message || 'Sunucu hatası.' });
  }
};

module.exports = { postDirections };
