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

  // Clear announcements
  useEffect(() => {
    if (!announcement) return
    const t = setTimeout(() => setAnnouncement(''), 1000)
    return () => clearTimeout(t)
  }, [announcement])

  const fetchProducts = async (q, cat) => {
    setLoading(true)
    setError(null)
    try {
      // ← productService.searchProducts needs to accept (q, page, limit, category)
      const { results } = await productService.searchProducts(q, 1, 20, cat)
      setProducts(results)

      if (cat) {
        setAnnouncement(`Loaded ${results.length} products in "${cat}"`)
      } else if (q) {
        setAnnouncement(`Found ${results.length} products matching "${q}"`)
      } else {
        setAnnouncement(`Loaded ${results.length} products`)
      }

      // focus results
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
    setCategory('')            // clear category filter
    fetchProducts(query.trim(), '')
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
            className="w-full max-w-md px-4 py-2 border rounded-lg"
          />
          <button className="px-4 py-2 bg-black text-white rounded-lg">
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
              onClick={() => {
                setQuery('')      // clear search field
                setCategory(cat)
              }}
              className={`
                px-4 py-2 whitespace-nowrap
                rounded-full border
                ${category === cat
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}
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
