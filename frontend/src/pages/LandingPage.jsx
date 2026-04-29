import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { citiesAPI, placesAPI } from '../services/api'

// City coordinates on a 0-100 scale for the canvas map
const CITY_DOTS = [
  { name: 'İstanbul', x: 20, y: 28, count: 5 },
  { name: 'Ankara', x: 44, y: 45, count: 3 },
  { name: 'İzmir', x: 12, y: 52, count: 2 },
  { name: 'Konya', x: 46, y: 60, count: 2 },
  { name: 'Bursa', x: 22, y: 35, count: 1 },
  { name: 'Antalya', x: 38, y: 75, count: 2 },
  { name: 'Trabzon', x: 72, y: 22, count: 1 },
  { name: 'Cappadocia', x: 54, y: 52, count: 2 },
]

export default function LandingPage() {
  const heroCanvasRef = useRef(null)
  const mapCanvasRef = useRef(null)
  const containerRef = useRef(null)
  const animFrameRef = useRef(null)
  const mouseRef = useRef({ x: -999, y: -999 })
  const [cities, setCities] = useState([])
  const [stats, setStats] = useState({ places: 0, cities: 0 })
  const [liveCount, setLiveCount] = useState(0)
  const [hoveredCity, setHoveredCity] = useState(null)

  // Fetch data
  useEffect(() => {
    citiesAPI.getAll().then(r => setCities(r.data.slice(0, 8)))
    placesAPI.getAll({ limit: 1 }).then(r => setStats(s => ({ ...s, places: r.data.total || 15 })))
    // Animate live count
    let n = 0
    const t = setInterval(() => {
      n++
      setLiveCount(n)
      if (n >= 12) clearInterval(t)
    }, 80)
    return () => clearInterval(t)
  }, [])

  // Particle canvas
  useEffect(() => {
    const canvas = heroCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W, H
    const particles = []

    const resize = () => {
      W = canvas.width = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Init particles
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.4 + 0.3,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      const { x: mx, y: my } = mouseRef.current

      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = W
        if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H
        if (p.y > H) p.y = 0

        const dx = p.x - mx
        const dy = p.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        const glow = dist < 130 ? (1 - dist / 130) * 0.9 : 0

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(245,158,11,${0.07 + glow * 0.6})`
        ctx.fill()

        // Line to mouse
        if (glow > 0) {
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(mx, my)
          ctx.strokeStyle = `rgba(245,158,11,${glow * 0.12})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      })

      // Connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 85) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(245,158,11,${(1 - d / 85) * 0.055})`
            ctx.lineWidth = 0.4
            ctx.stroke()
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  // Map canvas
  useEffect(() => {
    const canvas = mapCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf
    const W = canvas.width = canvas.offsetWidth || 480
    const H = canvas.height = 220

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      // Background
      ctx.fillStyle = '#0f0d0b'
      ctx.fillRect(0, 0, W, H)

      // Grid
      ctx.strokeStyle = 'rgba(255,255,255,0.025)'
      ctx.lineWidth = 1
      for (let x = 0; x < W; x += 28) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
      }
      for (let y = 0; y < H; y += 28) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
      }

      // Turkey silhouette
      ctx.beginPath()
      const tx = (v) => v * W / 100
      const ty = (v) => v * H / 100
      ctx.moveTo(tx(8), ty(48))
      ctx.bezierCurveTo(tx(10), ty(32), tx(22), ty(25), tx(32), ty(28))
      ctx.bezierCurveTo(tx(40), ty(22), tx(50), ty(20), tx(57), ty(23))
      ctx.bezierCurveTo(tx(65), ty(18), tx(75), ty(21), tx(85), ty(27))
      ctx.bezierCurveTo(tx(93), ty(31), tx(97), ty(39), tx(96), ty(48))
      ctx.bezierCurveTo(tx(93), ty(57), tx(86), ty(63), tx(78), ty(60))
      ctx.bezierCurveTo(tx(72), ty(68), tx(63), ty(72), tx(56), ty(68))
      ctx.bezierCurveTo(tx(48), ty(65), tx(40), ty(67), tx(34), ty(62))
      ctx.bezierCurveTo(tx(26), ty(67), tx(16), ty(63), tx(11), ty(57))
      ctx.bezierCurveTo(tx(8), ty(54), tx(7), ty(51), tx(8), ty(48))
      ctx.closePath()
      ctx.fillStyle = 'rgba(245,158,11,0.07)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(245,158,11,0.22)'
      ctx.lineWidth = 1
      ctx.stroke()

      // City dots with pulse
      const t = Date.now() / 1000
      CITY_DOTS.forEach((c, i) => {
        const px = tx(c.x)
        const py = ty(c.y)
        const pulse = (Math.sin(t * 1.6 + i * 0.8) + 1) / 2

        // Outer ring
        ctx.beginPath()
        ctx.arc(px, py, 8 + pulse * 7, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(245,158,11,${0.12 - pulse * 0.1})`
        ctx.lineWidth = 1
        ctx.stroke()

        // Inner dot
        ctx.beginPath()
        ctx.arc(px, py, 2.5 + pulse * 1.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(245,158,11,${0.5 + pulse * 0.45})`
        ctx.fill()
      })

      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])

  // Mouse tracking
  const handleMouseMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  // Custom cursor
  const [curPos, setCurPos] = useState({ x: -100, y: -100 })
  const [curLarge, setCurLarge] = useState(false)
  useEffect(() => {
    const onMove = (e) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      setCurPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const marqueeItems = [
    'Ayasofya', 'Mevlana Müzesi', 'Topkapı Sarayı', 'Aspendos Tiyatrosu',
    'Sümela Manastırı', 'Göreme Açık Hava Müzesi', 'Anıtkabir', 'Derinkuyu',
    'Efes Antik Kenti', 'Ankara Kalesi', 'Alaeddin Camii', 'Rumeli Hisarı',
  ]

  return (
    <div
      ref={containerRef}
      className="relative bg-stone-950 overflow-hidden select-none"
      onMouseMove={handleMouseMove}
      style={{ cursor: 'none' }}
    >
      {/* Custom cursor */}
      <div
        className="pointer-events-none fixed z-50 transition-transform duration-75"
        style={{ left: curPos.x, top: curPos.y, transform: 'translate(-50%,-50%)' }}
      >
        <div
          className={`rounded-full bg-amber-500 transition-all duration-200 ${curLarge ? 'w-4 h-4' : 'w-2.5 h-2.5'}`}
        />
      </div>
      <div
        className="pointer-events-none fixed z-49 rounded-full border border-amber-500/30 transition-all duration-150"
        style={{
          left: curPos.x, top: curPos.y,
          transform: 'translate(-50%,-50%)',
          width: curLarge ? 52 : 36,
          height: curLarge ? 52 : 36,
        }}
      />

      {/* Particle canvas */}
      <canvas
        ref={heroCanvasRef}
        className="absolute inset-0 w-full"
        style={{ height: '100vh', zIndex: 1 }}
      />

      {/* ─── HERO ─── */}
      <section className="relative z-10 min-h-screen flex flex-col justify-center px-10 md:px-16 pt-8">
        {/* Live badge */}
        <div className="inline-flex items-center gap-2 mb-10 self-start">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs tracking-widest uppercase text-stone-500 font-light">
            Canlı kültürel harita — Türkiye
          </span>
        </div>

        {/* Main title */}
        <h1 className="font-display text-[clamp(52px,8vw,88px)] leading-[0.92] font-bold text-stone-100 mb-6 max-w-3xl tracking-tight">
          Tarihin<br />
          <em className="not-italic text-amber-400">nabzını</em><br />
          hisset.
        </h1>

        <p className="text-stone-500 text-base md:text-lg font-light max-w-md leading-relaxed mb-12">
          Türkiye'nin binlerce yıllık tarihi mekanları ve anlık sokak etkinlikleri — tek interaktif haritada.
        </p>

        <div className="flex items-center gap-5">
          <Link
            to="/map"
            className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-medium text-sm px-7 py-3.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
            onMouseEnter={() => setCurLarge(true)}
            onMouseLeave={() => setCurLarge(false)}
          >
            Keşfetmeye Başla
          </Link>
          <Link
            to="/register"
            className="text-stone-500 hover:text-stone-200 text-sm flex items-center gap-2 transition-colors group"
          >
            <span>Ücretsiz kayıt</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 left-10 md:left-16 flex items-center gap-2 text-stone-700 text-xs tracking-widest uppercase">
          <div className="w-px h-8 bg-stone-700" />
          <span>Kaydır</span>
        </div>
      </section>

      {/* ─── MARQUEE ─── */}
      <div className="relative z-10 border-y border-stone-800/60 py-3.5 overflow-hidden bg-stone-950/80 backdrop-blur-sm">
        <div
          className="flex gap-0 whitespace-nowrap"
          style={{ animation: 'marquee 30s linear infinite', width: 'max-content' }}
        >
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="text-xs tracking-widest uppercase text-stone-700 px-6">
              {i % 2 === 1 ? <span className="text-amber-600/50 px-0">✦</span> : null}
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ─── MAP + STATS ─── */}
      <section className="relative z-10 px-10 md:px-16 py-20 flex flex-col md:flex-row gap-10 items-start">
        {/* Map */}
        <div className="flex-1 relative">
          <canvas
            ref={mapCanvasRef}
            className="w-full rounded-2xl border border-stone-800/60"
            style={{ height: 220 }}
          />
          {/* Fade edges */}
          <div className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ background: 'linear-gradient(to right, #0c0a09 0%, transparent 8%, transparent 92%, #0c0a09 100%)' }} />
        </div>

        {/* Stats */}
        <div className="flex flex-row md:flex-col gap-4 md:w-44 shrink-0">
          {[
            { val: '81+', label: 'Şehir', pct: 90 },
            { val: '500+', label: 'Tarihi mekan', pct: 65 },
            { val: liveCount, label: 'Canlı etkinlik', pct: Math.round(liveCount / 12 * 80) },
          ].map(({ val, label, pct }) => (
            <div key={label} className="flex-1 bg-stone-900/60 border border-stone-800/60 rounded-xl p-4">
              <div className="font-display text-3xl font-bold text-stone-100 leading-none">{val}</div>
              <div className="text-stone-600 text-xs uppercase tracking-wider mt-1.5">{label}</div>
              <div className="h-px bg-stone-800 mt-3 rounded overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded transition-all duration-1000"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="relative z-10 grid grid-cols-1 md:grid-cols-3 border-t border-stone-800/50"
        style={{ background: 'rgba(8,7,5,0.9)' }}>
        {[
          {
            num: '01',
            icon: '🗺️',
            title: 'İnteraktif harita',
            desc: 'Leaflet tabanlı, şehir ve kategori filtreli gerçek zamanlı Türkiye haritası.',
          },
          {
            num: '02',
            icon: '⚡',
            title: 'Canlı etkinlikler',
            desc: 'WebSocket ile anlık bildirim. Flash mob, sokak konseri, pop-up market — anında haritada.',
          },
          {
            num: '03',
            icon: '🔭',
            title: '360 / Street-Level',
            desc: 'Google Maps Embed, Panoramax veya kendi 360 görsel bağlantılarınla mekanlara sokak seviyesi görünüm ekle.',
          },
        ].map((f, i) => (
          <div
            key={f.num}
            className={`p-8 md:p-10 hover:bg-stone-900/50 transition-colors duration-300 ${i < 2 ? 'md:border-r border-stone-800/50' : ''} border-b md:border-b-0 border-stone-800/50`}
            onMouseEnter={() => setCurLarge(true)}
            onMouseLeave={() => setCurLarge(false)}
          >
            <div className="text-xs text-amber-500/40 tracking-widest mb-5">{f.num}</div>
            <div className="text-2xl mb-3">{f.icon}</div>
            <h3 className="font-display text-lg font-bold text-stone-100 mb-2">{f.title}</h3>
            <p className="text-stone-600 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* ─── CTA ─── */}
      <section className="relative z-10 px-10 md:px-16 py-20 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-stone-800/50">
        <div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-stone-100 mb-2">
            Başlamaya hazır mısın?
          </h2>
          <p className="text-stone-600 text-sm">Ücretsiz kayıt ol, haritayı keşfet.</p>
        </div>
        <Link
          to="/register"
          className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-sm px-10 py-4 rounded-full transition-all hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
          onMouseEnter={() => setCurLarge(true)}
          onMouseLeave={() => setCurLarge(false)}
        >
          Ücretsiz Başla →
        </Link>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="relative z-10 px-10 md:px-16 py-6 border-t border-stone-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-amber-500 rounded-md flex items-center justify-center text-xs text-stone-950 font-bold">C</div>
          <span className="font-display text-sm font-bold text-stone-400">CityLore</span>
          <span className="text-stone-700 text-xs ml-2">Web Programming SE 3355</span>
        </div>
        <div className="flex gap-2 flex-wrap justify-center">
          {['React', 'Node.js', 'MongoDB', 'Socket.IO', 'Leaflet', 'OpenStreetMap'].map(s => (
            <span key={s} className="text-xs border border-stone-800 text-stone-700 px-3 py-1 rounded-full">{s}</span>
          ))}
        </div>
      </footer>

      {/* Marquee keyframe */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0) }
          to { transform: translateX(-50%) }
        }
      `}</style>
    </div>
  )
}
