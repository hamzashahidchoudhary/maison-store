import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import Navbar from '@/components/layout/Navbar'
import CartDrawer from '@/components/cart/CartDrawer'
import HomePage from '@/pages/HomePage'
import ShopPage from '@/pages/ShopPage'
import CollectionsPage from '@/pages/CollectionsPage'
import AboutPage from '@/pages/AboutPage'
import ProductPage from '@/pages/ProductPage'
import AuthPage from '@/pages/AuthPage'
import CheckoutPage from '@/pages/CheckoutPage'
import OrdersPage from '@/pages/OrdersPage'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Navbar />
        <CartDrawer />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Routes>
        </main>
      </CartProvider>
    </AuthProvider>
  )
}
