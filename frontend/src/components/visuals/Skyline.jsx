const lanterns = [
  [86, 102, 0, 3.2],
  [162, 74, -1.4, 4.2],
  [248, 113, -2.2, 3.7],
  [332, 88, -0.8, 4.8],
  [492, 78, -2.8, 3.4],
  [610, 109, -1.9, 4.5],
  [744, 82, -0.4, 3.8],
  [884, 116, -2.6, 4.9],
  [1016, 80, -1.2, 3.5],
  [1120, 106, -3.1, 4.1],
]

export default function Skyline({ className = '' }) {
  return (
    <svg viewBox="0 0 1200 190" className={`pointer-events-none text-gold ${className}`} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="skylineHaze" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--gold-deep))" stopOpacity="0" />
          <stop offset="100%" stopColor="hsl(var(--gold-deep))" stopOpacity=".18" />
        </linearGradient>
        <filter id="lanternBlur" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      <rect x="0" y="82" width="1200" height="108" fill="url(#skylineHaze)" opacity=".9" />
      <path
        d="M0 170h35v-37h18v-19h26v19h18v37h30v-55h18c5-27 43-27 48 0h18v55h24v-29h34v29h35v-48h18c7-34 55-34 65 0h18v48h28v-32h42v32h26V97h16c6-32 48-32 56 0h16v73h33v-40h34v40h30v-57h18c8-31 50-31 60 0h18v57h30v-31h43v31h28V93h17c7-33 50-33 59 0h17v77h31v-45h20c7-27 44-27 52 0h20v45h27v-34h36v34h32v-60h18c8-31 49-31 58 0h18v60h32v-38h41v38h29v-53h16c5-25 41-25 47 0h16v53h47v20H0Z"
        fill="hsl(var(--bg-panel))"
        fillOpacity=".9"
      />
      <path
        d="M48 170V122M67 102v68M67 102c-9 14-9 26 0 38 9-12 9-24 0-38ZM158 88v82M158 88c-12 17-12 31 0 45 12-15 12-28 0-45ZM352 71v99M352 71c-14 19-14 36 0 51 14-16 14-32 0-51ZM522 64v106M522 64c-15 21-15 38 0 55 15-18 15-35 0-55ZM707 83v87M707 83c-12 17-12 31 0 45 12-15 12-28 0-45ZM899 68v102M899 68c-15 20-15 37 0 54 15-18 15-34 0-54ZM1096 79v91M1096 79c-13 18-13 33 0 48 13-16 13-31 0-48Z"
        stroke="currentColor"
        strokeOpacity=".3"
        strokeWidth="2"
      />
      <path
        d="M0 170h1200M18 151c70-28 127-28 171 1 53-34 116-38 188-12 45-21 91-18 139 8 62-39 135-43 219-13 79-31 148-29 208 6 68-25 132-20 191 15 40-20 82-23 126-8"
        stroke="currentColor"
        strokeOpacity=".3"
        strokeWidth="1"
      />
      <g fill="hsl(var(--gold-bright))">
        {lanterns.map(([cx, cy, delay, duration]) => (
          <g key={`${cx}-${cy}`} className="lantern-pulse" style={{ animationDelay: `${delay}s`, '--lantern-duration': `${duration}s` }}>
            <circle cx={cx} cy={cy} r="2" />
            <circle cx={cx} cy={cy} r="7" opacity=".4" filter="url(#lanternBlur)" />
          </g>
        ))}
      </g>
      <g fill="hsl(var(--gold) / .1)">
        <rect x="52" y="139" width="7" height="31" />
        <rect x="76" y="139" width="7" height="31" />
        <rect x="150" y="123" width="7" height="47" />
        <rect x="177" y="123" width="7" height="47" />
        <rect x="335" y="136" width="8" height="34" />
        <rect x="365" y="136" width="8" height="34" />
        <rect x="691" y="125" width="8" height="45" />
        <rect x="718" y="125" width="8" height="45" />
        <rect x="1082" y="129" width="8" height="41" />
        <rect x="1110" y="129" width="8" height="41" />
      </g>
    </svg>
  )
}
