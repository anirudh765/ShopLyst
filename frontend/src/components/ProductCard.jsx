import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { WishlistContext } from '../context/WishlistContext'; 
import { deleteProduct } from '../services/productService';

export default function ProductCard({ product }) {
  const { user } = useContext(AuthContext);
  const { addItem } = useContext(WishlistContext); 
  const isAmazon = product.source === 'amazon';
  const navigate = useNavigate(); 

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(product._id);
        onDelete();
        console.log("Product deleted");
      } catch (err) {
        console.error("Failed to delete product");
      }
    }
  };
  
  const handleAddToWishlist = async (e) => {
    e.stopPropagation();
    if (!user) return alert('Please sign in to add to wishlist');
  
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
        _id: product._id,
        source: isAmazon ? 'amazon' : 'flipkart',
        price: product.price,
        targetPrice, 
      });
      console.log(`Added product ${product.name} to wishlist with target price: ${targetPrice || 'None'}`);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/product/edit/${product._id}`, { state: { product } });
  };

  const handleCardClick = () => {
    navigate(`/product/${product._id}`, { state: { product } });
  };

  return (
    <div
      className="border border-slate-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition duration-300 overflow-hidden cursor-pointer"
      onClick={handleCardClick} 
    >
      <img
        src={product.image}
        alt={`Product image for ${product.title}`}
        className="w-full h-64 object-contain p-4 bg-slate-50"
        loading="lazy"
      />

      <div className="p-4 space-y-4">
        <h3 className="text-base font-semibold text-slate-800 leading-snug line-clamp-2">
          {product.title}
        </h3>

        <div className="text-sm space-y-1 text-slate-600">
          <div className="flex justify-between">
            <span className="font-medium">{isAmazon ? 'Amazon' : 'Flipkart'}</span>
            <span className="text-emerald-600 font-semibold">₹{product.price}</span>
          </div>
          <div className="text-xs text-slate-500">
            ⭐ {product.rating} ({product.reviews})
          </div>
        </div>

        {/* {user && user.isadmin ? (
        <button
          onClick={handleEdit}
          className="w-full py-2 mt-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
        >
          Edit Product
        </button>
        
      ) : (
        <button
          onClick={handleAddToWishlist}
          disabled={!user}
          className={`w-full py-2 mt-2 text-white rounded-lg transition ${
            user
              ? 'bg-sky-600 hover:bg-sky-700'
              : 'bg-slate-200 text-slate-500 cursor-not-allowed'
          }`}
        >
          Add to Wishlist
        </button>
      )} */}

      {
        user && user.isadmin && <button
        onClick={handleEdit}
        className="w-full py-2 mt-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
      >
        Edit Product
      </button>
      }
      {
        user && user.isadmin && <button
        onClick={handleDelete}
        className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
      >
        Delete Product
      </button>
      }
      {
        user && !user.isadmin && <button
        onClick={handleAddToWishlist}
        className={`w-full py-2 mt-2 text-white rounded-lg transition ${
          user
            ? 'bg-sky-600 hover:bg-sky-700'
            : 'bg-slate-200 text-slate-500 cursor-not-allowed'
        }`}
      >
        Add to Wishlist
      </button>

      }
      </div>
    </div>
  );
}