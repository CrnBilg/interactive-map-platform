// LoginPage
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Landmark } from 'lucide-react'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Hoş geldin!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Giriş başarısız')
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
          <h1 className="font-display text-3xl font-bold text-stone-100">Giriş Yap</h1>
          <p className="text-stone-500 mt-2">CityLore'a hoş geldiniz</p>
        </div>
        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <div>
            <label className="block text-stone-400 text-sm mb-1.5">E-posta</label>
            <input className="input" type="email" placeholder="ornek@mail.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-stone-400 text-sm mb-1.5">Şifre</label>
            <input className="input" type="password" placeholder="••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
          <p className="text-center text-stone-500 text-sm">
            Hesabın yok mu? <Link to="/register" className="text-amber-400 hover:underline">Kayıt ol</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
