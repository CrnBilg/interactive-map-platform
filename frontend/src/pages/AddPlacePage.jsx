import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { placesAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { MapPin } from 'lucide-react'

const categories = ['historical', 'museum', 'mosque', 'castle', 'ruins', 'monument', 'cultural', 'other']
const categoryLabels = { historical: 'Tarihi', museum: 'Müze', mosque: 'Cami', castle: 'Kale', ruins: 'Harabe', monument: 'Anıt', cultural: 'Kültürel', other: 'Diğer' }

export default function AddPlacePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', description: '', category: 'historical', city: '',
    lat: '', lng: '', address: '', period: '', entryFee: 0,
    openingHours: '', website: '', images: '',
    panoramaUrl: '', panoramaxImageId: '', streetViewUrl: '',
  })
  const [loading, setLoading] = useState(false)

  if (!user) { navigate('/login'); return null }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.lat || !form.lng) { toast.error('Koordinat girilmeli'); return }
    setLoading(true)
    try {
      const payload = {
        ...form,
        images: form.images ? form.images.split('\n').map(url => url.trim()).filter(Boolean) : [],
        panoramaUrl: form.panoramaUrl.trim(),
        panoramaxImageId: form.panoramaxImageId.trim(),
        streetViewUrl: form.streetViewUrl.trim(),
      }
      const { data } = await placesAPI.create(payload)
      toast.success('Mekan eklendi!')
      navigate(`/place/${data._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <h1 className="font-display text-3xl font-bold text-stone-100 mb-2">Yeni Mekan Ekle</h1>
      <p className="text-stone-500 mb-8">Türkiye'nin tarihi zenginliklerine katkıda bulun</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="card p-5 space-y-4">
          <h3 className="font-semibold text-stone-200">Temel Bilgiler</h3>
          <div>
            <label className="block text-stone-400 text-sm mb-1.5">Mekan Adı *</label>
            <input className="input" placeholder="Ayasofya" value={form.name} onChange={e => set('name', e.target.value)} required />
          </div>
          <div>
            <label className="block text-stone-400 text-sm mb-1.5">Açıklama *</label>
            <textarea className="input resize-none" rows={4} placeholder="Mekan hakkında detaylı bilgi..." value={form.description} onChange={e => set('description', e.target.value)} required minLength={20} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-400 text-sm mb-1.5">Kategori *</label>
              <select className="input" value={form.category} onChange={e => set('category', e.target.value)}>
                {categories.map(c => <option key={c} value={c}>{categoryLabels[c]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-stone-400 text-sm mb-1.5">Dönem</label>
              <input className="input" placeholder="Ottoman, Byzantine, Roman..." value={form.period} onChange={e => set('period', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="card p-5 space-y-4">
          <h3 className="font-semibold text-stone-200">Konum</h3>
          <div>
            <label className="block text-stone-400 text-sm mb-1.5">Şehir *</label>
            <input className="input" placeholder="İstanbul" value={form.city} onChange={e => set('city', e.target.value)} required />
          </div>
          <div>
            <label className="block text-stone-400 text-sm mb-1.5">Adres</label>
            <input className="input" placeholder="Sultanahmet, Fatih/İstanbul" value={form.address} onChange={e => set('address', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-400 text-sm mb-1.5">Enlem (Lat) *</label>
              <input className="input" placeholder="41.0086" type="number" step="any" value={form.lat} onChange={e => set('lat', e.target.value)} required />
            </div>
            <div>
              <label className="block text-stone-400 text-sm mb-1.5">Boylam (Lng) *</label>
              <input className="input" placeholder="28.9800" type="number" step="any" value={form.lng} onChange={e => set('lng', e.target.value)} required />
            </div>
          </div>
          <p className="text-stone-600 text-xs flex items-center gap-1">
            <MapPin size={11} /> OpenStreetMap veya başka bir harita uygulamasında mekanı açıp koordinatları kopyalayabilirsiniz.
          </p>
        </div>

        <div className="card p-5 space-y-4">
          <h3 className="font-semibold text-stone-200">Detaylar</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-400 text-sm mb-1.5">Giriş Ücreti (₺)</label>
              <input className="input" type="number" min={0} placeholder="0 = Ücretsiz" value={form.entryFee} onChange={e => set('entryFee', e.target.value)} />
            </div>
            <div>
              <label className="block text-stone-400 text-sm mb-1.5">Çalışma Saatleri</label>
              <input className="input" placeholder="09:00 - 18:00" value={form.openingHours} onChange={e => set('openingHours', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-stone-400 text-sm mb-1.5">Web Sitesi</label>
            <input className="input" type="url" placeholder="https://..." value={form.website} onChange={e => set('website', e.target.value)} />
          </div>
          <div>
            <label className="block text-stone-400 text-sm mb-1.5">Fotoğraf URL'leri (her satıra bir tane)</label>
            <textarea className="input resize-none font-mono text-xs" rows={3} placeholder="https://upload.wikimedia.org/..." value={form.images} onChange={e => set('images', e.target.value)} />
          </div>
        </div>

        <div className="card p-5 space-y-4">
          <h3 className="font-semibold text-stone-200">360 / Street-Level View</h3>
          <p className="text-stone-500 text-xs leading-relaxed">
            Optional. Google Maps Embed Street View is used automatically when the frontend has a Google Embed API key. Panoramax or a hosted 360 URL can be added as a fallback.
          </p>
          <div>
            <label className="block text-stone-400 text-sm mb-1.5">Panoramax Image ID</label>
            <input className="input font-mono text-xs" placeholder="panoramax-picture-id" value={form.panoramaxImageId} onChange={e => set('panoramaxImageId', e.target.value)} />
          </div>
          <div>
            <label className="block text-stone-400 text-sm mb-1.5">Panorama URL</label>
            <input className="input" type="url" placeholder="https://example.com/panorama.jpg" value={form.panoramaUrl} onChange={e => set('panoramaUrl', e.target.value)} />
          </div>
          <div>
            <label className="block text-stone-400 text-sm mb-1.5">Street-level viewer URL</label>
            <input className="input" type="url" placeholder="https://..." value={form.streetViewUrl} onChange={e => set('streetViewUrl', e.target.value)} />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base disabled:opacity-50">
          {loading ? 'Ekleniyor...' : '🏛️ Mekanı Ekle'}
        </button>
      </form>
    </div>
  )
}
