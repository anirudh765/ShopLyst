import { useState } from 'react';
import productService from '../services/productService';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    platform: 'Amazon',
    asin: '',
    fkid: '',
    title: '',
    price: '',
    rating: '',
    reviews: '',
    url: '',
    image: '',
    category: '',
    features: {}
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [statusAnnouncement, setStatusAnnouncement] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Announce platform change for screen readers
    if (e.target.name === 'platform') {
      setStatusAnnouncement(`Platform changed to ${e.target.value}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    setStatusAnnouncement('Adding product...');

    try {
      const payload =
        formData.platform === 'Amazon'
          ? {
            source: formData.platform.toLowerCase(),
            asin: formData.asin,
            title: formData.title,
            price: parseFloat(formData.price),
            rating: parseFloat(formData.rating) || undefined,
            reviews: formData.reviews,
            url: formData.url,
            image: formData.image,
            category: formData.category,
            features: formData.features
          }
          : {
            source: formData.platform.toLowerCase(),
            fkid: formData.fkid,
            title: formData.title,
            price: parseFloat(formData.price),
            rating: parseFloat(formData.rating) || undefined,
            reviews: formData.reviews,
            url: formData.url,
            image: formData.image,
            category: formData.category,
            features: formData.features
          };
      console.log("Request in add", payload);
      await productService.addProduct(payload);

      setSuccessMsg('Product added successfully!');
      setStatusAnnouncement('Product added successfully! Redirecting to home page.');
      setFormData({
        platform: formData.platform,
        asin: '',
        fkid: '',
        title: '',
        price: '',
        rating: '',
        reviews: '',
        url: '',
        image: ''
      });
      
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      setErrorMsg(err);
      setStatusAnnouncement(`Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const getIdFieldLabel = () => {
    return formData.platform === 'Amazon' ? 'Amazon ID ' : 'Flipkart ID';
  };

  const getIdFieldName = () => {
    return formData.platform === 'Amazon' ? 'asin' : 'fkid';
  };

  const getIdFieldValue = () => {
    return formData.platform === 'Amazon' ? formData.asin : formData.fkid;
  };

  return (
    <div className="min-h-screen pt-24 px-4 bg-gradient-to-br from-zinc-100 to-gray-200 dark:from-zinc-900 dark:to-black transition-colors duration-300 flex justify-center items-start"> {/* or mt-24 */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {statusAnnouncement}
      </div>
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-800 shadow-lg rounded-2xl p-6 md:p-8 transition-all duration-300">
        <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-6 text-center">Add Product</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="platform"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Platform
            </label>
            <select
              id="platform"
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              aria-label="Select platform"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-700 text-gray-800 dark:text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
            >
              <option value="Amazon">Amazon</option>
              <option value="Flipkart">Flipkart</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="productId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {getIdFieldLabel()}
            </label>
            <input
              id="productId"
              type="text"
              name={getIdFieldName()}
              placeholder={getIdFieldLabel()}
              value={getIdFieldValue()}
              onChange={handleChange}
              aria-required="true"
              aria-label={getIdFieldLabel()}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-700 text-gray-800 dark:text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
              required
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              aria-required="true"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-700 text-gray-800 dark:text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
            >
              <option value="">Select category</option>
              <option value="pcs">PCs</option>
              <option value="smartphones">Smartphones</option>
              <option value="headphones">Headphones</option>
              <option value="smartwatches">Smartwatches</option>
              <option value="keyboards">Keyboards</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              name="title"
              placeholder="Product Title"
              value={formData.title}
              onChange={handleChange}
              aria-required="true"
              aria-label="Product title"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-700 text-gray-800 dark:text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
              required
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Price (INR)
            </label>
            <input
              id="price"
              type="number"
              name="price"
              placeholder="Price (INR)"
              value={formData.price}
              onChange={handleChange}
              aria-required="true"
              aria-label="Product price in rupees"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-700 text-gray-800 dark:text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
              required
            />
          </div>

          {/* ─── Features ─── */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Features
            </label>

            {Object.entries(formData.features).map(([key, val], idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Feature name"
                  value={key}
                  onChange={(e) => {
                    const f = { ...formData.features };
                    delete f[key];
                    f[e.target.value] = val;
                    setFormData({ ...formData, features: f });
                  }}
                  className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={val}
                  onChange={(e) => {
                    const f = { ...formData.features };
                    f[key] = e.target.value;
                    setFormData({ ...formData, features: f });
                  }}
                  className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    const f = { ...formData.features };
                    delete f[key];
                    setFormData({ ...formData, features: f });
                  }}
                  className="px-2 py-1 bg-red-500 text-white rounded-lg"
                  aria-label={`Remove feature ${key}`}
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => {
                setFormData({
                  ...formData,
                  features: { ...formData.features, '': '' }
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
              Rating (0-5)
            </label>
            <input
              id="rating"
              type="number"
              name="rating"
              step="0.1"
              min="0"
              max="5"
              placeholder="Rating (optional)"
              value={formData.rating}
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
              Reviews Count
            </label>
            <input
              id="reviews"
              type="text"
              name="reviews"
              placeholder="Reviews (e.g. 1,2,3,4)"
              value={formData.reviews}
              onChange={handleChange}
              aria-label="Number of product reviews"
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
            <input
              id="url"
              type="url"
              name="url"
              placeholder="Product URL"
              value={formData.url}
              onChange={handleChange}
              aria-label="Product URL"
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
            <input
              id="image"
              type="url"
              name="image"
              placeholder="Image URL"
              value={formData.image}
              onChange={handleChange}
              aria-label="Product image URL"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-700 text-gray-800 dark:text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
            />
          </div>

          {errorMsg && (
            <p
              className="text-red-600 dark:text-red-400 text-sm"
              role="alert"
              aria-live="assertive"
            >
              {errorMsg}
            </p>
          )}

          {successMsg && (
            <p
              className="text-green-600 dark:text-green-400 text-sm"
              role="status"
              aria-live="polite"
            >
              {successMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            aria-disabled={loading}
            aria-busy={loading}
            className={`w-full py-2 px-4 bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg hover:scale-105 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
