const makeParticles = (excludeHeroZone = false) => {
  const particles = []
  let index = 0
  let seed = 0

  while (particles.length < 38 && seed < 120) {
    const left = (seed * 37) % 100
    const top = (seed * 53) % 100
    const insideHeroExclusion = left >= 38 && top >= 15 && top <= 76

    if (!excludeHeroZone || !insideHeroExclusion) {
      particles.push({
        id: index,
        left,
        top,
        size: index % 9 === 0 ? 3 : index % 4 === 0 ? 2 : 1,
        delay: -((index * 0.37) % 9),
        duration: 8 + (index % 7),
        rise: 20 + (index % 5) * 5,
        opacity: 0.3 + (index % 5) * 0.1,
      })
      index += 1
    }

    seed += 1
  }

  return particles
}

export default function ParticleField({ className = '', excludeHeroZone = false }) {
  const particles = makeParticles(excludeHeroZone)

  return (
    <div className={`pointer-events-none absolute inset-0 z-[5] overflow-hidden ${className}`} aria-hidden="true">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="animate-float absolute rounded-full bg-gold-bright blur-[1px]"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animationDelay: `${particle.delay}s`,
            '--float-duration': `${particle.duration}s`,
            '--float-rise': `-${particle.rise}px`,
          }}
        />
      ))}
    </div>
  )
}
