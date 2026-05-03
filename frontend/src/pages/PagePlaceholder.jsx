import { Link } from 'react-router-dom'
import Footer from '../components/sections/Footer'
import { SmallFlourish } from '../components/visuals/Ornaments'
import { useLanguage } from '../i18n/LanguageContext'

function CornerFrame() {
  return (
    <>
      <SmallFlourish className="left-4 top-4 h-6 w-6 opacity-80" />
      <SmallFlourish className="right-4 top-4 h-6 w-6 rotate-90 opacity-80" />
      <SmallFlourish className="bottom-4 left-4 h-6 w-6 -rotate-90 opacity-80" />
      <SmallFlourish className="bottom-4 right-4 h-6 w-6 rotate-180 opacity-80" />
    </>
  )
}

// IMPORTANT: All new UI text must use t() instead of hardcoded strings
export default function PagePlaceholder({ title, subtitle, children }) {
  const { t } = useLanguage()

  return (
    <>
      <main className="min-h-screen bg-bg-deepest text-parchment">
        <section className="lux-section px-5 py-28 sm:px-8 lg:px-16">
          <div className="relative z-[4] mx-auto max-w-5xl">
            <article className="lux-card lux-card-static px-6 py-14 text-center sm:px-10 lg:px-16">
              <CornerFrame />
              <p className="section-label">{t('pages.common.eyebrow')}</p>
              <h1 className="card-title-gold mt-4 font-display text-5xl font-semibold leading-none sm:text-6xl">
                {title}
              </h1>
              <div className="mx-auto my-6 text-2xl text-gold-bright/80">◆</div>
              <p className="mx-auto max-w-2xl font-display text-xl italic leading-[1.7] text-parchment/75">
                {subtitle || t('pages.common.defaultSubtitle')}
              </p>
              <Link
                to="/"
                className="hero-cta mt-8 inline-flex rounded-lg bg-gradient-to-b from-gold-bright to-gold-deep px-5 py-3 font-semibold text-bg-deep transition"
              >
                {t('pages.common.homeCta')}
              </Link>
            </article>

            {children && (
              <div className="mt-10 space-y-6">
                {children}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export function InfoPanel({ id, title, children }) {
  return (
    <section id={id} className="lux-card lux-card-static scroll-mt-28 p-6 sm:p-8">
      <CornerFrame />
      <h2 className="card-title-gold relative z-[2] font-display text-3xl font-semibold">{title}</h2>
      <div className="relative z-[2] mt-4 leading-[1.8] text-parchment/70">{children}</div>
    </section>
  )
}
