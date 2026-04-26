import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'
import { Map, Landmark, Plus, User, LogOut, Shield, Wifi, WifiOff, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { isConnected } = useSocket()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }
  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 bg-stone-950/90 backdrop-blur-md border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <Landmark size={16} className="text-stone-950" />
            </div>
            <span className="font-display text-xl font-bold text-stone-100">CityLore</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/map" className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/map') ? 'bg-stone-800 text-amber-400' : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/50'}`}>
              <Map size={15} /> Harita
            </Link>
            {user && (
              <Link to="/add-place" className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/add-place') ? 'bg-stone-800 text-amber-400' : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/50'}`}>
                <Plus size={15} /> Yer Ekle
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin" className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${isActive('/admin') ? 'bg-stone-800 text-amber-400' : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/50'}`}>
                <Shield size={15} /> Admin
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Live indicator */}
            <div className={`flex items-center gap-1.5 text-xs ${isConnected ? 'text-emerald-400' : 'text-stone-600'}`}>
              {isConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
              <span>{isConnected ? 'Canlı' : 'Bağlantı yok'}</span>
            </div>

            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 transition-colors text-sm">
                  <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-stone-950 font-bold text-xs">
                    {user.username?.[0]?.toUpperCase()}
                  </div>
                  <span>{user.username}</span>
                </Link>
                <button onClick={handleLogout} className="p-2 rounded-lg text-stone-500 hover:text-red-400 hover:bg-stone-800 transition-colors">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm py-1.5 px-4">Giriş</Link>
                <Link to="/register" className="btn-primary text-sm py-1.5 px-4">Kayıt</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 text-stone-400" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-stone-800 bg-stone-950 px-4 py-3 space-y-1">
          <Link to="/map" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-stone-300 hover:bg-stone-800"><Map size={16} /> Harita</Link>
          {user && <Link to="/add-place" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-stone-300 hover:bg-stone-800"><Plus size={16} /> Yer Ekle</Link>}
          {user?.role === 'admin' && <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-stone-300 hover:bg-stone-800"><Shield size={16} /> Admin</Link>}
          {user ? (
            <>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-stone-300 hover:bg-stone-800"><User size={16} /> Profil</Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-red-400 hover:bg-stone-800 w-full"><LogOut size={16} /> Çıkış</button>
            </>
          ) : (
            <div className="flex gap-2 pt-1">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-secondary flex-1 text-center text-sm">Giriş</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary flex-1 text-center text-sm">Kayıt</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
