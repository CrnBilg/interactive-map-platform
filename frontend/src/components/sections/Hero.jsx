import { Link } from 'react-router-dom'
import historicColumns from '../../assets/historic-columns.png'
import historicLandmarks from '../../assets/historic-landmarks.png'
import Compass from '../visuals/Compass'
import { CornerOrnament, MuseumIcon } from '../visuals/Ornaments'

export default function Hero() {
  return (
    <section className="lux-section hero-clean min-h-[640px] px-5 py-10 sm:px-8 lg:px-16">
      <style>
        {`
          .right-visual-container {
            background:
              radial-gradient(ellipse at 44% 50%, rgba(212, 175, 55, 0.06), transparent 48%),
              linear-gradient(to right, hsl(var(--background)) 0%, hsl(var(--background) / 0.82) 24%, hsl(var(--background) / 0.38) 46%, transparent 72%);
          }

          .right-visual-container::before {
            content: "";
            position: absolute;
            inset: 0;
            pointer-events: none;
            z-index: 3;
            filter: blur(18px);
            transform: scaleX(1.08);
            transform-origin: left center;
            background: linear-gradient(
              to right,
              hsl(var(--background)) 0%,
              hsl(var(--background) / 0.94) 18%,
              hsl(var(--background) / 0.78) 34%,
              hsl(var(--background) / 0.46) 52%,
              hsl(var(--background) / 0.18) 68%,
              transparent 86%
            );
          }

          .hero-illustration-wrapper {
            position: absolute;
            overflow: hidden;
            border: none;
            padding: 0;
          }

          .hero-illustration-wrapper::before {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(to right, hsl(var(--background) / 0.24) 0%, transparent 10%);
            z-index: 2;
            pointer-events: none;
          }

          .hero-landmarks-image {
            -webkit-mask-image: radial-gradient(
              ellipse 120% 100% at center,
              black 70%,
              rgba(0,0,0,0.6) 85%,
              transparent 100%
            );
            mask-image: radial-gradient(
              ellipse 120% 100% at center,
              black 70%,
              rgba(0,0,0,0.6) 85%,
              transparent 100%
            );
          }
        `}
      </style>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[44%] overflow-hidden">
        <img
          src={historicColumns}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 h-[82%] w-auto object-contain opacity-10 blur-[0.5px] mix-blend-screen drop-shadow-[0_0_35px_rgba(212,175,55,0.22)] md:opacity-20"
        />
        <div className="pointer-events-none absolute left-0 top-0 z-[2] h-full w-full bg-gradient-to-r from-black/35 via-black/15 to-transparent" />
      </div>
      <CornerOrnament className="left-3 top-3 z-[3] h-[120px] w-[120px] opacity-70" />
      <CornerOrnament className="right-3 top-3 z-[3] h-[120px] w-[120px] opacity-70" rotate={90} />
      <CornerOrnament className="bottom-3 left-3 z-[3] h-[120px] w-[120px] opacity-45" rotate={270} />
      <CornerOrnament className="bottom-3 right-3 z-[3] h-[120px] w-[120px] opacity-45" rotate={180} />
      <div className="pointer-events-none absolute left-[42%] top-[32%] z-[4] hidden h-[140px] w-[140px] -translate-x-1/2 -translate-y-1/2 opacity-80 drop-shadow-[0_0_25px_rgba(212,175,55,0.6)] lg:block">
        <Compass className="h-full w-full" />
      </div>
      <div className="right-visual-container pointer-events-none absolute inset-0 z-[2] hidden overflow-hidden lg:block">
        <div className="pointer-events-none absolute right-[12%] top-1/2 z-[1] h-[420px] w-[640px] -translate-y-1/2 rounded-full bg-yellow-500/10 blur-[80px]" />
        <div
          className="pointer-events-none absolute inset-y-[-8%] right-[-4%] z-[2] w-[74%]"
          style={{
            WebkitMaskImage: 'radial-gradient(ellipse at 68% 50%, rgba(0,0,0,1) 48%, rgba(0,0,0,0.55) 68%, rgba(0,0,0,0) 100%)',
            maskImage: 'radial-gradient(ellipse at 68% 50%, rgba(0,0,0,1) 48%, rgba(0,0,0,0.55) 68%, rgba(0,0,0,0) 100%)',
          }}
        >
          <div className="pointer-events-none absolute inset-0 z-[1] rounded-none bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.15)_0%,rgba(212,175,55,0.08)_40%,transparent_75%)] shadow-[inset_0_0_60px_rgba(212,175,55,0.15)]" />
          <div className="hero-illustration-wrapper pointer-events-none right-[12%] top-1/2 z-[2] aspect-[829/505] w-[92%] max-w-[940px] -translate-y-1/2">
            <img
              src={historicLandmarks}
              alt=""
              aria-hidden="true"
              className="hero-landmarks-image pointer-events-none absolute inset-0 z-[1] h-full w-full object-contain opacity-85 drop-shadow-[0_0_45px_rgba(212,175,55,0.35)]"
            />
            <div className="absolute inset-[10px] pointer-events-none border border-yellow-500/35 z-[5]" />
            <div className="absolute inset-[18px] pointer-events-none border border-yellow-300/20 z-[5]" />
            <div className="absolute top-[10px] left-1/2 h-px w-32 -translate-x-1/2 bg-gradient-to-r from-transparent via-yellow-200/80 to-transparent pointer-events-none z-[6]" />
            <div className="absolute bottom-[10px] left-1/2 h-px w-32 -translate-x-1/2 bg-gradient-to-r from-transparent via-yellow-200/60 to-transparent pointer-events-none z-[6]" />
            <div className="absolute left-[10px] top-[10px] h-8 w-8 border-l border-t border-yellow-300/60 pointer-events-none z-[6]" />
            <div className="absolute right-[10px] top-[10px] h-8 w-8 border-r border-t border-yellow-300/60 pointer-events-none z-[6]" />
            <div className="absolute left-[10px] bottom-[10px] h-8 w-8 border-l border-b border-yellow-300/60 pointer-events-none z-[6]" />
            <div className="absolute right-[10px] bottom-[10px] h-8 w-8 border-r border-b border-yellow-300/60 pointer-events-none z-[6]" />
          </div>
          <div className="pointer-events-none absolute left-0 top-0 z-[3] h-full w-[9%] bg-gradient-to-r from-background/35 to-transparent" />
          <div className="pointer-events-none absolute left-[4%] top-0 z-[3] h-full w-[12%] bg-gradient-to-r from-yellow-500/10 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-[3] h-full w-[8%] bg-gradient-to-l from-yellow-500/25 to-transparent" />
          <div className="pointer-events-none absolute left-0 top-0 z-[3] h-[8%] w-full bg-gradient-to-b from-yellow-500/20 to-transparent" />
          <div className="pointer-events-none absolute bottom-0 left-0 z-[3] h-[10%] w-full bg-gradient-to-t from-yellow-500/25 to-transparent" />
          <div className="pointer-events-none absolute left-0 top-0 z-[4] h-[20%] w-full bg-gradient-to-b from-[#050505] via-[#050505]/60 to-transparent" />
          <div className="pointer-events-none absolute bottom-0 left-0 z-[4] h-[25%] w-full bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-[4] h-full w-[12%] bg-gradient-to-l from-[#050505]/70 to-transparent" />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-20 z-[2] h-72 overflow-hidden opacity-[0.12] lg:hidden">
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_38%,transparent_82%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_38%,transparent_82%)]">
          <img
            src={historicLandmarks}
            alt=""
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-full w-[115%] -translate-x-1/2 -translate-y-1/2 object-contain opacity-40 drop-shadow-[0_0_45px_rgba(212,175,55,0.35)]"
          />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,hsl(var(--background)_/_0.8)_76%)]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-10 pt-8 lg:min-h-[560px] lg:grid-cols-12">
        <div className="lg:col-span-6">
          <div className="hero-badge">
            <span className="text-gold-bright/70">✦</span>
            <MuseumIcon className="h-4 w-4" />
            Türkiye kültür ve keşif haritası
            <span className="text-gold-bright/70">✦</span>
          </div>

          <h1 className="font-display text-[clamp(48px,6vw,88px)] font-semibold leading-[1.05] tracking-[-0.02em] text-gold-bright [text-shadow:0_0_24px_hsl(var(--gold-bright)_/_0.25)]">
            <span className="block bg-gradient-to-b from-gold-bright to-gold bg-clip-text text-transparent">Türkiye'yi keşfetmenin</span>
            <span className="block bg-gradient-to-b from-gold-bright to-gold bg-clip-text text-transparent">en kolay yolu</span>
          </h1>

          <p className="mt-6 max-w-[480px] text-[15px] leading-[1.7] text-parchment/80">
            Tarihi mekanları, şehirleri ve canlı etkinlikleri sade bir interaktif haritada keşfedin; rotanızı
            planlayın ve yeni durakları kolayca bulun.
          </p>

          <Link
            to="/map"
            className="hero-cta group mt-8 inline-flex items-center gap-3 rounded-lg bg-gradient-to-b from-gold-bright to-gold-deep px-7 py-3.5 font-semibold text-bg-deep transition duration-300"
          >
            Haritayı Aç
            <span className="transition duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <div className="hidden lg:col-span-6 lg:block" />
      </div>
    </section>
  )
}
