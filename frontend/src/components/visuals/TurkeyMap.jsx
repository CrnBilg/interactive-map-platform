const turkeyPath =
  'M47 175C56 139 94 125 129 132C158 104 208 98 253 112C290 92 350 94 392 108C430 88 491 92 532 114C579 111 633 128 675 158C708 181 713 220 684 246C651 276 598 271 566 254C531 287 470 291 427 268C383 294 324 290 287 263C243 280 193 273 165 248C119 267 75 247 55 213C45 198 42 186 47 175Z'

const majorCities = [
  { name: 'İstanbul', x: 156, y: 137 },
  { name: 'Ankara', x: 343, y: 174 },
  { name: 'İzmir', x: 137, y: 219 },
  { name: 'Kapadokya', x: 424, y: 218 },
  { name: 'Antalya', x: 295, y: 274 },
]

const midCities = [
  { name: 'Trabzon', x: 597, y: 137 },
  { name: 'Van', x: 680, y: 213 },
  { name: 'Diyarbakır', x: 556, y: 229 },
  { name: 'Gaziantep', x: 495, y: 257 },
  { name: 'Konya', x: 331, y: 239 },
  { name: 'Bursa', x: 181, y: 158 },
  { name: 'Samsun', x: 417, y: 136 },
  { name: 'Mersin', x: 405, y: 270 },
  { name: 'Edirne', x: 103, y: 124 },
  { name: 'Erzurum', x: 615, y: 179 },
]

const minorCities = [
  [83, 172], [113, 201], [180, 238], [205, 139], [225, 185], [265, 151], [274, 222],
  [302, 191], [371, 146], [387, 207], [451, 152], [465, 235], [517, 185], [538, 142],
  [581, 253], [640, 227], [653, 164], [226, 259], [322, 118], [496, 120], [602, 205],
  [145, 171], [357, 263], [438, 252],
]

function CityNode({ city, size = 'major', delay = 0, showLabels = true }) {
  const isMajor = size === 'major'
  const core = isMajor ? 14 : 8
  const halo = isMajor ? 24 : 16
  const bloom = isMajor ? 60 : 34

  return (
    <g>
      <circle cx={city.x} cy={city.y} r={bloom / 2} fill="hsl(var(--gold) / .2)" filter="url(#mapBlur)" opacity=".75">
        <animate attributeName="opacity" values=".38;.9;.38" dur={isMajor ? '3s' : '4s'} begin={`${delay}s`} repeatCount="indefinite" />
      </circle>
      <circle cx={city.x} cy={city.y} r={halo / 2} fill="hsl(var(--gold) / .5)" filter="url(#mapBlur)">
        <animate attributeName="r" values={`${halo / 3};${halo / 2};${halo / 3}`} dur={isMajor ? '3s' : '4s'} begin={`${delay}s`} repeatCount="indefinite" />
      </circle>
      <circle cx={city.x} cy={city.y} r={core / 2} fill="hsl(var(--gold-bright))" stroke="hsl(var(--gold))" strokeWidth="1.5" />
      {showLabels && (
        <>
          <path d={`M${city.x + 7} ${city.y - 6}h22`} stroke="hsl(var(--gold) / .3)" strokeWidth="1" />
          <text x={city.x + 33} y={city.y - 8} className="fill-gold-bright text-[11px] font-semibold tracking-[0.05em]">
            {city.name}
          </text>
        </>
      )}
    </g>
  )
}

export default function TurkeyMap({ className = '', compact = false, idSuffix = 'hero' }) {
  const labels = !compact

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-x-0 top-1/2 h-[68%] -translate-y-1/2 rounded-[50%] bg-gold-ember/30 blur-[80px]" />
      <svg viewBox="0 0 740 360" className="relative h-full w-full overflow-visible drop-shadow-[0_0_42px_hsl(var(--gold)_/_0.22)]" aria-hidden="true">
        <defs>
          <radialGradient id={`mapGradient-${idSuffix}`} cx="50%" cy="48%" r="58%">
            <stop offset="0%" stopColor="hsl(var(--gold-ember))" stopOpacity=".25" />
            <stop offset="58%" stopColor="hsl(var(--gold-deep))" stopOpacity=".12" />
            <stop offset="100%" stopColor="hsl(var(--gold))" stopOpacity=".03" />
          </radialGradient>
          <pattern id={`dotGrid-${idSuffix}`} width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="hsl(var(--gold) / .15)" />
          </pattern>
          <clipPath id={`turkeyClip-${idSuffix}`}>
            <path d={turkeyPath} />
          </clipPath>
          <filter id="mapBlur" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <filter id={`grain-${idSuffix}`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" stitchTiles="stitch" />
          </filter>
        </defs>

        <path d={turkeyPath} fill={`url(#mapGradient-${idSuffix})`} stroke="hsl(var(--gold) / .4)" strokeWidth="1.2" />
        <path d={turkeyPath} fill={`url(#dotGrid-${idSuffix})`} clipPath={`url(#turkeyClip-${idSuffix})`} opacity=".95" />
        <rect x="40" y="86" width="650" height="210" filter={`url(#grain-${idSuffix})`} clipPath={`url(#turkeyClip-${idSuffix})`} opacity=".15" className="mix-blend-soft-light" />

        <g clipPath={`url(#turkeyClip-${idSuffix})`} opacity=".42">
          {Array.from({ length: 26 }, (_, index) => (
            <path
              key={index}
              d={`M${45 + index * 26} 105C${120 + index * 10} ${150 + (index % 4) * 14} ${220 + index * 8} ${138 + (index % 5) * 22} 690 ${180 + (index % 6) * 16}`}
              stroke="hsl(var(--gold) / .16)"
              strokeWidth=".75"
              fill="none"
            />
          ))}
        </g>

        {[
          'M156 137C246 94 331 113 424 218',
          'M137 219C242 183 343 174 495 257',
          'M156 137C322 117 456 112 597 137',
          'M424 218C493 186 574 179 680 213',
          'M295 274C378 238 466 244 556 229',
        ].map((path) => (
          <path key={path} d={path} fill="none" stroke="hsl(var(--gold) / .4)" strokeWidth="1.2" strokeDasharray="2 4" className="animate-drift-dash" />
        ))}

        {minorCities.map(([x, y], index) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={index % 3 === 0 ? 2.5 : 1.8} fill="hsl(var(--gold) / .7)" />
        ))}
        {midCities.map((city, index) => (
          <CityNode key={city.name} city={city} size="mid" delay={index * 0.18} showLabels={labels} />
        ))}
        {majorCities.map((city, index) => (
          <CityNode key={city.name} city={city} size="major" delay={index * 0.22} showLabels={labels} />
        ))}

        <path d={turkeyPath} fill="none" stroke="hsl(var(--gold-bright) / .2)" strokeWidth="3" filter="url(#mapBlur)" />
      </svg>
    </div>
  )
}
