import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import { RouteProvider } from './context/RouteContext'
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
import ChatbotWidget from './components/ChatbotWidget'

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <RouteProvider>
          <div className="min-h-screen bg-bg-deepest text-parchment font-body">
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
            <ChatbotWidget />
          </div>
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: 'border border-gold/25 bg-panel text-parchment',
            }}
          />
        </RouteProvider>
      </SocketProvider>
    </AuthProvider>
  )
}
