import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { WishlistContext } from '../context/WishlistContext'; 

export default function ProductCard({ product }) {
  const { user } = useContext(AuthContext);
  const { addItem } = useContext(WishlistContext); 
  const isAmazon = product.source === 'amazon';

  const handleAddToWishlist = async () => {
    if (!user) return alert('Please sign in to add to wishlist');

    try {
      await addItem({
        _id: product._id,
        source: isAmazon ? 'amazon' : 'flipkart',
        price: product.price
      });
     console.log(`Added product ${product.name} to wishlist`);  
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  return (
    <div className="border border-slate-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition duration-300 overflow-hidden">
      <img
        src={product.image}
        alt={`Product image for ${product.title}`}
        className="w-full h-64 object-contain p-4 bg-slate-50"
        loading="lazy"
      />

      <div className="p-4 space-y-4">
        <h3 className="text-base font-semibold text-slate-800 leading-snug line-clamp-2">
          {product.title}
        </h3>

        <div className="text-sm space-y-1 text-slate-600">
          <div className="flex justify-between">
            <span className="font-medium">{isAmazon ? 'Amazon' : 'Flipkart'}</span>
            <span className="text-emerald-600 font-semibold">₹{product.price}</span>
          </div>
          <div className="text-xs text-slate-500">
            ⭐ {product.rating} ({product.reviews})
          </div>
        </div>

        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-sm text-sky-600 hover:underline"
        >
          View on {isAmazon ? 'Amazon' : 'Flipkart'}
        </a>

        <button
          onClick={handleAddToWishlist}
          disabled={!user}
          className={`w-full py-2 rounded-lg text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 ${
            user
              ? 'bg-sky-600 text-white hover:bg-sky-700'
              : 'bg-slate-200 text-slate-500 cursor-not-allowed'
          }`}
          aria-disabled={!user}
        >
          {user ? 'Add to Wishlist' : 'Sign in to Wishlist'}
        </button>
      </div>
    </div>
  );
}