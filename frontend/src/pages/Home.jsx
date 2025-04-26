import React, { useState, useEffect, useRef } from 'react'
import ProductCard from '../components/ProductCard'
import productService from '../services/productService'

export default function Home() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [announcement, setAnnouncement] = useState('')
  const searchResultsRef = useRef(null)

  const CATEGORIES = [
    'phones',
    'pcs',
    'headphones',
    'keyboards',
    'smartwatches'
  ]

  useEffect(() => {
    fetchProducts('', category)
  }, [category])

  useEffect(() => {
    if (!announcement) return
    const t = setTimeout(() => setAnnouncement(''), 1000)
    return () => clearTimeout(t)
  }, [announcement])

  const fetchProducts = async (q, cat) => {
    setLoading(true)
    setError(null)
    try {
      const { results } = await productService.searchProducts(q, 1, 20, cat)
      setProducts(results)

      if (cat) {
        setAnnouncement(`Loaded ${results.length} products in "${cat}"`)
      } else if (q) {
        setAnnouncement(`Found ${results.length} products matching "${q}"`)
      } else {
        setAnnouncement(`Loaded ${results.length} products`)
      }

      if (searchResultsRef.current) {
        setTimeout(() => searchResultsRef.current.focus(), 500)
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch products'
      setError(msg)
      setAnnouncement(`Error: ${msg}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setCategory('')
    fetchProducts(query.trim(), '')
  }

  const handleCategoryClick = (cat) => {
    if (category === cat) {
      setCategory('')
    } else {
      setQuery('')
      setCategory(cat)
    }
  }

  return (
    <div className="pt-20 px-4 min-h-screen bg-gradient-to-br from-zinc-100 to-gray-200 dark:from-zinc-900 dark:to-black transition-colors duration-300">
      {/* Hero / Search */}
      <div className="max-w-2xl mx-auto text-center py-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Smart Shopping, Simplified
        </h1>
        <form onSubmit={handleSearch} className="flex justify-center gap-2">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full max-w-md px-4 py-2 border rounded-lg bg-white text-black dark:bg-white dark:text-black"
          />
          <button
            className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg 
            hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors 
            hover:scale-105 active:scale-95 focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 
            transform duration-150 ease-in-out"
            type="submit"
            aria-label="Search products"
          >
            Search
        </button>
        </form>
      </div>

      {/* Category Bar */}
      <div className="max-w-6xl mx-auto mb-6">
        <nav className="flex space-x-4 overflow-x-auto pb-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`
                px-4 py-2 whitespace-nowrap rounded-full border
                transition-all duration-200 ease-in-out
                ${category === cat
                  ? 'bg-sky-600 hover:bg-sky-700 text-white border-sky-700 shadow-md scale-105'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-white dark:text-gray-800 dark:border-gray-300 dark:hover:bg-gray-100 hover:scale-105 hover:shadow-sm'}
              `}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Results */}
      <div
        className="max-w-6xl mx-auto py-10"
        ref={searchResultsRef}
        role="region"
        aria-label="Search Results"
      >
        {loading && <p>Loading…</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && products.length === 0 && (
          <p>No products found.</p>
        )}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((p, i) => (
              <div
                key={p._id || i}
                className="opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}
              >
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
