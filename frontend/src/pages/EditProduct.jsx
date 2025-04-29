import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import productService from '../services/productService';

export default function EditProduct() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const initialProd = location.state?.product || null;
  const [product, setProduct] = useState(initialProd);
  const [loading, setLoading] = useState(!initialProd);
  const [error, setError] = useState('');
  const [statusAnnouncement, setStatusAnnouncement] = useState('');

  useEffect(() => {
    if (!initialProd) {
      setStatusAnnouncement('Loading product data...');
      productService.getProductById(id)
        .then((res) => {
          setProduct(res);
          setStatusAnnouncement('Product data loaded successfully');
        })
        .catch(() => {
          setError('Could not load product');
          setStatusAnnouncement('Error: Could not load product');
        })
        .finally(() => setLoading(false));
    }
  }, [id, initialProd]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusAnnouncement('Saving changes...');
    try {
      await productService.updateProduct(id, product);
      setStatusAnnouncement('Changes saved successfully, redirecting to product page');
      navigate(`/product/${id}`);
    } catch (err) {
      setError('Failed to save changes');
      setStatusAnnouncement('Error: Failed to save changes');
    }
  };

  if (loading) return (
    <div className="min-h-screen pt-24 px-4">
      <p
        className="mt-20 text-center text-gray-500 dark:text-gray-400 animate-pulse"
        aria-live="polite"
      >
        Loading…
      </p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen pt-24 px-4">
      <p
        className="mt-20 text-center text-red-500 dark:text-red-400 font-semibold"
        role="alert"
        aria-live="assertive"
      >
        {error}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 px-4 bg-gradient-to-br from-zinc-100 to-gray-200 dark:from-zinc-900 dark:to-black transition-colors duration-300 flex justify-center items-start">
      {/* Status announcements for screen readers */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {statusAnnouncement}
      </div>

      <div className="w-full max-w-2xl bg-white dark:bg-zinc-800 shadow-lg rounded-2xl p-6 md:p-8 transition-all duration-300">
        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-6 text-center">
          Edit Product
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Title
            </label>
            <input
              id="title"
              name="title"
              value={product.title || ''}
              onChange={handleChange}
              aria-required="true"
              aria-label="Product title"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-700 text-gray-800 dark:text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Price (₹)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              value={product.price || ''}
              onChange={handleChange}
              aria-required="true"
              aria-label="Product price in rupees"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-700 text-gray-800 dark:text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
            />
          </div>

          {/* ─── Features (after Price) ─── */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Features
            </label>

            {Object.entries(product.features || {}).map(([key, val], idx) => {
              const entries = Object.entries(product.features);
              const [featKey, featVal] = entries[idx];
              return (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Feature name"
                    value={featKey}
                    onChange={(e) => {
                      const newFeatures = { ...product.features };
                      delete newFeatures[featKey];              // remove old
                      newFeatures[e.target.value] = featVal;    // add under new key
                      setProduct({ ...product, features: newFeatures });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-700 text-gray-800 dark:text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={featVal}
                    onChange={(e) => {
                      const newFeatures = { ...product.features };
                      newFeatures[featKey] = e.target.value;
                      setProduct({ ...product, features: newFeatures });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-700 text-gray-800 dark:text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newFeatures = { ...product.features };
                      delete newFeatures[featKey];
                      setProduct({ ...product, features: newFeatures });
                    }}
                    className="px-2 py-1 bg-red-500 text-white rounded-lg"
                    aria-label={`Remove feature ${featKey}`}
                  >
                    Remove
                  </button>
                </div>
              );
            })}

            <button
              type="button"
              onClick={() => {
                setProduct({
                  ...product,
                  features: { ...product.features, '': '' }
                });
              }}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Add Feature
            </button>
          </div>


          <div>
            <label
              htmlFor="rating"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Rating
            </label>
            <input
              id="rating"
              name="rating"
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={product.rating || ''}
              onChange={handleChange}
              aria-label="Product rating from 0 to 5"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-700 text-gray-800 dark:text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
            />
          </div>

          <div>
            <label
              htmlFor="reviews"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Reviews
            </label>
            <textarea
              id="reviews"
              name="reviews"
              value={product.reviews || ''}
              onChange={handleChange}
              aria-label="Product reviews"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-700 text-gray-800 dark:text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
            />
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Image URL
            </label>
            <textarea
              id="image"
              name="image"
              value={product.image || ''}
              onChange={handleChange}
              aria-label="Product image URL"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-700 text-gray-800 dark:text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
            />
          </div>

          <div>
            <label
              htmlFor="url"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Product URL
            </label>
            <textarea
              id="url"
              name="url"
              value={product.url || ''}
              onChange={handleChange}
              aria-label="Product URL"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-700 text-gray-800 dark:text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
            />
          </div>

          <button
            type="submit"
            aria-label="Save product changes"
            className="w-full py-2 px-4 bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg hover:scale-105 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}