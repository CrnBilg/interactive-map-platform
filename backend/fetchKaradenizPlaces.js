/**
 * Module to fetch historical and touristic places in Turkey's Black Sea Region
 * using the Geoapify Places API.
 */

const fs = require('fs').promises;
const path = require('path');

const API_ENDPOINT = 'https://api.geoapify.com/v2/places';
// Note: 'historic' and 'tourism.museum' categories can cause 400 Bad Request errors on Geoapify.
// Using 'heritage' instead of 'historic' and keeping 'tourism.sights', 'tourism.attraction' as valid categories.
const CATEGORIES = 'tourism.sights,tourism.attraction,heritage';
const BOUNDING_BOX = 'rect:29.0,40.5,42.5,42.5';
const LIMIT = 500;
const OUTPUT_FILE = 'karadeniz_historical_places.json';

// Helper function to delay execution (rate limiting)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetches data from Geoapify Places API with pagination
 * @returns {Promise<Array>} Array of place objects
 */
async function fetchKaradenizPlaces() {
  const apiKey = process.env.GEOAPIFY_API_KEY;

  if (!apiKey) {
    console.error('Error: GEOAPIFY_API_KEY environment variable is missing.');
    console.error('Please set it using: export GEOAPIFY_API_KEY=your_api_key');
    process.exit(1);
  }

  const allPlaces = new Map();
  let offset = 0;
  let hasMore = true;

  console.log(`Starting fetch for Black Sea Region historical places...`);
  console.log(`Categories: ${CATEGORIES}`);
  console.log(`Bounding Box: ${BOUNDING_BOX}`);

  while (hasMore) {
    try {
      const url = `${API_ENDPOINT}?categories=${CATEGORIES}&filter=${BOUNDING_BOX}&limit=${LIMIT}&offset=${offset}&apiKey=${apiKey}`;

      console.log(`Fetching offset ${offset}...`);

      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 429) {
          console.warn('Rate limit exceeded. Waiting for 5 seconds before retrying...');
          await delay(5000);
          continue; // Retry the same offset
        }
        throw new Error(`API request failed with status: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const features = data.features || [];

      if (features.length === 0) {
        hasMore = false;
        console.log('No more results found. Finished pagination.');
        break;
      }

      let validCount = 0;
      for (const feature of features) {
        const props = feature.properties;

        // Ignore entries without a name
        if (!props.name || props.name.trim() === '') {
          continue;
        }

        // Deduplicate using place_id
        if (!allPlaces.has(props.place_id)) {
          allPlaces.set(props.place_id, {
            id: props.place_id,
            name: props.name.trim(),
            category: props.categories ? props.categories.join(',') : '',
            latitude: props.lat,
            longitude: props.lon,
            city: props.city || '',
            state: props.state || '',
            country: props.country || '',
            formatted: props.formatted || ''
          });
          validCount++;
        }
      }

      console.log(`Retrieved ${features.length} features, ${validCount} valid unique new places added.`);

      // If we got exactly the limit, there might be more
      if (features.length === LIMIT) {
        offset += LIMIT;
        // Be nice to the API, wait slightly between requests
        await delay(500);
      } else {
        // Less than limit means we reached the end
        hasMore = false;
        console.log('Fetched last page of results. Finished pagination.');
      }

    } catch (error) {
      console.error(`Error during fetch at offset ${offset}:`, error.message);
      console.log('Retrying in 5 seconds...');
      await delay(5000);
    }
  }

  // Convert map to array
  const finalPlaces = Array.from(allPlaces.values());

  // Sort alphabetically by name (using Turkish locale for correct sorting)
  finalPlaces.sort((a, b) => a.name.localeCompare(b.name, 'tr', { sensitivity: 'base' }));

  console.log(`\nTotal unique named places found: ${finalPlaces.length}`);

  // Save to file with pretty formatting
  try {
    const outputPath = path.resolve(process.cwd(), OUTPUT_FILE);
    await fs.writeFile(outputPath, JSON.stringify(finalPlaces, null, 2), 'utf-8');
    console.log(`Successfully saved data to: ${outputPath}`);
  } catch (writeError) {
    console.error('Failed to write results to file:', writeError.message);
  }

  return finalPlaces;
}

module.exports = {
  fetchKaradenizPlaces
};

// Execute if run directly from terminal
if (require.main === module) {
  // Try to load .env if dotenv is installed (helpful for direct execution in this project)
  try {
    require('dotenv').config();
  } catch (e) {
    // Ignore if dotenv is not available, we assume GEOAPIFY_API_KEY is in environment
  }

  fetchKaradenizPlaces().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}
