import { Link } from 'react-router-dom'
import FeatureCards from '../components/landing/FeatureCards'
import Footer from '../components/landing/Footer'
import HeroSection from '../components/landing/HeroSection'
import ParticleField from '../components/landing/ParticleField'
import { PillarIcon } from '../components/landing/Ornaments'

const chips = [
  'Ayasofya',
  'Topkapı Sarayı',
  'Efes Antik Kenti',
  'Kapadokya',
  'Göbeklitepe',
  'Ani Harabeleri',
  'Sümela Manastırı',
  'Aspendos',
  'Mevlana Müzesi',
  'Safranbolu',
  'Nemrut Dağı',
  'Zeugma',
]

function MapIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m4 6 5-2 6 2 5-2v14l-5 2-6-2-5 2V6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 4v14M15 6v14" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

function LandingHeader() {
  return (
    <header className="relative z-40 border-b border-[#d4af37]/20 bg-[linear-gradient(180deg,rgba(10,8,6,0.98),rgba(5,5,5,0.92))] shadow-[0_1px_30px_rgba(212,175,55,0.08)] backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1500px] items-center justify-between px-8 md:px-20">
        <Link to="/" className="flex items-center gap-3 text-[#d4af37]">
          <PillarIcon className="h-8 w-8" />
          <span className="font-display text-2xl font-bold text-[#f5d77a] drop-shadow-[0_0_18px_rgba(245,215,122,0.2)]">CityLore</span>
        </Link>

        <Link to="/map" className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-lg border border-[#d4af37]/55 bg-gradient-to-br from-[#f5d77a] via-[#d4af37] to-[#8b6914] px-6 py-3 text-sm font-black text-[#050505] shadow-[inset_0_0_12px_rgba(245,215,122,0.2),0_0_24px_rgba(212,175,55,0.28)] md:flex">
          <MapIcon />
          Harita
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full bg-[#15110a]/90 px-4 py-2 text-sm font-bold text-[#e8d9a8] shadow-[inset_0_0_16px_rgba(212,175,55,0.06)] md:flex">
            <span className="h-2 w-2 rounded-full bg-lime-400 shadow-[0_0_12px_rgba(132,204,22,0.95)] landing-live-dot" />
            Canlı
          </div>
          <Link to="/login" className="hidden rounded-lg border border-[#d4af37]/35 px-6 py-3 text-sm font-bold text-[#f5d77a] transition hover:border-[#d4af37]/75 hover:bg-[#d4af37]/10 md:block">
            Giriş
          </Link>
          <Link to="/register" className="hidden rounded-lg border border-[#d4af37]/25 bg-[#7f1d1d] px-6 py-3 text-sm font-black text-[#f5d77a] shadow-[0_0_22px_rgba(194,65,12,0.32)] transition hover:bg-[#991b1b] md:block">
            Kayıt
          </Link>
          <div className="flex items-center gap-2 rounded-full border border-[#d4af37]/38 bg-[#0a0806] px-4 py-3 font-display text-sm font-bold text-[#f5d77a]">
            CR <span className="text-[#d4af37]/75">⌄</span>
          </div>
        </div>
      </div>
    </header>
  )
}

function TagStrip() {
  return (
    <section className="relative overflow-hidden border-y border-[#d4af37]/15 bg-[linear-gradient(180deg,rgba(21,17,10,0.98),rgba(5,5,5,0.98))] py-4">
      <ParticleField className="opacity-25" />
      <button className="absolute left-7 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-[#d4af37]/35 bg-[#050505]/85 text-2xl text-[#f5d77a] shadow-[0_0_18px_rgba(212,175,55,0.18)] md:grid" type="button" aria-label="Önceki">
        ‹
      </button>
      <button className="absolute right-7 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-[#d4af37]/35 bg-[#050505]/85 text-2xl text-[#f5d77a] shadow-[0_0_18px_rgba(212,175,55,0.18)] md:grid" type="button" aria-label="Sonraki">
        ›
      </button>
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-40 bg-gradient-to-l from-[#050505] to-transparent" />
      <div className="landing-tag-marquee relative z-0 flex w-max gap-3 px-16">
        {[...chips, ...chips].map((chip, index) => (
          <span key={`${chip}-${index}`} className="rounded-full border border-[#d4af37]/30 bg-[#15110a]/80 px-5 py-2 text-sm font-bold text-[#f5d77a]/85 shadow-[inset_0_0_16px_rgba(212,175,55,0.05)] transition hover:border-[#d4af37]/70 hover:bg-[#d4af37]/15 hover:shadow-[0_0_18px_rgba(212,175,55,0.18)]">
            <span className="mr-3 text-[#d4af37]">●</span>
            {chip}
          </span>
        ))}
      </div>
    </section>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#030303] text-[#e8d9a8] antialiased selection:bg-[#d4af37]/30">
      <div className="pointer-events-none fixed inset-0 z-50 bg-[radial-gradient(circle_at_50%_28%,rgba(139,105,20,0.12),transparent_58%),radial-gradient(circle_at_20%_80%,rgba(212,175,55,0.05),transparent_38%)]" />
      <div className="citylore-noise pointer-events-none fixed inset-0 z-50" />
      <LandingHeader />
      <main>
        <HeroSection />
        <TagStrip />
        <FeatureCards />
      </main>
      <Footer />
    </div>
  )
}
