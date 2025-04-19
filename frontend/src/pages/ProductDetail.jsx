// src/pages/ProductDetail.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import PriceComparisonTable from '../components/PriceComparisonTable';
import { AuthContext } from '../context/AuthContext';
import productService from '../services/productService';
import wishlistService from '../services/wishlistService';

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [comparison, setComparison] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [wishLoading, setWishLoading] = useState(false);
  const [wishError, setWishError] = useState('');
  const [wishSuccess, setWishSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const prod = await productService.getProductById(id);
        setProduct(prod);
        const comp = await productService.compareProductPrices(id);
        setComparison(comp.prices || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddToWishlist = async () => {
    if (!user) {
      setWishError('Please log in to add to wishlist');
      return;
    }
    setWishLoading(true);
    setWishError('');
    setWishSuccess('');
    try {
      await wishlistService.addToWishlist({
        productId: product._id || product.id,
        watched: false,
        targetPrice: null
      });
      setWishSuccess('Added to wishlist!');
    } catch (err) {
      setWishError(err.response?.data?.message || err.message || 'Failed to add');
    } finally {
      setWishLoading(false);
    }
  };

  if (loading) {
    return <p className="pt-20 text-center text-gray-500">Loading product...</p>;
  }
  if (error) {
    return <p className="pt-20 text-center text-red-500">{error}</p>;
  }

  const amazon = comparison.find(c => c.source === 'amazon') || {};
  const flipkart = comparison.find(c => c.source === 'flipkart') || {};

  return (
    <div className="pt-20 px-4">
      <div className="max-w-6xl mx-auto py-8">
        {/* Product Header */}
        <div className="flex flex-col md:flex-row gap-8">
          <img
            src={product.image}
            alt={product.name}
            className="w-full md:w-1/3 object-contain rounded-lg bg-white p-4"
          />
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            {product.description && (
              <p className="text-gray-700">{product.description}</p>
            )}

            <button
              onClick={handleAddToWishlist}
              disabled={wishLoading}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {wishLoading ? 'Adding...' : 'Add to Wishlist'}
            </button>
            {wishError && (
              <p className="text-red-500 text-sm">{wishError}</p>
            )}
            {wishSuccess && (
              <p className="text-green-600 text-sm">{wishSuccess}</p>
            )}
          </div>
        </div>

        {/* Price Comparison */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Price Comparison</h2>
          <PriceComparisonTable
            product={{
              amazonPrice: amazon.price,
              flipkartPrice: flipkart.price,
              amazonUrl: amazon.url,
              flipkartUrl: flipkart.url
            }}
          />
        </div>
      </div>
    </div>
  );
}