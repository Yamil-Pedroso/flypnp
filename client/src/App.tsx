import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./providers/UserProvider";
import { PlacesProvider } from "./providers/PlacesProvider";
import { NotificationsProvider } from "./providers/NotificationsProvider";
import { WishlistProvider } from "./providers/WishlistProvider";
import { BookingProvider } from "./providers/BookingProvider";
import { PaymentProvider } from "./providers/PaymentProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sonner";
import "./index.css";

import WithNavbarLayout from "./layouts/WithNavbarLayout";
import WithoutNavbarLayout from "./layouts/WithoutNavbarLayout";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import PlaceDetailsPage from "./pages/PlaceDetailsPage";
import BookingPage from "./pages/BookingPage";
import NotificationsPage from "./pages/NotificationsPage";
import PaymentPage from "./pages/PaymentPage";
import SucceededPaymentPage from "./pages/SucceededPaymentPage";
import TripsPage from "./pages/TripsPage";
import WishListPage from "./pages/WishListPage";
import { SearchProvider } from "./components/search/SearchContext";
import WelcomeModal from "./components/welcome/WelcomeModal";
import ExperienceProvider from "./providers/ExperienceProvider";
import ExperiencesPage from "./pages/ExperiencesPage";
import ExperienceDetailsPage from "./pages/ExperienceDetailsPage";
import ServicesPage from "./pages/ServicesPage";
import AdminServicesPage from "./pages/AdminServicesPage";
import HostPage from "./pages/HostPage";
import PlacesFormPage from "./pages/PlacesFormPage";
import MessagesPage from "./pages/MessagesPage";
import GiftCardsPage from "./pages/GiftCardsPage";
import MessagesProvider from "./providers/MessagesProvider";

//interface AppProps {
//  children: React.ReactNode
//}

//const Layout = ({ children }: AppProps) => {
//   <div>
//     {children}
//   </div>
//}

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Toaster position="bottom-right" richColors />
      <UserProvider>
        <MessagesProvider>
        <WelcomeModal />
        <PlacesProvider>
          <ExperienceProvider>
          <NotificationsProvider>
            <WishlistProvider>
              <BookingProvider>
                <PaymentProvider>
                  <Router>
                    <SearchProvider>
                    <Routes>
                      {/* Rutas con Navbar */}
                      <Route
                        element={<WithNavbarLayout />}
                      >
                        <Route path="/" element={<HomePage />} />
                        <Route path="/experiences" element={<ExperiencesPage />} />
                        <Route path="/experiences/:slug" element={<ExperienceDetailsPage />} />
                        <Route path="/services" element={<ServicesPage />} />
                        <Route path="/admin/services" element={<AdminServicesPage />} />
                        <Route path="/host" element={<HostPage />} />
                        <Route path="/host/listings/new" element={<PlacesFormPage />} />
                        <Route path="/host/listings/:id/edit" element={<PlacesFormPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route
                          path="/notifications"
                          element={<NotificationsPage />}
                        />
                        <Route
                          path="/place/:category/:id"
                          element={<PlaceDetailsPage />}
                        />
                        <Route path="/bookings" element={<BookingPage />} />
                        <Route path="/trips" element={<TripsPage />} />
                        <Route path="/messages" element={<MessagesPage />} />
                        <Route path="/gift-cards" element={<GiftCardsPage />} />
                        <Route path="/wishlist" element={<WishListPage />} />
                        <Route path="/my-payment" element={<PaymentPage />} />
                      </Route>

                      {/* Rutas sin Navbar */}
                      <Route element={<WithoutNavbarLayout />}>
                        <Route
                          path="/succeeded-payment"
                          element={<SucceededPaymentPage />}
                        />
                      </Route>

                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                    </SearchProvider>
                  </Router>
                </PaymentProvider>
              </BookingProvider>
            </WishlistProvider>
          </NotificationsProvider>
          </ExperienceProvider>
        </PlacesProvider>
        </MessagesProvider>
      </UserProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
