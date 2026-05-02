import Hero from '../components/sections/Hero'
import TagStrip from '../components/sections/TagStrip'
import FeatureGrid from '../components/sections/FeatureGrid'
import Footer from '../components/sections/Footer'

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-bg-deepest text-parchment">
      <Hero />
      <TagStrip />
      <FeatureGrid />
      <Footer />
    </main>
  )
}
