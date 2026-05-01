type City = {
  name: string
  lat: number
  lng: number
  dx?: number
  dy?: number
}

const bounds = {
  minLng: 25.45,
  maxLng: 44.95,
  minLat: 35.55,
  maxLat: 42.35,
}

const viewBox = {
  width: 760,
  height: 340,
  padX: 34,
  padY: 44,
}

const borderPoints = [
  [26.05, 40.72], [26.66, 41.32], [28.02, 41.55], [29.21, 41.24], [30.33, 41.08],
  [31.72, 41.05], [33.11, 41.35], [34.84, 41.61], [36.65, 41.33], [38.24, 41.13],
  [39.93, 41.15], [41.48, 41.52], [42.88, 41.42], [44.22, 40.98], [44.69, 39.72],
  [44.31, 38.71], [44.78, 37.76], [42.85, 37.08], [41.35, 37.13], [40.03, 36.82],
  [38.66, 36.73], [37.54, 36.68], [36.23, 35.83], [35.78, 36.24], [34.66, 36.13],
  [33.42, 36.18], [32.21, 36.08], [30.92, 36.43], [30.24, 36.79], [29.55, 36.65],
  [28.67, 36.79], [27.76, 37.07], [27.17, 37.48], [26.61, 38.18], [26.37, 39.08],
  [26.05, 40.72],
] as const

const cities: City[] = [
  { name: 'İstanbul', lat: 41.01, lng: 28.97, dx: 10, dy: -12 },
  { name: 'Ankara', lat: 39.93, lng: 32.86, dx: 10, dy: -10 },
  { name: 'İzmir', lat: 38.42, lng: 27.14, dx: 10, dy: 16 },
  { name: 'Bursa', lat: 40.19, lng: 29.06, dx: -44, dy: 18 },
  { name: 'Antalya', lat: 36.9, lng: 30.71, dx: -48, dy: 16 },
  { name: 'Konya', lat: 37.87, lng: 32.48, dx: -38, dy: 18 },
  { name: 'Kapadokya', lat: 38.62, lng: 34.71, dx: 10, dy: -12 },
  { name: 'Gaziantep', lat: 37.07, lng: 37.38, dx: 10, dy: 17 },
  { name: 'Mersin', lat: 36.81, lng: 34.64, dx: -34, dy: 18 },
  { name: 'Diyarbakır', lat: 37.91, lng: 40.24, dx: 10, dy: 16 },
  { name: 'Van', lat: 38.49, lng: 43.41, dx: 12, dy: 4 },
  { name: 'Erzurum', lat: 39.9, lng: 41.27, dx: 10, dy: -12 },
  { name: 'Trabzon', lat: 41.0, lng: 39.72, dx: 10, dy: -12 },
  { name: 'Samsun', lat: 41.29, lng: 36.33, dx: -24, dy: -16 },
  { name: 'Edirne', lat: 41.68, lng: 26.56, dx: 10, dy: -10 },
]

function project(lng: number, lat: number) {
  const x =
    viewBox.padX +
    ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * (viewBox.width - viewBox.padX * 2)
  const y =
    viewBox.padY +
    ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * (viewBox.height - viewBox.padY * 2)
  return { x, y }
}

const turkeyPath = borderPoints
  .map(([lng, lat], index) => {
    const { x, y } = project(lng, lat)
    return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
  })
  .join(' ')
  .concat(' Z')

const routePairs = [
  ['İstanbul', 'Ankara'],
  ['İzmir', 'Antalya'],
  ['Ankara', 'Kapadokya'],
  ['Kapadokya', 'Gaziantep'],
  ['Samsun', 'Trabzon'],
] as const

function routePath(fromName: string, toName: string) {
  const from = cities.find((city) => city.name === fromName)
  const to = cities.find((city) => city.name === toName)
  if (!from || !to) return ''
  const a = project(from.lng, from.lat)
  const b = project(to.lng, to.lat)
  const cx = (a.x + b.x) / 2
  const cy = Math.min(a.y, b.y) - 28
  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`
}

export default function TurkeyMap({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-x-0 top-1/2 h-[72%] -translate-y-1/2 rounded-[50%] bg-gold-ember/30 blur-[80px]" />
      <svg
        viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
        className="relative h-full w-full overflow-visible drop-shadow-[0_0_12px_hsl(var(--gold-bright)_/_0.6)]"
        aria-label="Türkiye keşif haritası"
        role="img"
      >
        <defs>
          <pattern id="turkeyAntiqueDots" width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="hsl(var(--gold-bright) / .18)" />
            <path d="M6 7h2" stroke="hsl(var(--gold-line) / .12)" strokeWidth=".8" />
          </pattern>
          <clipPath id="turkeyRealClip">
            <path d={turkeyPath} />
          </clipPath>
          <filter id="cityHalo" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        <path d={turkeyPath} fill="hsl(var(--gold-line) / .06)" stroke="hsl(var(--gold-line))" strokeWidth="1.5" />
        <path d={turkeyPath} fill="url(#turkeyAntiqueDots)" clipPath="url(#turkeyRealClip)" opacity=".9" />

        <g clipPath="url(#turkeyRealClip)" opacity=".32">
          {Array.from({ length: 17 }, (_, index) => (
            <path
              key={index}
              d={`M${42 + index * 40} ${70 + (index % 5) * 22} C${170 + index * 18} ${120 + (index % 4) * 20} ${310 + index * 8} ${92 + (index % 6) * 26} 716 ${140 + (index % 7) * 18}`}
              fill="none"
              stroke="hsl(var(--gold-line) / .18)"
              strokeWidth=".8"
            />
          ))}
        </g>

        {routePairs.map(([from, to]) => (
          <path
            key={`${from}-${to}`}
            d={routePath(from, to)}
            fill="none"
            stroke="hsl(var(--gold-line) / .42)"
            strokeWidth="1.15"
            strokeDasharray="2 5"
            className="animate-drift-dash"
          />
        ))}

        {cities.map((city, index) => {
          const { x, y } = project(city.lng, city.lat)
          return (
            <g key={city.name}>
              <circle cx={x} cy={y} r="13" fill="hsl(var(--gold-bright) / .3)" filter="url(#cityHalo)" className="turkey-city-halo" style={{ animationDelay: `${index * -0.17}s` }} />
              <circle cx={x} cy={y} r="4" fill="hsl(var(--gold-bright))" stroke="hsl(var(--gold-line))" strokeWidth="1" />
              <text
                x={x + (city.dx ?? 10)}
                y={y + (city.dy ?? -10)}
                className="fill-gold-bright font-display text-[13px] font-semibold tracking-[0.03em]"
              >
                {city.name}
              </text>
            </g>
          )
        })}

        <path d={turkeyPath} fill="none" stroke="hsl(var(--gold-bright) / .2)" strokeWidth="5" filter="url(#cityHalo)" />
      </svg>
    </div>
  )
}
