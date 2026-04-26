import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { citiesAPI, placesAPI } from '../services/api'
import { MapPin, Landmark, Star, ArrowRight } from 'lucide-react'

const categoryEmoji = { historical: '🏛️', museum: '🏺', mosque: '🕌', castle: '🏰', ruins: '⛏️', monument: '🗿', cultural: '🎭', other: '📍' }

export default function CityPage() {
  const { id } = useParams()
  const [city, setCity] = useState(null)
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    citiesAPI.getOne(id).then(res => {
      setCity(res.data)
      return placesAPI.getAll({ city: res.data.name, limit: 50 })
    }).then(res => {
      setPlaces(res.data.places)
    }).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex items-center justify-center h-64 text-stone-500">Yükleniyor...</div>
  if (!city) return <div className="text-center py-20 text-stone-500">Şehir bulunamadı</div>

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="mb-10">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-stone-100 mb-2">{city.name}</h1>
        <p className="text-stone-400">{city.description}</p>
        <div className="flex items-center gap-4 mt-4">
          <span className="flex items-center gap-1 text-stone-500 text-sm"><MapPin size={14} /> {city.region}</span>
          <span className="flex items-center gap-1 text-amber-400 text-sm"><Landmark size={14} /> {city.placeCount} tarihi mekan</span>
          <Link to={`/map`} className="flex items-center gap-1 text-amber-400 hover:text-amber-300 text-sm">
            Haritada Göster <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {places.map(place => (
          <Link key={place._id} to={`/place/${place._id}`} className="card group hover:border-amber-500/30 transition-all">
            <div className="h-36 bg-gradient-to-br from-stone-800 to-stone-900 flex items-center justify-center text-5xl">
              {categoryEmoji[place.category]}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-stone-100 group-hover:text-amber-300 transition-colors">{place.name}</h3>
              <p className="text-stone-500 text-xs mt-1 line-clamp-2">{place.description}</p>
              <div className="flex items-center justify-between mt-3">
                {place.rating > 0 && (
                  <span className="flex items-center gap-1 text-amber-400 text-xs">
                    <Star size={11} fill="currentColor" /> {place.rating}
                  </span>
                )}
                {place.period && <span className="text-stone-600 text-xs">{place.period}</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {places.length === 0 && (
        <div className="text-center py-16 text-stone-500">
          <Landmark size={40} className="mx-auto mb-3 opacity-30" />
          <p>Bu şehir için henüz mekan eklenmemiş.</p>
          <Link to="/add-place" className="text-amber-400 hover:underline mt-2 inline-block">İlk mekanı sen ekle!</Link>
        </div>
      )}
    </div>
  )
}
