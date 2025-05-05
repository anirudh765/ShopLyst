import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { WishlistContext } from '../context/WishlistContext'; 
import { deleteProduct } from '../services/productService';
import { toast } from 'react-toastify';
import GenericModal from '../components/GenericModal';

export default function ProductCard({ product, onDelete }) {
  const { user } = useContext(AuthContext);
  const { addItem } = useContext(WishlistContext); 
  const isAmazon = product.source === 'amazon';
  const navigate = useNavigate();

  const [modalState, setModalState] = useState({ open: false, type: null });
  const [announcement, setAnnouncement] = useState('');

  const handleDelete = async () => {
    try {
      await deleteProduct(product._id);
      onDelete(product._id);
      setAnnouncement("Product successfully deleted");
      toast.success("Product deleted successfully");
    } catch (err) {
      setAnnouncement("Failed to delete product");
      toast.error("Failed to delete product");
    }
  };

  const handleAddToWishlist = async (targetPrice) => {
    try {
      await addItem({
        _id: product._id,
        source: isAmazon ? 'amazon' : 'flipkart',
        price: product.price,
        targetPrice,
      });
      toast.info('Product added to your wishlist successfully!');
      setAnnouncement(`Added product ${product.title} to wishlist`);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      if (error.response?.status === 400) {
        toast.info('Product already exists in your wishlist');
      } else {
        toast.error('Error adding to wishlist. Please try again.');
      }
      setAnnouncement('Error adding to wishlist');
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/product/edit/${product._id}`, { state: { product } });
  };

  const handleCardClick = () => {
    navigate(`/product/${product._id}`, { state: { product } });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <>
      <div
        className="border border-slate-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md hover:scale-105 transform transition duration-300 overflow-hidden cursor-pointer"
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        tabIndex="0"
        role="article"
        aria-label={`${product.title} product card`}
      >
        <div aria-live="assertive" className="sr-only" role="status">
          {announcement}
        </div>

        <img
          src={product.image}
          alt={`Product image: ${product.title}`}
          className="w-full h-64 object-contain p-4 bg-slate-50 dark:bg-gray-700/20"
          loading="lazy"
        />

        <div className="p-4 space-y-4">
          <h3 className="text-base font-semibold text-slate-800 dark:text-gray-200 leading-snug line-clamp-2">
            {product.title}
          </h3>

          <div className="text-sm space-y-1 text-slate-600 dark:text-gray-400">
            <div className="flex justify-between">
              <span className="font-medium">{isAmazon ? 'Amazon' : 'Flipkart'}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold" aria-label={`Price: ${product.price} Rupees`}>₹{product.price}</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-gray-400">
              <span aria-label={`Rated ${product.rating} out of 5 stars with ${product.reviews} reviews`}>
                ⭐ {product.rating} ({product.reviews})
              </span>
            </div>
          </div>

          {user && user.isadmin && (
            <>
              <button
                onClick={handleEdit}
                onKeyDown={(e) => e.stopPropagation()}
                className="w-full py-2 mt-2 text-white rounded-lg transition-colors bg-sky-600 dark:bg-sky-700 hover:bg-sky-700 dark:hover:bg-sky-800"
              >
                Edit Product
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setModalState({ open: true, type: 'delete' }); }}
                onKeyDown={(e) => e.stopPropagation()}
                className="w-full py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-colors"
              >
                Delete Product
              </button>
            </>
          )}

          {user && !user.isadmin && (
            <button
              onClick={(e) => { e.stopPropagation(); setModalState({ open: true, type: 'wishlist' }); }}
              onKeyDown={(e) => e.stopPropagation()}
              className="w-full py-2 mt-2 text-white rounded-lg transition-colors bg-sky-600 dark:bg-sky-700 hover:bg-sky-700 dark:hover:bg-sky-800"
            >
              Add to Wishlist
            </button>
          )}

          {!user && (
            <button
              disabled
              className="w-full py-2 mt-2 bg-slate-200 dark:bg-gray-700 text-slate-500 dark:text-gray-500 rounded-lg cursor-not-allowed"
              aria-label="Sign in to add to wishlist"
            >
              Sign in to Add to Wishlist
            </button>
          )}
        </div>
      </div>

      <GenericModal
        isOpen={modalState.open}
        title={modalState.type === 'delete' ? 'Delete Product' : 'Set Target Price'}
        message={modalState.type === 'delete' ? 'Are you sure you want to delete this product?' : 'Enter your desired target price:'}
        confirmText={modalState.type === 'delete' ? 'Delete' : 'Add'}
        cancelText="Cancel"
        requireInput={modalState.type === 'wishlist'}
        inputLabel={modalState.type === 'wishlist' ? 'Target Price' : ''}
        placeholder={modalState.type === 'wishlist' ? 'e.g. 2999.99' : ''}
        onCancel={() => setModalState({ open: false, type: null })}
        onConfirm={(inputValue) => {
          setModalState({ open: false, type: null });
          if (modalState.type === 'delete') handleDelete();
          else handleAddToWishlist(inputValue ? parseFloat(inputValue) : null);
        }}
      />
    </>
  );
}
