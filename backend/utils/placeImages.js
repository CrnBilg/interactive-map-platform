const imageCache = new Map();

const IMAGE_TIMEOUT_MS = 2500;
const WIKIPEDIA_LANGUAGES = ['en', 'tr'];
const BAD_IMAGE_WORDS = [
  'badge',
  'blank',
  'coat_of_arms',
  'diagram',
  'emblem',
  'flag',
  'icon',
  'logo',
  'map',
  'placeholder',
  'seal',
  'symbol',
  'wordmark',
];

const knownImageTitles = {
  anitkabir: 'An\u0131tkabir',
  ayasofya: 'Hagia Sophia',
  'blue mosque': 'Sultan Ahmed Mosque',
  'efes antik kenti': 'Ephesus',
  'ephesus ancient city': 'Ephesus',
  'galata kulesi': 'Galata Tower',
  'galata tower': 'Galata Tower',
  'hagia sophia': 'Hagia Sophia',
  'mevlana museum': 'Mevlana Museum',
  'mevlana muzesi': 'Mevlana Museum',
  'mount nemrut': 'Mount Nemrut',
  'nemrut dagi': 'Mount Nemrut',
  safranbolu: 'Safranbolu',
  'sultanahmet camii': 'Sultan Ahmed Mosque',
  'sumela manastiri': 'S\u00fcmela Monastery',
  'sumela monastery': 'S\u00fcmela Monastery',
  'topkapi palace': 'Topkap\u0131 Palace',
  'topkapi sarayi': 'Topkap\u0131 Palace',
  'troya antik kenti': 'Troy',
  'troy ancient city': 'Troy',
  zeugma: 'Zeugma',
};

const normalizeText = value => String(value || '')
  .toLocaleLowerCase('tr-TR')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/\u0131/g, 'i')
  .replace(/\u0130/g, 'i')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()
  .replace(/\s+/g, ' ');

const isUsablePlaceImage = (url = '') => {
  if (!/^https?:\/\//i.test(url)) return false;

  const cleanUrl = url.split('?')[0];
  if (/\.(svg|gif|webm|mp4)$/i.test(cleanUrl)) return false;

  const decoded = decodeURIComponent(cleanUrl).toLowerCase();
  if (!/\.(jpe?g|png|webp)$/i.test(decoded)) return false;
  if (BAD_IMAGE_WORDS.some(word => decoded.includes(word))) return false;

  return true;
};

const getExistingImage = (place) => {
  const images = Array.isArray(place?.images) ? place.images : [];
  return images.find(isUsablePlaceImage) || '';
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
    const candidates = [
      data?.originalimage?.source,
      data?.thumbnail?.source,
    ].filter(Boolean);

    return candidates.find(isUsablePlaceImage) || '';
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
    knownImageTitles[normalizeText(name)],
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

module.exports = { resolvePlaceImage, isUsablePlaceImage };
