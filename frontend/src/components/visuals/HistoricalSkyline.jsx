function LandmarkSvg({ className = '', children, viewBox = '0 0 260 180' }) {
  return (
    <svg
      viewBox={viewBox}
      className={`pointer-events-none absolute text-gold-bright ${className}`}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="landmarkFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--gold-bright))" stopOpacity=".18" />
          <stop offset="100%" stopColor="hsl(var(--ember-red))" stopOpacity=".12" />
        </linearGradient>
      </defs>
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="url(#landmarkFill)">
        {children}
      </g>
    </svg>
  )
}

function GlowDots({ dots }) {
  return (
    <g fill="hsl(var(--gold-bright) / .8)">
      {dots.map(([cx, cy], index) => (
        <circle key={`${cx}-${cy}-${index}`} cx={cx} cy={cy} r="1.5" />
      ))}
    </g>
  )
}

function Cappadocia() {
  return (
    <LandmarkSvg className="left-4 top-5 z-[1] h-[190px] w-[340px] opacity-25 blur-[1px]" viewBox="0 0 360 210">
      <path d="M48 190c11-62 23-91 36-86 12 5 18 34 18 86M116 190c9-76 24-116 45-118 22 2 36 42 43 118M218 190c8-66 22-100 42-101 20 1 34 35 41 101M70 123h20M146 98h30M247 118h28M82 156h16M161 146h20M260 153h18" />
      <path d="M59 104c8-14 18-14 29 0M138 72c12-18 29-18 44 0M241 89c12-16 25-16 38 0" />
      <path d="M156 30c19 0 34 16 34 36 0 16-16 36-34 36s-34-20-34-36c0-20 15-36 34-36ZM140 101h32M294 34c16 0 29 13 29 30 0 14-13 31-29 31s-29-17-29-31c0-17 13-30 29-30ZM281 94h26M70 42c13 0 24 11 24 25 0 12-11 27-24 27S46 79 46 67c0-14 11-25 24-25ZM59 93h22" />
    </LandmarkSvg>
  )
}

function Nemrut() {
  return (
    <LandmarkSvg className="right-4 top-5 z-[1] h-[170px] w-[330px] opacity-25 blur-[1px]" viewBox="0 0 360 190">
      <path d="M20 172c48-34 107-48 177-41 59 6 108 20 143 41" />
      <path d="M65 153c-13-35-6-67 21-86 26-18 58-13 75 11 17 24 15 55-7 75M88 92h45M94 119h42M182 158c-16-33-11-64 17-83 24-16 55-12 72 11 15 22 12 52-9 72M203 98h42M210 124h36M287 160c-20-22-19-47 4-66 21-16 48-11 60 10 11 20 4 43-17 56M302 114h35M311 137h26" />
      <path d="M51 165c25 12 57 12 96 0M174 169c35 10 75 8 119-6" opacity=".55" />
    </LandmarkSvg>
  )
}

function Galata() {
  return (
    <LandmarkSvg className="left-[9%] top-[31%] z-[2] h-[250px] w-[170px] opacity-35 blur-[0.5px]" viewBox="0 0 150 260">
      <path d="M41 246V78h68v168M33 78h84L101 43H49L33 78ZM49 43c10-35 42-35 52 0M75 28V8M75 8c-7 9-7 18 0 27 7-9 7-18 0-27Z" />
      <path d="M45 102h60M48 122h54M52 220h46" />
      <GlowDots dots={[[62, 108], [88, 108], [62, 138], [88, 138], [62, 168], [88, 168], [62, 198], [88, 198]]} />
    </LandmarkSvg>
  )
}

function Suleymaniye() {
  return (
    <LandmarkSvg className="right-2 top-[32%] z-[2] h-[250px] w-[300px] opacity-35 blur-[0.5px]" viewBox="0 0 330 260">
      <path d="M62 238V146M62 146c-13 16-13 31 0 47 13-16 13-31 0-47ZM100 238v-62c23-52 91-52 114 0v62M116 176c17-28 31-42 41-42s24 14 41 42M222 238v-52c19-40 68-40 86 0v52M264 238V122M264 122c-13 16-13 31 0 47 13-16 13-31 0-47ZM26 238V168M26 168c-10 12-10 24 0 36 10-12 10-24 0-36ZM306 238V168M306 168c-10 12-10 24 0 36 10-12 10-24 0-36ZM70 238h226M84 208h146" />
      <GlowDots dots={[[126, 198], [154, 188], [183, 198], [245, 205], [286, 205]]} />
    </LandmarkSvg>
  )
}

function Pamukkale() {
  return (
    <LandmarkSvg className="bottom-0 left-0 z-[4] h-[95px] w-[250px] opacity-50" viewBox="0 0 260 100">
      <path d="M4 82c35-20 70-20 105 0 31-17 66-17 105 0M22 62c32-16 62-16 90 0 27-14 58-14 91 0M44 44c25-12 50-12 76 0 22-10 49-10 79 0M65 28c18-8 38-8 60 0 17-7 36-7 58 0" />
      <path d="M4 88h248" opacity=".45" />
    </LandmarkSvg>
  )
}

function Anitkabir() {
  const columns = Array.from({ length: 24 }, (_, index) => 30 + index * 8.7)
  return (
    <LandmarkSvg className="bottom-0 left-[8%] z-[4] h-[150px] w-[330px] opacity-60" viewBox="0 0 280 150">
      <path d="M28 96h224v38H28zM38 72h204v24H38zM50 55h180v17H50zM74 134l-18 12h168l-18-12M14 96h22M244 96h22M20 78V48h28v30M232 78V48h28v30" />
      {columns.map((x) => (
        <path key={x} d={`M${x} 96V132h5V96`} />
      ))}
      <GlowDots dots={columns.filter((_, index) => index % 3 === 0).map((x) => [x + 2.5, 86])} />
    </LandmarkSvg>
  )
}

function SultanAhmet() {
  return (
    <LandmarkSvg className="bottom-0 left-[28%] z-[4] h-[175px] w-[350px] opacity-58" viewBox="0 0 360 180">
      <path d="M34 164V74M34 74c-11 13-11 26 0 40 11-14 11-27 0-40ZM78 164V50M78 50c-12 15-12 29 0 44 12-15 12-29 0-44ZM126 164V96c20-34 54-34 74 0v68M126 96c-28 6-49 27-62 68M200 96c28 6 49 27 62 68M144 92c10-41 63-41 74 0M180 164V74M180 74c-14 16-14 31 0 48 14-17 14-32 0-48ZM234 164V96c20-34 54-34 74 0v68M282 164V50M282 50c12 15 12 29 0 44-12-15-12-29 0-44ZM326 164V74M326 74c11 13 11 26 0 40-11-14-11-27 0-40ZM54 164h252" />
      <GlowDots dots={[[146, 121], [165, 112], [196, 112], [215, 121], [95, 144], [262, 144]]} />
    </LandmarkSvg>
  )
}

function TopkapiGate() {
  return (
    <LandmarkSvg className="bottom-0 left-[49%] z-[4] h-[145px] w-[240px] opacity-55" viewBox="0 0 240 145">
      <path d="M28 134V58h52v76M160 134V58h52v76M38 58c10-26 27-26 32 0M170 58c10-26 27-26 32 0M80 134V76h80v58M100 134v-32c0-22 40-22 40 0v32M64 76h112M92 62h56M120 62V42" />
      <GlowDots dots={[[53, 88], [187, 88], [112, 82], [128, 82]]} />
    </LandmarkSvg>
  )
}

function Ayasofya() {
  return (
    <LandmarkSvg className="bottom-0 left-[61%] z-[4] h-[170px] w-[330px] opacity-58" viewBox="0 0 340 175">
      <path d="M42 162V64M42 64c-10 12-10 25 0 38 10-13 10-26 0-38ZM82 162V98h34v64M116 98c22-58 110-58 132 0M128 98c25-35 83-35 108 0M248 162V98h34v64M298 162V64M298 64c10 12 10 25 0 38-10-13-10-26 0-38ZM16 162h308M68 162v-36c16-34 45-34 61 0M211 162v-36c16-34 45-34 61 0M101 120h138" />
      <GlowDots dots={[[151, 114], [170, 108], [189, 114], [89, 142], [252, 142]]} />
    </LandmarkSvg>
  )
}

function Ephesus() {
  return (
    <LandmarkSvg className="bottom-0 right-1 z-[4] h-[155px] w-[300px] opacity-58" viewBox="0 0 300 160">
      <path d="M22 148V62h256v86M36 62l37-28 37 28M110 62l40-32 40 32M190 62c14-28 56-28 70 0M40 92h220M48 62v86M84 62v86M122 62v86M158 62v86M196 62v86M232 62v86M62 148v-28c0-19 28-19 28 0v28M134 148v-30c0-20 32-20 32 0v30M211 148v-28c0-19 28-19 28 0v28" />
      <GlowDots dots={[[66, 82], [102, 82], [140, 82], [176, 82], [214, 82], [250, 82]]} />
    </LandmarkSvg>
  )
}

export default function HistoricalSkyline({ className = '' }) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      <Cappadocia />
      <Nemrut />
      <Galata />
      <Suleymaniye />
      <Pamukkale />
      <Anitkabir />
      <SultanAhmet />
      <TopkapiGate />
      <Ayasofya />
      <Ephesus />
    </div>
  )
}
