import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { citiesAPI, placesAPI } from '../services/api'
import { MapPin, Landmark, Zap, ArrowRight, Star, Image as ImageIcon } from 'lucide-react'
import { has360Imagery } from '../utils/place360'
import { useLanguage } from '../i18n/LanguageContext'

const getPlaceImage = (place) => Array.isArray(place.images) ? place.images.find(Boolean) : ''

export default function HomePage() {
  const { t, translateCity, translatePlace } = useLanguage()
  const [cities, setCities] = useState([])
  const [featuredPlaces, setFeaturedPlaces] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([citiesAPI.getAll(), placesAPI.getAll({ limit: 6 })])
      .then(([citiesRes, placesRes]) => {
        setCities(citiesRes.data.slice(0, 8))
        setFeaturedPlaces(placesRes.data.places)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-stone-950 to-stone-950" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(245,158,11,0.08) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(120,53,15,0.12) 0%, transparent 50%)' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm mb-8">
              <span className="live-dot w-2 h-2 bg-amber-400 rounded-full" />
              {t('home.liveTracking')}
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-stone-100 leading-tight mb-6">
              {t('home.titlePrefix')}<br />
              <span className="text-amber-400">{t('home.titleHighlight')}</span><br />
              {t('home.titleSuffix')}
            </h1>
            <p className="text-stone-400 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
              {t('home.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/map" className="btn-primary flex items-center justify-center gap-2 text-base py-3 px-8">
                <MapPin size={18} /> {t('common.openMap')}
              </Link>
              <Link to="/register" className="btn-secondary flex items-center justify-center gap-2 text-base py-3 px-8">
                {t('home.freeRegister')} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-stone-800 bg-stone-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-3 gap-8">
            {[
              { label: t('home.statsCity'), value: '81+', icon: MapPin },
              { label: t('home.statsPlace'), value: '500+', icon: Landmark },
              { label: t('home.statsLive'), value: '∞', icon: Zap },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="text-center">
                <Icon size={20} className="text-amber-400 mx-auto mb-2" />
                <div className="font-display text-3xl font-bold text-stone-100">{value}</div>
                <div className="text-stone-500 text-sm mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-3xl font-bold text-stone-100">{t('home.cities')}</h2>
          <Link to="/map" className="text-amber-400 hover:text-amber-300 text-sm flex items-center gap-1">{t('home.viewOnMap')} <ArrowRight size={14} /></Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[...Array(8)].map((_, i) => <div key={i} className="h-24 bg-stone-800 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {cities.map(city => {
              const displayCity = translateCity(city)
              return (
              <Link key={city._id} to={`/city/${city._id}`} className="card p-4 hover:border-amber-500/40 hover:bg-stone-800/50 transition-all group">
                <div className="font-semibold text-stone-100 group-hover:text-amber-300 transition-colors">{displayCity.displayName}</div>
                <div className="text-stone-500 text-xs mt-1">{displayCity.displayRegion}</div>
                <div className="flex items-center gap-1 text-amber-500/70 text-xs mt-2">
                  <Landmark size={11} /> {t('home.placeCount', { count: city.placeCount })}
                </div>
              </Link>
            )})}
          </div>
        )}
      </section>

      {/* Featured Places */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-3xl font-bold text-stone-100">{t('home.featured')}</h2>
          <Link to="/map" className="text-amber-400 hover:text-amber-300 text-sm flex items-center gap-1">{t('home.seeAll')} <ArrowRight size={14} /></Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="h-48 bg-stone-800 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredPlaces.map(place => {
              const displayPlace = translatePlace(place)
              const placeImage = getPlaceImage(place)
              return (
              <Link key={place._id} to={`/place/${place._id}`} className="card group hover:border-amber-500/30 transition-all">
                <div className="h-40 bg-gradient-to-br from-stone-800 to-stone-900 flex items-center justify-center overflow-hidden">
                  {placeImage && (
                    <img
                      src={placeImage}
                      alt={displayPlace.displayName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.classList.add('hidden')
                        e.currentTarget.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                  )}
                  <div className={`${placeImage ? 'hidden ' : ''}flex flex-col items-center gap-2 text-stone-600`}>
                    <ImageIcon size={34} strokeWidth={1.4} />
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-stone-100 group-hover:text-amber-300 transition-colors leading-tight">{displayPlace.displayName}</h3>
                    {place.rating > 0 && (
                      <div className="flex items-center gap-1 text-amber-400 text-sm shrink-0">
                        <Star size={12} fill="currentColor" /> {place.rating}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-stone-500 text-xs mb-2">
                    <MapPin size={11} /> {displayPlace.displayCity}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="badge bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {displayPlace.displayCategory || t(`categories.${place.category}`)}
                    </span>
                    {place.period && <span className="text-stone-600 text-xs">{displayPlace.displayPeriod}</span>}
                  </div>
                  <div className={`mt-3 text-xs ${has360Imagery(place) ? 'text-amber-400' : 'text-stone-600'}`}>
                    {has360Imagery(place) ? '360 View' : t('place.viewUnavailable')}
                  </div>
                </div>
              </Link>
            )})}
          </div>
        )}
      </section>
    </div>
  )
}
