import React from 'react';

export default function PriceComparisonTable({ product }) {
  // Determine the best price to announce to screen readers
  const getBestPrice = () => {
    if (!product.amazonPrice && !product.flipkartPrice) return 'No prices available';
    if (!product.amazonPrice) return `Best price is Flipkart at ₹${product.flipkartPrice}`;
    if (!product.flipkartPrice) return `Best price is Amazon at ₹${product.amazonPrice}`;

    const amazon = parseFloat(product.amazonPrice);
    const flipkart = parseFloat(product.flipkartPrice);

    if (amazon < flipkart) {
      return `Best price is Amazon at ₹${product.amazonPrice}, which is ₹${(flipkart - amazon).toFixed(2)} less than Flipkart`;
    } else if (flipkart < amazon) {
      return `Best price is Flipkart at ₹${product.flipkartPrice}, which is ₹${(amazon - flipkart).toFixed(2)} less than Amazon`;
    } else {
      return `Amazon and Flipkart both offer the same price of ₹${product.amazonPrice}`;
    }
  };

  return (
    <div className="w-full rounded-2xl shadow-md bg-white dark:bg-[#1a1a1a] ring-1 ring-slate-200 dark:ring-zinc-700 overflow-hidden">
      <div 
        role="table" 
        aria-label="Price comparison for product" 
        aria-describedby="price-comparison-summary"
      >
        <div className="sr-only" id="price-comparison-summary">{getBestPrice()}</div>
        
        <div role="rowgroup">
          <div 
            className="grid grid-cols-2 sm:grid-cols-3 text-sm font-medium bg-sky-50 dark:bg-zinc-800 text-slate-800 dark:text-slate-100 border-b border-sky-100 dark:border-zinc-700"
            role="row"
          >
            <div className="px-4 py-3" role="columnheader">Platform</div>
            <div className="px-4 py-3" role="columnheader">Price</div>
            <div className="px-4 py-3 hidden sm:block" role="columnheader">Link</div>
          </div>
        </div>

        <div role="rowgroup">
          {/* Amazon Row */}
          <div 
            className="grid grid-cols-2 sm:grid-cols-3 border-b dark:border-zinc-700 hover:bg-sky-50 dark:hover:bg-zinc-800 transition-colors duration-200"
            role="row"
          >
            <div className="px-4 py-3 flex items-center gap-2" role="cell">
              <img src="/amazon.png" alt="" className="w-5 h-5" />
              <span className="text-slate-800 dark:text-slate-200">Amazon</span>
            </div>
            <div 
              className="px-4 py-3 text-emerald-600 font-semibold"
              role="cell"
              aria-label={`Amazon price: ${product.amazonPrice ? `₹${product.amazonPrice}` : 'not available'}`}
            >
              {product.amazonPrice ? `₹${product.amazonPrice}` : '—'}
            </div>
            <div className="px-4 py-3 hidden sm:block" role="cell">
              {product.amazonUrl ? (
                <a
                  href={product.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-600 dark:text-sky-400 hover:underline"
                  aria-label="View product on Amazon"
                  aria-describedby="external-link-description"
                >
                  View
                </a>
              ) : (
                <span className="text-slate-400 dark:text-slate-500">N/A</span>
              )}
            </div>
          </div>

          {/* Flipkart Row */}
          <div 
            className="grid grid-cols-2 sm:grid-cols-3 hover:bg-sky-50 dark:hover:bg-zinc-800 transition-colors duration-200"
            role="row"
          >
            <div className="px-4 py-3 flex items-center gap-2" role="cell">
              <img src="/flipkart.png" alt="" className="w-5 h-5" />
              <span className="text-slate-800 dark:text-slate-200">Flipkart</span>
            </div>
            <div 
              className="px-4 py-3 text-emerald-600 font-semibold"
              role="cell"
              aria-label={`Flipkart price: ${product.flipkartPrice ? `₹${product.flipkartPrice}` : 'not available'}`}
            >
              {product.flipkartPrice ? `₹${product.flipkartPrice}` : '—'}
            </div>
            <div className="px-4 py-3 hidden sm:block" role="cell">
              {product.flipkartUrl ? (
                <a
                  href={product.flipkartUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-600 dark:text-sky-400 hover:underline"
                  aria-label="View product on Flipkart"
                  aria-describedby="external-link-description"
                >
                  View
                </a>
              ) : (
                <span className="text-slate-400 dark:text-slate-500">N/A</span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Hidden description for external links */}
      <div className="sr-only" id="external-link-description">
        This link opens in a new tab
      </div>
    </div>
  );
}