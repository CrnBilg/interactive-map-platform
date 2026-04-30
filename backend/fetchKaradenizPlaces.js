require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');

const API_ENDPOINT = 'https://api.geoapify.com/v2/places';
const CATEGORIES = 'tourism.sights,heritage,tourism.attraction,entertainment.museum';
const LIMIT = 500;
const OUTPUT_FILE = 'karadeniz_historical_places.json';

const TARGET_CITIES = [
  'Samsun', 'Sinop', 'Kastamonu', 'Bartın', 'Karabük', 'Zonguldak', 
  'Düzce', 'Bolu', 'Amasya', 'Tokat', 'Çorum', 'Ordu', 'Giresun', 
  'Trabzon', 'Rize', 'Artvin', 'Gümüşhane', 'Bayburt'
];

function normalizeCity(cityName) {
  if (!cityName) return null;
  let lower = cityName.toLowerCase('tr-TR');
  
  for (const targetCity of TARGET_CITIES) {
    const targetLower = targetCity.toLowerCase('tr-TR');
    // Ensure exact match or matches like 'Trabzon Province', 'Trabzon (City)'
    if (lower === targetLower || lower.startsWith(targetLower + ' ') || lower.endsWith(' ' + targetLower)) {
      return targetCity;
    }
  }
  return null;
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchRect(rectStr, apiKey) {
  let offset = 0;
  let hasMore = true;
  const places = [];

  while (hasMore) {
    let url = `${API_ENDPOINT}?categories=${CATEGORIES}&filter=${rectStr}&limit=${LIMIT}&offset=${offset}&apiKey=${apiKey}`;

    console.log(`Fetching ${rectStr} offset ${offset}...`);
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
      await delay(500); // Be nice to API
    } else {
      hasMore = false;
    }
  }

  return places;
}

async function fetchKaradenizPlaces() {
  const apiKey = process.env.GEOAPIFY_API_KEY;
  if (!apiKey) {
    throw new Error('GEOAPIFY_API_KEY is not set in .env');
  }

  const subRegions = [
    'rect:30.5,40.5,34.5,42.5', // Batı Karadeniz
    'rect:34.5,40.5,38.5,42.5', // Orta Karadeniz
    'rect:38.5,40.5,42.5,42.8'  // Doğu Karadeniz
  ];

  const allFeatures = [];

  for (const rect of subRegions) {
    try {
      const places = await fetchRect(rect, apiKey);
      allFeatures.push(...places);
      console.log(`Region ${rect} returned ${places.length} features.`);
    } catch (e) {
      console.error(`Error fetching region ${rect}:`, e.message);
    }
  }

  console.log(`Total raw features fetched: ${allFeatures.length}`);

  const uniquePlaces = [];
  const seenNames = new Set();
  const seenCoords = new Set();

  for (const feature of allFeatures) {
    const props = feature.properties;
    
    // Skip empty names or missing coords
    if (!props.name || props.name.trim() === '') continue;
    if (props.lat === undefined || props.lon === undefined) continue;

    const city = normalizeCity(props.city || props.state);
    if (!city) continue; // Only keep target cities

    const nameLower = props.name.trim().toLowerCase('tr-TR');
    const dedupKey = `${city}_${nameLower}`;
    const coordKey = `${parseFloat(props.lat.toFixed(5))}_${parseFloat(props.lon.toFixed(5))}`;

    if (!seenNames.has(dedupKey) && !seenCoords.has(coordKey)) {
      const placeId = props.place_id || `geoapify-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const placeObj = {
        id: placeId,
        name: props.name.trim(),
        city: city,
        district: props.district || props.suburb || props.county || '',
        latitude: parseFloat(props.lat.toFixed(6)),
        longitude: parseFloat(props.lon.toFixed(6)),
        category: props.categories ? props.categories[0] : '',
        address: props.formatted || '',
        description: props.description || '',
        source: 'Geoapify'
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
    const cat = place.category || '';
    if (cat.includes('historic') || cat.includes('heritage')) score += 10;
    if (cat.includes('museum')) score += 5;
    if (cat.includes('castle') || cat.includes('ruins')) score += 8;
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
    
    if (sortedPlaces.length > 0) {
      finalCitiesObj[city] = sortedPlaces;
    }
  });

  const output = {
    region: "Karadeniz",
    total_places: totalCount,
    cities: finalCitiesObj
  };

  const outputPath = path.resolve(process.cwd(), OUTPUT_FILE);
  await fs.writeFile(outputPath, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`Successfully saved data to: ${outputPath}. Total places: ${totalCount}`);
}

fetchKaradenizPlaces().catch(console.error);
