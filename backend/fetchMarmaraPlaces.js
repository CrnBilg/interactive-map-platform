/**
 * Fetch historical and cultural places in Turkey's Marmara Region
 * using the Geoapify Places API.
 */

const fs = require('fs').promises;
const path = require('path');

const API_ENDPOINT = 'https://api.geoapify.com/v2/places';
const REQUESTED_CATEGORIES = 'tourism.sights,historic,tourism.attraction,tourism.museum';
const FALLBACK_CATEGORIES = 'tourism.sights,tourism.attraction,heritage';
const BOUNDING_BOX = 'rect:26,39,31.5,42';
const LIMIT = 100;
const REQUEST_DELAY_MS = 700;
const RETRY_DELAY_MS = 5000;
const OUTPUT_FILE = 'marmara_historical_places.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function buildUrl({ apiKey, categories, offset }) {
  const params = new URLSearchParams({
    categories,
    filter: BOUNDING_BOX,
    limit: String(LIMIT),
    offset: String(offset),
    apiKey,
  });

  return `${API_ENDPOINT}?${params.toString()}`;
}

function normalizeFeature(feature) {
  const props = feature?.properties || {};
  const coordinates = feature?.geometry?.coordinates;
  const lon = Number.isFinite(props.lon) ? props.lon : coordinates?.[0];
  const lat = Number.isFinite(props.lat) ? props.lat : coordinates?.[1];

  if (!props.name?.trim() || !Number.isFinite(lon) || !Number.isFinite(lat)) {
    return null;
  }

  return {
    id: props.place_id,
    name: props.name.trim(),
    category: Array.isArray(props.categories) ? props.categories.join(',') : '',
    latitude: lat,
    longitude: lon,
    city: props.city || props.county || '',
    state: props.state || '',
    country: props.country || '',
    formatted: props.formatted || '',
  };
}

async function fetchPage({ apiKey, categories, offset }) {
  const response = await fetch(buildUrl({ apiKey, categories, offset }));

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    const error = new Error(`API request failed with status: ${response.status} ${response.statusText}${body ? ` - ${body}` : ''}`);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

async function fetchWithCategorySet({ apiKey, categories }) {
  const allPlaces = new Map();
  let offset = 0;

  console.log(`Categories: ${categories}`);
  console.log(`Bounding Box: ${BOUNDING_BOX}`);

  while (true) {
    try {
      console.log(`Fetching offset ${offset}...`);
      const data = await fetchPage({ apiKey, categories, offset });
      const features = data.features || [];

      if (features.length === 0) {
        console.log('No more results found. Finished pagination.');
        break;
      }

      let validCount = 0;
      for (const feature of features) {
        const place = normalizeFeature(feature);
        if (!place?.id || allPlaces.has(place.id)) continue;

        allPlaces.set(place.id, place);
        validCount++;
      }

      console.log(`Retrieved ${features.length} features, ${validCount} valid unique new places added.`);

      if (features.length < LIMIT) {
        console.log('Fetched last page of results. Finished pagination.');
        break;
      }

      offset += LIMIT;
      await delay(REQUEST_DELAY_MS);
    } catch (error) {
      if (error.status === 429) {
        console.warn('Rate limit exceeded. Waiting before retrying...');
        await delay(RETRY_DELAY_MS);
        continue;
      }

      throw error;
    }
  }

  return Array.from(allPlaces.values());
}

async function fetchMarmaraPlaces() {
  const apiKey = process.env.GEOAPIFY_API_KEY;

  if (!apiKey) {
    console.error('Error: GEOAPIFY_API_KEY environment variable is missing.');
    console.error('Please set it in backend/.env or your shell before running this script.');
    process.exit(1);
  }

  console.log('Starting fetch for Marmara Region historical places...');

  let places;
  try {
    places = await fetchWithCategorySet({ apiKey, categories: REQUESTED_CATEGORIES });
  } catch (error) {
    console.warn(`Requested categories failed: ${error.message}`);
    console.warn('Retrying with Geoapify-compatible fallback categories...');
    places = await fetchWithCategorySet({ apiKey, categories: FALLBACK_CATEGORIES });
  }

  places.sort((a, b) => a.name.localeCompare(b.name, 'tr', { sensitivity: 'base' }));

  console.log(`\nTotal unique named places found: ${places.length}`);

  const outputPath = path.resolve(process.cwd(), OUTPUT_FILE);
  await fs.writeFile(outputPath, JSON.stringify(places, null, 2), 'utf-8');
  console.log(`Successfully saved data to: ${outputPath}`);

  return places;
}

module.exports = {
  fetchMarmaraPlaces,
};

if (require.main === module) {
  try {
    require('dotenv').config();
  } catch (e) {
    // dotenv is optional when the key is already present in the environment.
  }

  fetchMarmaraPlaces().catch(err => {
    console.error('Fatal error:', err.message);
    process.exit(1);
  });
}
