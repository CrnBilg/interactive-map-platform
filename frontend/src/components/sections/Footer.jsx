import { Link } from 'react-router-dom'
import historicColumns from '@/assets/historic-columns.png'
import { CornerOrnament, MuseumIcon } from '../visuals/Ornaments'

const columns = [
  ['Keşfet', 'Harita', 'Mekanlar', 'Etkinlikler', 'Rotalar'],
  ['Hakkımızda', 'Biz Kimiz?', 'Misyonumuz', 'Kariyer', 'İletişim'],
  ['Destek', 'Yardım Merkezi', 'Kullanım Koşulları', 'Gizlilik Politikası', 'SSS'],
]

export default function Footer() {
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
          <p className="mt-5 max-w-[220px] text-sm leading-[1.7] text-parchment/70">Türkiye'nin kültürel mirasını keşfet, yaşat ve paylaş.</p>
          <div className="mt-6 flex gap-3">
            {['ig', 'fb', 'x', 'yt'].map((item) => (
              <span key={item} className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/30 text-[11px] font-semibold text-gold-bright/80 shadow-[inset_0_1px_0_hsl(var(--gold-bright)_/_0.12)]">
                {item}
              </span>
            ))}
          </div>
        </div>

        {columns.map(([title, ...items]) => (
          <div key={title}>
            <h3 className="font-semibold text-gold-bright">{title}</h3>
            <div className="mt-4 flex flex-col gap-2.5 text-sm text-parchment/65">
              {items.map((item) => (
                <Link key={item} to="/map" className="transition hover:text-gold-bright">
                  {item}
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div>
          <h3 className="font-semibold text-gold-bright">Bültenimize Katılın</h3>
          <p className="mt-4 text-sm leading-[1.7] text-parchment/65">Yeni yerler, etkinlikler ve özel içerikler için e-posta listemize katılın.</p>
          <form className="mt-5 flex overflow-hidden rounded-lg border border-gold/30 bg-bg-black shadow-[inset_0_0_20px_hsl(var(--gold)_/_0.05)]">
            <input className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-gold-bright placeholder:text-gold-bright/40 focus:outline-none" placeholder="E-posta adresiniz" />
            <button className="m-1 rounded-md bg-gradient-to-b from-gold-bright to-gold-deep px-4 font-semibold text-bg-deep shadow-[inset_0_1px_0_hsl(var(--gold-soft)_/_0.6),0_0_20px_hsl(var(--gold)_/_0.25)]" type="button">
              →
            </button>
          </form>
        </div>
      </div>

      <p className="relative z-[4] mt-9 text-center text-xs text-parchment/45">© 2025 CityLore. Tüm hakları saklıdır.</p>
    </footer>
  )
}
