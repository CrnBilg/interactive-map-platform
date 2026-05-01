import { Link } from 'react-router-dom'
import Compass from './Compass'
import ParticleField from './ParticleField'
import TurkeyMap from './TurkeyMap'
import { CornerOrnament, PillarIcon, Skyline, TughraOrnament } from './Ornaments'

export default function HeroSection() {
  return (
    <section className="relative min-h-[430px] overflow-hidden border-b border-[#d4af37]/20 bg-[#0a0806] md:min-h-[470px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_42%_43%,rgba(245,215,122,0.16),transparent_22%),radial-gradient(circle_at_78%_48%,rgba(184,134,11,0.24),transparent_32%),linear-gradient(90deg,rgba(3,3,3,0.72),rgba(10,8,6,0.24)_48%,rgba(3,3,3,0.55))]" />
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(212,175,55,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,.045)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_34%,rgba(3,3,3,0.82)_100%)]" />
      <ParticleField />
      <CornerOrnament position="tl" />
      <CornerOrnament position="tr" />
      <Skyline className="opacity-70" />
      <TughraOrnament className="bottom-4 right-8 hidden h-32 w-36 md:block" />

      <div className="relative z-10 mx-auto grid max-w-[1540px] items-center gap-4 px-8 py-11 md:grid-cols-[0.82fr_0.36fr_1.08fr] md:px-20">
        <div className="relative z-20 max-w-[570px]">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/[0.08] px-4 py-2 text-[11px] font-bold text-[#d4af37] shadow-[inset_0_0_18px_rgba(212,175,55,0.08)]">
            <PillarIcon className="h-3.5 w-3.5" />
            Türkiye kültür ve keşif haritası
          </div>
          <h1 className="font-display text-[48px] font-bold leading-[0.98] tracking-[-0.03em] text-[#f5d77a] drop-shadow-[0_0_34px_rgba(245,215,122,0.24)] md:text-[68px] xl:text-[74px]">
            Türkiye’yi keşfetmenin
            <br />
            en kolay yolu
          </h1>
          <p className="mt-5 max-w-[520px] text-[15px] font-semibold leading-7 text-[#e8d9a8]/75">
            Tarihi mekanları, şehirleri ve canlı etkinlikleri sade bir interaktif haritada keşfedin, rotanızı planlayın ve yeni durakları kolayca bulun.
          </p>
          <Link to="/map" className="group mt-8 inline-flex items-center gap-3 rounded-lg border border-[#f5d77a]/45 bg-gradient-to-br from-[#f5d77a] via-[#d4af37] to-[#8b6914] px-8 py-4 text-base font-black text-[#050505] shadow-[0_8px_32px_rgba(212,175,55,0.38)] transition duration-300 hover:scale-[1.03] hover:shadow-[0_12px_44px_rgba(245,215,122,0.55)]">
            Haritayı Aç
            <span className="transition duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <div className="relative z-10 hidden h-[310px] items-center justify-center md:flex">
          <Compass />
        </div>

        <div className="relative z-10 h-[320px] md:-ml-16">
          <TurkeyMap />
        </div>
      </div>
    </section>
  )
}
