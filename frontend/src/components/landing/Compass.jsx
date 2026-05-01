const ticks = Array.from({ length: 48 }, (_, index) => index)
const points = Array.from({ length: 16 }, (_, index) => index)

export default function Compass({ small = false, className = '' }) {
  const size = small ? 'h-40 w-40' : 'h-[340px] w-[340px]'

  return (
    <div className={`landing-compass relative ${size} ${className}`} aria-hidden="true">
      <div className="absolute -inset-14 rounded-full bg-[radial-gradient(circle,rgba(245,215,122,0.28),rgba(212,175,55,0.08)_34%,transparent_68%)] blur-3xl" />
      <svg className="relative h-full w-full overflow-visible drop-shadow-[0_0_44px_rgba(245,215,122,0.42)]" viewBox="0 0 300 300">
        <defs>
          <radialGradient id={small ? 'compassCoreSmall' : 'compassCore'} cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#fff2b7" />
            <stop offset="38%" stopColor="#f5d77a" />
            <stop offset="100%" stopColor="#8b6914" />
          </radialGradient>
          <linearGradient id={small ? 'needleGoldSmall' : 'needleGold'} x1="0" x2="1">
            <stop stopColor="#f5d77a" />
            <stop offset=".48" stopColor="#d4af37" />
            <stop offset="1" stopColor="#5f4510" />
          </linearGradient>
        </defs>

        <g className="landing-compass-spin" transform="translate(150 150)">
          <circle r="137" fill="rgba(5,5,5,.52)" stroke="#d4af37" strokeOpacity=".25" />
          <circle r="118" fill="none" stroke="#d4af37" strokeOpacity=".38" strokeWidth="1.2" />
          <circle r="91" fill="rgba(139,105,20,.08)" stroke="#f5d77a" strokeOpacity=".28" strokeDasharray="2 6" />
          <circle r="62" fill="none" stroke="#d4af37" strokeOpacity=".36" />
          {ticks.map(tick => (
            <line
              key={tick}
              x1="0"
              y1={tick % 4 === 0 ? -131 : -126}
              x2="0"
              y2="-138"
              stroke="#f5d77a"
              strokeOpacity={tick % 4 === 0 ? '.52' : '.2'}
              strokeWidth={tick % 4 === 0 ? '1.1' : '.65'}
              transform={`rotate(${tick * 7.5})`}
            />
          ))}
          <text x="0" y="-101" textAnchor="middle" fill="#f5d77a" fontSize="13" fontFamily="Georgia" fontWeight="700">N</text>
          <text x="0" y="111" textAnchor="middle" fill="#f5d77a" fontSize="13" fontFamily="Georgia" fontWeight="700">S</text>
          <text x="105" y="5" textAnchor="middle" fill="#f5d77a" fontSize="13" fontFamily="Georgia" fontWeight="700">E</text>
          <text x="-105" y="5" textAnchor="middle" fill="#f5d77a" fontSize="13" fontFamily="Georgia" fontWeight="700">W</text>
        </g>

        <g className="landing-compass-needle" transform="translate(150 150)">
          {points.map(point => {
            const major = point % 2 === 0
            const long = major ? 92 : 68
            const width = major ? 15 : 9
            return (
              <path
                key={point}
                d={`M0 ${-long} L${width} 0 L0 ${major ? -14 : -8} L${-width} 0Z`}
                fill={`url(#${small ? 'needleGoldSmall' : 'needleGold'})`}
                opacity={major ? '.84' : '.42'}
                transform={`rotate(${point * 22.5})`}
              />
            )
          })}
          <path d="M0-94 13 18 0 8-13 18Z" fill="#f5d77a" opacity=".9" />
          <path d="M0 94 12-17 0-7-12-17Z" fill="#8b6914" opacity=".82" />
          <circle r="22" fill={`url(#${small ? 'compassCoreSmall' : 'compassCore'})`} className="landing-flicker" />
          <circle r="9" fill="#fff4bd" opacity=".85" />
        </g>
      </svg>
    </div>
  )
}
