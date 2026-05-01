import { Link } from 'react-router-dom'
import Compass from './Compass'
import ParticleField from './ParticleField'
import TurkeyMap from './TurkeyMap'
import { CardFlourish, PillarIcon, Skyline } from './Ornaments'

const features = [
  {
    title: 'Tarihi Mekanları Keşfet',
    desc: 'Binlerce yıllık mirasa sahip mekanları detaylı içerikleriyle inceleyin.',
    icon: 'museum',
  },
  {
    title: 'Canlı Kültürel Etkinlikleri Gör',
    desc: 'Konser, sergi, festival ve daha fazlasını anlık olarak takip edin.',
    icon: 'calendar',
  },
  {
    title: 'Kendi Gezi Rotanı Oluştur',
    desc: 'İlgi alanlarına göre rotalar oluştur, kaydet ve paylaş.',
    icon: 'book',
  },
]

function FeatureIcon({ type }) {
  if (type === 'calendar') {
    return (
      <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none">
        <rect x="10" y="13" width="28" height="26" rx="3" stroke="currentColor" strokeWidth="2" />
        <path d="M10 21h28M17 9v8M31 9v8M17 27h4M27 27h4M17 34h4M27 34h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }

  if (type === 'book') {
    return (
      <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none">
        <path d="M8 12c9-4 15-2 16 2v26c-2-4-8-6-16-3V12ZM40 12c-9-4-15-2-16 2v26c2-4 8-6 16-3V12Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M24 14v26" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }

  return <PillarIcon className="h-8 w-8" />
}

function FeatureCard({ feature }) {
  return (
    <article className="landing-card group relative flex min-h-[310px] overflow-hidden rounded-lg border border-[#d4af37]/25 bg-[linear-gradient(145deg,rgba(21,17,10,0.94),rgba(5,5,5,0.98))] p-7 text-center shadow-[inset_0_0_0_1px_rgba(245,215,122,0.05),inset_0_0_56px_rgba(212,175,55,0.08),0_24px_64px_rgba(0,0,0,0.58)] transition duration-300 hover:scale-[1.02] hover:border-[#d4af37]/55 hover:shadow-[inset_0_0_70px_rgba(212,175,55,0.12),0_28px_72px_rgba(0,0,0,0.7),0_0_32px_rgba(212,175,55,0.12)]">
      <CardFlourish className="left-3 top-3" />
      <CardFlourish className="bottom-3 right-3 rotate-180" />
      <ParticleField className="opacity-40" />
      <Skyline className="opacity-60" />
      <div className="relative z-10 flex w-full flex-col items-center">
        <div className="grid h-18 w-18 place-items-center rounded-full border border-[#d4af37]/45 bg-[radial-gradient(circle,rgba(245,215,122,0.16),rgba(21,17,10,0.9)_62%)] p-4 text-[#d4af37] shadow-[0_0_30px_rgba(212,175,55,0.22),inset_0_0_18px_rgba(245,215,122,0.08)]">
          <FeatureIcon type={feature.icon} />
        </div>
        <h3 className="mt-7 font-display text-2xl font-bold leading-tight text-[#f5d77a] drop-shadow-[0_0_20px_rgba(245,215,122,0.15)]">{feature.title}</h3>
        <p className="mx-auto mt-5 max-w-[230px] text-sm font-semibold leading-6 text-[#e8d9a8]/65">{feature.desc}</p>
        <Link to="/map" className="mt-auto inline-flex border-t border-[#d4af37]/15 px-7 pt-7 text-sm font-black text-[#d4af37] transition hover:text-[#f5d77a]">
          Keşfet →
        </Link>
      </div>
    </article>
  )
}

export default function FeatureCards() {
  return (
    <section className="relative overflow-hidden border-b border-[#d4af37]/20 bg-[#050505] px-7 py-6 md:px-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_30%,rgba(212,175,55,0.11),transparent_32%),radial-gradient(circle_at_74%_60%,rgba(184,134,11,0.08),transparent_30%)]" />
      <ParticleField className="opacity-30" />
      <div className="relative z-10 mx-auto grid max-w-[1500px] gap-5 lg:grid-cols-[1.58fr_0.46fr_0.46fr_0.46fr]">
        <article className="landing-card relative min-h-[310px] overflow-hidden rounded-lg border border-[#d4af37]/30 bg-[radial-gradient(ellipse_at_center,rgba(35,24,8,0.94),rgba(5,5,5,0.98)_72%)] p-7 shadow-[inset_0_0_0_1px_rgba(245,215,122,0.06),inset_0_0_64px_rgba(212,175,55,0.08),0_24px_64px_rgba(0,0,0,0.6)] transition duration-300 hover:scale-[1.01] hover:border-[#d4af37]/55">
          <CardFlourish className="left-3 top-3" />
          <CardFlourish className="bottom-3 right-3 rotate-180" />
          <Skyline className="opacity-70" />
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#d4af37]/55">HARİTA ÖNİZLEMESİ</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-[#f5d77a]">Türkiye genelindeki keşif noktaları</h2>
            </div>
            <Link to="/map" className="rounded-md border border-[#d4af37]/30 bg-[#0a0806]/80 px-5 py-3 text-sm font-bold text-[#d4af37] shadow-[inset_0_0_18px_rgba(212,175,55,0.06)] transition hover:border-[#d4af37]/70 hover:text-[#f5d77a]">
              Tam Haritayı Aç →
            </Link>
          </div>
          <div className="relative z-10 mt-1 h-[220px]">
            <TurkeyMap compact />
          </div>
          <div className="relative z-10 mt-1 flex justify-center gap-6 text-xs font-semibold text-[#e8d9a8]/62">
            <span>Yoğunluk Düzeyi:</span>
            <span><b className="text-[#c2410c]">●</b> Yüksek</span>
            <span><b className="text-[#d4af37]">●</b> Orta</span>
            <span><b className="text-[#55753d]">●</b> Düşük</span>
          </div>
          <Compass small className="absolute -bottom-12 -left-10 opacity-50" />
        </article>

        {features.map(feature => (
          <FeatureCard key={feature.title} feature={feature} />
        ))}
      </div>
    </section>
  )
}
