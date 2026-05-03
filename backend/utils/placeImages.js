const imageCache = new Map();

const IMAGE_TIMEOUT_MS = 2500;
const WIKIPEDIA_LANGUAGES = ['tr', 'en'];

const knownImageTitles = {
  'Anitkabir': 'Anıtkabir',
  'Anıtkabir': 'Anıtkabir',
  'Hagia Sophia': 'Hagia Sophia',
  'Ayasofya': 'Ayasofya',
  'Topkapi Palace': 'Topkapı Palace',
  'Topkapı Palace': 'Topkapı Palace',
  'Topkapı Sarayı': 'Topkapı Sarayı',
  'Ephesus Ancient City': 'Ephesus',
  'Efes Antik Kenti': 'Efes',
  'Sumela Monastery': 'Sümela Monastery',
  'Sümela Monastery': 'Sümela Manastırı',
  'Mevlana Museum': 'Mevlana Museum',
  'Mevlana Müzesi': 'Mevlana Müzesi',
  'Safranbolu': 'Safranbolu',
  'Mount Nemrut': 'Mount Nemrut',
  'Nemrut Dağı': 'Nemrut Dağı',
  'Zeugma': 'Zeugma',
  'Aspendos': 'Aspendos',
  'Troy Ancient City': 'Troy',
  'Troya Antik Kenti': 'Truva',
  'Galata Tower': 'Galata Tower',
  'Galata Kulesi': 'Galata Kulesi',
  'Blue Mosque': 'Sultan Ahmed Mosque',
  'Sultanahmet Camii': 'Sultan Ahmed Mosque',
};

const getExistingImage = (place) => {
  const images = Array.isArray(place?.images) ? place.images : [];
  return images.find(Boolean) || '';
};

const fetchWikipediaImage = async (language, title) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), IMAGE_TIMEOUT_MS);

  try {
    const url = `https://${language}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'CityLore/1.0 educational project',
      },
      signal: controller.signal,
    });

    if (!response.ok) return '';
    const data = await response.json();
    return data?.originalimage?.source || data?.thumbnail?.source || '';
  } catch (err) {
    return '';
  } finally {
    clearTimeout(timeout);
  }
};

const resolvePlaceImage = async (place) => {
  const existingImage = getExistingImage(place);
  if (existingImage) return existingImage;

  const name = place?.name || '';
  const city = place?.city || '';
  const cacheKey = `${name}|${city}`;
  if (imageCache.has(cacheKey)) return imageCache.get(cacheKey);

  const titles = [
    knownImageTitles[name],
    name,
    city && `${name} ${city}`,
  ].filter(Boolean);

  let imageUrl = '';
  for (const title of [...new Set(titles)]) {
    for (const language of WIKIPEDIA_LANGUAGES) {
      imageUrl = await fetchWikipediaImage(language, title);
      if (imageUrl) break;
    }
    if (imageUrl) break;
  }

  imageCache.set(cacheKey, imageUrl);
  return imageUrl;
};

module.exports = { resolvePlaceImage };
