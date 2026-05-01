const ticks = Array.from({ length: 24 }, (_, index) => index * 15)
const points = Array.from({ length: 8 }, (_, index) => index * 45)

export default function Compass({ className = '', small = false }) {
  return (
    <div className={`relative text-gold-bright ${className}`} aria-hidden="true">
      <div className="absolute inset-x-8 bottom-2 h-16 rounded-full bg-gold/30 blur-3xl opacity-40" />
      <svg
        viewBox="0 0 360 360"
        className="relative h-full w-full overflow-visible drop-shadow-[0_0_60px_hsl(var(--gold-bright)_/_0.45)]"
        fill="none"
      >
        <defs>
          <radialGradient id={small ? 'compassCoreSmall' : 'compassCore'} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--gold-bright))" stopOpacity="1" />
            <stop offset="48%" stopColor="hsl(var(--gold))" stopOpacity=".88" />
            <stop offset="100%" stopColor="hsl(var(--gold-deep))" stopOpacity=".45" />
          </radialGradient>
          <linearGradient id={small ? 'needleGoldSmall' : 'needleGold'} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--gold-bright))" />
            <stop offset="54%" stopColor="hsl(var(--gold))" />
            <stop offset="100%" stopColor="hsl(var(--gold-deep))" />
          </linearGradient>
        </defs>

        <g className="origin-center animate-[spin_60s_linear_infinite]">
          <circle cx="180" cy="180" r="157" stroke="currentColor" strokeOpacity=".32" strokeWidth="1.2" />
          <circle cx="180" cy="180" r="136" stroke="currentColor" strokeOpacity=".22" strokeDasharray="2 8" />
          <circle cx="180" cy="180" r="112" stroke="currentColor" strokeOpacity=".42" />
          {ticks.map((angle) => (
            <line
              key={angle}
              x1="180"
              y1={angle % 45 === 0 ? 28 : 36}
              x2="180"
              y2="48"
              stroke="currentColor"
              strokeOpacity={angle % 45 === 0 ? '.72' : '.35'}
              strokeWidth={angle % 45 === 0 ? '1.5' : '1'}
              transform={`rotate(${angle} 180 180)`}
            />
          ))}
          {['N', 'E', 'S', 'W'].map((label, index) => (
            <text
              key={label}
              x="180"
              y="61"
              textAnchor="middle"
              className="fill-gold-bright font-display text-[20px] font-bold"
              transform={`rotate(${index * 90} 180 180)`}
            >
              {label}
            </text>
          ))}
        </g>

        <g opacity=".22">
          <circle cx="180" cy="180" r="178" stroke="currentColor" strokeDasharray="3 6" />
          <circle cx="180" cy="180" r="82" stroke="currentColor" />
        </g>

        <g className="origin-center animate-[spin_8s_linear_infinite_reverse]">
          {points.map((angle, index) => (
            <path
              key={angle}
              d={index % 2 === 0 ? 'M180 55 197 180 180 305 163 180Z' : 'M180 78 191 180 180 282 169 180Z'}
              fill={`url(#${small ? 'needleGoldSmall' : 'needleGold'})`}
              fillOpacity={index % 2 === 0 ? '.84' : '.42'}
              stroke="currentColor"
              strokeOpacity=".38"
              transform={`rotate(${angle} 180 180)`}
            />
          ))}
        </g>

        <path d="M180 56 205 185 180 169 155 185Z" fill={`url(#${small ? 'needleGoldSmall' : 'needleGold'})`} />
        <path d="M180 304 154 175 180 191 206 175Z" fill="hsl(var(--gold-deep))" fillOpacity=".62" />
        <circle cx="180" cy="180" r="34" fill="hsl(var(--bg-black) / .72)" stroke="currentColor" strokeOpacity=".55" />
        <circle cx="180" cy="180" r="18" fill={`url(#${small ? 'compassCoreSmall' : 'compassCore'})`} className="animate-flicker" />
        <circle cx="180" cy="180" r="6" fill="hsl(var(--gold-bright))" />
      </svg>
    </div>
  )
}
