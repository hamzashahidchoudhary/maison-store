import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/cart/CartDrawer'
import ScrollToTop from '@/components/ScrollToTop'
import HomePage from '@/pages/HomePage'
import ShopPage from '@/pages/ShopPage'
import CollectionsPage from '@/pages/CollectionsPage'
import AboutPage from '@/pages/AboutPage'
import ProductPage from '@/pages/ProductPage'
import AuthPage from '@/pages/AuthPage'
import CheckoutPage from '@/pages/CheckoutPage'
import OrdersPage from '@/pages/OrdersPage'
import AdminPage from '@/pages/AdminPage'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <ScrollToTop />
          <Navbar />
          <CartDrawer />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/collections" element={<CollectionsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  )
}
