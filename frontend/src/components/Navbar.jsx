import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { LogOut, Menu, Plus, Shield, User, X, Sun, Moon, Wifi, WifiOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'
import { useTheme } from '../context/ThemeContext'
import { MapGlyph, MuseumIcon } from './visuals/Ornaments'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { isConnected } = useSocket()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 h-[72px] border-b border-gold/15 bg-gradient-to-b from-bg-black via-bg-black/92 to-bg-black/55 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-[1500px] items-center justify-between px-4 sm:px-8 lg:px-16">
        <Link to="/" className="flex items-center gap-3 text-gold-bright">
          <MuseumIcon className="h-7 w-7 text-gold" />
          <span className="font-display text-[22px] font-bold">CityLore</span>
        </Link>

        <div className="absolute left-1/2 hidden -translate-x-1/2 md:block">
          <Link
            to="/map"
            className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition ${
              isActive('/map')
                ? 'border-gold bg-gold-deep/55 text-gold-bright'
                : 'border-gold/50 bg-gold-deep/40 text-gold-bright hover:border-gold'
            }`}
          >
            <MapGlyph className="h-4 w-4" />
            Harita
          </Link>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={toggleTheme}
            className="rounded-lg border border-gold/25 p-2 text-gold-bright transition hover:border-gold/60"
            title={theme === 'dark' ? 'Açık Tema' : 'Koyu Tema'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <div className="inline-flex items-center gap-2 rounded-full bg-gold/8 px-3 py-2 text-xs font-semibold text-gold/80">
            {isConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
            {isConnected ? 'Canlı' : 'Bağlantı yok'}
          </div>

          {user && (
            <>
              <Link to="/add-place" className="rounded-lg border border-gold/25 px-3 py-2 text-sm text-gold-bright/80 transition hover:border-gold/60">
                <Plus size={15} />
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="rounded-lg border border-gold/25 px-3 py-2 text-sm text-gold-bright/80 transition hover:border-gold/60">
                  <Shield size={15} />
                </Link>
              )}
            </>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/profile" className="inline-flex items-center gap-2 rounded-full border border-gold/35 bg-bg-black/80 px-3 py-2 text-sm text-gold-bright">
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gold/45 text-xs font-bold">
                  {user.username?.[0]?.toUpperCase()}
                </span>
                <span className="max-w-[90px] truncate">{user.username}</span>
              </Link>
              <button onClick={handleLogout} className="rounded-lg border border-gold/20 p-2 text-gold/70 transition hover:text-ember">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="rounded-lg border border-gold/45 bg-bg-black/40 px-5 py-2 text-sm font-semibold text-gold-bright transition hover:border-gold">
                Giriş
              </Link>
              <Link to="/register" className="rounded-lg bg-ember px-5 py-2 text-sm font-semibold text-gold-bright transition">
                Kayıt
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden rounded-lg border border-gold/25 p-2 text-gold-bright" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gold/15 bg-bg-black px-4 py-3">
          <Link to="/map" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-gold-bright hover:bg-gold/10">
            <MapGlyph className="h-4 w-4" /> Harita
          </Link>
          {user && <Link to="/add-place" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-gold-bright hover:bg-gold/10"><Plus size={16} /> Yer Ekle</Link>}
          {user?.role === 'admin' && <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-gold-bright hover:bg-gold/10"><Shield size={16} /> Admin</Link>}
          {user ? (
            <>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-gold-bright hover:bg-gold/10"><User size={16} /> Profil</Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-ember hover:bg-gold/10"><LogOut size={16} /> Çıkış</button>
            </>
          ) : (
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-secondary text-center text-sm">Giriş</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary text-center text-sm">Kayıt</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}