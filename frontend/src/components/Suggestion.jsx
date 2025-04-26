import React from 'react';

export default function Suggestion({ product, isSelected, onClick }) {
  return (
    <div
      className={`cursor-pointer border rounded-lg p-2 transition-all duration-300 ${
        isSelected ? 'border-blue-600 ring-2 ring-blue-400' : 'border-gray-300'
      } hover:shadow-lg hover:border-blue-300 transform-gpu bg-white dark:bg-zinc-800 relative`}
      onClick={() => onClick(product._id)}
      role="button"
      aria-pressed={isSelected}
      aria-label={`Select ${product.title} for comparison`}
    >
      <div className="overflow-hidden rounded-md">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-36 object-contain mb-2 rounded-md transition-transform duration-300 hover:scale-105"
        />
      </div>
      <p className="text-sm font-medium text-gray-800 dark:text-white truncate transition-colors duration-200 group-hover:text-blue-600">
        {product.title}
      </p>
      <div className="flex justify-between items-center mt-1">
        <p className="text-gray-600 dark:text-gray-300 text-sm font-medium transition-colors duration-200">
          ₹{product.price}
        </p>
        <span className="opacity-0 hover:opacity-100 transition-opacity duration-200 text-xs text-blue-600 dark:text-blue-400">
          Compare
        </span>
      </div>
    </div>
  );
}