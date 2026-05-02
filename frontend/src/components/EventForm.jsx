import { useState } from 'react'
import { eventsAPI } from '../services/api'
import { X, Zap, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import { useLanguage } from '../i18n/LanguageContext'

const eventTypes = [
  { value: 'concert' },
  { value: 'flashmob' },
  { value: 'popup' },
  { value: 'exhibition' },
  { value: 'festival' },
  { value: 'protest' },
  { value: 'other' },
]

export default function EventForm({ selectedCity, onClose, onCreated }) {
  const { t, translateCity } = useLanguage()
  const displayCity = translateCity(selectedCity)
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'concert',
    lat: selectedCity?.location?.coordinates?.[1] || '',
    lng: selectedCity?.location?.coordinates?.[0] || '',
    address: '',
    startTime: new Date().toISOString().slice(0, 16),
  })
  const [loading, setLoading] = useState(false)

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.lat || !form.lng) { toast.error(t('toast.coordinatesEnter')); return }
    setLoading(true)
    try {
      const { data } = await eventsAPI.create({
        ...form,
        city: selectedCity?.name || '',
        cityId: selectedCity?._id || '',
      })
      onCreated(data)
    } catch (err) {
      toast.error(err.response?.data?.message || t('toast.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-stone-900 border border-stone-700 rounded-2xl w-full max-w-md shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between p-5 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <Zap size={16} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="font-semibold text-stone-100">{t('eventForm.title')}</h2>
              {selectedCity && <p className="text-stone-500 text-xs">{displayCity.displayName}</p>}
            </div>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-300 transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-stone-400 text-sm mb-1.5">{t('eventForm.eventName')}</label>
            <input
              className="input"
              placeholder={t('eventForm.eventNamePlaceholder')}
              value={form.title}
              onChange={e => set('title', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-stone-400 text-sm mb-1.5">{t('eventForm.type')}</label>
            <div className="grid grid-cols-2 gap-2">
              {eventTypes.map(({ value }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => set('type', value)}
                  className={`px-3 py-2 rounded-lg text-xs text-left transition-colors border ${
                    form.type === value
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-stone-800 border-stone-700 text-stone-400 hover:border-stone-600'
                  }`}
                >
                  {t(`eventTypes.${value}`)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-stone-400 text-sm mb-1.5">{t('eventForm.description')}</label>
            <textarea
              className="input resize-none"
              rows={2}
              placeholder={t('eventForm.descriptionPlaceholder')}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              required
              minLength={10}
            />
          </div>

          <div>
            <label className="block text-stone-400 text-sm mb-1.5">{t('addPlace.address')}</label>
            <input
              className="input"
              placeholder={t('eventForm.addressPlaceholder')}
              value={form.address}
              onChange={e => set('address', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-400 text-sm mb-1.5">{t('eventForm.latitude')}</label>
              <input
                className="input text-sm"
                placeholder="41.0082"
                type="number"
                step="any"
                value={form.lat}
                onChange={e => set('lat', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-stone-400 text-sm mb-1.5">{t('eventForm.longitude')}</label>
              <input
                className="input text-sm"
                placeholder="28.9784"
                type="number"
                step="any"
                value={form.lng}
                onChange={e => set('lng', e.target.value)}
                required
              />
            </div>
          </div>

          <p className="text-stone-600 text-xs flex items-center gap-1">
            <MapPin size={10} /> {t('eventForm.coordsHint')}
          </p>

          <div>
            <label className="block text-stone-400 text-sm mb-1.5">{t('eventForm.startTime')}</label>
            <input
              className="input"
              type="datetime-local"
              value={form.startTime}
              onChange={e => set('startTime', e.target.value)}
              required
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-2.5 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Zap size={15} />
              {loading ? t('eventForm.reporting') : t('eventForm.reportLive')}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary px-4">
              {t('common.cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
