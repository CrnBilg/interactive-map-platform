import { useEffect, useRef, useState } from 'react'
import { X, Star, MapPin, Clock, DollarSign, Globe, ExternalLink, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import { Link } from 'react-router-dom'

// Pannellum is loaded via CDN in index.html
// Falls back to Google Street View embed if no panorama images

const categoryEmoji = {
  historical: '🏛️', museum: '🏺', mosque: '🕌', castle: '🏰',
  ruins: '⛏️', monument: '🗿', cultural: '🎭', other: '📍',
}
const categoryLabel = {
  historical: 'Tarihi', museum: 'Müze', mosque: 'Cami', castle: 'Kale',
  ruins: 'Harabe', monument: 'Anıt', cultural: 'Kültürel', other: 'Diğer',
}

export default function PanoramaModal({ place, onClose }) {
  const viewerRef = useRef(null)
  const pannellumRef = useRef(null)
  const [viewerMode, setViewerMode] = useState('loading') // 'pannellum' | 'streetview' | 'fallback'
  const [currentPanoIdx, setCurrentPanoIdx] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const lat = place?.location?.coordinates?.[1]
  const lng = place?.location?.coordinates?.[0]

  // panoramaImages: use place.panoramas[] if available, else try Street View
  const panoramas = place?.panoramas || []
  const hasPannellum = panoramas.length > 0

  useEffect(() => {
    if (!place) return

    if (hasPannellum && window.pannellum) {
      initPannellum(panoramas[0])
    } else {
      // Use Google Street View embed (free, no API key needed for embed)
      setViewerMode('streetview')
    }

    return () => {
      if (pannellumRef.current) {
        pannellumRef.current.destroy()
        pannellumRef.current = null
      }
    }
  }, [place])

  const initPannellum = (imageUrl) => {
    if (!viewerRef.current || !window.pannellum) return
    if (pannellumRef.current) pannellumRef.current.destroy()

    pannellumRef.current = window.pannellum.viewer(viewerRef.current, {
      type: 'equirectangular',
      panorama: imageUrl,
      autoLoad: true,
      autoRotate: -2,
      autoRotateInactivityDelay: 2000,
      compass: true,
      showControls: true,
      mouseZoom: true,
      hfov: 110,
      pitch: 0,
      yaw: 0,
      strings: {
        loadButtonLabel: '360° Görünümü Başlat',
        loadingLabel: 'Yükleniyor...',
        bylineLabel: 'CityLore',
        noPanoramaError: 'Panorama yüklenemedi.',
      },
    })
    setViewerMode('pannellum')
  }

  const switchPanorama = (idx) => {
    setCurrentPanoIdx(idx)
    if (pannellumRef.current && panoramas[idx]) {
      pannellumRef.current.loadScene(panoramas[idx])
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      viewerRef.current?.requestFullscreen?.()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen?.()
      setIsFullscreen(false)
    }
  }

  // Street View embed URL (no API key needed)
  const streetViewUrl = `https://www.google.com/maps/embed?pb=!4v${Date.now()}!6m8!1m7!1sCAoSK0FGMVFpcE9MYWR0ZXN0!2m2!1d${lat}!2d${lng}!3f0!4f0!5f0.7820865974627469`

  // Fallback: Google Maps satellite embed
  const mapsUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=18&output=embed`

  if (!place) return null

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-3 md:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-stone-900 border border-stone-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">

        {/* 360 Viewer */}
        <div className="relative bg-stone-950" style={{ height: '320px' }}>

          {/* Pannellum container */}
          {hasPannellum && (
            <div ref={viewerRef} className="w-full h-full" />
          )}

          {/* Street View iframe fallback */}
          {!hasPannellum && viewerMode === 'streetview' && (
            <iframe
              title="Street View"
              src={`https://www.google.com/maps/embed/v1/streetview?key=AIzaSyD-dummy&location=${lat},${lng}&heading=0&pitch=0&fov=80`}
              className="w-full h-full border-0"
              loading="lazy"
              onError={() => setViewerMode('fallback')}
            />
          )}

          {/* Pure Google Maps embed fallback (always works, no key) */}
          {(viewerMode === 'fallback' || (!hasPannellum && viewerMode === 'streetview')) && (
            <iframe
              title={`${place.name} harita`}
              src={mapsUrl}
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
            />
          )}

          {/* Loading state */}
          {viewerMode === 'loading' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl mb-3">{categoryEmoji[place.category]}</div>
                <div className="text-stone-500 text-sm">Panorama yükleniyor...</div>
              </div>
            </div>
          )}

          {/* Top bar overlays */}
          <div className="absolute top-0 inset-x-0 flex items-start justify-between p-3 z-10">
            {/* 360 badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 text-xs text-stone-300">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
              {hasPannellum ? '360° Panorama' : 'Harita Görünümü'}
            </div>

            <div className="flex items-center gap-2">
              {hasPannellum && (
                <button
                  onClick={toggleFullscreen}
                  className="p-1.5 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 text-stone-400 hover:text-white transition-colors"
                >
                  <Maximize2 size={14} />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 text-stone-400 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Panorama switcher (if multiple) */}
          {panoramas.length > 1 && (
            <>
              <button
                onClick={() => switchPanorama(Math.max(0, currentPanoIdx - 1))}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => switchPanorama(Math.min(panoramas.length - 1, currentPanoIdx + 1))}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
              >
                <ChevronRight size={16} />
              </button>

              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {panoramas.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => switchPanorama(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentPanoIdx ? 'bg-amber-400 w-3' : 'bg-white/40'}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Drag hint for pannellum */}
          {viewerMode === 'pannellum' && (
            <div className="absolute bottom-3 right-3 text-xs text-white/40 bg-black/40 px-2 py-1 rounded-lg">
              Sürükle • Döndür
            </div>
          )}
        </div>

        {/* Info section */}
        <div className="p-5 overflow-y-auto">
          {/* Title row */}
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

          {/* Meta chips */}
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
                🆓 Ücretsiz
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

          {/* Description */}
          <p className="text-stone-400 text-sm leading-relaxed mb-4 line-clamp-3">
            {place.description}
          </p>

          {/* Actions */}
          <div className="flex gap-2">
            <Link
              to={`/place/${place._id}`}
              onClick={onClose}
              className="btn-primary flex-1 text-center text-sm py-2.5 flex items-center justify-center gap-2"
            >
              <ExternalLink size={14} /> Detay Sayfası
            </Link>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-sm py-2.5 flex items-center gap-1.5"
            >
              <Globe size={14} /> Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
