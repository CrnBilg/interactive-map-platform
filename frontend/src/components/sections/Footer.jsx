import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import historicColumns from '@/assets/historic-columns.png'
import { CornerOrnament, MuseumIcon } from '../visuals/Ornaments'
import { useLanguage } from '../../i18n/LanguageContext'

// IMPORTANT: All new UI text must use t() instead of hardcoded strings
const footerColumns = [
  {
    titleKey: 'landing.footer.explore',
    links: [
      { labelKey: 'landing.footer.map', to: '/#map' },
      { labelKey: 'landing.footer.places', to: '/places' },
      { labelKey: 'landing.footer.events', to: '/events' },
      { labelKey: 'landing.footer.routes', to: '/routes' },
    ],
  },
  {
    titleKey: 'landing.footer.about',
    links: [
      { labelKey: 'landing.footer.who', to: '/about#who' },
      { labelKey: 'landing.footer.mission', to: '/about#mission' },
      { labelKey: 'landing.footer.careers', to: '/about#careers' },
      { labelKey: 'landing.footer.contact', to: '/contact' },
    ],
  },
  {
    titleKey: 'landing.footer.support',
    links: [
      { labelKey: 'landing.footer.help', to: '/help' },
      { labelKey: 'landing.footer.terms', to: '/terms' },
      { labelKey: 'landing.footer.privacy', to: '/privacy' },
      { labelKey: 'landing.footer.faq', to: '/help#faq' },
    ],
  },
]

const footerItemClass = 'transition hover:text-gold-bright'

function FooterNavLink({ label, to }) {
  const location = useLocation()
  const navigate = useNavigate()

  const handleClick = (event) => {
    if (!to.includes('#')) return

    const [path, hash] = to.split('#')
    event.preventDefault()

    if (location.pathname === path) {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
      return
    }

    navigate(to)
    window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
    }, 80)
  }

  return (
    <Link to={to} onClick={handleClick} className={footerItemClass}>
      {label}
    </Link>
  )
}

export default function Footer() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()
  const handleNewsletterSubmit = (event) => {
    event.preventDefault()
    toast.success(t('toast.newsletterJoined'))
  }

  return (
    <footer className="lux-section border-t border-gold/20 bg-panel px-5 pb-8 pt-16 sm:px-8 lg:px-16">
      <div className="pointer-events-none absolute inset-0">
        <img
          src={historicColumns}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-bottom opacity-[0.12] blur-[14px] [mask-image:linear-gradient(to_bottom,transparent_0%,black_30%,black_70%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_30%,black_70%,transparent_100%)]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/60" />
      </div>
      <CornerOrnament className="left-3 top-3 z-[3] h-[120px] w-[120px] opacity-45" />
      <CornerOrnament className="right-3 top-3 z-[3] h-[120px] w-[120px] opacity-45" rotate={90} />
      <div className="ornamental-divider relative z-[4] mb-8"><span /></div>

      <div className="relative z-[4] mx-auto grid max-w-[1500px] gap-8 md:grid-cols-5">
        <div>
          <Link to="/" className="inline-flex items-center gap-3 text-gold-bright">
            <MuseumIcon className="h-8 w-8 text-gold" />
            <span className="font-display text-3xl font-bold">CityLore</span>
          </Link>
          <p className="mt-5 max-w-[220px] text-sm leading-[1.7] text-parchment/70">{t('landing.footerText')}</p>
          {/* TODO: Sosyal medya hesapları açıldığında ikon satırı geri eklenecek */}
          <div className="mt-6 h-px w-24 bg-gold/25 shadow-[0_0_16px_hsl(var(--gold-bright)_/_0.25)]" />
        </div>

        {footerColumns.map((column) => (
          <div key={column.titleKey}>
            <h3 className="font-semibold text-gold-bright">{t(column.titleKey)}</h3>
            <div className="mt-4 flex flex-col gap-2.5 text-sm text-parchment/65">
              {column.links.map((item) => (
                <FooterNavLink key={item.to} label={t(item.labelKey)} to={item.to} />
              ))}
            </div>
          </div>
        ))}

        <div>
          <h3 className="font-semibold text-gold-bright">{t('landing.newsletter')}</h3>
          <p className="mt-4 text-sm leading-[1.7] text-parchment/65">{t('landing.newsletterText')}</p>
          <form onSubmit={handleNewsletterSubmit} className="mt-5 flex overflow-hidden rounded-lg border border-gold/30 bg-bg-black shadow-[inset_0_0_20px_hsl(var(--gold)_/_0.05)]">
            <input className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-gold-bright placeholder:text-gold-bright/40 focus:outline-none" placeholder={t('landing.emailPlaceholder')} />
            <button className="m-1 rounded-md bg-gradient-to-b from-gold-bright to-gold-deep px-4 font-semibold text-bg-deep shadow-[inset_0_1px_0_hsl(var(--gold-soft)_/_0.6),0_0_20px_hsl(var(--gold)_/_0.25)]" type="submit">
              →
            </button>
          </form>
        </div>
      </div>

      <p className="relative z-[4] mt-9 text-center text-xs text-parchment/45">{t('landing.copyright', { year })}</p>
    </footer>
  )
}
