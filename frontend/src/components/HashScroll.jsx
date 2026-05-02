import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function HashScroll() {
  const { hash, pathname } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const targetId = decodeURIComponent(hash.slice(1))
    window.setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' })
    }, 80)
  }, [hash, pathname])

  return null
}
