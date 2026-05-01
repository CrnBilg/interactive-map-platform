const axios = require('axios');
const Place = require('../models/Place');

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';
const TURKISH_CHARS = {
  c: '[cç]',
  g: '[gğ]',
  i: '[iıİI]',
  o: '[oö]',
  s: '[sş]',
  u: '[uü]',
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
    .split(/[^a-z0-9çğıöşüİ]+/i)
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

    try {
      const response = await axios.post(OPENROUTER_URL, {
        model: DEFAULT_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.4,
        max_tokens: 550,
      }, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:5173',
          'X-Title': 'CityLore',
        }
      });

      const data = response.data;
      const reply = data?.choices?.[0]?.message?.content?.trim();
      
      if (!reply) {
        return res.status(502).json({ message: 'Chat provider returned an empty response.' });
      }

      res.json({ reply });
    } catch (axiosError) {
      const status = axiosError.response?.status || 502;
      const errorData = axiosError.response?.data;
      const errorMessage = errorData?.error?.message || errorData?.message || axiosError.message;
      
      console.error('OpenRouter Error:', {
        status,
        message: errorMessage,
        details: errorData
      });

      let userFriendlyMessage = errorMessage;
      if (status === 429) {
        userFriendlyMessage = 'OpenRouter: Too many requests or insufficient balance. Please check your OpenRouter credits/limits.';
      } else if (status === 401 || status === 403) {
        userFriendlyMessage = 'Invalid API Key. Please check your OPENROUTER_API_KEY in .env';
      }

      res.status(status).json({ message: userFriendlyMessage });
    }
  } catch (err) {
    console.error('Chat Controller Error:', err);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
};

module.exports = { chat };
