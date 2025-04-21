import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import PriceComparisonTable from '../components/PriceComparisonTable';
import { AuthContext } from '../context/AuthContext';
import productService from '../services/productService';
import { WishlistContext } from '../context/WishlistContext';

export default function ProductDetail() {
  const { id } = useParams();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const { addItem } = useContext(WishlistContext);

  const passedProduct = location.state?.product || null;

  const [product, setProduct] = useState(passedProduct);
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
        let prod = product;
        if (!product) {
          prod = await productService.getProductById(id);
          setProduct(prod);
        }

        const comp = await productService.compareProductPrices(prod._id || prod.id);
        setComparison(comp.prices || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, product]);

  const handleAddToWishlist = async () => {
    if (!user) {
      setWishError('Please log in to add to wishlist');
      return;
    }
    setWishLoading(true);
    setWishError('');
    setWishSuccess('');

    let targetPrice = null;
    if (window.confirm('Would you like to set a target price for this product?')) {
      const input = window.prompt('Enter your target price:');
      if (input) {
        targetPrice = parseFloat(input);
        if (isNaN(targetPrice)) {
          return alert('Invalid target price entered. Please try again.');
        }
      }
    }

    try {
      await addItem({
        _id: product._id || product.id,
        source: product.source,
        price: product.price,
        targetPrice
      });
      setWishSuccess('Added to wishlist!');
    } catch (err) {
      setWishError(err.response?.data?.message || err.message || 'Failed to add');
    } finally {
      setWishLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-100 to-gray-200 dark:from-zinc-900 dark:to-black">
        <p className="pt-20 text-center text-gray-500 dark:text-gray-400">Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-100 to-gray-200 dark:from-zinc-900 dark:to-black">
        <p className="pt-20 text-center text-red-500 dark:text-red-400">{error}</p>
      </div>
    );
  }

  const amazon = comparison.find(c => c.source === 'amazon') || {};
  const flipkart = comparison.find(c => c.source === 'flipkart') || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 to-gray-200 dark:from-zinc-900 dark:to-black pt-20 px-4">
      <div className="max-w-6xl mx-auto py-8">
        {/* Product Header */}
        <div className="flex flex-col md:flex-row gap-8 bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg">
          <img
            src={product.image}
            alt={product.name}
            className="w-full md:w-1/3 object-contain rounded-lg bg-white p-4"
          />
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{product.title}</h1>
            <p className="text-gray-700 dark:text-gray-300">
              {product.source === "amazon" ? "Amazon" : "Flipkart"}
            </p>
            {product.description && (
              <p className="text-gray-700 dark:text-gray-300">{product.description}</p>
            )}
            {product.price && (
              <p className="text-gray-700 dark:text-gray-300">₹{product.price}</p>
            )}
            <p className="text-gray-700 dark:text-gray-300">Rating: {product.rating}</p>
            <p className="text-gray-700 dark:text-gray-300">Reviews: {product.reviews}</p>
            
            {!user?.isadmin && (
              <button
                onClick={handleAddToWishlist}
                disabled={wishLoading}
                className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                {wishLoading ? 'Adding...' : 'Add to Wishlist'}
              </button>
            )}
            {wishError && (
              <p className="text-red-500 dark:text-red-400 text-sm">{wishError}</p>
            )}
            {wishSuccess && (
              <p className="text-green-600 dark:text-green-400 text-sm">{wishSuccess}</p>
            )}
          </div>
        </div>

        {/* Price Comparison */}
        <div className="mt-8 bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Price Comparison</h2>
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
