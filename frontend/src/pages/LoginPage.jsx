// LoginPage
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Landmark } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'

export function LoginPage() {
  const { login } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const from = location.state?.from || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success(t('toast.welcome'))
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || t('toast.loginFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Landmark size={24} className="text-stone-950" />
          </div>
          <h1 className="font-display text-3xl font-bold text-stone-100">{t('auth.loginTitle')}</h1>
          <p className="text-stone-500 mt-2">{t('auth.loginWelcome')}</p>
        </div>
        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <div>
            <label className="block text-stone-400 text-sm mb-1.5">{t('common.email')}</label>
            <input className="input" type="email" placeholder="ornek@mail.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-stone-400 text-sm mb-1.5">{t('common.password')}</label>
            <input className="input" type="password" placeholder="••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? t('auth.loggingIn') : t('auth.loginTitle')}
          </button>
          <p className="text-center text-stone-500 text-sm">
            {t('auth.noAccount')} <Link to="/register" state={{ from }} className="text-amber-400 hover:underline">{t('auth.registerLink')}</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
