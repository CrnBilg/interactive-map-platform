import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage'
import MapPage from './pages/MapPage'
import PlacePage from './pages/PlacePage'
import CityPage from './pages/CityPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import AddPlacePage from './pages/AddPlacePage'
import AdminPage from './pages/AdminPage'

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <div className="min-h-screen bg-stone-950 text-stone-100 font-body">
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/explore" element={<HomePage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/place/:id" element={<PlacePage />} />
            <Route path="/city/:id" element={<CityPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/add-place" element={<AddPlacePage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </div>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: { background: '#1c1917', color: '#e7e5e4', border: '1px solid #44403c' },
          }}
        />
      </SocketProvider>
    </AuthProvider>
  )
}
