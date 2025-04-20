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

  useEffect(() => {
    if (!initialProd) {
      productService.getProductById(id)
        .then((res) => setProduct(res))
        .catch(() => setError('Could not load product'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await productService.updateProduct(id, product);
      navigate(`/product/${id}`);
    } catch (err) {
      setError('Failed to save changes');
    }
  };

  if (loading) return <p className="mt-20 text-center">Loading…</p>;
  if (error) return <p className="mt-20 text-center text-red-500">{error}</p>;

  return (

    <div className="min-h-screen pt-32 px-4 flex justify-center bg-gray-50">
  <div className="w-full max-w-xl bg-white rounded-lg shadow p-6">
    <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium">Title</label>
        <input
          name="title"
          value={product.title || ''}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>
      <div>
        <label className="block font-medium">Price (₹)</label>
        <input
          name="price"
          type="number"
          value={product.price || ''}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>
      <div>
        <label className="block font-medium">Rating</label>
        <input
          name="rating"
          type="number"
          step="0.1"
          value={product.rating || ''}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>
      {console.log(product.reviews)}
      <div>
        <label className="block font-medium">Reviews</label>
        <textarea
          name="reviews"
          value={product.reviews || ''}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>
      <div>
        <label className="block font-medium">Image URL</label>
        <textarea
          name="reviews"
          value={product.image || ''}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>
      <div>
        <label className="block font-medium">Product URL</label>
        <textarea
          name="reviews"
          value={product.url || ''}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Save Changes
      </button>
    </form>
  </div>
</div>
  );
}