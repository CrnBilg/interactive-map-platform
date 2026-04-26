# 🏛️ CityLore

**CityLore** — Türkiye'nin tarihi mekanlarını ve anlık kültürel etkinliklerini tek haritada keşfet.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite, Tailwind CSS, Leaflet |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Realtime | Socket.IO (WebSocket) |
| Auth | JWT (JSON Web Tokens) |

## Features

- 🗺️ **İnteraktif Harita** — Leaflet ile Türkiye geneli tarihi mekan haritası
- ⚡ **Canlı Etkinlikler** — WebSocket ile gerçek zamanlı etkinlik bildirimi ve takibi
- 🔐 **Kimlik Doğrulama** — JWT tabanlı giriş/kayıt sistemi
- 👑 **Admin Paneli** — Mekan ve etkinlik yönetimi
- ⭐ **Yorum & Puan** — Ziyaretçi yorumları ve yıldız puanı sistemi
- 🔖 **Kaydet** — Beğenilen mekanları kaydetme
- 🏙️ **Şehir Filtreleme** — 81 şehir bazlı filtreleme
- 📱 **Responsive** — Mobil uyumlu arayüz

## Quick Start

### 1. Backend

```bash
cd backend
cp .env.example .env
# .env dosyasında MONGO_URI'yi düzenleyin
npm install
npm run seed   # Veritabanını örnek verilerle doldur
npm run dev    # http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev    # http://localhost:5173
```

## Default Users (after seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@citylore.com | admin123 |
| User | test@citylore.com | test123 |

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
- **Database**: MongoDB Atlas (free tier)
