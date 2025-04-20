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
    image: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const payload =
        formData.platform === 'Amazon'
          ? {
              asin: formData.asin,
              title: formData.title,
              price: parseFloat(formData.price),
              rating: parseFloat(formData.rating) || undefined,
              reviews: formData.reviews,
              url: formData.url,
              image: formData.image
            }
          : {
              fkid: formData.fkid,
              title: formData.title,
              price: parseFloat(formData.price),
              rating: parseFloat(formData.rating) || undefined,
              reviews: formData.reviews,
              url: formData.url,
              image: formData.image
            };
    console.log("Request in add",payload);
      await productService.addProduct(formData.platform.toLowerCase(), {payload});

      setSuccessMsg('Product added successfully!');
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
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="pt-24"> {/* or mt-24 */}
<div className="w-full max-w-xl mx-auto p-10 bg-white shadow-lg rounded-xl border border-gray-200">
<h2 className="text-2xl font-bold mb-6 text-center">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="platform"
          value={formData.platform}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="Amazon">Amazon</option>
          <option value="Flipkart">Flipkart</option>
        </select>

        {formData.platform === 'Amazon' && (
          <input
            type="text"
            name="asin"
            placeholder="ASIN"
            value={formData.asin}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        )}

        {formData.platform === 'Flipkart' && (
          <input
            type="text"
            name="fkid"
            placeholder="Flipkart ID"
            value={formData.fkid}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        )}

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price (INR)"
          value={formData.price}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />

        <input
          type="number"
          name="rating"
          step="0.1"
          placeholder="Rating (optional)"
          value={formData.rating}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />

        <input
          type="text"
          name="reviews"
          placeholder="Reviews (e.g., '1,234')"
          value={formData.reviews}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />

        <input
          type="url"
          name="url"
          placeholder="Product URL"
          value={formData.url}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />

        <input
          type="url"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />

        {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}
        {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
    </div>
  );
};

export default AddProduct;
