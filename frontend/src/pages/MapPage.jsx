import { useState, useEffect, useCallback, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet'
import L from 'leaflet'
import { placesAPI, eventsAPI, citiesAPI } from '../services/api'
import { useSocket } from '../context/SocketContext'
import { useAuth } from '../context/AuthContext'
import { useRoute } from '../context/RouteContext'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Filter, Zap, MapPin, Star, X, Plus, Clock, Navigation, Trash2, Car, Footprints, Cloud, Sun, CloudRain, CloudLightning, CloudSnow, Wind } from 'lucide-react'
import EventForm from '../components/EventForm'
import PanoramaModal from '../components/PanoramaModal'
import { has360Imagery } from '../utils/place360'
import axios from 'axios'
import toast from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'
import { enUS, tr } from 'date-fns/locale'
import { useLanguage } from '../i18n/LanguageContext'
import demoEvents from '../data/demoEvents'

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

const liveCulturalEventIcon = L.divIcon({
  className: '',
  html: `<div style="width:38px;height:38px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fbbf24 0%,#f97316 42%,#991b1b 100%);border:2px solid #facc15;box-shadow:0 0 0 6px rgba(249,115,22,.18),0 0 24px rgba(248,113,22,.85),0 6px 16px rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;color:#fff7ed;font-size:17px;position:relative;animation:pulse-glow 1.8s ease-in-out infinite"><span>✦</span><span style="position:absolute;inset:-8px;border-radius:50%;border:1px solid rgba(251,191,36,.35);animation:pulse-dot 1.8s ease-in-out infinite"></span></div>`,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
  popupAnchor: [0, -22],
})

function MapController({ center, zoom }) {
  const map = useMap()
  useEffect(() => { if (center) map.setView(center, zoom || 13) }, [center, zoom])
  return null
}

const categoryOptions = ['all', 'historical', 'museum', 'mosque', 'castle', 'ruins', 'monument', 'cultural']

const getWeatherIcon = (code) => {
  if (code === 0) return <Sun size={14} className="text-amber-400" />
  if (code >= 1 && code <= 3) return <Cloud size={14} className="text-stone-400" />
  if (code >= 51 && code <= 67) return <CloudRain size={14} className="text-blue-400" />
  if (code >= 71 && code <= 77) return <CloudSnow size={14} className="text-stone-100" />
  if (code >= 80 && code <= 82) return <CloudRain size={14} className="text-blue-500" />
  if (code >= 95) return <CloudLightning size={14} className="text-purple-400" />
  return <Wind size={14} className="text-stone-500" />
}

const isRainy = (code) => (code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95

const formatDistance = (m) => {
  if (m < 1000) return `${Math.round(m)} m`
  return `${(m / 1000).toFixed(1)} km`
}

const formatTime = (s, language = 'tr') => {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  if (language === 'en') {
    if (h > 0) return `${h} hr ${m} min`
    return `${m} min`
  }
  if (h > 0) return `${h} sa ${m} dk`
  return `${m} dk`
}

const getEventDate = (event) => new Date(`${event.date}T${event.time}:00`)

const getEventStatus = (event) => {
  const eventDate = getEventDate(event)
  const diffMs = eventDate.getTime() - Date.now()
  const liveWindowMs = 2 * 60 * 60 * 1000

  if (Math.abs(diffMs) <= liveWindowMs) return 'live'
  if (diffMs > 0) return 'upcoming'
  return null
}

const ORS_API_KEY = import.meta.env.VITE_ORS_API_KEY;

export default function MapPage() {
  const { language, t, translateCity, translatePlace, translateEvent } = useLanguage()
  const [searchParams] = useSearchParams()
  const isLiveTab = searchParams.get('tab') === 'live'
  const eventMarkerRefs = useRef({})
  const { user } = useAuth()
  const { liveEvents, setLiveEvents, joinCity, leaveCity } = useSocket()
  const { routePlaces, addToRoute, removeFromRoute, clearRoute } = useRoute()
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
  const [routeSummary, setRouteSummary] = useState(null)
  const [walkingSummary, setWalkingSummary] = useState(null)
  const [routePolyline, setRoutePolyline] = useState([])
  const [walkingPolyline, setWalkingPolyline] = useState([])
  const [weather, setWeather] = useState(null)

  const getDemoEventTitle = (event) => language === 'tr' ? event.titleTR : event.titleEN
  const getDemoEventDescription = (event) => language === 'tr' ? event.descriptionTR : event.descriptionEN
  const getDemoEventStatusLabel = (status) => {
    if (status === 'live') return language === 'tr' ? t('map.liveStatus') : 'LIVE'
    return language === 'tr' ? t('map.upcoming') : 'UPCOMING'
  }
  const visibleDemoEvents = demoEvents
    .map(event => ({
      ...event,
      computedStatus: getEventStatus(event),
      eventDate: getEventDate(event),
    }))
    .filter(event => event.computedStatus)
    .sort((a, b) => {
      if (a.computedStatus !== b.computedStatus) return a.computedStatus === 'live' ? -1 : 1
      return a.eventDate - b.eventDate
    })
  const focusDemoEvent = (event) => {
    setMapCenter(event.coordinates)
    setMapZoom(13)
    window.setTimeout(() => {
      eventMarkerRefs.current[event.id]?.openPopup()
    }, 120)
  }

  useEffect(() => {
    if (isLiveTab) {
      setShowPlaces(false)
      setShowEvents(true)
    }
  }, [isLiveTab])

  useEffect(() => {
    citiesAPI.getAll().then(res => setCities(res.data))
  }, [])

  // Fetch Weather
  useEffect(() => {
    if (!selectedCity) {
      setWeather(null)
      return
    }

    const fetchWeather = async () => {
      try {
        const [lng, lat] = selectedCity.location.coordinates
        const res = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`)
        setWeather(res.data.current_weather)
      } catch (err) {
        console.error('Weather fetch error:', err)
      }
    }

    fetchWeather()
  }, [selectedCity])

  // Fetch both driving and walking route summaries and geometries from OpenRouteService API
  useEffect(() => {
    if (routePlaces.length < 2) {
      setRouteSummary(null)
      setWalkingSummary(null)
      setRoutePolyline([])
      setWalkingPolyline([])
      return
    }

    const fetchRoutes = async () => {
      const coordinates = routePlaces.map(p => [p.location.coordinates[0], p.location.coordinates[1]])
      
      const fetchORSRoute = async (profile) => {
        try {
          const response = await axios.post(`https://api.openrouteservice.org/v2/directions/${profile}/geojson`, {
            coordinates: coordinates,
            preference: 'shortest'
          }, {
            headers: {
              'Authorization': ORS_API_KEY,
              'Content-Type': 'application/json'
            }
          })
          
          if (response.data.features && response.data.features[0]) {
            const feature = response.data.features[0]
            const geometry = feature.geometry.coordinates.map(coord => [coord[1], coord[0]])

            if (profile === 'driving-car') {
              setRoutePolyline(geometry)
            } else if (profile === 'foot-walking') {
              setWalkingPolyline(geometry)
            }

            return {
              distance: feature.properties.summary.distance,
              time: feature.properties.summary.duration
            }
          }
        } catch (err) {
          console.error(`ORS ${profile} error:`, err)
          return null
        }
      }

      const driveData = await fetchORSRoute('driving-car')
      if (driveData) setRouteSummary(driveData)

      const walkData = await fetchORSRoute('foot-walking')
      if (walkData) setWalkingSummary(walkData)
    }

    fetchRoutes()
  }, [routePlaces])

  useEffect(() => {
    const params = {}
    if (selectedCity) params.city = selectedCity.name
    if (selectedCategory !== 'all') params.category = selectedCategory
    if (searchTerm) params.search = searchTerm

    placesAPI.getAll({ ...params, limit: 500 }).then(res => {
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
    toast.success(t('map.eventReported'))
  }

  const waypoints = routePlaces.map(p => [p.location.coordinates[1], p.location.coordinates[0]])

  return (
    <div className="h-[calc(100vh-64px)] flex">
      {/* Sidebar */}
      <div className="w-80 shrink-0 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 flex flex-col overflow-y-auto overflow-x-hidden transition-colors duration-300">
        {/* Search */}
        <div className="p-3 border-b border-stone-200 dark:border-stone-800">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500" />
            <input
              className="input pl-9 text-sm py-2"
              placeholder={t('map.search')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Cities */}
        <div className="p-3 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-medium text-stone-400 dark:text-stone-500 uppercase tracking-wider">{t('map.selectCity')}</div>
            {weather && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-stone-100 dark:bg-stone-800 rounded-full border border-stone-200 dark:border-stone-700 transition-colors">
                {getWeatherIcon(weather.weathercode)}
                <span className="text-[11px] font-bold text-stone-700 dark:text-stone-200">{Math.round(weather.temperature)}°C</span>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
            <button
              onClick={() => { setSelectedCity(null); setMapCenter([39.1, 35.0]); setMapZoom(6) }}
              className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${!selectedCity ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm' : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'}`}
            >{t('common.allTurkey')}</button>
            {cities.map(city => (
              <button
                key={city._id}
                onClick={() => handleCitySelect(city)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${selectedCity?._id === city._id ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm' : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'}`}
              >{translateCity(city).displayName}</button>
            ))}
          </div>
        </div>

        {/* Weather Suggestion */}
        {weather && isRainy(weather.weathercode) && (
          <div className="p-3 bg-blue-500/5 dark:bg-blue-500/10 border-b border-blue-200 dark:border-blue-500/20 transition-colors">
            <button 
              onClick={() => setSelectedCategory('museum')}
              className="w-full flex items-center justify-between p-2 bg-blue-500/10 dark:bg-blue-500/20 hover:bg-blue-500/20 dark:hover:bg-blue-500/30 border border-blue-200 dark:border-blue-500/30 rounded-xl transition-all group"
            >
              <div className="flex items-center gap-2">
                <CloudRain size={16} className="text-blue-500 dark:text-blue-400 animate-bounce" />
                <div className="text-left">
                  <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 leading-none">{t('map.rainyTitle')}</div>
                  <div className="text-[10px] text-blue-500/70 dark:text-blue-300/70 mt-0.5">{t('map.rainyText')}</div>
                </div>
              </div>
              <Plus size={14} className="text-blue-500 dark:text-blue-400 group-hover:rotate-90 transition-transform" />
            </button>
          </div>
        )}

        {/* Layer toggles */}
        <div className="p-3 border-b border-stone-200 dark:border-stone-800 flex gap-2">
          <button
            onClick={() => setShowPlaces(!showPlaces)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors flex-1 justify-center ${showPlaces ? 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30' : 'bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-500'}`}
          >🏛️ {t('map.places')} ({places.length})</button>
          <button
            onClick={() => setShowEvents(!showEvents)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors flex-1 justify-center ${showEvents ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30' : 'bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-500'}`}
          >⚡ {isLiveTab ? t('map.liveCulturalEvents') : t('map.live')} ({isLiveTab ? visibleDemoEvents.length : liveEvents.length})</button>
        </div>

        {isLiveTab && (
          <div className="flex-1 flex flex-col overflow-hidden bg-stone-950">
            <div className="p-3 border-b border-amber-500/20 bg-stone-950/95">
              <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Zap size={14} />
                {t('map.liveCulturalEvents')} ({visibleDemoEvents.length})
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {visibleDemoEvents.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <div className="w-12 h-12 bg-stone-900 rounded-full flex items-center justify-center mb-3 text-amber-400 border border-amber-500/20">
                    <Zap size={20} />
                  </div>
                  <div className="text-sm font-semibold text-amber-300">{t('map.noLiveEvents')}</div>
                  <p className="text-stone-500 text-xs leading-relaxed mt-1">{t('map.noLiveEventsNow')}</p>
                </div>
              ) : (
                visibleDemoEvents.map(event => (
                  <button
                    key={event.id}
                    onClick={() => focusDemoEvent(event)}
                    className="group w-full text-left p-3 rounded-xl border border-amber-500/15 bg-stone-900/80 hover:border-orange-400/50 hover:bg-stone-900 transition-all shadow-[inset_0_1px_0_rgb(255_255_255_/_0.04)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-stone-100 group-hover:text-amber-200 transition-colors line-clamp-2">
                          {getDemoEventTitle(event)}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-stone-400">
                          <MapPin size={12} className="text-amber-500" />
                          <span className="truncate">{event.city}</span>
                        </div>
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${event.computedStatus === 'live' ? 'bg-red-500/15 text-red-300 border border-red-400/30' : 'bg-amber-400/15 text-amber-200 border border-amber-300/30'}`}>
                        {getDemoEventStatusLabel(event.computedStatus)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-stone-500">
                      <Clock size={12} className="text-orange-400" />
                      <span>{event.date} · {event.time}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Route Section */}
        {!isLiveTab && (
        <div className="flex-1 flex flex-col overflow-hidden bg-stone-50/50 dark:bg-stone-950/30">
          <div className="p-3 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-white dark:bg-stone-900/50">
            <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Navigation size={14} />
              {t('map.myRoute')} ({routePlaces.length})
            </div>
            {routePlaces.length > 0 && (
              <button onClick={clearRoute} className="text-stone-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                <Trash2 size={14} />
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {routePlaces.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="w-12 h-12 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mb-3 text-stone-300 dark:text-stone-600">
                  <Navigation size={20} />
                </div>
                <p className="text-stone-400 dark:text-stone-500 text-xs leading-relaxed">
                  {t('map.emptyRoute')}<br/>{t('map.emptyRouteHint')}
                </p>
              </div>
            ) : (
              <>
                {routePlaces.map((place, index) => (
                  <div key={place._id} className="group relative flex items-center gap-3 p-2 bg-white dark:bg-stone-800/50 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700/50 transition-all">
                    <div className="w-6 h-6 shrink-0 bg-amber-500 text-stone-950 rounded-full flex items-center justify-center text-[10px] font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-stone-800 dark:text-stone-200 truncate">{translatePlace(place).displayName}</div>
                      <div className="text-[10px] text-stone-400 dark:text-stone-500">{translatePlace(place).displayCity}</div>
                    </div>
                    <button 
                      onClick={() => removeFromRoute(place._id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-stone-400 hover:text-red-500 dark:hover:text-red-400 transition-all"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}

                {routeSummary && routePlaces.length >= 2 && (
                  <div className="mt-4 p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl space-y-3 animate-fade-in shadow-inner">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400">
                        <Car size={14} className="text-amber-500" />
                        <span className="text-xs">{t('map.driving')}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-amber-600 dark:text-amber-500">{formatTime(routeSummary.time, language)}</div>
                        <div className="text-[10px] text-stone-400 dark:text-stone-600 font-mono">{formatDistance(routeSummary.distance)}</div>
                      </div>
                    </div>

                    <div className="h-px bg-stone-100 dark:bg-stone-800" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400">
                        <Footprints size={14} className="text-emerald-500" />
                        <span className="text-xs">{t('map.walking')}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-emerald-600 dark:text-emerald-500">
                          {walkingSummary ? formatTime(walkingSummary.time, language) : '...'}
                        </div>
                        <div className="text-[10px] text-stone-400 dark:text-stone-600 font-mono">
                          {walkingSummary ? formatDistance(walkingSummary.distance) : '...'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        )}
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

          {/* Driving Route (with outline for prominence) */}
          {routePolyline.length > 0 && (
            <>
              <Polyline 
                positions={routePolyline}
                pathOptions={{ color: '#000', weight: 10, opacity: 0.3, lineJoin: 'round' }} 
              />
              <Polyline 
                positions={routePolyline}
                pathOptions={{ 
                  color: '#f59e0b', 
                  weight: 6, 
                  opacity: 1,
                  lineJoin: 'round'
                }} 
              />
            </>
          )}

          {/* Walking Route (with outline for prominence) */}
          {walkingPolyline.length > 0 && (
            <>
              <Polyline 
                positions={walkingPolyline}
                pathOptions={{ color: '#000', weight: 8, opacity: 0.3, lineJoin: 'round' }} 
              />
              <Polyline 
                positions={walkingPolyline}
                pathOptions={{ 
                  color: '#10b981', 
                  weight: 4, 
                  opacity: 1,
                  dashArray: '2, 10',
                  lineJoin: 'round'
                }} 
              />
            </>
          )}

          {/* Place markers */}
          {!isLiveTab && showPlaces && places.map(place => (
            <Marker
              key={place._id}
              position={[place.location.coordinates[1], place.location.coordinates[0]]}
              icon={placeIcon}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <div className="font-semibold text-stone-100 text-sm mb-1">{translatePlace(place).displayName}</div>
                  <div className="text-stone-400 text-xs mb-3 line-clamp-2">{translatePlace(place).displayDescription}</div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => addToRoute(place)}
                      className="flex-1 bg-amber-500 hover:bg-amber-400 text-stone-950 text-[11px] font-bold py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <Plus size={12} /> {t('map.addToRoute')}
                    </button>
                    {has360Imagery(place) && (
                      <button
                        onClick={() => setPanoramaPlace(place)}
                        className="bg-stone-800 hover:bg-stone-700 text-stone-200 p-1.5 rounded-lg transition-colors"
                        title="360 View"
                      >
                        <Zap size={14} />
                      </button>
                    )}
                  </div>
                  <Link to={`/place/${place._id}`} className="block text-center text-stone-500 text-[10px] mt-2 hover:text-stone-300 transition-colors">
                    {t('map.viewDetails')}
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Event markers */}
          {isLiveTab && visibleDemoEvents.map(event => (
            <Marker
              key={event.id}
              ref={(marker) => {
                if (marker) eventMarkerRefs.current[event.id] = marker
              }}
              position={event.coordinates}
              icon={liveCulturalEventIcon}
            >
              <Popup>
                <div className="min-w-[220px] rounded-xl bg-stone-950 text-stone-100">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="font-semibold text-amber-200 text-sm leading-snug">{getDemoEventTitle(event)}</div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${event.computedStatus === 'live' ? 'bg-red-500/20 text-red-200 border border-red-400/40' : 'bg-amber-400/20 text-amber-100 border border-amber-300/40'}`}>
                      {getDemoEventStatusLabel(event.computedStatus)}
                    </span>
                  </div>
                  <div className="text-stone-300 text-xs mb-1">{event.city} · {event.venue}</div>
                  <div className="flex items-center gap-1.5 text-orange-300 text-xs mb-3">
                    <Clock size={12} />
                    <span>{event.date} · {event.time}</span>
                  </div>
                  <div className="text-stone-400 text-xs leading-relaxed">{getDemoEventDescription(event)}</div>
                </div>
              </Popup>
            </Marker>
          ))}

          {!isLiveTab && showEvents && liveEvents.map(event => (
            <Marker key={event._id} position={[event.location.coordinates[1], event.location.coordinates[0]]} icon={createEventIcon(event.type)}>
              <Popup>
                <div className="min-w-[180px]">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="live-dot w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    <span className="text-emerald-400 text-xs">{t('map.liveEvent')}</span>
                  </div>
                  <div className="font-semibold text-stone-100 text-sm">{translateEvent(event).displayTitle}</div>
                  <div className="text-stone-400 text-xs mt-1">{translateEvent(event).displayDescription}</div>
                  <div className="text-stone-500 text-xs mt-1">
                    {formatDistanceToNow(new Date(event.createdAt), { addSuffix: true, locale: language === 'tr' ? tr : enUS })}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Floating add event button */}
        {!isLiveTab && user && selectedCity && (
          <button
            onClick={() => setShowEventForm(true)}
            className="absolute bottom-6 right-6 z-[1000] flex items-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full shadow-2xl transition-all active:scale-95 font-medium text-sm"
          >
            <Zap size={16} /> {t('map.reportEvent')}
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
