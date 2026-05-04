const Place = require('../models/Place');
const User = require('../models/User');

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';
const TR_CHARS = {
  cedilla: String.fromCharCode(0x00e7),
  breveG: String.fromCharCode(0x011f),
  dotlessI: String.fromCharCode(0x0131),
  dottedUpperI: String.fromCharCode(0x0130),
  umlautO: String.fromCharCode(0x00f6),
  sCedilla: String.fromCharCode(0x015f),
  umlautU: String.fromCharCode(0x00fc),
};
const TURKISH_CHARS = {
  c: `[c${TR_CHARS.cedilla}]`,
  g: `[g${TR_CHARS.breveG}]`,
  i: `[i${TR_CHARS.dotlessI}${TR_CHARS.dottedUpperI}I]`,
  o: `[o${TR_CHARS.umlautO}]`,
  s: `[s${TR_CHARS.sCedilla}]`,
  u: `[u${TR_CHARS.umlautU}]`,
};
const TURKISH_SUFFIXES = [
  'leri',
  'lari',
  `${TR_CHARS.dotlessI}n${TR_CHARS.dotlessI}n`,
  'inin',
  'unun',
  `${TR_CHARS.umlautU}n${TR_CHARS.umlautU}n`,
  `n${TR_CHARS.dotlessI}n`,
  'nin',
  'nun',
  `n${TR_CHARS.umlautU}n`,
  'dan',
  'den',
  'tan',
  'ten',
  `d${TR_CHARS.dotlessI}r`,
  'dir',
  'dur',
  `d${TR_CHARS.umlautU}r`,
  'tir',
  `t${TR_CHARS.dotlessI}r`,
  'tur',
  `t${TR_CHARS.umlautU}r`,
  'ya',
  'ye',
  'yi',
  `y${TR_CHARS.dotlessI}`,
  'yu',
  `y${TR_CHARS.umlautU}`,
  'da',
  'de',
  'ta',
  'te',
  'a',
  'e',
  'i',
  TR_CHARS.dotlessI,
  'u',
  TR_CHARS.umlautU,
];
const CHAT_STOP_WORDS = new Set([
  'about',
  'anlat',
  'anlatabilir',
  'bana',
  'bilgi',
  'can',
  'could',
  'eder',
  'edin',
  'et',
  'give',
  'hakkinda',
  'hakkindaki',
  'info',
  'information',
  'mekan',
  'misin',
  'musun',
  'nedir',
  'place',
  'please',
  'soyle',
  'tell',
  'the',
  'this',
  'ver',
  'what',
  'where',
  'yer',
]);
const GENERAL_DISCOVERY_WORDS = new Set([
  'gez',
  'gezilecek',
  'nerede',
  'oner',
  'onerebilir',
  'recommend',
  'route',
  'rota',
  'routes',
  'visit',
  'visiting',
]);
const ENGLISH_NAME_ALIASES = {
  anitkabir: ['anitkabir', 'ataturk mausoleum', 'mausoleum of ataturk'],
  ayasofya: ['hagia sophia', 'ayasofya mosque', 'hagia sophia mosque'],
  kapadokya: ['cappadocia'],
  gobeklitepe: ['gobeklitepe', 'gobekli tepe'],
  'efes antik kenti': ['ephesus', 'ephesus ancient city'],
  'nemrut dagi': ['mount nemrut'],
  'sumela manastiri': ['sumela monastery'],
  'ani harabeleri': ['ani ruins'],
  'mevlana muzesi': ['mevlana museum'],
};
const PLACE_TYPE_SUFFIX_RULES = [
  [' antik kenti', ' ancient city'],
  [' antik tiyatrosu', ' ancient theater'],
  [' tarihi alani', ' historic site'],
  [' saat kulesi', ' clock tower'],
  [' yarimadasi', ' peninsula'],
  [' milli parki', ' national park'],
  [' peri bacalari', ' fairy chimneys'],
  [' bahceleri', ' gardens'],
  [' bahcesi', ' garden'],
  [' dagi', null],
  [' golu', null],
  [' muzesi', ' museum'],
  [' kalesi', ' castle'],
  [' koprusu', ' bridge'],
  [' sarayi', ' palace'],
  [' camii', ' mosque'],
  [' camisi', ' mosque'],
  [' kilisesi', ' church'],
  [' manastiri', ' monastery'],
  [' feneri', ' lighthouse'],
  [' selalesi', ' waterfall'],
  [' magarasi', ' cave'],
  [' hoyugu', ' mound'],
  [' harabeleri', ' ruins'],
  [' vadisi', ' valley'],
  [' adasi', ' island'],
  [' koyu', ' bay'],
  [' plaji', ' beach'],
  [' parki', ' park'],
  [' aniti', ' monument'],
  [' turbesi', ' tomb'],
  [' medresesi', ' madrasa'],
  [' medrese', ' madrasa'],
  [' hani', ' caravanserai'],
  [' han', ' caravanserai'],
  [' bedesten', ' covered bazaar'],
  [' hamami', ' turkish bath'],
  [' hamam', ' turkish bath'],
  [' carsisi', ' bazaar'],
  [' kaplicalari', ' thermal springs'],
];

const cleanMessages = (messages = []) =>
  messages
    .filter(message => ['user', 'assistant'].includes(message?.role) && typeof message?.content === 'string')
    .slice(-12)
    .map(message => ({
      role: message.role,
      content: message.content.slice(0, 1200),
    }));

const formatPlaceContext = places =>
  places
    .map(place => {
      const city = place.city ? `, ${place.city}` : '';
      const category = place.category ? ` [${place.category}]` : '';
      const address = place.address ? ` Address: ${place.address}.` : '';
      const period = place.period ? ` Period: ${place.period}.` : '';
      const hours = place.openingHours ? ` Hours: ${place.openingHours}.` : '';
      const fee = Number.isFinite(place.entryFee) ? ` Entry fee: ${place.entryFee}.` : '';
      return `- ${place.name}${city}${category}: ${place.description}${address}${period}${hours}${fee}`;
    })
    .join('\n');

const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const normalizeSearchText = value => String(value || '')
  .toLocaleLowerCase('tr-TR')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replaceAll(TR_CHARS.cedilla, 'c')
  .replaceAll(TR_CHARS.breveG, 'g')
  .replaceAll(TR_CHARS.dotlessI, 'i')
  .replaceAll(TR_CHARS.dottedUpperI.toLocaleLowerCase('tr-TR'), 'i')
  .replaceAll(TR_CHARS.umlautO, 'o')
  .replaceAll(TR_CHARS.sCedilla, 's')
  .replaceAll(TR_CHARS.umlautU, 'u')
  .replace(/['`\u00b4\u2019\u2018]/g, ' ')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()
  .replace(/\s+/g, ' ');

const normalizedTokens = value => normalizeSearchText(value)
  .split(' ')
  .map(word => word.trim())
  .filter(word => word.length >= 3 && !CHAT_STOP_WORDS.has(word));

const turkishLoosePattern = word =>
  escapeRegex(word)
    .split('')
    .map(char => TURKISH_CHARS[char.toLowerCase()] || char)
    .join('');

const extractSearchWords = text =>
  text
    .toLowerCase()
    .split(/[^a-z0-9\u00e7\u011f\u0131\u00f6\u015f\u00fc\u0130]+/i)
    .map(word => word.trim())
    .filter(word => word.length >= 4)
    .slice(-8);

const expandNormalizedToken = (word) => {
  const expanded = new Set([word]);
  const suffixes = [
    'leri',
    'lari',
    'inin',
    'unun',
    'nin',
    'nun',
    'dan',
    'den',
    'tan',
    'ten',
    'dir',
    'tir',
    'ya',
    'ye',
    'yi',
    'yu',
    'da',
    'de',
    'ta',
    'te',
    'a',
    'e',
    'i',
    'u',
  ];

  suffixes.forEach((suffix) => {
    if (word.endsWith(suffix) && word.length - suffix.length >= 4) {
      expanded.add(word.slice(0, -suffix.length));
    }
  });

  return [...expanded];
};

const expandSearchWords = words => {
  const expanded = new Set(words);

  words.forEach((word) => {
    TURKISH_SUFFIXES.forEach((suffix) => {
      if (word.endsWith(suffix) && word.length - suffix.length >= 4) {
        expanded.add(word.slice(0, -suffix.length));
      }
    });
  });

  return [...expanded];
};

const generateEnglishAliases = (name) => {
  const normalizedName = normalizeSearchText(name);
  const aliases = new Set(ENGLISH_NAME_ALIASES[normalizedName] || []);

  PLACE_TYPE_SUFFIX_RULES.forEach(([suffix, replacement]) => {
    if (!normalizedName.endsWith(suffix)) return;

    const base = normalizedName.slice(0, -suffix.length).trim();
    if (!base) return;

    if (suffix === ' dagi') {
      aliases.add(`mount ${base}`);
      aliases.add(`${base} mountain`);
    } else if (suffix === ' golu') {
      aliases.add(`lake ${base}`);
      aliases.add(`${base} lake`);
    } else if (replacement) {
      aliases.add(`${base}${replacement}`);
    }
  });

  return [...aliases];
};

const scorePlaceForQuestion = (place, question) => {
  const questionText = normalizeSearchText(question);
  const questionTokens = new Set(normalizedTokens(question).flatMap(expandNormalizedToken));
  if (!questionTokens.size) return 0;

  const nameAliases = [
    place.name,
    ...generateEnglishAliases(place.name),
  ].filter(Boolean);

  let bestScore = 0;
  nameAliases.forEach((alias) => {
    const aliasText = normalizeSearchText(alias);
    if (!aliasText) return;

    const aliasTokens = normalizedTokens(aliasText);
    let score = 0;

    if (questionText === aliasText) score += 100;
    if (questionText.includes(aliasText)) score += 70;
    if (aliasText.includes(questionText) && questionText.length >= 4) score += 45;

    const matchedTokenCount = aliasTokens.filter(token => questionTokens.has(token)).length;
    if (matchedTokenCount) {
      score += matchedTokenCount * 16;
      if (matchedTokenCount === aliasTokens.length) score += 35;
    }

    bestScore = Math.max(bestScore, score);
  });

  const cityTokens = normalizedTokens(place.city);
  const addressTokens = normalizedTokens(place.address);
  const cityScore = cityTokens.filter(token => questionTokens.has(token)).length * 8;
  const addressScore = addressTokens.filter(token => questionTokens.has(token)).length * 3;

  if (bestScore) bestScore += cityScore + addressScore;

  return bestScore;
};

const rankPlacesForQuestion = (places, question) =>
  places
    .map(place => ({ place, score: scorePlaceForQuestion(place, question) }))
    .filter(result => result.score >= 35)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(result => result.place);
const CHAT_PLACE_FIELDS = 'name city category description period entryFee openingHours address has360 location';
const isGeneralDiscoveryQuestion = question =>
  normalizedTokens(question).some(token => GENERAL_DISCOVERY_WORDS.has(token));

const findRelevantPlaces = async (question) => {
  const adminIds = await User.find({ role: 'admin' }).distinct('_id');
  const publicQuery = {
    approved: true,
    $or: [
      { visibility: 'public' },
      { addedBy: { $in: adminIds }, visibility: { $exists: false } },
      { addedBy: { $exists: false } },
    ],
  };
  const words = expandSearchWords(extractSearchWords(question));
  const normalizedWords = normalizedTokens(question).flatMap(expandNormalizedToken);
  const allSearchWords = [...new Set([...words, ...normalizedWords])].slice(-14);
  const searchClauses = allSearchWords.map(word => {
    const pattern = turkishLoosePattern(word);
    return {
      $or: [
        { name: { $regex: pattern, $options: 'i' } },
        { city: { $regex: pattern, $options: 'i' } },
        { address: { $regex: pattern, $options: 'i' } },
        { description: { $regex: pattern, $options: 'i' } },
      ],
    };
  });

  const matchedPlaces = searchClauses.length
    ? await Place.find({ $and: [publicQuery, { $or: searchClauses }] })
      .select(CHAT_PLACE_FIELDS)
      .limit(60)
      .lean()
    : [];
  const rankedMatchedPlaces = rankPlacesForQuestion(matchedPlaces, question);

  if (rankedMatchedPlaces.length) {
    return rankedMatchedPlaces;
  }

  const publicPlaces = await Place.find(publicQuery)
    .select(CHAT_PLACE_FIELDS)
    .limit(500)
    .lean();
  const rankedPublicPlaces = rankPlacesForQuestion(publicPlaces, question);

  if (rankedPublicPlaces.length) {
    return rankedPublicPlaces;
  }

  if (normalizedTokens(question).length && !isGeneralDiscoveryQuestion(question)) {
    return [];
  }

  const popularPlaces = await Place.find(publicQuery)
    .select(CHAT_PLACE_FIELDS)
    .sort({ rating: -1, reviewCount: -1, createdAt: -1 })
    .limit(20)
    .lean();

  return [...matchedPlaces, ...popularPlaces];
};

// @POST /api/chat
const chat = async (req, res) => {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        message: 'Chatbot is not configured yet. Add OPENROUTER_API_KEY to backend/.env and restart the backend.',
      });
    }

    const messages = cleanMessages(req.body.messages);
    if (!messages.length || messages[messages.length - 1].role !== 'user') {
      return res.status(400).json({ message: 'Send at least one user message.' });
    }

    const lastUserMessage = messages[messages.length - 1].content;
    const places = await findRelevantPlaces(lastUserMessage);

    const systemPrompt = [
      'You are CityLore Assistant, a friendly travel guide for historical and cultural places in Turkey.',
      'Answer concisely and help users choose places, plan visits, understand history, and use the app.',
      'Answer in the same language as the user message.',
      'Use the provided place context when relevant.',
      'If a place is listed in context, answer using that context and mention the city or address.',
      'Treat each context bullet as a separate place. Never mix details from one listed place into another.',
      'If the user asks where a place is, provide the city/address and tell them they can search or click its marker on the map.',
      'If a place is not listed in context, say it may not be in the current CityLore database and suggest searching the map.',
      'Do not invent opening hours, prices, or 360 availability when the context does not include it.',
      '',
      'Available place context:',
      formatPlaceContext(places) || 'No place data is available yet.',
    ].join('\n');

    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:5173',
        'X-Title': 'CityLore',
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.4,
        max_tokens: 550,
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const providerMessage = data?.error?.message || data?.message || '';
      const isAuthProblem = response.status === 401 || response.status === 403 || /user not found|invalid api key|unauthorized/i.test(providerMessage);

      return res.status(response.status).json({
        message: isAuthProblem
          ? 'OpenRouter API key is invalid or revoked. Add a fresh OPENROUTER_API_KEY to backend/.env and restart the backend.'
          : providerMessage || 'Chat provider request failed.',
      });
    }

    const reply = data?.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return res.status(502).json({ message: 'Chat provider returned an empty response.' });
    }

    res.json({ reply });
  } catch (err) {
    console.error('Chat Controller Error:', err);
    const message = err.message === 'fetch failed'
      ? 'Could not reach OpenRouter from the backend. Check your internet connection, OPENROUTER_API_KEY, and restart the backend.'
      : err.message || 'Chat provider request failed.';
    res.status(502).json({ message });
  }
};

module.exports = { chat, findRelevantPlaces };
