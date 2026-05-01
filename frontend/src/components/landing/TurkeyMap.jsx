import { useId } from 'react'

const mapPath = 'M55 210C78 170 127 143 197 146C246 112 314 111 374 126C429 101 486 98 548 108C613 89 665 103 716 127C765 119 818 126 862 150C915 151 962 183 978 228C994 273 957 306 900 300C863 326 811 329 769 309C708 346 646 344 593 317C541 342 479 335 426 309C364 333 302 323 253 297C202 318 150 311 111 282C75 281 35 250 55 210Z'

const majorNodes = [
  ['Istanbul', 218, 137, 1.25],
  ['Ankara', 492, 214, 1.12],
  ['İzmir', 191, 275, 0.95],
  ['Kapadokya', 612, 273, 1.08],
  ['Antalya', 452, 329, 0.9],
]

const midNodes = [
  ['Trabzon', 806, 139],
  ['Van', 930, 250],
  ['Diyarbakır', 772, 270],
  ['Gaziantep', 689, 332],
  ['Konya', 456, 284],
  ['Bursa', 258, 165],
  ['Samsun', 613, 156],
  ['Mersin', 582, 340],
  ['Edirne', 132, 116],
  ['Erzurum', 795, 206],
]

const minorNodes = [
  [150, 194], [184, 224], [235, 205], [280, 178], [316, 235], [352, 167],
  [395, 208], [431, 149], [458, 248], [518, 167], [548, 238], [575, 196],
  [641, 178], [662, 236], [718, 188], [735, 237], [821, 239], [858, 194],
  [890, 270], [914, 213], [704, 285], [521, 304], [359, 288], [262, 272],
]

const routes = [
  [218, 137, 492, 214],
  [191, 275, 612, 273],
  [492, 214, 806, 139],
  [612, 273, 930, 250],
  [258, 165, 689, 332],
]

function CityNode({ node, type, index, compact }) {
  const [name, x, y, weight = 1] = node
  const major = type === 'major'
  const mid = type === 'mid'
  const core = major ? 6.5 * weight : mid ? 4.2 : 2.1
  const halo = major ? 25 * weight : mid ? 15 : 7
  const bloom = major ? 52 * weight : mid ? 28 : 12

  return (
    <g className={major || mid ? 'landing-node-pulse' : ''} style={{ animationDelay: `${index * 0.22}s` }}>
      <circle cx={x} cy={y} r={bloom} fill={major ? '#f5d77a' : '#d4af37'} opacity={major ? '.12' : '.08'} />
      <circle cx={x} cy={y} r={halo} fill={major ? '#f5d77a' : '#b8860b'} opacity={major ? '.28' : '.2'} />
      <circle cx={x} cy={y} r={core} fill="#f5d77a" opacity=".95" />
      <circle cx={x} cy={y} r={core / 2} fill="#fff8d6" />
      {!compact && name && (
        <>
          <line x1={x + 7} y1={y - 4} x2={x + 20} y2={y - 13} stroke="#d4af37" strokeOpacity=".28" />
          <text x={x + 23} y={y - 14} fill="#f5d77a" fontSize="17" fontWeight="700" opacity=".88">
            {name}
          </text>
        </>
      )}
    </g>
  )
}

export default function TurkeyMap({ compact = false, className = '' }) {
  const id = useId().replace(/:/g, '')
  const visibleMajor = compact ? majorNodes.slice(0, 4) : majorNodes
  const visibleMid = compact ? midNodes.slice(0, 5) : midNodes
  const visibleMinor = compact ? minorNodes.slice(0, 13) : minorNodes

  return (
    <div className={`relative h-full w-full ${className}`}>
      <div className="absolute inset-[-8%] rounded-full bg-[radial-gradient(circle_at_55%_52%,rgba(245,215,122,0.3),rgba(184,134,11,0.16)_28%,transparent_64%)] blur-3xl" />
      <svg className="relative z-10 h-full w-full overflow-visible" viewBox="0 0 1000 430" role="img" aria-label="Türkiye kültür haritası">
        <defs>
          <filter id={`mapBloom-${id}`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0.2 0 1 0 0 0.13 0 0 1 0 0.03 0 0 0 1 0" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id={`mapGradient-${id}`} cx="54%" cy="52%" r="65%">
            <stop offset="0%" stopColor="#b8860b" stopOpacity=".32" />
            <stop offset="42%" stopColor="#8b6914" stopOpacity=".18" />
            <stop offset="100%" stopColor="#050505" stopOpacity=".04" />
          </radialGradient>
          <pattern id={`dotGrid-${id}`} width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.05" fill="#f5d77a" opacity=".16" />
          </pattern>
          <pattern id={`scratch-${id}`} width="36" height="36" patternUnits="userSpaceOnUse">
            <path d="M0 31 31 0M8 38 38 8" stroke="#d4af37" strokeOpacity=".055" strokeWidth="1" />
          </pattern>
          <clipPath id={`mapClip-${id}`}>
            <path d={mapPath} />
          </clipPath>
        </defs>

        <g filter={`url(#mapBloom-${id})`}>
          <path d={mapPath} fill={`url(#mapGradient-${id})`} stroke="#d4af37" strokeOpacity=".58" strokeWidth="1.7" />
          <path d={mapPath} fill={`url(#dotGrid-${id})`} opacity=".95" />
          <path d={mapPath} fill={`url(#scratch-${id})`} opacity=".88" />
          <g clipPath={`url(#mapClip-${id})`}>
            <circle cx="510" cy="225" r="255" fill="#d4af37" opacity=".055" />
            <circle cx="704" cy="300" r="135" fill="#c2410c" opacity=".11" />
            <circle cx="230" cy="145" r="95" fill="#f5d77a" opacity=".13" />
            {visibleMinor.map(([x, y], index) => (
              <CityNode key={`${x}-${y}`} node={['', x, y]} type="minor" index={index} compact />
            ))}
          </g>

          {routes.slice(0, compact ? 3 : routes.length).map(([sx, sy, ex, ey], index) => (
            <path
              key={`${sx}-${ex}`}
              className="landing-route-drift"
              d={`M${sx} ${sy} C${(sx + ex) / 2} ${Math.min(sy, ey) - 72}, ${(sx + ex) / 2} ${Math.max(sy, ey) + 50}, ${ex} ${ey}`}
              fill="none"
              stroke="#f5d77a"
              strokeOpacity=".36"
              strokeWidth="1.2"
              strokeDasharray="2 7"
              style={{ animationDelay: `${index * -0.7}s` }}
            />
          ))}

          {visibleMajor.map((node, index) => (
            <CityNode key={node[0]} node={node} type="major" index={index} compact={compact} />
          ))}
          {visibleMid.map((node, index) => (
            <CityNode key={node[0]} node={node} type="mid" index={index + 6} compact={compact} />
          ))}
        </g>
      </svg>
      <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_center,transparent_48%,rgba(3,3,3,0.45)_100%)]" />
    </div>
  )
}
