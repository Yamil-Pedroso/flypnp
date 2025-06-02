import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axiosInstance from "./utils/axios";
import { UserProvider } from "./providers/UserProvider";
import { PlacesProvider } from "./providers/PlacesProvider";
import { NotificationsProvider } from "./providers/NotificationsProvider";
import { WishlistProvider } from "./providers/WishlistProvider";
import { BookingProvider } from "./providers/BookingProvider";
import { PaymentProvider } from "./providers/PaymentProvider";
import { getItemsFromLocalStorage } from "./utils";
import { GoogleOAuthProvider } from "@react-oauth/google";
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

//interface AppProps {
//  children: React.ReactNode
//}

//const Layout = ({ children }: AppProps) => {
//   <div>
//     {children}
//   </div>
//}

interface AppProps {
  menuClick: boolean;
}

function App({ menuClick }: AppProps) {
  useEffect(() => {
    const token = getItemsFromLocalStorage("token");
    if (token) {
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    }
  }, []);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <UserProvider>
        <PlacesProvider>
          <NotificationsProvider>
            <WishlistProvider>
              <BookingProvider>
                <PaymentProvider>
                  <Router>
                    <Routes>
                      {/* Rutas con Navbar */}
                      <Route
                        element={<WithNavbarLayout menuClick={menuClick} />}
                      >
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
                        <Route path="/bookings" element={<BookingPage />} />
                        <Route path="/trips" element={<TripsPage />} />
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
                  </Router>
                </PaymentProvider>
              </BookingProvider>
            </WishlistProvider>
          </NotificationsProvider>
        </PlacesProvider>
      </UserProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
