import { useLanguage } from '../../i18n/LanguageContext'

const places = [
  'Aspendos',
  'Sümela Manastırı',
  'Mevlana Müzesi',
  'Safranbolu',
  'Nemrut Dağı',
  'Zeugma',
  'Ayasofya',
  'Topkapı Sarayı',
  'Efes Antik Kenti',
  'Kapadokya',
  'Göbeklitepe',
  'Ani Harabeleri',
]

export default function TagStrip() {
  const { translateEntity } = useLanguage()

  return (
    <section className="chip-strip">
      <div className="ornamental-divider absolute left-1/2 top-[-2px] z-[2] -translate-x-1/2"><span /></div>
      <div className="chip-marquee animate-marquee flex w-max gap-3 whitespace-nowrap px-6">
        {[...places, ...places, ...places, ...places].map((place, index) => (
          <span key={`${place}-${index}`} className="chip-pill">
            <span className="chip-dot" />
            {translateEntity(place)}
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute right-0 top-0 flex h-full w-28 items-center justify-end bg-gradient-to-l from-bg-warm-black via-bg-warm-black/85 to-transparent pr-5 text-gold-bright">
        &gt;
      </div>
    </section>
  )
}
