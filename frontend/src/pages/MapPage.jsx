import { useState, useEffect, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { placesAPI, eventsAPI, citiesAPI } from '../services/api'
import { useSocket } from '../context/SocketContext'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { Search, Filter, Zap, MapPin, Star, X, Plus, Clock } from 'lucide-react'
import EventForm from '../components/EventForm'
import PanoramaModal from '../components/PanoramaModal'
import { has360Imagery } from '../utils/place360'
import toast from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'

// Custom icons
const placeIcon = L.divIcon({
  className: '',
  html: `<div style="width:32px;height:32px;background:#f59e0b;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid #1c1917;box-shadow:0 2px 8px rgba(0,0,0,0.4)"><span style="display:block;transform:rotate(45deg);text-align:center;line-height:28px;font-size:14px">🏛️</span></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -35],
})

const eventIcons = {
  concert: '🎵', flashmob: '💃', popup: '🛍️', exhibition: '🎨',
  festival: '🎉', protest: '📢', other: '⚡',
}

const createEventIcon = (type) => L.divIcon({
  className: '',
  html: `<div style="width:36px;height:36px;background:#10b981;border-radius:50%;border:2px solid #1c1917;box-shadow:0 2px 8px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;font-size:16px;position:relative"><span>${eventIcons[type] || '⚡'}</span><span style="position:absolute;top:-4px;right:-4px;width:10px;height:10px;background:#22c55e;border-radius:50%;border:1px solid #1c1917;animation:pulse-dot 1.5s infinite"></span></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -22],
})

function MapController({ center, zoom }) {
  const map = useMap()
  useEffect(() => { if (center) map.setView(center, zoom || 13) }, [center, zoom])
  return null
}

const categoryOptions = ['all', 'historical', 'museum', 'mosque', 'castle', 'ruins', 'monument', 'cultural']
const categoryLabels = { all: 'Tümü', historical: 'Tarihi', museum: 'Müze', mosque: 'Cami', castle: 'Kale', ruins: 'Harabe', monument: 'Anıt', cultural: 'Kültürel' }

export default function MapPage() {
  const { user } = useAuth()
  const { liveEvents, setLiveEvents, joinCity, leaveCity } = useSocket()
  const [places, setPlaces] = useState([])
  const [cities, setCities] = useState([])
  const [selectedCity, setSelectedCity] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showEvents, setShowEvents] = useState(true)
  const [showPlaces, setShowPlaces] = useState(true)
  const [mapCenter, setMapCenter] = useState([39.1, 35.0])
  const [mapZoom, setMapZoom] = useState(6)
  const [showEventForm, setShowEventForm] = useState(false)
  const [panoramaPlace, setPanoramaPlace] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    citiesAPI.getAll().then(res => setCities(res.data))
  }, [])

  useEffect(() => {
    const params = {}
    if (selectedCity) params.city = selectedCity.name
    if (selectedCategory !== 'all') params.category = selectedCategory
    if (searchTerm) params.search = searchTerm

    placesAPI.getAll({ ...params, limit: 100 }).then(res => {
      setPlaces(res.data.places)
      setLoading(false)
    })

    if (selectedCity) {
      eventsAPI.getAll({ city: selectedCity.name }).then(res => setLiveEvents(res.data))
      joinCity(selectedCity._id)
      return () => leaveCity(selectedCity._id)
    }
  }, [selectedCity, selectedCategory, searchTerm])

  const handleCitySelect = (city) => {
    setSelectedCity(city)
    setMapCenter([city.location.coordinates[1], city.location.coordinates[0]])
    setMapZoom(13)
  }

  const handleEventCreated = (event) => {
    setLiveEvents(prev => [event, ...prev])
    setShowEventForm(false)
    toast.success('Etkinlik bildirildi! 🎉')
  }

  return (
    <div className="h-[calc(100vh-64px)] flex">
      {/* Sidebar */}
      <div className="w-80 shrink-0 bg-stone-900 border-r border-stone-800 flex flex-col overflow-hidden">
        {/* Search */}
        <div className="p-3 border-b border-stone-800">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
            <input
              className="input pl-9 text-sm py-2"
              placeholder="Mekan ara..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Cities */}
        <div className="p-3 border-b border-stone-800">
          <div className="text-xs font-medium text-stone-500 mb-2 uppercase tracking-wider">Şehir Seç</div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => { setSelectedCity(null); setMapCenter([39.1, 35.0]); setMapZoom(6) }}
              className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${!selectedCity ? 'bg-amber-500 text-stone-950 font-semibold' : 'bg-stone-800 text-stone-400 hover:text-stone-200'}`}
            >Tüm Türkiye</button>
            {cities.map(city => (
              <button
                key={city._id}
                onClick={() => handleCitySelect(city)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${selectedCity?._id === city._id ? 'bg-amber-500 text-stone-950 font-semibold' : 'bg-stone-800 text-stone-400 hover:text-stone-200'}`}
              >{city.name}</button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="p-3 border-b border-stone-800">
          <div className="text-xs font-medium text-stone-500 mb-2 uppercase tracking-wider">Kategori</div>
          <div className="flex flex-wrap gap-1.5">
            {categoryOptions.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${selectedCategory === cat ? 'bg-amber-500 text-stone-950 font-semibold' : 'bg-stone-800 text-stone-400 hover:text-stone-200'}`}
              >{categoryLabels[cat]}</button>
            ))}
          </div>
        </div>

        {/* Layer toggles */}
        <div className="p-3 border-b border-stone-800 flex gap-2">
          <button
            onClick={() => setShowPlaces(!showPlaces)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors flex-1 justify-center ${showPlaces ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-stone-800 text-stone-500'}`}
          >🏛️ Mekanlar ({places.length})</button>
          <button
            onClick={() => setShowEvents(!showEvents)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors flex-1 justify-center ${showEvents ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-stone-800 text-stone-500'}`}
          >⚡ Canlı ({liveEvents.length})</button>
        </div>

        {/* Live events list */}
        <div className="flex-1 overflow-y-auto">
          {liveEvents.length > 0 && showEvents && (
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-medium text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="live-dot w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  Canlı Etkinlikler
                </div>
                {user && (
                  <button onClick={() => setShowEventForm(true)} className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs hover:bg-emerald-500/20 transition-colors">
                    <Plus size={11} /> Bildir
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {liveEvents.map(event => (
                  <div key={event._id} className="p-2.5 bg-stone-800 rounded-xl border border-emerald-500/10">
                    <div className="flex items-start gap-2">
                      <span className="text-lg">{eventIcons[event.type] || '⚡'}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-stone-100 text-sm truncate">{event.title}</div>
                        <div className="text-stone-500 text-xs">{event.address || event.city}</div>
                        <div className="flex items-center gap-1 text-stone-600 text-xs mt-0.5">
                          <Clock size={10} />
                          {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true, locale: tr })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {liveEvents.length === 0 && selectedCity && (
            <div className="p-4 text-center text-stone-600 text-sm">
              <Zap size={24} className="mx-auto mb-2 opacity-30" />
              <p>Bu şehirde şu an aktif etkinlik yok.</p>
              {user && <button onClick={() => setShowEventForm(true)} className="text-amber-400 hover:text-amber-300 mt-1 text-xs">İlk bildiren sen ol!</button>}
            </div>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapController center={mapCenter} zoom={mapZoom} />

          {/* Place markers */}
          {showPlaces && places.map(place => (
            <Marker
              key={place._id}
              position={[place.location.coordinates[1], place.location.coordinates[0]]}
              icon={placeIcon}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <div className="font-semibold text-stone-100 text-sm mb-1">{place.name}</div>
                  <div className="text-stone-400 text-xs mb-2 line-clamp-2">{place.description}</div>
                  {has360Imagery(place) ? (
                    <button
                      onClick={() => setPanoramaPlace(place)}
                      className="text-amber-400 text-xs hover:underline flex items-center gap-1"
                    >
                      360 View →
                    </button>
                  ) : (
                    <div className="text-stone-500 text-xs">360 view not available yet</div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Event markers */}
          {showEvents && liveEvents.map(event => (
            <Marker key={event._id} position={[event.location.coordinates[1], event.location.coordinates[0]]} icon={createEventIcon(event.type)}>
              <Popup>
                <div className="min-w-[180px]">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="live-dot w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    <span className="text-emerald-400 text-xs">Canlı Etkinlik</span>
                  </div>
                  <div className="font-semibold text-stone-100 text-sm">{event.title}</div>
                  <div className="text-stone-400 text-xs mt-1">{event.description}</div>
                  <div className="text-stone-500 text-xs mt-1">
                    {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true, locale: tr })}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Floating add event button */}
        {user && selectedCity && (
          <button
            onClick={() => setShowEventForm(true)}
            className="absolute bottom-6 right-6 z-[1000] flex items-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full shadow-2xl transition-all active:scale-95 font-medium text-sm"
          >
            <Zap size={16} /> Etkinlik Bildir
          </button>
        )}
      </div>

      {/* Event form modal */}
      {showEventForm && (
        <EventForm
          selectedCity={selectedCity}
          onClose={() => setShowEventForm(false)}
          onCreated={handleEventCreated}
        />
      )}

      {/* Panorama modal */}
      {panoramaPlace && (
        <PanoramaModal
          place={panoramaPlace}
          onClose={() => setPanoramaPlace(null)}
        />
      )}
    </div>
  )
}
