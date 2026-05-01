import { Link } from 'react-router-dom'
import ParticleField from './ParticleField'
import { CornerOrnament, PillarIcon, Skyline, TughraOrnament } from './Ornaments'

const columns = [
  ['Keşfet', 'Harita', 'Mekanlar', 'Etkinlikler', 'Rotalar'],
  ['Hakkımızda', 'Biz Kimiz?', 'Misyonumuz', 'Kariyer', 'İletişim'],
  ['Destek', 'Yardım Merkezi', 'Kullanım Koşulları', 'Gizlilik Politikası', 'SSS'],
]

function SocialIcon({ label }) {
  return (
    <span className="grid h-8 w-8 place-items-center rounded-full border border-[#d4af37]/35 bg-[#0a0806]/70 text-xs font-black text-[#d4af37] shadow-[inset_0_0_12px_rgba(212,175,55,0.06)]">
      {label}
    </span>
  )
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[#d4af37]/20 bg-[#080604] px-8 py-8 md:px-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_30%,rgba(212,175,55,0.08),transparent_30%),radial-gradient(circle_at_84%_45%,rgba(184,134,11,0.1),transparent_28%),linear-gradient(180deg,rgba(21,17,10,0.9),rgba(3,3,3,0.98))]" />
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(212,175,55,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,.035)_1px,transparent_1px)] [background-size:24px_24px]" />
      <ParticleField className="opacity-35" />
      <CornerOrnament position="bl" />
      <CornerOrnament position="br" />
      <Skyline className="h-32 opacity-80" />
      <TughraOrnament className="bottom-5 right-20 hidden h-36 w-40 md:block" />

      <div className="relative z-10 mx-auto grid max-w-[1500px] gap-8 md:grid-cols-[1.25fr_0.55fr_0.55fr_0.55fr_1fr]">
        <div>
          <Link to="/" className="flex items-center gap-3 text-[#d4af37]">
            <PillarIcon className="h-7 w-7" />
            <span className="font-display text-2xl font-bold text-[#f5d77a]">CityLore</span>
          </Link>
          <p className="mt-4 max-w-[280px] text-sm font-semibold leading-6 text-[#e8d9a8]/62">Türkiye’nin kültürel mirasını keşfet, yaşat ve paylaş.</p>
          <div className="mt-5 flex gap-3">
            <SocialIcon label="IG" />
            <SocialIcon label="f" />
            <SocialIcon label="X" />
            <SocialIcon label="▶" />
          </div>
        </div>

        {columns.map(([heading, ...links]) => (
          <div key={heading}>
            <h4 className="font-display text-sm font-bold tracking-wide text-[#d4af37]">{heading}</h4>
            <div className="mt-3 grid gap-2 text-sm font-semibold text-[#e8d9a8]/58">
              {links.map(link => <span key={link}>{link}</span>)}
            </div>
          </div>
        ))}

        <div>
          <h4 className="font-display text-sm font-bold tracking-wide text-[#d4af37]">Bültenimize Katılın</h4>
          <p className="mt-3 text-sm font-semibold leading-6 text-[#e8d9a8]/58">Yeni yerler, etkinlikler ve özel içerikler için e-posta listemize katılın.</p>
          <div className="mt-4 flex rounded-lg border border-[#d4af37]/25 bg-[#0a0806]/90 p-1 shadow-[inset_0_0_18px_rgba(212,175,55,0.05)]">
            <div className="flex flex-1 items-center px-3 text-sm font-semibold text-[#8b6914]">E-posta adresiniz</div>
            <button className="grid h-10 w-12 place-items-center rounded-md bg-gradient-to-br from-[#f5d77a] to-[#8b6914] text-[#050505] shadow-[0_0_18px_rgba(212,175,55,0.28)]" type="button" aria-label="Bültene katıl">
              →
            </button>
          </div>
        </div>
      </div>
      <div className="relative z-10 mt-7 border-t border-[#d4af37]/10 pt-4 text-center text-xs font-semibold text-[#d4af37]/45">© 2025 CityLore. Tüm hakları saklıdır.</div>
    </footer>
  )
}
