import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Landmark } from 'lucide-react'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const from = location.state?.from || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) { toast.error('Şifre en az 6 karakter olmalı'); return }
    setLoading(true)
    try {
      await register(form.username, form.email, form.password)
      toast.success('Hesabın oluşturuldu!')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Kayıt başarısız')
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
          <h1 className="font-display text-3xl font-bold text-stone-100">Kayıt Ol</h1>
          <p className="text-stone-500 mt-2">Türkiye'yi birlikte keşfedelim</p>
        </div>
        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <div>
            <label className="block text-stone-400 text-sm mb-1.5">Kullanıcı Adı</label>
            <input className="input" placeholder="citylore_user" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} required minLength={3} />
          </div>
          <div>
            <label className="block text-stone-400 text-sm mb-1.5">E-posta</label>
            <input className="input" type="email" placeholder="ornek@mail.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-stone-400 text-sm mb-1.5">Şifre</label>
            <input className="input" type="password" placeholder="En az 6 karakter" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required minLength={6} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? 'Kayıt oluşturuluyor...' : 'Kayıt Ol'}
          </button>
          <p className="text-center text-stone-500 text-sm">
            Hesabın var mı? <Link to="/login" state={{ from }} className="text-amber-400 hover:underline">Giriş yap</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
