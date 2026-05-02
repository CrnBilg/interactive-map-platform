import { Link } from 'react-router-dom'
import turkeyMap from '@/assets/turkey-gold-map.png'
import { MuseumIcon, SmallFlourish } from '../visuals/Ornaments'
import { useLanguage } from '../../i18n/LanguageContext'

function CalendarIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
      <rect x="6" y="8" width="20" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10 5v6M22 5v6M6 14h20M11 19h3M18 19h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function BookIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
      <path d="M6 7h8c2 0 3 1 3 3v16c0-2-1-3-3-3H6V7ZM26 7h-8c-2 0-3 1-3 3v16c0-2 1-3 3-3h8V7Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M10 12h4M20 12h3M10 17h4M20 17h3" stroke="currentColor" strokeOpacity=".7" strokeLinecap="round" />
    </svg>
  )
}

function BackgroundSigil({ type }) {
  if (type === 'calendar') {
    return (
      <svg viewBox="0 0 180 180" className="absolute inset-x-0 top-14 mx-auto h-44 w-44 text-gold opacity-[0.06]" fill="none" aria-hidden="true">
        <rect x="36" y="42" width="108" height="96" rx="8" stroke="currentColor" strokeWidth="7" />
        <path d="M56 24v38M124 24v38M36 74h108M58 102h18M84 102h18M110 102h18M58 124h18M84 124h18M110 124h18" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
        <path d="M88 8c20 21 20 42 0 63-20-21-20-42 0-63Z" stroke="currentColor" strokeWidth="5" />
      </svg>
    )
  }

  if (type === 'route') {
    return (
      <svg viewBox="0 0 180 180" className="absolute inset-x-0 top-14 mx-auto h-44 w-44 text-gold opacity-[0.06]" fill="none" aria-hidden="true">
        <path d="M40 38h86c18 0 29 12 29 28v82H54c-18 0-29-12-29-28V52c0-8 6-14 15-14Z" stroke="currentColor" strokeWidth="7" />
        <path d="M48 62c29 24 55 31 79 20M48 98c23-12 46-10 68 6 14 10 27 13 40 8M58 132c32-11 61-9 86 6" stroke="currentColor" strokeWidth="5" strokeDasharray="10 10" />
        <circle cx="52" cy="62" r="8" fill="currentColor" />
        <circle cx="139" cy="113" r="8" fill="currentColor" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 180 180" className="absolute inset-x-0 top-14 mx-auto h-44 w-44 text-gold opacity-[0.06]" fill="none" aria-hidden="true">
      <path d="M30 72h120M42 142h96M44 64l46-28 46 28" stroke="currentColor" strokeWidth="7" strokeLinejoin="round" />
      <path d="M50 72v58M78 72v58M106 72v58M134 72v58" stroke="currentColor" strokeWidth="6" />
      <path d="M64 34c18-18 34-18 52 0" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    </svg>
  )
}

const features = [
  {
    icon: MuseumIcon,
    sigil: 'column',
  },
  {
    icon: CalendarIcon,
    sigil: 'calendar',
  },
  {
    icon: BookIcon,
    sigil: 'route',
  },
]

function CardCorners() {
  return (
    <>
      <SmallFlourish className="left-3 top-3 h-5 w-5 opacity-80" />
      <SmallFlourish className="right-3 top-3 h-5 w-5 rotate-90 opacity-80" />
      <SmallFlourish className="bottom-3 left-3 h-5 w-5 -rotate-90 opacity-80" />
      <SmallFlourish className="bottom-3 right-3 h-5 w-5 rotate-180 opacity-80" />
    </>
  )
}

function FeatureCard({ feature }) {
  const Icon = feature.icon

  return (
    <article className="lux-card group min-h-[340px] p-8 text-center">
      <CardCorners />
      <BackgroundSigil type={feature.sigil} />
      <div className="relative z-[2] mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full border border-gold-line bg-[radial-gradient(circle,hsl(var(--gold-bright)_/_0.25),transparent_68%)] text-gold-bright shadow-[0_0_24px_hsl(var(--gold-bright)_/_0.35)]">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="card-title-gold relative z-[2] text-3xl leading-none">{feature.title}</h3>
      <p className="relative z-[2] mx-auto mt-5 max-w-[230px] font-display text-lg italic leading-[1.7] text-parchment/80">{feature.text}</p>
      <Link to={feature.href || '/map'} className="relative z-[2] mt-8 inline-flex items-center gap-2 text-sm font-semibold text-gold-bright drop-shadow-[0_0_10px_hsl(var(--gold-bright)_/_0.32)] underline-offset-4 hover:underline">
        {feature.cta} <span>→</span>
      </Link>
    </article>
  )
}

export default function FeatureGrid() {
  const { t } = useLanguage()
  const translatedFeatures = t('landing.features')

  return (
    <section className="lux-section px-5 py-10 sm:px-8 lg:px-14">
      <div className="ornamental-divider relative z-[4] mb-7"><span /></div>
      <div className="relative z-[4] mx-auto grid max-w-[1500px] gap-5 xl:grid-cols-[5fr_1.55fr_1.55fr_1.55fr]">
        <article className="lux-card min-h-[400px] p-5 xl:col-span-1">
          <CardCorners />
          <div className="relative z-[2] flex items-start justify-between gap-4">
            <div>
              <p className="section-label">{t('landing.mapPreview')}</p>
              <h2 className="card-title-gold mt-2 text-3xl leading-none">{t('landing.mapPreviewTitle')}</h2>
            </div>
            <Link to="/map" className="hidden rounded-md border border-gold/30 bg-bg-black/60 px-4 py-2 text-sm font-semibold text-gold-bright transition hover:border-gold sm:inline-flex">
              {t('landing.openFullMap')}
            </Link>
          </div>

          <div className="relative z-[2] mt-6 h-[275px] overflow-hidden rounded-md border border-gold/10 bg-bg-black/30">
            <img
              src={turkeyMap}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover object-center opacity-[0.95]"
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_48%,hsl(var(--background)_/_0.4)_100%)]" />
            <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-5 whitespace-nowrap rounded-full bg-background/60 px-4 py-2 text-[11px] text-parchment/80 backdrop-blur-sm">
              <span>{t('landing.density')}</span>
              <span className="inline-flex items-center gap-1.5"><b className="h-2 w-2 rounded-full bg-ember shadow-[0_0_8px_hsl(var(--ember-red)_/_0.7)]" />{t('landing.high')}</span>
              <span className="inline-flex items-center gap-1.5"><b className="h-2 w-2 rounded-full bg-gold shadow-[0_0_8px_hsl(var(--gold)_/_0.65)]" />{t('landing.medium')}</span>
              <span className="inline-flex items-center gap-1.5"><b className="h-2 w-2 rounded-full bg-gold-deep" />{t('landing.low')}</span>
            </div>
          </div>
        </article>

        {features.map((feature, index) => (
          <FeatureCard
            key={feature.sigil}
            feature={{
              ...feature,
              ...translatedFeatures[index],
              cta: t('landing.explore'),
              href: index === 1 ? '/map?tab=live' : '/map',
            }}
          />
        ))}
      </div>
    </section>
  )
}
