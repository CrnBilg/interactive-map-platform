import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Compass, Landmark, MapPin } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'
import { useLanguage } from '../i18n/LanguageContext'

export default function SavedPlacesPage() {
  const { user } = useAuth()
  const { t, translatePlace } = useLanguage()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    authAPI.getMe().then(res => setProfile(res.data))
  }, [user])

  if (!profile) return <div className="flex h-64 items-center justify-center text-stone-500">{t('common.loading')}</div>

  const savedPlaces = profile.savedPlaces || []
  const getPlaceId = (place) => place?._id || place?.id || place
  const getPlaceImage = (place) => {
    if (Array.isArray(place?.images) && place.images[0]) return place.images[0]
    if (Array.isArray(place?.imageUrls) && place.imageUrls[0]) return place.imageUrls[0]
    if (place?.imageUrl) return place.imageUrl
    return ''
  }

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(hsl(var(--gold-line)/0.45)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--gold-line)/0.35)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="profile-gold-glow pointer-events-none absolute left-1/2 top-0 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-gold-bright/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl animate-fade-in">
        <Link to="/profile" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-gold-bright transition hover:text-gold-soft">
          <ArrowLeft size={16} />
          {t('nav.profile')}
        </Link>

        <header className="profile-fade-up relative overflow-hidden rounded-lg border border-gold/25 bg-panel/80 px-6 py-8 shadow-card-lux backdrop-blur sm:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--gold-bright)/0.2),transparent_34%),radial-gradient(circle_at_78%_0%,hsl(var(--ember-red)/0.1),transparent_28%)]" />
          <div className="relative z-10 max-w-3xl">
            <p className="section-label mb-3">{t('savedPlacesPage.eyebrow')}</p>
            <h1 className="font-display text-4xl font-bold text-stone-100 md:text-5xl">{t('savedPlacesPage.title')}</h1>
            <p className="mt-3 text-sm leading-6 text-stone-400 sm:text-base">{t('savedPlacesPage.subtitle')}</p>
          </div>
        </header>

        {savedPlaces.length === 0 ? (
          <section className="profile-fade-up mt-8 rounded-lg border border-gold/25 bg-panel/85 px-6 py-12 text-center shadow-card-lux">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold-bright">
              <Landmark size={28} />
            </div>
            <h2 className="font-display text-2xl font-semibold text-stone-100">{t('savedPlacesPage.emptyTitle')}</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-stone-500">{t('savedPlacesPage.emptyText')}</p>
            <Link to="/map?tab=places" className="hero-cta mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-gold-bright to-gold-deep px-5 py-3 text-sm font-bold text-bg-deep transition duration-300">
              <MapPin size={16} />
              {t('savedPlacesPage.exploreMap')}
            </Link>
          </section>
        ) : (
          <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {savedPlaces.map((place, index) => {
              const displayPlace = typeof place === 'object' ? translatePlace(place) : null
              const placeId = getPlaceId(place)
              const image = typeof place === 'object' ? getPlaceImage(place) : ''
              return (
                <article key={placeId || index} className="profile-fade-up group overflow-hidden rounded-lg border border-gold/20 bg-bg-black/65 shadow-card-lux transition duration-300 hover:-translate-y-1 hover:border-gold/55 hover:shadow-gold-bloom" style={{ animationDelay: `${index * 60}ms` }}>
                  <div className="relative h-44 overflow-hidden bg-[radial-gradient(circle_at_35%_20%,hsl(var(--gold-bright)/0.28),transparent_30%),linear-gradient(145deg,hsl(var(--bg-black)),hsl(var(--vellum)),hsl(var(--bg-panel)))]">
                    {image ? (
                      <img src={image} alt={displayPlace.displayName} className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-110 group-hover:opacity-95" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gold/70">
                        <Landmark size={46} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-black via-bg-black/20 to-transparent" />
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="line-clamp-2 font-display text-xl font-semibold text-stone-100">
                          {displayPlace?.displayName || t('profile.discoveryPuzzleFallback')}
                        </h2>
                        <p className="mt-2 flex items-center gap-1 text-xs text-stone-500">
                          <MapPin size={12} /> {displayPlace?.displayCity || t('profile.unknownCity')}
                        </p>
                      </div>
                      {displayPlace?.displayCategory && (
                        <span className="rounded-full border border-gold/25 bg-gold/10 px-2.5 py-1 text-xs font-semibold text-gold-bright">
                          {displayPlace.displayCategory}
                        </span>
                      )}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <Link to={`/place/${placeId}`} className="flex-1 rounded-lg bg-gold-bright px-3 py-2 text-center text-xs font-bold text-bg-deep transition hover:bg-gold-soft">
                        {t('savedPlacesPage.viewPlace')}
                      </Link>
                      <Link to="/map?tab=places" className="inline-flex items-center justify-center gap-2 rounded-lg border border-gold/40 bg-bg-black/85 px-3 py-2 text-xs font-semibold text-gold-bright transition hover:border-gold-bright">
                        <Compass size={13} />
                        {t('savedPlacesPage.viewOnMap')}
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </section>
        )}
      </div>
    </div>
  )
}
