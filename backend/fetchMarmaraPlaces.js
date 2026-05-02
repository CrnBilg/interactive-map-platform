require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');

const API_ENDPOINT = 'https://api.geoapify.com/v2/places';
const CATEGORIES = 'tourism.sights,heritage,tourism.attraction,entertainment.museum';
// Not: Geoapify'da 'historic' ve 'tourism.museum' geçersiz olduğu için 'heritage' ve 'entertainment.museum' kullanıyoruz.
const LIMIT = 500;
const OUTPUT_FILE = 'marmara_historical_places.json';

const TARGET_CITIES = [
  'İstanbul', 'Edirne', 'Kırklareli', 'Tekirdağ', 'Kocaeli', 
  'Sakarya', 'Yalova', 'Bursa', 'Balıkesir', 'Çanakkale', 'Bilecik'
];

const NORMALIZED_CITIES = TARGET_CITIES.map(c => c.toLowerCase('tr-TR'));

function normalizeCity(cityName) {
  if (!cityName) return null;
  let lower = cityName.toLowerCase('tr-TR');
  // Handle some common Geoapify returns
  if (lower.includes('istanbul') || lower.includes('i̇stanbul')) return 'İstanbul';
  if (lower.includes('edirne')) return 'Edirne';
  if (lower.includes('kırklareli') || lower.includes('kirklareli')) return 'Kırklareli';
  if (lower.includes('tekirdağ') || lower.includes('tekirdag')) return 'Tekirdağ';
  if (lower.includes('kocaeli')) return 'Kocaeli';
  if (lower.includes('sakarya')) return 'Sakarya';
  if (lower.includes('yalova')) return 'Yalova';
  if (lower.includes('bursa')) return 'Bursa';
  if (lower.includes('balıkesir') || lower.includes('balikesir')) return 'Balıkesir';
  if (lower.includes('çanakkale') || lower.includes('canakkale')) return 'Çanakkale';
  if (lower.includes('bilecik')) return 'Bilecik';
  return null;
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchRect(lon1, lat1, lon2, lat2, apiKey) {
  let offset = 0;
  let hasMore = true;
  const places = [];

  while (hasMore) {

    const rect = `rect:${lon1},${lat1},${lon2},${lat2}`;
    let url = `${API_ENDPOINT}?categories=${CATEGORIES}&filter=${rect}&limit=${LIMIT}&offset=${offset}&apiKey=${apiKey}`;

    console.log(`Fetching ${rect} offset ${offset}...`);
    let response = await fetch(url);

    if (!response.ok) {
      if (response.status === 429) {
        console.warn('Rate limit exceeded. Waiting 5s...');
        await delay(5000);
        continue;
      }
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const features = data.features || [];

    places.push(...features);

    if (features.length === LIMIT) {
      offset += LIMIT;
      await delay(500); // Be nice
    } else {
      hasMore = false;
    }
  }

  return places;
}

async function fetchMarmaraPlaces() {
  const apiKey = process.env.GEOAPIFY_API_KEY;
  if (!apiKey) {
    throw new Error('GEOAPIFY_API_KEY is not set in .env');
  }

  const LON_START = 26.0;
  const LON_END = 31.5;
  const LAT_START = 39.0;
  const LAT_END = 42.5;

  const LON_STEPS = 4;
  const LAT_STEPS = 4;
  
  const lonStep = (LON_END - LON_START) / LON_STEPS;
  const latStep = (LAT_END - LAT_START) / LAT_STEPS;

  const allFeatures = [];

  // Break bounding box into smaller rectangles
  for (let i = 0; i < LON_STEPS; i++) {
    for (let j = 0; j < LAT_STEPS; j++) {
      const lon1 = (LON_START + i * lonStep).toFixed(4);
      const lat1 = (LAT_START + j * latStep).toFixed(4);
      const lon2 = (LON_START + (i + 1) * lonStep).toFixed(4);
      const lat2 = (LAT_START + (j + 1) * latStep).toFixed(4);

      try {
        const places = await fetchRect(lon1, lat1, lon2, lat2, apiKey);
        allFeatures.push(...places);
        console.log(`Grid [${i},${j}] returned ${places.length} features.`);
      } catch (e) {
        console.error(`Error fetching grid [${i},${j}]:`, e.message);
      }
    }
  }

  console.log(`Total raw features fetched: ${allFeatures.length}`);

  const uniquePlaces = [];
  const seenNames = new Set();
  const seenCoords = new Set();

  for (const feature of allFeatures) {
    const props = feature.properties;
    if (!props.name || props.name.trim() === '') continue;

    const city = normalizeCity(props.city || props.state);
    if (!city) continue; // Only keep target cities

    const dedupKey = `${city}_${props.name.trim().toLowerCase('tr-TR')}`;
    const coordKey = `${parseFloat(props.lat.toFixed(4))}_${parseFloat(props.lon.toFixed(4))}`;

    if (!seenNames.has(dedupKey) && !seenCoords.has(coordKey)) {
      const placeObj = {
        name: props.name.trim(),
        city: city,
        district: props.district || props.suburb || props.county || '',
        latitude: parseFloat(props.lat.toFixed(6)),
        longitude: parseFloat(props.lon.toFixed(6)),
        category: props.categories ? props.categories[0] : '',
        address: props.formatted || '',
        description: props.description || ''
      };
      uniquePlaces.push(placeObj);
      seenNames.add(dedupKey);
      seenCoords.add(coordKey);
    }
  }

  // Group by city
  const citiesMap = {};
  TARGET_CITIES.forEach(c => { citiesMap[c] = []; });

  let totalCount = 0;

  uniquePlaces.forEach(place => {
    // Determine priority score (basic heuristic)
    let score = 0;
    if (place.category.includes('historic') || place.category.includes('heritage')) score += 10;
    if (place.category.includes('museum')) score += 5;
    place._score = score; // temporary

    citiesMap[place.city].push(place);
    totalCount++;
  });

  // Sort and clean up
  const finalCitiesObj = {};
  TARGET_CITIES.sort((a, b) => a.localeCompare(b, 'tr', { sensitivity: 'base' })).forEach(city => {
    const sortedPlaces = citiesMap[city].sort((a, b) => {
      if (b._score !== a._score) return b._score - a._score;
      return a.name.localeCompare(b.name, 'tr', { sensitivity: 'base' });
    });

    sortedPlaces.forEach(p => delete p._score);
    sortedPlaces.forEach(p => delete p.city); // optional: remove city from object since it's the key, or keep it. I'll keep it as user format didn't explicitly forbid, wait, user format showed: { name, latitude, longitude, category, address }. I'll include district and description as requested.
    
    if (sortedPlaces.length > 0) {
      finalCitiesObj[city] = sortedPlaces;
    }
  });

  const output = {
    region: "Marmara",
    total_places: totalCount,
    cities: finalCitiesObj
  };

  const outputPath = path.resolve(process.cwd(), OUTPUT_FILE);
  await fs.writeFile(outputPath, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`Successfully saved data to: ${outputPath}. Total places: ${totalCount}`);
}

fetchMarmaraPlaces().catch(console.error);
