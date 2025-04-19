import React from 'react';

export default function PriceComparisonTable({ product }) {
  return (
    <div
      role="table"
      className="w-full rounded-2xl shadow-md bg-white ring-1 ring-slate-200 overflow-hidden"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 text-sm font-medium bg-sky-50 text-slate-800 border-b border-sky-100">
        <div className="px-4 py-3" role="columnheader">Platform</div>
        <div className="px-4 py-3" role="columnheader">Price</div>
        <div className="px-4 py-3 hidden sm:block" role="columnheader">Link</div>
      </div>

      {/* Amazon Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 border-b hover:bg-sky-50 transition-colors duration-200">
        <div className="px-4 py-3 flex items-center gap-2" role="rowheader">
          <img src="/amazon.png" alt="Amazon logo" className="w-5 h-5" />
          <span>Amazon</span>
        </div>
        <div className="px-4 py-3 text-emerald-600 font-semibold">
          {product.amazonPrice ? `$${product.amazonPrice}` : '—'}
        </div>
        <div className="px-4 py-3 hidden sm:block">
          {product.amazonUrl ? (
            <a
              href={product.amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-600 hover:underline"
            >
              View
            </a>
          ) : (
            <span className="text-slate-400">N/A</span>
          )}
        </div>
      </div>

      {/* Flipkart Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 hover:bg-sky-50 transition-colors duration-200">
        <div className="px-4 py-3 flex items-center gap-2" role="rowheader">
          <img src="/flipkart.png" alt="Flipkart logo" className="w-5 h-5" />
          <span>Flipkart</span>
        </div>
        <div className="px-4 py-3 text-emerald-600 font-semibold">
          {product.flipkartPrice ? `$${product.flipkartPrice}` : '—'}
        </div>
        <div className="px-4 py-3 hidden sm:block">
          {product.flipkartUrl ? (
            <a
              href={product.flipkartUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-600 hover:underline"
            >
              View
            </a>
          ) : (
            <span className="text-slate-400">N/A</span>
          )}
        </div>
      </div>
    </div>
  );
}
