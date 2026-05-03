import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Bookmark, CheckCircle2, Landmark, Lock, MapPin, Sparkles, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'

export const DISCOVERIES_PER_LEVEL = 20
const TILE_COUNT = DISCOVERIES_PER_LEVEL
const CONFETTI_COUNT = 18
const LEVEL_TITLE_KEYS = [
  'dashboard.gamification.levelTitles.explorer',
  'dashboard.gamification.levelTitles.traveler',
  'dashboard.gamification.levelTitles.cultureHunter',
  'dashboard.gamification.levelTitles.historyMaster',
  'dashboard.gamification.levelTitles.anatolianGuide',
  'dashboard.gamification.levelTitles.legendaryExplorer',
]

export const getDiscoveryLevelTitleKey = (level) => LEVEL_TITLE_KEYS[Math.min(level - 1, LEVEL_TITLE_KEYS.length - 1)]

export const getDiscoveryProgress = (totalDiscoveries = 0) => {
  const completedLevels = Math.floor(totalDiscoveries / DISCOVERIES_PER_LEVEL)
  const currentLevel = completedLevels + 1
  const currentProgress = totalDiscoveries % DISCOVERIES_PER_LEVEL
  const progressForDisplay = currentProgress === 0 && totalDiscoveries > 0 ? DISCOVERIES_PER_LEVEL : currentProgress
  const progressPercent = Math.min((progressForDisplay / DISCOVERIES_PER_LEVEL) * 100, 100)
  const remaining = progressForDisplay === DISCOVERIES_PER_LEVEL ? 0 : DISCOVERIES_PER_LEVEL - progressForDisplay

  return {
    totalDiscoveries,
    completedLevels,
    currentLevel,
    currentProgress,
    progressForDisplay,
    progressPercent,
    remaining,
  }
}

const getPlaceId = (place) => {
  if (typeof place === 'string' || typeof place === 'number') return place
  return place?._id || place?.id || null
}

const getPlaceImage = (place) => {
  if (Array.isArray(place?.images) && place.images.find(Boolean)) return place.images.find(Boolean)
  if (Array.isArray(place?.imageUrls) && place.imageUrls.find(Boolean)) return place.imageUrls.find(Boolean)
  return place?.imageUrl || place?.image || ''
}

const inferCategory = (place, displayPlace) => {
  const source = `${displayPlace?.displayName || place?.name || ''} ${displayPlace?.displayCategory || place?.category || ''}`.toLocaleLowerCase('tr-TR')
  if (source.includes('antik') || source.includes('ören') || source.includes('ruins')) return 'Antik Kent'
  if (source.includes('saray') || source.includes('palace')) return 'Saray'
  if (source.includes('müze') || source.includes('museum')) return 'Müze'
  if (source.includes('kale') || source.includes('castle')) return 'Kale'
  return displayPlace?.displayCategory || place?.category || 'Tarihi Yer'
}

export default function DiscoveryPuzzle({ savedPlaces = [] }) {
  const { user } = useAuth()
  const { t, translatePlace } = useLanguage()
  const [showReward, setShowReward] = useState(false)
  const previousCount = useRef(null)
  const contextSavedPlaces = Array.isArray(user?.savedPlaces) ? user.savedPlaces : []
  const places = savedPlaces.length ? savedPlaces : contextSavedPlaces
  const totalDiscoveries = places.length
  const {
    completedLevels,
    currentLevel,
    progressForDisplay,
    progressPercent,
    remaining,
  } = getDiscoveryProgress(totalDiscoveries)
  const activeCollectionIndex = progressForDisplay === DISCOVERIES_PER_LEVEL && totalDiscoveries > 0
    ? Math.max(completedLevels - 1, 0)
    : completedLevels
  const activeCollectionNumber = activeCollectionIndex + 1
  const activePlaces = places.slice(activeCollectionIndex * DISCOVERIES_PER_LEVEL, activeCollectionNumber * DISCOVERIES_PER_LEVEL)
  const unlockedCount = Math.min(TILE_COUNT, activePlaces.length || progressForDisplay)
  const isComplete = progressForDisplay === DISCOVERIES_PER_LEVEL
  const motivationKey = isComplete
    ? 'profile.discoveryPuzzleMotivationComplete'
    : remaining <= 5 && totalDiscoveries > 0
      ? 'profile.discoveryPuzzleMotivationClose'
      : completedLevels > 0
        ? 'profile.discoveryPuzzleMotivationBadge'
        : 'profile.discoveryPuzzleMotivationStart'

  useEffect(() => {
    if (previousCount.current === null) {
      previousCount.current = totalDiscoveries
      return
    }

    if (totalDiscoveries > previousCount.current) {
      setShowReward(true)
      const timer = setTimeout(() => setShowReward(false), 1500)
      previousCount.current = totalDiscoveries
      return () => clearTimeout(timer)
    }

    previousCount.current = totalDiscoveries
  }, [totalDiscoveries])

  const getTileName = (place) => {
    if (!place) return t('profile.discoveryPuzzleFallback')
    const translated = translatePlace(place)
    return translated?.displayName || translated?.name || place.name || place.title || t('profile.discoveryPuzzleFallback')
  }

  return (
    <section className="profile-fade-up relative overflow-hidden rounded-lg border border-gold/25 bg-panel/85 p-5 shadow-card-lux [animation-delay:360ms] sm:p-6">
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

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="mb-5 flex flex-col gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div>
            <p className="section-label mb-2">{t('profile.discoveryPuzzleEyebrow')}</p>
            <h3 className="font-display text-2xl font-semibold text-stone-100">{t('profile.discoveryPuzzleTitle')}</h3>
            <p className="mt-2 text-base font-semibold text-gold-bright">
              {t('profile.discoveryPuzzleLevelProgress', { level: currentLevel })}
            </p>
            <p className="mt-1 text-xs text-stone-500 sm:text-sm">
              {t('profile.discoveryPuzzleProgress', { count: progressForDisplay, total: DISCOVERIES_PER_LEVEL })}
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

        <div className={`mb-5 overflow-hidden rounded-2xl border p-4 ${isComplete ? 'border-gold-bright/55 bg-gold/10 shadow-gold-bloom' : 'border-gold/20 bg-bg-black/60'}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-gold-bright">
                {t('profile.discoveryPuzzleCollectionTitle', { level: activeCollectionNumber })}
              </p>
              <p className="mt-1 text-xs leading-5 text-stone-400">{t(motivationKey)}</p>
            </div>
            {completedLevels > 0 && (
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/35 bg-bg-black/75 px-3 py-1 text-xs font-bold text-gold-bright">
                <Trophy size={14} />
                {t('profile.discoveryPuzzleNewBadge')}
              </span>
            )}
          </div>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-bg-black">
            <div
              className="discovery-progress-fill h-full rounded-full bg-gradient-to-r from-gold-deep via-gold-bright to-gold-soft shadow-[0_0_18px_hsl(var(--gold-bright)/0.55)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="mt-2 text-xs font-semibold text-stone-500">
            {isComplete
              ? t('profile.discoveryPuzzleCollectionComplete')
              : t('profile.discoveryPuzzleRemaining', { count: remaining })}
          </p>
          {isComplete && (
            <p className="mt-1 text-xs font-semibold text-gold/80">
              {t('profile.discoveryPuzzleNextCollectionCta')}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: TILE_COUNT }).map((_, index) => {
            const unlocked = index < unlockedCount
            const place = activePlaces[index]
            const displayPlace = unlocked && typeof place === 'object' ? translatePlace(place) : null
            const placeName = unlocked ? getTileName(place) : ''
            const placeId = getPlaceId(place)
            const placeImage = unlocked && typeof place === 'object' ? getPlaceImage(place) : ''
            const placeCity = displayPlace?.displayCity || displayPlace?.displayRegion || place?.region || ''
            const placeCategory = unlocked ? inferCategory(place, displayPlace) : ''

            return (
              <article
                key={index}
                className="profile-fade-up group relative aspect-[4/5] min-h-[150px]"
                style={{ animationDelay: `${430 + index * 35}ms` }}
                title={unlocked ? placeName : t('profile.discoveryPuzzleLockedTooltip')}
              >
                {unlocked ? (
                  <Link
                    to={placeId ? `/place/${placeId}` : '/map?tab=places'}
                    className="discovery-card-unlock relative block h-full overflow-hidden rounded-2xl border border-gold/25 bg-[radial-gradient(circle_at_35%_15%,hsl(var(--gold-bright)/0.3),transparent_32%),linear-gradient(145deg,hsl(var(--bg-black)),hsl(var(--vellum)),hsl(var(--bg-panel)))] shadow-card-lux transition duration-500 hover:-translate-y-1.5 hover:border-gold-bright/85 hover:shadow-[0_0_34px_hsl(var(--gold-bright)/0.42),0_20px_48px_hsl(var(--shadow-black)/0.7)] focus:outline-none focus:ring-2 focus:ring-gold-bright/70"
                  >
                    {placeImage ? (
                      <div
                        className="absolute inset-0 bg-cover bg-center opacity-80 transition duration-700 group-hover:scale-110 group-hover:opacity-95"
                        style={{ backgroundImage: `url("${placeImage}")` }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gold/70">
                        <Landmark size={42} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-black via-bg-black/45 to-transparent" />
                    <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-black via-bg-black/20 to-gold-bright/10" />
                      <div className="absolute inset-x-4 top-4 h-px bg-gradient-to-r from-transparent via-gold-bright/80 to-transparent" />
                    </div>

                    <div className="relative z-10 flex h-full flex-col justify-between p-3 sm:p-4">
                      <div className="flex items-start justify-between gap-2">
                        <span className="max-w-full rounded-full border border-gold/35 bg-bg-black/75 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-gold-bright shadow-[0_0_14px_hsl(var(--gold-bright)/0.18)] backdrop-blur">
                          {placeCategory}
                        </span>
                        <Sparkles size={15} className="shrink-0 text-gold-bright drop-shadow" />
                      </div>

                      <div>
                        {placeCity && (
                          <p className="mb-1.5 flex items-center gap-1 text-[11px] font-semibold text-stone-300">
                            <MapPin size={12} />
                            <span className="truncate">{placeCity}</span>
                          </p>
                        )}
                        <h4 className="line-clamp-2 font-display text-base font-semibold leading-tight text-stone-100 sm:text-lg">
                          {placeName}
                        </h4>
                        <span className="mt-3 inline-flex translate-y-2 items-center gap-1.5 rounded-lg border border-gold/40 bg-bg-black/80 px-3 py-2 text-xs font-bold text-gold-bright opacity-0 shadow-gold-bloom transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          {t('profile.discoveryPuzzleMapAction')}
                          <ArrowRight size={13} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="relative flex h-full overflow-hidden rounded-2xl border border-stone-800/85 bg-bg-black/80 shadow-card-lux transition duration-500 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_0_24px_hsl(var(--gold-bright)/0.16)]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,hsl(var(--gold-bright)/0.13),transparent_34%),linear-gradient(145deg,hsl(var(--bg-black)),hsl(var(--stone-950)))] blur-[0.2px]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-black via-bg-black/70 to-stone-950/50" />
                    <div className="absolute inset-3 rounded-xl border border-gold/10 opacity-70" />
                    <div className="relative z-10 flex h-full w-full flex-col items-center justify-center p-3 text-center">
                      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-gold/20 bg-bg-black/75 text-gold/55 shadow-[0_0_18px_hsl(var(--shadow-black)/0.5)] transition duration-300 group-hover:border-gold/45 group-hover:text-gold-bright">
                        <Lock size={18} />
                      </div>
                      <p className="max-w-[9rem] text-[11px] font-semibold leading-4 text-stone-600 transition duration-300 group-hover:text-gold-bright">
                        {t('profile.discoveryPuzzleLockedTooltip')}
                      </p>
                    </div>
                  </div>
                )}
              </article>
            )
          })}
        </div>

        {completedLevels > 0 && (
          <div className="mt-6">
            <div className="mb-3 flex items-center gap-2 text-gold-bright">
              <Trophy size={18} />
              <h4 className="font-display text-xl font-semibold text-stone-100">{t('profile.discoveryPuzzleCompletedCollections')}</h4>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {Array.from({ length: completedLevels }).map((_, index) => {
                const collectionNumber = index + 1
                return (
                  <article
                    key={collectionNumber}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-gold/25 bg-bg-black/65 p-4 shadow-card-lux transition duration-300 hover:-translate-y-0.5 hover:border-gold-bright/60 hover:shadow-gold-bloom"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/35 bg-gold/10 text-gold-bright shadow-[0_0_20px_hsl(var(--gold-bright)/0.18)]">
                        <CheckCircle2 size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-stone-100">
                          {t('profile.discoveryPuzzleCollectionDone', { count: collectionNumber })}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-gold/75">
                          {t(getDiscoveryLevelTitleKey(collectionNumber))}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="rounded-full border border-gold/30 bg-gold/10 px-2.5 py-1 text-xs font-bold text-gold-bright">
                        {DISCOVERIES_PER_LEVEL}/{DISCOVERIES_PER_LEVEL}
                      </span>
                      <Link to="/saved-places" className="hidden rounded-lg border border-gold/30 bg-bg-black/80 px-3 py-2 text-xs font-bold text-gold-bright transition hover:border-gold-bright sm:inline-flex">
                        {t('profile.discoveryPuzzleViewCollection')}
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
