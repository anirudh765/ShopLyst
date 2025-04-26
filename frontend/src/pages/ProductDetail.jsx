import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation ,useNavigate} from 'react-router-dom';
import PriceComparisonTable from '../components/PriceComparisonTable';
import { AuthContext } from '../context/AuthContext';
import productService from '../services/productService';
import { WishlistContext } from '../context/WishlistContext';
import Suggestion from '../components/Suggestion';
import { toast } from 'react-toastify' ;

export default function ProductDetail() {
  const { id } = useParams();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const { addItem } = useContext(WishlistContext);
  const navigate = useNavigate();

  const passedProduct = location.state?.product || null;

  const [product, setProduct] = useState(passedProduct);
  const [comparison, setComparison] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  // const [selected, setSelected] = useState(new Set());
  const [selectedId, setSelectedId] = useState(null);

  const [wishLoading, setWishLoading] = useState(false);
  const [wishError, setWishError] = useState('');
  const [wishSuccess, setWishSuccess] = useState('');
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let prod = product;
        if (!prod) {
          prod = await productService.getProductById(id);
          setProduct(prod);
        }
        const comp = await productService.compareProductPrices(prod._id || prod.id);
        setComparison(comp.prices || []);

       // old category-based suggestions      
       // new dedicated suggestions endpoint
       const suggs = await productService.getSuggestions(prod._id || prod.id);
       setSuggestions(suggs);

      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (announcement) {
      const timer = setTimeout(() => {
        setAnnouncement('');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [announcement]);

  const handleAddToWishlist = async () => {
    if (!user) {
      setWishError('Please log in to add to wishlist');
      setAnnouncement('Please log in to add to wishlist');
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
          setAnnouncement('Invalid target price entered');
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
      toast.info('Product added to your wishlist successfully!');
      setWishSuccess('Added to wishlist!');
      setAnnouncement('Product successfully added to wishlist');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
  
      if (error.response && error.response.status === 400) {
        toast.info('Product already exists in your wishlist');
      } else {
        toast.error('Error adding to wishlist. Please try again.');
      }
      setAnnouncement('Error adding to wishlist');
    } finally {
      setWishLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-100 to-gray-200 dark:from-zinc-900 dark:to-black" role="status" aria-live="polite">
        <p className="pt-20 text-center text-gray-500 dark:text-gray-400">Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-100 to-gray-200 dark:from-zinc-900 dark:to-black" role="alert">
        <p className="pt-20 text-center text-red-500 dark:text-red-400">{error}</p>
      </div>
    );
  }

  const handleSelect = (pid) => {
    setSelectedId(prev => (prev === pid ? null : pid));
  };

  const handleCompare = () => {
    if (selectedId) {
      navigate(`/compare?left=${product._id}&right=${selectedId}`);
    }
  };

  const handleEdit = () => {
    navigate(`/product/edit/${product._id}`, { state: { product } });
  };

  const amazon = comparison.find(c => c.source === 'amazon'  || c.asin) || {};
  const flipkart = comparison.find(c => c.source === 'flipkart') || {};

  return (
    <div className="min-h-screen pt-20 px-4 bg-gradient-to-br from-zinc-100 to-gray-200 dark:from-zinc-900 dark:to-black">
      <main className="max-w-6xl mx-auto py-8 flex flex-col lg:flex-row gap-8">
        
        {/* ─── LEFT PANE: 70% ──────────────────────────────── */}
        <div className="w-full lg:w-[70%] space-y-8">
          
          {/* Product Header + Features */}
          <section
            className="flex flex-col md:flex-row gap-8 bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg"
            aria-labelledby="product-title"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full md:w-1/3 object-contain rounded-lg bg-white p-4"
            />
            <div className="flex-1 space-y-4">
              <h1 id="product-title" className="text-3xl font-bold text-gray-900 dark:text-white">
                {product.title}
              </h1>
              <p className="text-gray-700 dark:text-gray-300">
                {product.source === 'amazon' ? 'Amazon' : 'Flipkart'}
              </p>
              {product.description && (
                <p className="text-gray-700 dark:text-gray-300">{product.description}</p>
              )}
              {product.price != null && (
                <p className="text-gray-700 dark:text-gray-300">₹{product.price}</p>
              )}
              <div className="flex flex-col space-y-1">
                <p className="text-gray-700 dark:text-gray-300">Rating: {product.rating}</p>
                <p className="text-gray-700 dark:text-gray-300">Reviews: {product.reviews}</p>
              </div>
              {user && !user.isadmin && (
                <button                  
                  onClick={handleAddToWishlist}
                  className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg"
                >
                  Add to Wishlist
                </button>
              )}

              { user && user.isadmin && 
                (<button
                onClick={handleEdit}
                onKeyDown={(e) => e.stopPropagation()}
                className="w-full py-2 mt-2 text-white rounded-lg transition-colors bg-sky-600 dark:bg-sky-700 hover:bg-sky-700 dark:hover:bg-sky-800"
                aria-label={`Edit product: ${product.title}`}
              >
                Edit Product
              </button>)
              }
            </div>
          </section>

          {/* Features */}
          {product.features && (
            <section
              className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg"
              aria-labelledby="features-heading"
            >
              <h2
                id="features-heading"
                className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white"
              >
                Features
              </h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(product.features).map(([key, val]) => (
                  <React.Fragment key={key}>
                    <dt className="font-medium text-gray-700 dark:text-gray-300">{key}</dt>
                    <dd className="text-gray-800 dark:text-gray-200">{val}</dd>
                  </React.Fragment>
                ))}
              </dl>
            </section>
          )}

          {/* Price Comparison */}
          <section
            className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg"
            aria-labelledby="price-comparison-heading"
          >
            <h2
              id="price-comparison-heading"
              className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white"
            >
              Price Comparison
            </h2>
            <PriceComparisonTable
              product={{
                amazonPrice:  amazon.price,
                flipkartPrice: flipkart.price,
                amazonUrl:     amazon.url,
                flipkartUrl:   flipkart.url
              }}
            />
          </section>
        </div>

        {/* ─── RIGHT PANE: 30% ─────────────────────────────── */}
        <aside className="w-full lg:w-[30%] space-y-4">
          <button
            onClick={handleCompare}
            disabled={!selectedId}
            className={`w-full py-2 rounded-lg text-white transition ${
              selectedId
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Compare
          </button>

          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            {suggestions.map(prod => (
              <Suggestion
                key={prod._id}
                product={prod}
                isSelected={selectedId === prod._id}
                onClick={handleSelect}
              />
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
  
}