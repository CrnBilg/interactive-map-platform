import { useEffect, useMemo, useRef, useState } from 'react'
import { X, Star, MapPin, Clock, DollarSign, Globe, ExternalLink, AlertCircle, Maximize2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getGoogleStreetViewEmbedUrl, getPanoramaxUrl, getPrimary360Source } from '../utils/place360'

const GOOGLE_EMBED_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_EMBED_API_KEY

const categoryEmoji = {
  historical: '🏛️', museum: '🏺', mosque: '🕌', castle: '🏰',
  ruins: '⛏️', monument: '🗿', cultural: '🎭', other: '📍',
}
const categoryLabel = {
  historical: 'Tarihi', museum: 'Müze', mosque: 'Cami', castle: 'Kale',
  ruins: 'Harabe', monument: 'Anıt', cultural: 'Kültürel', other: 'Diğer',
}

const mediaTypeFromUrl = (url = '') => {
  const cleanUrl = url.split('?')[0].toLowerCase()
  if (/\.(jpg|jpeg|png|webp|gif)$/.test(cleanUrl)) return 'image'
  if (/\.(mp4|webm|ogg)$/.test(cleanUrl)) return 'video'
  return 'external'
}

export default function PanoramaModal({ place, onClose }) {
  const viewerRef = useRef(null)
  const [viewerMode, setViewerMode] = useState('loading')
  const [statusMessage, setStatusMessage] = useState('')

  const lat = place?.location?.coordinates?.[1]
  const lng = place?.location?.coordinates?.[0]
  const source = useMemo(() => getPrimary360Source(place), [place])
  const canUseGoogleEmbed = GOOGLE_EMBED_API_KEY && Number.isFinite(lat) && Number.isFinite(lng)
  const googleEmbedUrl = canUseGoogleEmbed
    ? getGoogleStreetViewEmbedUrl({
        apiKey: GOOGLE_EMBED_API_KEY,
        lat,
        lng,
        panoId: place?.streetView?.panoId,
        heading: place?.streetView?.heading,
        pitch: place?.streetView?.pitch,
        fov: place?.streetView?.fov,
        radius: place?.streetView?.radius,
      })
    : null
  const fallbackMediaType = source?.type === 'panorama' ? mediaTypeFromUrl(source.value) : null
  const fallbackIframeUrl = source?.type === 'panoramax'
    ? getPanoramaxUrl(source.value)
    : source?.type === 'street-url' && !source.value.includes('openstreetmap.org/#map')
      ? source.value
      : null

  useEffect(() => {
    setStatusMessage('')

    if (googleEmbedUrl) {
      setViewerMode('google')
    } else if (!source) {
      setStatusMessage('No verified 360 source exists for this place yet.')
      setViewerMode('message')
    } else if (source.type === 'panorama') {
      if (fallbackMediaType === 'external') {
        setStatusMessage('This backup 360 source opens as an external page and cannot be embedded here. Use the button below to open it.')
        setViewerMode('external')
      } else {
        setViewerMode('panorama')
      }
    } else if (fallbackIframeUrl) {
      setViewerMode('iframe')
    } else {
      setStatusMessage('This backup street-level source does not allow embedding. Use the button below to open it.')
      setViewerMode('external')
    }
  }, [googleEmbedUrl, source, fallbackMediaType, fallbackIframeUrl])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      viewerRef.current?.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
  }

  if (!place) return null

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-3 md:p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-stone-900 border border-stone-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
        <div ref={viewerRef} className="relative bg-stone-950" style={{ height: '320px' }}>
          {viewerMode === 'google' && (
            <iframe
              title={`${place.name} Google Street View`}
              src={googleEmbedUrl}
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          )}

          {viewerMode === 'panorama' && (
            fallbackMediaType === 'video' ? (
              <video src={source.value} className="w-full h-full object-contain" controls autoPlay muted loop playsInline />
            ) : (
              <img src={source.value} alt={`${place.name} 360 view`} className="w-full h-full object-contain" />
            )
          )}

          {viewerMode === 'iframe' && fallbackIframeUrl && (
            <iframe
              title={`${place.name} street-level view`}
              src={fallbackIframeUrl}
              className="w-full h-full border-0"
              loading="lazy"
              allow="fullscreen; gyroscope; accelerometer"
              allowFullScreen
            />
          )}

          {viewerMode === 'loading' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl mb-3">{categoryEmoji[place.category]}</div>
                <div className="text-stone-500 text-sm">360 view loading...</div>
              </div>
            </div>
          )}

          {viewerMode === 'message' && (
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="max-w-sm rounded-xl border border-stone-800 bg-stone-900/90 p-4 text-center">
                <AlertCircle size={24} className="mx-auto mb-3 text-amber-400" />
                <p className="text-sm text-stone-300">{statusMessage}</p>
              </div>
            </div>
          )}

          {viewerMode === 'external' && (
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="max-w-sm rounded-xl border border-stone-800 bg-stone-900/90 p-4 text-center">
                <AlertCircle size={24} className="mx-auto mb-3 text-amber-400" />
                <p className="text-sm text-stone-300 mb-4">{statusMessage}</p>
                <a href={source.value} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2">
                  <ExternalLink size={14} /> Open view
                </a>
              </div>
            </div>
          )}

          <div className="absolute top-0 inset-x-0 flex items-start justify-between p-3 z-10">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 text-xs text-stone-300">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
              {viewerMode === 'google' ? 'Google Street View' : source?.type === 'panoramax' ? 'Panoramax' : source ? '360 View' : 'No 360 View'}
            </div>

            <div className="flex items-center gap-2">
              {viewerMode !== 'message' && (
                <button onClick={toggleFullscreen} className="p-1.5 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 text-stone-400 hover:text-white transition-colors">
                  <Maximize2 size={14} />
                </button>
              )}
              <button onClick={onClose} className="p-1.5 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 text-stone-400 hover:text-white transition-colors">
                <X size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-5 overflow-y-auto">
          <div className="flex items-start gap-3 mb-3">
            <div className="text-3xl">{categoryEmoji[place.category]}</div>
            <div className="flex-1 min-w-0">
              <h2 className="font-display text-xl font-bold text-stone-100 leading-tight">{place.name}</h2>
              <div className="flex items-center gap-1.5 text-stone-500 text-xs mt-1">
                <MapPin size={11} /> {place.city}
                {place.address && <span>• {place.address}</span>}
              </div>
            </div>
            {place.rating > 0 && (
              <div className="flex items-center gap-1 text-amber-400 shrink-0">
                <Star size={14} fill="currentColor" />
                <span className="font-semibold">{place.rating}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            <span className="badge bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-2.5 py-1">
              {categoryLabel[place.category]}
            </span>
            {place.period && (
              <span className="badge bg-stone-800 text-stone-400 border border-stone-700 text-xs px-2.5 py-1">
                {place.period}
              </span>
            )}
            {place.entryFee === 0 ? (
              <span className="badge bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-1">
                Ücretsiz
              </span>
            ) : place.entryFee > 0 ? (
              <span className="badge bg-stone-800 text-stone-400 border border-stone-700 text-xs px-2.5 py-1">
                <DollarSign size={10} /> ₺{place.entryFee}
              </span>
            ) : null}
            {place.openingHours && (
              <span className="badge bg-stone-800 text-stone-400 border border-stone-700 text-xs px-2.5 py-1 flex items-center gap-1">
                <Clock size={10} /> {place.openingHours}
              </span>
            )}
          </div>

          <p className="text-stone-400 text-sm leading-relaxed mb-4 line-clamp-3">
            {place.description}
          </p>

          <div className="flex gap-2">
            <Link to={`/place/${place._id}`} onClick={onClose} className="btn-primary flex-1 text-center text-sm py-2.5 flex items-center justify-center gap-2">
              <ExternalLink size={14} /> Detay Sayfası
            </Link>
            <a href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=18/${lat}/${lng}`} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm py-2.5 flex items-center gap-1.5">
              <Globe size={14} /> OSM
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
