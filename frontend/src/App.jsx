import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import { RouteProvider } from './context/RouteContext'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './i18n/LanguageContext'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage'
import MapPage from './pages/MapPage'
import PlacePage from './pages/PlacePage'
import CityPage from './pages/CityPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import SavedPlacesPage from './pages/SavedPlacesPage'
import AddPlacePage from './pages/AddPlacePage'
import AdminPage from './pages/AdminPage'
import Places from './pages/Places'
import Events from './pages/Events'
import RoutesPage from './pages/Routes'
import About from './pages/About'
import Contact from './pages/Contact'
import Help from './pages/Help'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import ChatbotWidget from './components/ChatbotWidget'
import HashScroll from './components/HashScroll'

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <RouteProvider>
              <div className="min-h-screen bg-bg-deepest text-parchment font-body transition-colors duration-300">
                <HashScroll />
                <Navbar />
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/explore" element={<HomePage />} />
                  <Route path="/map" element={<MapPage />} />
                  <Route path="/places" element={<Places />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/routes" element={<RoutesPage />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/help" element={<Help />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/place/:id" element={<PlacePage />} />
                  <Route path="/city/:id" element={<CityPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/saved-places" element={<SavedPlacesPage />} />
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
      </ThemeProvider>
    </LanguageProvider>
  )
}
