const GOOGLE_EMBED_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_EMBED_API_KEY

export function getPrimary360Source(place) {
  if (!place) return null

  if (place.panoramaxImageId) return { type: 'panoramax', value: place.panoramaxImageId }
  if (place.panoramaUrl) return { type: 'panorama', value: place.panoramaUrl }
  if (place.streetViewUrl) return { type: 'street-url', value: place.streetViewUrl }

  const curatedUrl = place.panoramaItems?.find(item => item?.url)?.url || place.panoramas?.[0]
  if (curatedUrl) return { type: 'panorama', value: curatedUrl }

  return null
}

export function has360Imagery(place) {
  const coordinates = place?.location?.coordinates
  const hasGoogleStreetViewCandidate = Boolean(
    GOOGLE_EMBED_API_KEY &&
    Number.isFinite(coordinates?.[0]) &&
    Number.isFinite(coordinates?.[1])
  )

  return Boolean(
    hasGoogleStreetViewCandidate ||
    place?.has360 ||
    place?.panoramaUrl ||
    place?.panoramaxImageId ||
    place?.streetViewUrl
  )
}

export function getPanoramaxUrl(imageId) {
  return `https://api.panoramax.xyz/#focus=pic&pic=${encodeURIComponent(imageId)}`
}

export function getGoogleStreetViewEmbedUrl({ apiKey, lat, lng, heading = 0, pitch = 0, fov = 80, radius = 500 }) {
  const params = new URLSearchParams({
    key: apiKey,
    location: `${lat},${lng}`,
    heading: String(heading),
    pitch: String(pitch),
    fov: String(fov),
    radius: String(radius),
  })

  return `https://www.google.com/maps/embed/v1/streetview?${params.toString()}`
}
