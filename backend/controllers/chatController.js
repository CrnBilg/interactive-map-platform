const Place = require('../models/Place');

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';
const TURKISH_CHARS = {
  c: '[c\\u00e7]',
  g: '[g\\u011f]',
  i: '[i\\u0131\\u0130I]',
  o: '[o\\u00f6]',
  s: '[s\\u015f]',
  u: '[u\\u00fc]',
};

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

const findRelevantPlaces = async (question) => {
  const words = extractSearchWords(question);
  const searchClauses = words.map(word => {
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
    ? await Place.find({ approved: true, $or: searchClauses })
      .select('name city category description period entryFee openingHours address has360 location')
      .limit(12)
      .lean()
    : [];

  const popularPlaces = await Place.find({ approved: true, _id: { $nin: matchedPlaces.map(place => place._id) } })
    .select('name city category description period entryFee openingHours address has360 location')
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
      'Use the provided place context when relevant.',
      'If a place is listed in context, answer using that context and mention the city or address.',
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
    res.status(502).json({ message: err.message || 'Chat provider request failed.' });
  }
};

module.exports = { chat };
