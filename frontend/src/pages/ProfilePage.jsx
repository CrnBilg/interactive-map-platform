import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'
import { Link, useNavigate } from 'react-router-dom'
import { User, Bookmark, Settings } from 'lucide-react'
import toast from 'react-hot-toast'
import { useLanguage } from '../i18n/LanguageContext'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const { t, translatePlace } = useLanguage()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ username: '', bio: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    authAPI.getMe().then(res => {
      setProfile(res.data)
      setForm({ username: res.data.username, bio: res.data.bio || '' })
    })
  }, [user])

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authAPI.updateProfile(form)
      toast.success(t('profile.updated'))
      setEditing(false)
      const res = await authAPI.getMe()
      setProfile(res.data)
    } catch (err) {
      toast.error(err.response?.data?.message || t('toast.error'))
    } finally {
      setLoading(false)
    }
  }

  if (!profile) return <div className="flex items-center justify-center h-64 text-stone-500">{t('common.loading')}</div>

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="card p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-amber-500 flex items-center justify-center text-stone-950 font-bold text-3xl mx-auto mb-4">
            {profile.username?.[0]?.toUpperCase()}
          </div>
          <h2 className="font-display text-xl font-bold text-stone-100">{profile.username}</h2>
          <p className="text-stone-500 text-sm mt-1">{profile.email}</p>
          {profile.bio && <p className="text-stone-400 text-sm mt-3">{profile.bio}</p>}
          <div className="mt-4 pt-4 border-t border-stone-800 text-xs text-stone-600">
            {profile.role === 'admin' ? `👑 ${t('common.admin')}` : `👤 ${t('common.member')}`}
          </div>
          <button onClick={() => setEditing(!editing)} className="btn-secondary w-full mt-4 text-sm flex items-center justify-center gap-2">
            <Settings size={14} /> {t('common.edit')}
          </button>
          <button onClick={() => { logout(); navigate('/') }} className="w-full mt-2 py-2 text-red-400 hover:text-red-300 text-sm transition-colors">
            {t('profile.logout')}
          </button>
        </div>

        <div className="md:col-span-2 space-y-5">
          {/* Edit form */}
          {editing && (
            <form onSubmit={handleUpdate} className="card p-5 space-y-4">
              <h3 className="font-semibold text-stone-200">{t('profile.editProfile')}</h3>
              <div>
                <label className="block text-stone-400 text-sm mb-1.5">{t('auth.username')}</label>
                <input className="input" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
              </div>
              <div>
                <label className="block text-stone-400 text-sm mb-1.5">{t('profile.bio')}</label>
                <textarea className="input resize-none" rows={3} placeholder={t('profile.bioPlaceholder')} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={loading} className="btn-primary text-sm disabled:opacity-50">
                  {loading ? t('profile.saving') : t('common.save')}
                </button>
                <button type="button" onClick={() => setEditing(false)} className="btn-secondary text-sm">{t('common.cancel')}</button>
              </div>
            </form>
          )}

          {/* Saved places */}
          <div className="card p-5">
            <h3 className="font-semibold text-stone-200 mb-4 flex items-center gap-2">
              <Bookmark size={16} className="text-amber-400" /> {t('profile.savedPlaces')}
            </h3>
            {profile.savedPlaces?.length === 0 ? (
              <div className="text-stone-600 text-sm text-center py-4">
                {t('profile.noSaved')} <Link to="/map" className="text-amber-400 hover:underline">{t('profile.discover')}</Link>
              </div>
            ) : (
              <div className="space-y-2">
                {profile.savedPlaces?.map(place => {
                  const displayPlace = translatePlace(place)
                  return (
                  <Link key={place._id} to={`/place/${place._id}`} className="flex items-center gap-3 p-3 bg-stone-800 rounded-xl hover:bg-stone-700/50 transition-colors">
                    <span className="text-xl">🏛️</span>
                    <div>
                      <div className="font-medium text-stone-200 text-sm">{displayPlace.displayName}</div>
                      <div className="text-stone-500 text-xs">{displayPlace.displayCity}</div>
                    </div>
                  </Link>
                )})}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
