// src/components/WishlistItem.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi';

export default function WishlistItem({ item, onRemove, onToggleWatch }) {
  const navigate = useNavigate();
  const { _id, watched, targetPrice, amazonProduct, flipkartProduct } = item;
  const product = amazonProduct || flipkartProduct;

  if (!product) return null;

  const handleCardClick = () => {
    navigate(`/product/${product._id}`, { state: { product } });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`View product details for ${product.title}`}
      className="flex items-center border border-slate-200 rounded-2xl p-4 mb-4 bg-white hover:shadow-sm transition-shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transform hover:scale-[1.01] duration-200"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
    >
      <img
        src={product.image}
        alt={`Image of ${product.title}`}
        className="w-16 h-16 object-contain rounded-lg mr-4 bg-slate-50"
      />

      <div className="flex-1">
        <h4 className="text-base font-semibold text-slate-800 line-clamp-2">
          {product.title}
        </h4>
        <div className="mt-1 text-sm text-slate-600">
          <span className="sr-only">Current Price:</span>
          Current Price:{' '}
          <span className="font-mono text-emerald-600">
            ₹{product.price ?? '—'}
          </span>
        </div>
        <div className="text-sm text-slate-600">
          <span className="sr-only">Target Price:</span>
          Target Price:{' '}
          <span className="font-mono text-sky-600">
            ₹{targetPrice ? `${targetPrice}` : '—'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 ml-4">
        {/* <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWatch(_id);
          }}
          className="p-2 rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400"
          aria-label={watched ? 'Unwatch product' : 'Watch product'}
        >
          {watched ? (
            <FiEye className="w-5 h-5 text-green-600" />
          ) : (
            <FiEyeOff className="w-5 h-5 text-slate-400" />
          )}
        </button> */}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(_id);
          }}
          className="p-2 rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-red-400"
          aria-label={`Remove ${product.title} from wishlist`}
        >
          <FiTrash2 className="w-5 h-5 text-red-500" />
        </button>
      </div>
    </div>
  );
}
