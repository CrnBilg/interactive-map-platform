export function PillarIcon({ className = 'h-7 w-7' }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M7 18h34M10 38h28M12 34h24M14 18v16M22 18v16M30 18v16M38 42H10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M6 15 24 6l18 9H6Z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M16 15 24 11l8 4" stroke="currentColor" strokeWidth="1.4" opacity=".6" />
    </svg>
  )
}

export function CornerOrnament({ position = 'tl', className = '' }) {
  const classes = {
    tl: 'left-0 top-0',
    tr: 'right-0 top-0 rotate-90',
    bl: 'left-0 bottom-0 -rotate-90',
    br: 'right-0 bottom-0 rotate-180',
  }

  return (
    <svg className={`pointer-events-none absolute ${classes[position]} h-28 w-28 text-[#d4af37]/45 ${className}`} viewBox="0 0 112 112" fill="none" aria-hidden="true">
      <path d="M4 108V4h104" stroke="currentColor" strokeWidth="1.2" />
      <path d="M10 101c15-20 19-36 16-54C23 27 38 13 58 16c19 3 31-1 45-10" stroke="currentColor" strokeWidth="1" />
      <path d="M9 83c16 0 25-8 27-24c2-17 14-28 31-29c16-1 25-8 32-20" stroke="currentColor" strokeWidth=".85" />
      <path d="M18 26c23 9 40 26 51 50M5 56c13-10 25-12 36-5M58 5c-8 12-8 25 1 39" stroke="currentColor" strokeWidth=".75" strokeDasharray="3 6" />
      <circle cx="30" cy="30" r="6" stroke="currentColor" strokeWidth=".8" />
      <circle cx="48" cy="55" r="3" fill="currentColor" opacity=".35" />
    </svg>
  )
}

export function Skyline({ className = '' }) {
  return (
    <svg className={`pointer-events-none absolute inset-x-0 bottom-0 h-28 w-full text-[#d4af37]/20 ${className}`} viewBox="0 0 1400 160" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 132c82-19 144-16 213 3c88 24 155 19 244-8c80-24 151-17 219 8c82 30 151 24 229-6c91-35 174-28 255 7c67 29 137 24 240-5v29H0z" fill="currentColor" opacity=".16" />
      <path d="M36 132V99h19v33M55 99l21 33M140 132V82h49v50M156 82v-26h18v26M249 132V94h64v38M268 94l14-27h16l14 27M404 132V77h32v55M436 77l34 55M578 132V96h42v36M598 96V70M724 132V70h70v62M759 70V42M887 132V91h51v41M913 91V63M1054 132V74h68v58M1088 74V38M1225 132V96h46v36M1248 96V72" stroke="currentColor" strokeWidth="2" fill="none" opacity=".55" />
      <path d="M171 56c16-14 34-14 50 0M728 70c22-18 45-18 67 0M1055 74c24-19 47-19 68 0" stroke="currentColor" strokeWidth="1.4" fill="none" opacity=".42" />
    </svg>
  )
}

export function CardFlourish({ className = '' }) {
  return (
    <svg className={`pointer-events-none absolute h-10 w-10 text-[#d4af37]/35 ${className}`} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M4 44V4h40" stroke="currentColor" strokeWidth="1" />
      <path d="M8 36c10-9 13-18 11-27c10 10 18 12 27 7c-7 8-10 17-8 28" stroke="currentColor" strokeWidth=".85" />
      <circle cx="19" cy="19" r="3" stroke="currentColor" strokeWidth=".75" />
    </svg>
  )
}

export function TughraOrnament({ className = '' }) {
  return (
    <svg className={`pointer-events-none absolute text-[#d4af37]/20 ${className}`} viewBox="0 0 190 170" fill="none" aria-hidden="true">
      <path d="M47 142c30-3 58-19 83-48c18-22 27-48 28-78" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M76 139c21-18 32-48 32-103M103 139c23-24 34-57 32-119M132 138c20-29 25-66 17-125" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity=".85" />
      <path d="M21 132c38 26 91 26 143 5c-42-13-86-12-132 4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M32 112c32-10 59-8 82 8M44 96c22-7 43-5 62 5M62 79c17-5 32-4 46 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".7" />
      <circle cx="52" cy="118" r="4" fill="currentColor" opacity=".55" />
      <circle cx="83" cy="105" r="3" fill="currentColor" opacity=".45" />
    </svg>
  )
}
