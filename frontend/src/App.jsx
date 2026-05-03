import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import { RouteProvider } from './context/RouteContext'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './i18n/LanguageContext'
import Navbar from './components/Navbar'
import HashScroll from './components/HashScroll'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const HomePage = lazy(() => import('./pages/HomePage'))
const MapPage = lazy(() => import('./pages/MapPage'))
const PlacePage = lazy(() => import('./pages/PlacePage'))
const CityPage = lazy(() => import('./pages/CityPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const SavedPlacesPage = lazy(() => import('./pages/SavedPlacesPage'))
const AddPlacePage = lazy(() => import('./pages/AddPlacePage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const Places = lazy(() => import('./pages/Places'))
const Events = lazy(() => import('./pages/Events'))
const RoutesPage = lazy(() => import('./pages/Routes'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Help = lazy(() => import('./pages/Help'))
const Terms = lazy(() => import('./pages/Terms'))
const Privacy = lazy(() => import('./pages/Privacy'))
const ChatbotWidget = lazy(() => import('./components/ChatbotWidget'))

function PageFallback() {
  return <div className="min-h-[40vh]" />
}

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
                <Suspense fallback={<PageFallback />}>
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
                </Suspense>
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
