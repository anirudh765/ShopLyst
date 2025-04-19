import React from 'react';
import { FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi';

export default function WishlistItem({ item, onRemove, onToggleWatch }) {
  const { _id, watched, targetPrice, amazonProduct, flipkartProduct } = item;
  const product = amazonProduct || flipkartProduct;

  if (!product) return null; // prevent render if product is missing

  return (
    <div className="flex items-center border border-slate-200 rounded-2xl p-4 mb-4 bg-white hover:shadow-sm transition-shadow">
      <img
        src={product.image}
        alt={`Image of ${product.name}`}
        className="w-16 h-16 object-contain rounded-lg mr-4 bg-slate-50"
      />
      
      <div className="flex-1">
        <h4 className="text-base font-semibold text-slate-800 line-clamp-2">{product.name}</h4>
        <div className="mt-1 text-sm text-slate-600">
          Current Price:{' '}
          <span className="font-mono text-emerald-600">
            ${product.currentPrice ?? '—'}
          </span>
        </div>
        <div className="text-sm text-slate-600">
          Target Price:{' '}
          <span className="font-mono text-sky-600">
            {targetPrice ? `$${targetPrice}` : '—'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 ml-4">
        <button
          onClick={() => onToggleWatch(_id)}
          className="p-2 rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400"
          aria-label={watched ? 'Unwatch product' : 'Watch product'}
        >
          {watched ? (
            <FiEye className="w-5 h-5 text-green-600" />
          ) : (
            <FiEyeOff className="w-5 h-5 text-slate-400" />
          )}
        </button>

        <button
          onClick={() => onRemove(_id)}
          className="p-2 rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-red-400"
          aria-label="Remove from wishlist"
        >
          <FiTrash2 className="w-5 h-5 text-red-500" />
        </button>
      </div>
    </div>
  );
}
