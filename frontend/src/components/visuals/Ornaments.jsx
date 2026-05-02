export function CornerOrnament({ className = '', rotate = 0 }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={`pointer-events-none absolute text-gold ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
      fill="none"
      aria-hidden="true"
    >
      <path d="M8 112V8h104" stroke="currentColor" strokeOpacity=".34" strokeWidth="1" />
      <path d="M15 105C21 73 44 48 79 41c-18 14-28 31-31 55" stroke="currentColor" strokeOpacity=".34" />
      <path d="M15 89c14-1 25-12 24-26 10 5 21 3 29-5" stroke="currentColor" strokeOpacity=".24" />
      <path d="M25 18c4 20 18 33 40 37M35 11c1 16 11 27 29 31M50 8c-2 13 5 22 20 28" stroke="currentColor" strokeOpacity=".25" />
      <circle cx="23" cy="23" r="4" stroke="currentColor" strokeOpacity=".38" />
      <circle cx="42" cy="42" r="2.5" fill="currentColor" fillOpacity=".26" />
      <path d="M12 54c13 2 24-5 31-18M54 12c-1 13 6 24 18 31" stroke="currentColor" strokeOpacity=".18" />
      <path d="M8 8c18 14 36 17 58 9M8 8c14 18 17 36 9 58" stroke="currentColor" strokeOpacity=".22" />
    </svg>
  )
}

export function SmallFlourish({ className = '' }) {
  return (
    <svg viewBox="0 0 48 48" className={`absolute text-gold ${className}`} fill="none" aria-hidden="true">
      <path d="M4 44V4h40" stroke="currentColor" strokeOpacity=".45" />
      <path d="M9 38c4-14 14-24 29-29-8 9-11 18-9 29" stroke="currentColor" strokeOpacity=".35" />
      <path d="M12 24c8 1 14-4 15-13" stroke="currentColor" strokeOpacity=".25" />
      <circle cx="15" cy="15" r="2" fill="currentColor" fillOpacity=".4" />
    </svg>
  )
}

export function Tughra({ className = '' }) {
  return (
    <svg viewBox="0 0 260 210" className={`text-gold ${className}`} fill="none" aria-hidden="true">
      <path d="M40 152c38 30 132 28 173-9-50 11-93 2-130-27 35 13 74 6 112-21-55 16-92 4-112-35" stroke="currentColor" strokeOpacity=".24" strokeWidth="3" />
      <path d="M66 138c28-40 27-79-2-118M98 136c25-41 28-82 8-124M133 131c19-42 24-82 14-120" stroke="currentColor" strokeOpacity=".22" strokeWidth="4" />
      <path d="M42 164c42 21 91 23 148 6 21-6 35-1 43 14M50 183c44-11 89-10 134 2" stroke="currentColor" strokeOpacity=".2" strokeWidth="2" />
      <path d="M81 100c23 25 53 30 90 14M72 117c30 14 62 15 96 3" stroke="currentColor" strokeOpacity=".26" strokeWidth="2" />
    </svg>
  )
}

export function MuseumIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
      <path d="M4 12h24M7 26h18M6 9l10-5 10 5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M8 12v11M14 12v11M20 12v11M26 12v11" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 26h22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function MapGlyph({ className = '' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
      <path d="M5 8l7-3 8 3 7-3v19l-7 3-8-3-7 3V8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M12 5v19M20 8v19" stroke="currentColor" strokeWidth="1.2" strokeOpacity=".72" />
      <path d="M8 13c4-2 8-1 12 2 2 1 4 2 7 1" stroke="currentColor" strokeWidth="1.1" strokeOpacity=".55" />
    </svg>
  )
}
