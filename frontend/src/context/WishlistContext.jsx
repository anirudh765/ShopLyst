// src/contexts/WishlistContext.jsx
import React, { createContext, useEffect, useState, useContext } from 'react';
import socket from '../utils/socket';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} from '../services/wishlistService';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

export default function WishlistProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = async () => {
    try {
      const data = await getWishlist();
      setWishlist(data);
    } catch (err) {
      console.error('Error loading wishlist:', err);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchWishlist();
    socket.connect();
    socket.on('wishlist:update', fetchWishlist);
    return () => {
      socket.off('wishlist:update');
      socket.disconnect();
    };
  }, [user]);

  // product: { _id, source }
  const addItem = async ({ _id, source,price }) => {
    await addToWishlist({
      productId: _id,
      source,
      price,
      watched: false,
      targetPrice: null
    });
    fetchWishlist();
  };

  const removeItem = async (wishlistItemId) => {
    await removeFromWishlist(wishlistItemId);
    fetchWishlist();
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addItem, removeItem }}>
      {children}
    </WishlistContext.Provider>
  );
}