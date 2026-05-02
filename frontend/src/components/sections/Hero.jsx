import { Link } from 'react-router-dom'
import Compass from '../visuals/Compass'
import TurkeyMap from '../TurkeyMap'
import ParticleField from '../visuals/ParticleField'
import Skyline from '../visuals/Skyline'
import HistoricalSkyline from '../visuals/HistoricalSkyline'
import { CornerOrnament, MuseumIcon } from '../visuals/Ornaments'

export default function Hero() {
  return (
    <section className="lux-section min-h-[640px] px-5 py-10 sm:px-8 lg:px-16">
      <HistoricalSkyline className="historical-skyline-layer" />
      <div className="hero-safe-zone" />
      <ParticleField excludeHeroZone />
      <CornerOrnament className="left-3 top-3 z-[3] h-[120px] w-[120px] opacity-70" />
      <CornerOrnament className="right-3 top-3 z-[3] h-[120px] w-[120px] opacity-70" rotate={90} />
      <CornerOrnament className="bottom-3 left-3 z-[3] h-[120px] w-[120px] opacity-45" rotate={270} />
      <CornerOrnament className="bottom-3 right-3 z-[3] h-[120px] w-[120px] opacity-45" rotate={180} />
      <div className="absolute bottom-0 left-0 z-[3] h-40 w-full bg-gradient-to-b from-transparent via-transparent to-gold-deep/18" />
      <Skyline className="absolute bottom-0 left-0 z-[4] h-[155px] w-full opacity-90" />

      <div className="relative z-10 mx-auto grid max-w-[1500px] grid-cols-1 items-center gap-8 pt-8 lg:min-h-[560px] lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="hero-badge">
            <span className="text-gold-bright/70">✦</span>
            <MuseumIcon className="h-4 w-4" />
            Türkiye kültür ve keşif haritası
            <span className="text-gold-bright/70">✦</span>
          </div>

          <h1 className="font-display text-[clamp(48px,6vw,88px)] font-semibold leading-[1.05] tracking-[-0.02em] text-gold-bright [text-shadow:0_0_24px_hsl(var(--gold-bright)_/_0.25)]">
            <span className="block bg-gradient-to-b from-gold-bright to-gold bg-clip-text text-transparent">Türkiye'yi keşfetmenin</span>
            <span className="block bg-gradient-to-b from-gold-bright to-gold bg-clip-text text-transparent">en kolay yolu</span>
          </h1>

          <p className="mt-6 max-w-[480px] text-[15px] leading-[1.7] text-parchment/80">
            Tarihi mekanları, şehirleri ve canlı etkinlikleri sade bir interaktif haritada keşfedin; rotanızı
            planlayın ve yeni durakları kolayca bulun.
          </p>

          <Link
            to="/map"
            className="hero-cta group mt-8 inline-flex items-center gap-3 rounded-lg bg-gradient-to-b from-gold-bright to-gold-deep px-7 py-3.5 font-semibold text-bg-deep transition duration-300"
          >
            Haritayı Aç
            <span className="transition duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <div className="relative hidden h-[360px] lg:col-span-2 lg:block">
          <Compass className="absolute -left-16 top-6 z-[5] h-[340px] w-[340px]" />
          <svg className="absolute left-[230px] top-[166px] z-[4] h-16 w-48 overflow-visible" viewBox="0 0 190 60" fill="none" aria-hidden="true">
            <path d="M4 30C58 2 123 2 186 30" stroke="hsl(var(--gold-line) / .36)" strokeWidth="1.2" strokeDasharray="3 7" className="animate-drift-dash" />
          </svg>
        </div>

        <div className="relative min-h-[320px] lg:col-span-5 lg:-ml-24">
          <TurkeyMap className="h-[340px] w-full lg:h-[430px]" />
        </div>
      </div>
      <div className="ornamental-divider relative z-10 mt-4"><span /></div>
    </section>
  )
}
