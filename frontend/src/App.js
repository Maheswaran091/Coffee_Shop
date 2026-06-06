import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Booking from './pages/Booking';
import Bookings from './pages/Bookings';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Offers from './pages/Offers';
import Contact from './pages/Contact';
import './styles/global.css';

const PrivateRoute = ({ children }) => {
  const { isAuth, loading } = useAuth();
  if (loading) return <div className="spinner" />;
  return isAuth ? children : <Navigate to="/login" />;
};

const PublicOnlyRoute = ({ children }) => {
  const { isAuth } = useAuth();
  return isAuth ? <Navigate to="/" /> : children;
};

function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ minHeight:'calc(100vh - 64px)' }}>
        <Routes>
          <Route path="/"        element={<Home />} />
          <Route path="/menu"    element={<Menu />} />
          <Route path="/cart"    element={<Cart />} />
          <Route path="/offers"  element={<Offers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/login"    element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
          <Route path="/orders"   element={<PrivateRoute><Orders /></PrivateRoute>} />
          <Route path="/bookings" element={<PrivateRoute><Bookings /></PrivateRoute>} />
          <Route path="/profile"  element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="*"         element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--card-bg)',
            color: 'var(--text)',
            fontFamily: 'DM Sans, sans-serif',
            borderRadius: 12,
            padding: '14px 18px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)',
          },
          success: { iconTheme: { primary:'#d4762a', secondary:'#fff' } },
        }}
      />
    </BrowserRouter>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

