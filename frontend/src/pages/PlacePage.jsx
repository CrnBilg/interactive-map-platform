import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { placesAPI, reviewsAPI, authAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { MapPin, Star, Clock, DollarSign, Globe, Bookmark, BookmarkCheck, Trash2, ArrowLeft, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import PanoramaModal from '../components/PanoramaModal'

const categoryLabel = { historical: 'Tarihi', museum: 'Müze', mosque: 'Cami', castle: 'Kale', ruins: 'Harabe', monument: 'Anıt', cultural: 'Kültürel', other: 'Diğer' }
const categoryEmoji = { historical: '🏛️', museum: '🏺', mosque: '🕌', castle: '🏰', ruins: '⛏️', monument: '🗿', cultural: '🎭', other: '📍' }

export default function PlacePage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [place, setPlace] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [panoramaOpen, setPanoramaOpen] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    Promise.all([placesAPI.getOne(id), reviewsAPI.getByPlace(id)])
      .then(([placeRes, reviewsRes]) => {
        setPlace(placeRes.data)
        setReviews(reviewsRes.data)
        if (user) setSaved(user.savedPlaces?.includes(id))
      })
      .finally(() => setLoading(false))
  }, [id, user])

  const handleSave = async () => {
    if (!user) { toast.error('Kaydetmek için giriş yapın'); return }
    await authAPI.savePlace(id)
    setSaved(!saved)
    toast.success(saved ? 'Kaydedilenlerden çıkarıldı' : 'Kaydedildi!')
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!reviewForm.comment.trim() || reviewForm.comment.length < 10) {
      toast.error('Yorum en az 10 karakter olmalı')
      return
    }
    setSubmitting(true)
    try {
      const { data } = await reviewsAPI.create(id, reviewForm)
      setReviews(prev => [data, ...prev])
      setReviewForm({ rating: 5, comment: '' })
      toast.success('Yorumunuz eklendi!')
      const updatedPlace = await placesAPI.getOne(id)
      setPlace(updatedPlace.data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Hata oluştu')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteReview = async (reviewId) => {
    await reviewsAPI.delete(reviewId)
    setReviews(prev => prev.filter(r => r._id !== reviewId))
    toast.success('Yorum silindi')
  }

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="h-64 bg-stone-800 rounded-2xl animate-pulse mb-6" />
      <div className="h-8 bg-stone-800 rounded-xl animate-pulse w-1/2 mb-4" />
      <div className="h-4 bg-stone-800 rounded animate-pulse w-3/4" />
    </div>
  )

  if (!place) return <div className="text-center py-20 text-stone-500">Mekan bulunamadı</div>

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-stone-500 hover:text-stone-300 mb-6 transition-colors text-sm">
        <ArrowLeft size={16} /> Geri
      </button>

      {/* Hero image */}
      <div className="h-64 md:h-80 bg-gradient-to-br from-stone-800 to-stone-900 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden">
        {place.images?.[0] ? (
          <img src={place.images[0]} alt={place.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-8xl">{categoryEmoji[place.category]}</span>
        )}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setPanoramaOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl backdrop-blur-sm border bg-stone-900/80 border-stone-700 text-amber-400 hover:bg-amber-500 hover:text-stone-950 hover:border-amber-400 transition-all text-sm font-medium"
          >
            <Eye size={15} /> 360° Panorama
          </button>
          <button onClick={handleSave} className={`p-2.5 rounded-xl backdrop-blur-sm border transition-all ${saved ? 'bg-amber-500/90 border-amber-400 text-stone-950' : 'bg-stone-900/80 border-stone-700 text-stone-300 hover:text-amber-400'}`}>
            {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="badge bg-amber-500/10 text-amber-400 border border-amber-500/20">{categoryLabel[place.category]}</span>
            {place.period && <span className="badge bg-stone-800 text-stone-400 border border-stone-700">{place.period}</span>}
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-stone-100 mb-2">{place.name}</h1>
          <div className="flex items-center gap-1 text-stone-500 text-sm mb-4">
            <MapPin size={14} /> {place.city} {place.address && `• ${place.address}`}
          </div>
          <p className="text-stone-400 leading-relaxed">{place.description}</p>
        </div>

        <div className="space-y-3">
          {place.rating > 0 && (
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-1">
                <Star size={16} className="text-amber-400" fill="currentColor" />
                <span className="font-bold text-2xl text-stone-100">{place.rating}</span>
              </div>
              <div className="text-stone-500 text-sm">{place.reviewCount} yorum</div>
            </div>
          )}
          {place.entryFee !== undefined && (
            <div className="card p-4">
              <div className="text-stone-500 text-xs mb-1">Giriş Ücreti</div>
              <div className="font-semibold text-stone-100">
                {place.entryFee === 0 ? '🆓 Ücretsiz' : `₺${place.entryFee}`}
              </div>
            </div>
          )}
          {place.openingHours && (
            <div className="card p-4">
              <div className="flex items-center gap-1.5 text-stone-500 text-xs mb-1"><Clock size={12} /> Çalışma Saatleri</div>
              <div className="text-stone-300 text-sm">{place.openingHours}</div>
            </div>
          )}
          {place.website && (
            <a href={place.website} target="_blank" rel="noopener noreferrer" className="card p-3 flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors text-sm">
              <Globe size={14} /> Web Sitesi
            </a>
          )}
          <Link to={`/map?city=${place.city}`} className="card p-3 flex items-center gap-2 text-stone-400 hover:text-stone-200 transition-colors text-sm">
            <MapPin size={14} /> Haritada Göster
          </Link>
        </div>
      </div>

      {/* Reviews */}
      <section>
        <h2 className="font-display text-2xl font-bold text-stone-100 mb-6">Yorumlar</h2>

        {user ? (
          <form onSubmit={handleReviewSubmit} className="card p-5 mb-6">
            <h3 className="font-medium text-stone-200 mb-4">Yorum Yaz</h3>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-stone-500 text-sm">Puanın:</span>
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: n }))}
                  className={`text-2xl transition-transform hover:scale-110 ${n <= reviewForm.rating ? 'text-amber-400' : 'text-stone-700'}`}>★</button>
              ))}
            </div>
            <textarea
              className="input resize-none mb-3"
              rows={3}
              placeholder="Deneyimini paylaş..."
              value={reviewForm.comment}
              onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
            />
            <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? 'Gönderiliyor...' : 'Yorum Gönder'}
            </button>
          </form>
        ) : (
          <div className="card p-5 mb-6 text-center text-stone-500">
            <Link to="/login" className="text-amber-400 hover:underline">Giriş yapın</Link> veya <Link to="/register" className="text-amber-400 hover:underline">kayıt olun</Link> — yorum yazmak için.
          </div>
        )}

        {reviews.length === 0 ? (
          <div className="text-center text-stone-600 py-8">Henüz yorum yok. İlk yorumu sen yaz!</div>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review._id} className="card p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-stone-950 font-bold text-sm">
                      {review.user?.username?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-stone-200 text-sm">{review.user?.username}</div>
                      <div className="flex">
                        {[1,2,3,4,5].map(n => (
                          <span key={n} className={`text-sm ${n <= review.rating ? 'text-amber-400' : 'text-stone-700'}`}>★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {(user?._id === review.user?._id || user?.role === 'admin') && (
                    <button onClick={() => handleDeleteReview(review._id)} className="text-stone-600 hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <p className="text-stone-400 text-sm leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Panorama Modal */}
      {panoramaOpen && (
        <PanoramaModal
          place={place}
          onClose={() => setPanoramaOpen(false)}
        />
      )}
    </div>
  )
}
