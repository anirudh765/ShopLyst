import React, { useState, useEffect, useRef } from 'react';
import ProductCard from '../components/ProductCard';
import productService from '../services/productService';

export default function Home() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [productDeleted, setProductDeleted] = useState(false);
  // State for screen reader announcements
  const [announcement, setAnnouncement] = useState('');
  // Ref for focusing after search
  const searchResultsRef = useRef(null);

  useEffect(() => {
    fetchProducts('');
  }, [productDeleted]);

  // Clear announcements after they've been read
  useEffect(() => {
    if (announcement) {
      const timer = setTimeout(() => {
        setAnnouncement('');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [announcement]);

  const fetchProducts = async (q) => {
    setLoading(true);
    setError(null);
    try {
      const { results } = await productService.searchProducts(q, 1, 20);
      setProducts(results);
      if (q) {
        setAnnouncement(`Found ${results.length} products matching "${q}"`);
      } else {
        setAnnouncement(`Loaded ${results.length} products`);
      }
      // Focus on search results after loading
      if (searchResultsRef.current) {
        setTimeout(() => {
          searchResultsRef.current.focus();
        }, 500);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch products';
      setError(errorMessage);
      setAnnouncement(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    fetchProducts(query.trim());
  };

  const handleProductDeleted = () => {
    setProductDeleted(prev => !prev);
    setAnnouncement('Product deleted, refreshing list');
  };

  return (
    <div className="pt-20 px-4 min-h-screen bg-gradient-to-br from-zinc-100 to-gray-200 dark:from-zinc-900 dark:to-black transition-colors duration-300">
      {/* Screen reader announcement */}
      <div 
        aria-live="assertive" 
        className="sr-only" 
        role="status"
      >
        {announcement}
      </div>

      {/* Hero Section */}
      <div className="max-w-2xl mx-auto text-center py-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight bg-gradient-to-r from-black to-gray-800 dark:from-[#feffff] dark:to-[#cccccc] bg-clip-text text-transparent">
          Smart Shopping, Simplified
        </h1>
        <p className="text-gray-600 dark:text-[#cccccc] mb-6 text-base md:text-lg">
          Search and compare prices from your favorite platforms in one place.
        </p>
        <form onSubmit={handleSearch} className="flex items-center justify-center gap-2" role="search">
          <label htmlFor="product-search" className="sr-only">Search for products</label>
          <input
            type="text"
            id="product-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products..."
            className="w-full max-w-md px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-800 dark:text-white shadow-md rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
            aria-label="Search for products"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg hover:scale-105 hover:shadow-lg transition-all duration-200"
            aria-label="Search"
          >
            Search
          </button>
        </form>
      </div>

      {/* Results */}
      <div 
        className="max-w-6xl mx-auto py-10" 
        ref={searchResultsRef} 
        tabIndex="-1" 
        aria-label="Search Results" 
        role="region"
      >
        {loading && (
          <p className="text-center text-gray-500 dark:text-gray-400 animate-pulse" role="status">
            Loading products...
          </p>
        )}
        {error && (
          <p className="text-center text-red-500 dark:text-red-400 font-semibold" role="alert">{error}</p>
        )}
        {!loading && !error && products.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 italic" role="status">
            No products matched your search. Try different keywords!
          </p>
        )}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-500 ease-in-out" role="feed" aria-busy={loading} aria-label={`${products.length} products found`}>
            {products.map((product, index) => (
              <div
                key={product._id || product.id || index}
                className="opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
              >
                <ProductCard product={product} onDelete={handleProductDeleted}/>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Skip to main content link - placed at the beginning of page but only visible on focus */}
      <a 
        href="#product-search" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-black focus:p-2 focus:rounded"
      >
        Skip to search
      </a>
    </div>
  );
}