import React, { useState, useEffect, useContext } from 'react';
import WishlistItem from '../components/WishlistItem';
import wishlistService from '../services/wishlistService';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Wishlist() {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchWishlist = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await wishlistService.getWishlist({ page: 1, limit: 50 });
        setItems(data);
        if (data.length === 0) {
          setAnnouncement('Your wishlist is empty.');
        } else {
          setAnnouncement(`Successfully loaded your wishlist with ${data.length} items.`);
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load wishlist';
        setError(errorMessage);
        setAnnouncement(`Error: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user]);

  const handleRemove = async (id) => {
    try {
      if (!window.confirm('Are you sure you want to remove this item from your wishlist?')) return;
      await wishlistService.removeFromWishlist(id);
      const removedItem = items.find(item => item._id === id);
      toast.info(`Removed ${removedItem?.title || 'item'} from wishlist`);
      setItems((prev) => prev.filter((item) => item._id !== id));
      setAnnouncement(`${removedItem?.title || 'Item'} removed from wishlist`);
    } catch (err) {
      console.error('Remove failed', err);
      setAnnouncement('Failed to remove item from wishlist');
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 bg-gray-100 dark:bg-zinc-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto text-center py-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-800 dark:text-white animate-fade-in">
          Your Wishlist
        </h1>
      </div>

      {/* Live region for screen reader announcements */}
      <div 
        className="sr-only" 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
      >
        {announcement}
      </div>

      {loading && (
        <p 
          className="text-center text-gray-500 dark:text-gray-400 animate-pulse"
          aria-live="polite"
        >
          Loading your wishlist...
        </p>
      )}
      
      {error && (
        <div 
          className="max-w-6xl mx-auto p-4 mb-4 text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/30 rounded-lg"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}
      
      {!loading && !error && items.length === 0 && (
        <p 
          className="text-center text-gray-500 dark:text-gray-400"
          aria-live="polite"
        >
          Your wishlist is empty.
        </p>
      )}
      
      {!loading && items.length > 0 && (
        <div 
          className="max-w-6xl mx-auto space-y-4 pb-8 animate-fade-in"
          role="list"
          aria-label="Wishlist items"
        >
          {items.map((item) => (
            <WishlistItem
              key={item._id}
              item={item}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}