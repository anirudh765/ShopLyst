// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import productService from '../services/productService';

export default function Home() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [productDeleted, setProductDeleted] = useState(false);

  useEffect(() => {
    fetchProducts('');
  }, [productDeleted]);

  const fetchProducts = async (q) => {
    setLoading(true);
    setError(null);
    try {
      const { results } = await productService.searchProducts(q, 1, 20);
      setProducts(results);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch products');
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
  };

  return (
    <div className="pt-20 px-4 min-h-screen bg-gradient-to-br from-zinc-100 to-gray-200 dark:from-zinc-900 dark:to-black transition-colors duration-300">

      {/* Hero Section */}
      <div className="max-w-2xl mx-auto text-center py-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight bg-gradient-to-r from-black to-gray-800 dark:from-[#feffff] dark:to-[#cccccc] bg-clip-text text-transparent">
          Smart Shopping, Simplified
        </h1>
        <p className="text-gray-600 dark:text-[#cccccc] mb-6 text-base md:text-lg">
          Search and compare prices from your favorite platforms in one place.
        </p>
        <form onSubmit={handleSearch} className="flex items-center justify-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products..."
            className="w-full max-w-md px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-800 dark:text-white shadow-md rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg hover:scale-105 hover:shadow-lg transition-all duration-200"
          >
            Search
          </button>
        </form>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto py-10">
        {loading && (
          <p className="text-center text-gray-500 dark:text-gray-400 animate-pulse">
            Loading products...
          </p>
        )}
        {error && (
          <p className="text-center text-red-500 dark:text-red-400 font-semibold">{error}</p>
        )}
        {!loading && !error && products.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 italic">
            No products matched your search. Try different keywords!
          </p>
        )}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-500 ease-in-out">
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
    </div>
  );
}
