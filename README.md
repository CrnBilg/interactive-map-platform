# 🏛️ CityLore

**CityLore** — Türkiye'nin tarihi mekanlarını ve anlık kültürel etkinliklerini tek haritada keşfet.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite, Tailwind CSS, Leaflet + OpenStreetMap |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Realtime | Socket.IO (WebSocket) |
| Auth | JWT (JSON Web Tokens) |

## Features

- 🗺️ **İnteraktif Harita** — Leaflet + OpenStreetMap ile Türkiye geneli tarihi mekan haritası
- ⚡ **Canlı Etkinlikler** — WebSocket ile gerçek zamanlı etkinlik bildirimi ve takibi
- 🔐 **Kimlik Doğrulama** — JWT tabanlı giriş/kayıt sistemi
- 👑 **Admin Paneli** — Mekan ve etkinlik yönetimi
- ⭐ **Yorum & Puan** — Ziyaretçi yorumları ve yıldız puanı sistemi
- 🔖 **Kaydet** — Beğenilen mekanları kaydetme
- 🏙️ **Şehir Filtreleme** — 81 şehir bazlı filtreleme
- 📱 **Responsive** — Mobil uyumlu arayüz

## Quick Start

Required external service: MongoDB. MongoDB Atlas free M0 is enough for local development and deployment.

Maps are free by default: the project uses Leaflet + OpenStreetMap, so no Google Maps API key is needed.

The chatbot is optional. If you want to enable it, add an OpenRouter API key to `backend/.env` as `OPENROUTER_API_KEY`.

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env and set MONGO_URI. MongoDB Atlas free M0 works well.
npm install
npm run seed   # Fill the database with sample data
npm run dev    # http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env   # Optional; only needed for optional viewer tokens
npm install
npm run dev    # http://localhost:5173
```

## Default Users (after seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@citylore.com | admin123 |
| User | test@citylore.com | test123 |

## 360 / Street-Level Imagery

The map itself uses Leaflet + OpenStreetMap and needs no API key.

360 / street-level views are optional per place. Recommended options, in order:

- Google Maps Embed Street View for the most reliable draggable street-level experience
- Panoramax for a free/open no-token fallback
- Self-hosted 360 image URL as a fallback

The default map still uses Leaflet + OpenStreetMap. Google is only used inside the optional 360 modal when `VITE_GOOGLE_MAPS_EMBED_API_KEY` is configured.

To make 360 available for a place without Google Embed, add at least one of these optional fields to the place data:

- `panoramaUrl`
- `panoramaxImageId`
- `streetViewUrl`

To enable Google Maps Embed Street View, create a Google Maps Embed API key and add this to `frontend/.env`:

```env
VITE_GOOGLE_MAPS_EMBED_API_KEY=your_google_maps_embed_key_here
```

## Chatbot

CityLore includes an optional floating chatbot for place recommendations, historical questions, and app help.

The browser never receives the AI API key. The frontend calls `/api/chat`, and the backend sends the request to OpenRouter.

To enable it, add this to `backend/.env`:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=openai/gpt-4o-mini
```

Use an OpenRouter key for `OPENROUTER_API_KEY`. Do not use a GitHub token here, and do not put chatbot keys in `frontend/.env`.

## Project Structure

```
citylore/
├── backend/
│   ├── config/          # DB connection
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   ├── seed.js          # Sample data seeder
│   └── server.js        # Entry point
└── frontend/
    └── src/
        ├── components/  # Reusable UI components
        ├── context/     # React Context (Auth, Socket)
        ├── pages/       # Page components
        └── services/    # API calls (axios)
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Kayıt ol |
| POST | /api/auth/login | Giriş yap |
| GET | /api/auth/me | Profil bilgisi |
| PUT | /api/auth/profile | Profil güncelle |
| POST | /api/auth/save-place/:id | Mekan kaydet |

### Places
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/places | Mekan listesi (filtreli) |
| GET | /api/places/:id | Tek mekan |
| POST | /api/places | Mekan ekle |
| PUT | /api/places/:id | Mekan güncelle |
| DELETE | /api/places/:id | Mekan sil |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/events | Etkinlik listesi |
| POST | /api/events | Etkinlik bildir |
| PUT | /api/events/:id/like | Beğen |
| DELETE | /api/events/:id | Sil |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/reviews/place/:id | Mekan yorumları |
| POST | /api/reviews/place/:id | Yorum ekle |
| DELETE | /api/reviews/:id | Yorum sil |

### Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/chat | CityLore chatbot response |

## WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| join_city | Client → Server | Şehir odasına katıl |
| leave_city | Client → Server | Şehir odasından ayrıl |
| new_event | Client → Server | Yeni etkinlik bildirimi |
| event_added | Server → Client | Yeni etkinlik yayını |
| event_removed | Server → Client | Etkinlik silindi |
| event_liked | Server → Client | Etkinlik beğenildi |

## Deployment

- **Frontend**: Vercel (`vercel --prod`)
- **Backend**: Render (web service, `npm start`)
- **Database**: MongoDB Atlas free M0
- **Maps**: Leaflet + OpenStreetMap by default; no Google Maps key required.
