import React, { useState, useEffect, useContext } from 'react';
import WishlistItem from '../components/WishlistItem';
import wishlistService from '../services/wishlistService';
import { AuthContext } from '../context/AuthContext';

export default function Wishlist() {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchWishlist = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await wishlistService.getWishlist({ page: 1, limit: 50 });
        setItems(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load wishlist');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user]);

  const handleRemove = async (id) => {
    try {
      await wishlistService.removeFromWishlist(id);
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Remove failed', err);
    }
  };

  const handleToggleWatch = async (id) => {
    try {
      const updated = await wishlistService.toggleWatchStatus(id);
      setItems((prev) =>
        prev.map((item) => (item._id === id ? updated : item))
      );
    } catch (err) {
      console.error('Toggle watch failed', err);
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 bg-gray-100 dark:bg-zinc-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto text-center py-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-800 dark:text-white animate-fade-in">
          Your Wishlist
        </h1>
      </div>

      {loading && (
        <p className="text-center text-gray-500 dark:text-gray-400 animate-pulse">
          Loading your wishlist...
        </p>
      )}
      {error && (
        <p className="text-center text-red-500 dark:text-red-400">{console.log(error)}</p>
      )}
      {!loading && !error && items.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Your wishlist is empty.
        </p>
      )}
      {!loading && items.length > 0 && (
        <div className="max-w-6xl mx-auto space-y-4 pb-8 animate-fade-in">
          {items.map((item) => (
            <WishlistItem
              key={item._id}
              item={item}
              onRemove={handleRemove}
              onToggleWatch={handleToggleWatch}
            />
          ))}
        </div>
      )}
    </div>
  );
}