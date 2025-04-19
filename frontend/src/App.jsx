import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Wishlist from './pages/Wishlist';
import ProductDetail from './pages/ProductDetail';
import Alerts from './pages/Alerts';  // Import Alerts Page

import AuthProvider from './context/AuthContext';
import WishlistProvider from './context/WishlistContext';
import ThemeProvider from './context/ThemeContext';

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <WishlistProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/alerts" element={<Alerts />} /> {/* Add Alerts route */}
            </Routes>
          </WishlistProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}