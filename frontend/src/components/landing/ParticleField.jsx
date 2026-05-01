const particles = Array.from({ length: 92 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 101}%`,
  top: `${(index * 61) % 97}%`,
  size: 1 + (index % 3) * 0.7,
  delay: `${(index % 17) * -0.45}s`,
  duration: `${8 + (index % 9)}s`,
  opacity: 0.18 + (index % 7) * 0.055,
}))

export default function ParticleField({ className = '' }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {particles.map(particle => (
        <span
          key={particle.id}
          className="landing-particle"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
          }}
        />
      ))}
    </div>
  )
}
