import React from 'react';

export default function Suggestion({ product, isSelected, onClick }) {
  return (
    <div
      className={`cursor-pointer border rounded-lg p-2 transition-all duration-200 ${
        isSelected ? 'border-blue-600 ring-2 ring-blue-400' : 'border-gray-300'
      } hover:shadow-md bg-white dark:bg-zinc-800`}
      onClick={() => onClick(product._id)}
      role="button"
      aria-pressed={isSelected}
      aria-label={`Select ${product.title} for comparison`}
    >
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-36 object-contain mb-2 rounded-md"
      />
      <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
        {product.title}
      </p>
      <p className="text-gray-600 dark:text-gray-300 text-sm">₹{product.price}</p>
    </div>
  );
}
