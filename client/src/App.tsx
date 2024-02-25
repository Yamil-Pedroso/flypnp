import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import axiosInstance from './utils/axios'
import { UserProvider } from './providers/UserProvider'
import { PlacesProvider } from './providers/PlacesProvider'
import { NotificationsProvider } from './providers/NotificationsProvider'
import { WishlistProvider } from './providers/WishlistProvider'
import { getItemsFromLocalStorage } from './utils'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'

import Navbar from './components/navbar/Navbar'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import ProfilePage from './pages/ProfilePage'
import PlaceDetailsPage from './pages/PlaceDetailsPage'
import NotificationsPage from './pages/NotificationsPage'
import TripsPage from './pages/TripsPage'
import WishListPage from './pages/WishListPage'

//interface AppProps {
//  children: React.ReactNode
//}

//const Layout = ({ children }: AppProps) => {
//   <div>
//     {children}
//   </div>
//}

interface AppProps {
  menuClick: boolean
}

function App({ menuClick }: AppProps) {
  useEffect(() => {
    const token = getItemsFromLocalStorage('token')
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
  }, [])

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <UserProvider>
        <PlacesProvider>
          <NotificationsProvider>
            <WishlistProvider>
              <Navbar menuClick={menuClick} />
              <Router>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route
                    path="/notifications"
                    element={<NotificationsPage />}
                  />
                  <Route
                    path="/place/:category/:id"
                    element={<PlaceDetailsPage />}
                  />
                  <Route path="/trips" element={<TripsPage />} />
                  <Route path="/wishlist" element={<WishListPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Router>
            </WishlistProvider>
          </NotificationsProvider>
        </PlacesProvider>
      </UserProvider>
    </GoogleOAuthProvider>
  )
}

export default App
