import { useEffect, useRef, useState } from 'react'
import { Bookmark, Landmark, Lock, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'

const TILE_COUNT = 20
const CONFETTI_COUNT = 18

export default function DiscoveryPuzzle({ savedPlaces = [] }) {
  const { user } = useAuth()
  const { t, translatePlace } = useLanguage()
  const [showReward, setShowReward] = useState(false)
  const previousCount = useRef(null)
  const contextSavedPlaces = Array.isArray(user?.savedPlaces) ? user.savedPlaces : []
  const places = savedPlaces.length ? savedPlaces : contextSavedPlaces
  const unlockedCount = Math.min(TILE_COUNT, places.length)
  const isComplete = unlockedCount === TILE_COUNT

  useEffect(() => {
    if (previousCount.current === null) {
      previousCount.current = unlockedCount
      return
    }

    if (unlockedCount > previousCount.current) {
      setShowReward(true)
      const timer = setTimeout(() => setShowReward(false), 1500)
      previousCount.current = unlockedCount
      return () => clearTimeout(timer)
    }

    previousCount.current = unlockedCount
  }, [unlockedCount])

  const getTileName = (place) => {
    if (!place) return t('profile.discoveryPuzzleFallback')
    const translated = translatePlace(place)
    return translated?.displayName || translated?.name || place.name || place.title || t('profile.discoveryPuzzleFallback')
  }

  return (
    <section className="profile-fade-up relative overflow-hidden rounded-lg border border-gold/25 bg-panel/85 p-5 shadow-card-lux [animation-delay:360ms]">
      <div className="pointer-events-none absolute inset-0 opacity-[0.1] [background-image:linear-gradient(hsl(var(--gold-line)/0.5)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--gold-line)/0.38)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-80 -translate-x-1/2 rounded-full bg-gold-bright/15 blur-3xl" />
      {showReward && (
        <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
          <div className="discovery-reward absolute left-1/2 top-7 -translate-x-1/2 rounded-full border border-gold/35 bg-bg-black/90 px-4 py-2 text-sm font-semibold text-gold-bright shadow-gold-bloom">
            {t('profile.discoveryPuzzleReward')}
          </div>
          {Array.from({ length: CONFETTI_COUNT }).map((_, index) => (
            <span
              key={index}
              className="discovery-confetti absolute left-1/2 top-16 h-2 w-1 rounded-full bg-gold-bright"
              style={{
                '--confetti-x': `${(index % 6 - 2.5) * 34}px`,
                '--confetti-y': `${-54 - Math.floor(index / 6) * 28}px`,
                '--confetti-r': `${index * 31}deg`,
                animationDelay: `${index * 24}ms`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="mb-5 flex flex-col gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div>
            <p className="section-label mb-2">{t('profile.discoveryPuzzleEyebrow')}</p>
            <h3 className="font-display text-2xl font-semibold text-stone-100">{t('profile.discoveryPuzzleTitle')}</h3>
            <p className="mt-2 text-sm text-stone-500">
              {t('profile.discoveryPuzzleProgress', { count: unlockedCount })}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            {!isComplete && (
              <Link to="/map?tab=places" className="hero-cta inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-gold-bright to-gold-deep px-4 py-2.5 text-sm font-bold text-bg-deep transition duration-300">
                <MapPin size={16} />
                {t('profile.discoveryPuzzleCta')}
              </Link>
            )}
            <Link to="/saved-places" className="inline-flex items-center justify-center gap-2 rounded-lg border border-gold/30 bg-bg-black/70 px-4 py-2.5 text-sm font-bold text-gold-bright transition duration-300 hover:border-gold-bright hover:bg-gold/10">
              <Bookmark size={16} />
              {t('profile.savedPlaces')}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {Array.from({ length: TILE_COUNT }).map((_, index) => {
            const unlocked = index < unlockedCount
            const placeName = unlocked ? getTileName(places[index]) : ''
            return (
              <div
                key={index}
                className="profile-fade-up group relative aspect-square [perspective:900px]"
                style={{ animationDelay: `${430 + index * 35}ms` }}
                title={unlocked ? placeName : t('profile.discoveryPuzzleLockedTooltip')}
              >
                <div className={`relative h-full w-full rounded-lg transition duration-700 [transform-style:preserve-3d] ${unlocked ? '[transform:rotateY(180deg)]' : ''}`}>
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg border border-stone-700/60 bg-[#111] text-stone-600 opacity-40 blur-[0.4px] [backface-visibility:hidden]">
                    <Lock size={16} />
                    {!unlocked && (
                      <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden w-max max-w-[160px] -translate-x-1/2 rounded-md border border-gold/25 bg-bg-black/95 px-2 py-1 text-[10px] font-semibold text-gold-bright shadow-card-lux group-hover:block">
                        {t('profile.discoveryPuzzleLockedTooltip')}
                      </span>
                    )}
                  </div>
                  <div className="absolute inset-0 overflow-hidden rounded-lg border border-gold-soft/60 bg-gradient-to-br from-gold-bright via-gold to-gold-deep text-bg-deep shadow-[0_0_24px_hsl(var(--gold-bright)/0.5)] transition duration-300 [backface-visibility:hidden] [transform:rotateY(180deg)] group-hover:scale-105 group-hover:shadow-[0_0_34px_hsl(var(--gold-bright)/0.72)]">
                    <div className="absolute inset-x-2 top-2 h-[38%] rounded-md bg-[radial-gradient(circle_at_28%_28%,hsl(var(--gold-soft)/0.95),transparent_34%),linear-gradient(135deg,hsl(var(--bg-deep)/0.22),hsl(var(--gold-deep)/0.28))] opacity-75" />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg-deep/25 to-transparent" />
                    <div className="relative flex h-full flex-col items-center justify-between p-2 text-center">
                      <Landmark size={20} className="mt-1 drop-shadow" />
                      <p className="line-clamp-2 max-w-full text-[10px] font-bold leading-tight sm:text-xs">
                        {placeName}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
