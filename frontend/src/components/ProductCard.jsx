// import React, { useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';
// import { WishlistContext } from '../context/WishlistContext'; 
// import { deleteProduct } from '../services/productService';

// export default function ProductCard({ product }) {
//   const { user } = useContext(AuthContext);
//   const { addItem } = useContext(WishlistContext); 
//   const isAmazon = product.source === 'amazon';
//   const navigate = useNavigate(); 

//   const handleDelete = async (e) => {
//     e.stopPropagation();
//     if (confirm("Are you sure you want to delete this product?")) {
//       try {
//         await deleteProduct(product._id);
//         onDelete();
//         console.log("Product deleted");
//       } catch (err) {
//         console.error("Failed to delete product");
//       }
//     }
//   };
  
//   const handleAddToWishlist = async (e) => {
//     e.stopPropagation();
//     if (!user) return alert('Please sign in to add to wishlist');
  
//     let targetPrice = null;
//     if (window.confirm('Would you like to set a target price for this product?')) {
//       const input = window.prompt('Enter your target price:');
//       if (input) {
//         targetPrice = parseFloat(input);
//         if (isNaN(targetPrice)) {
//           return alert('Invalid target price entered. Please try again.');
//         }
//       }
//     }
  
//     try {
//       await addItem({
//         _id: product._id,
//         source: isAmazon ? 'amazon' : 'flipkart',
//         price: product.price,
//         targetPrice, 
//       });
//       console.log(`Added product ${product.name} to wishlist with target price: ${targetPrice || 'None'}`);
//     } catch (error) {
//       console.error('Error adding to wishlist:', error);
//     }
//   };

//   const handleEdit = (e) => {
//     e.stopPropagation();
//     navigate(`/product/edit/${product._id}`, { state: { product } });
//   };

//   const handleCardClick = () => {
//     navigate(`/product/${product._id}`, { state: { product } });
//   };

//   return (
//     <div
//       className="border border-slate-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition duration-300 overflow-hidden cursor-pointer"
//       onClick={handleCardClick} 
//     >
//       <img
//         src={product.image}
//         alt={`Product image for ${product.title}`}
//         className="w-full h-64 object-contain p-4 bg-slate-50"
//         loading="lazy"
//       />

//       <div className="p-4 space-y-4">
//         <h3 className="text-base font-semibold text-slate-800 leading-snug line-clamp-2">
//           {product.title}
//         </h3>

//         <div className="text-sm space-y-1 text-slate-600">
//           <div className="flex justify-between">
//             <span className="font-medium">{isAmazon ? 'Amazon' : 'Flipkart'}</span>
//             <span className="text-emerald-600 font-semibold">₹{product.price}</span>
//           </div>
//           <div className="text-xs text-slate-500">
//             ⭐ {product.rating} ({product.reviews})
//           </div>
//         </div>

//         {/* {user && user.isadmin ? (
//         <button
//           onClick={handleEdit}
//           className="w-full py-2 mt-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
//         >
//           Edit Product
//         </button>
        
//       ) : (
//         <button
//           onClick={handleAddToWishlist}
//           disabled={!user}
//           className={`w-full py-2 mt-2 text-white rounded-lg transition ${
//             user
//               ? 'bg-sky-600 hover:bg-sky-700'
//               : 'bg-slate-200 text-slate-500 cursor-not-allowed'
//           }`}
//         >
//           Add to Wishlist
//         </button>
//       )} */}

//       {
//         user && user.isadmin && <button
//         onClick={handleEdit}
//         className="w-full py-2 mt-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
//       >
//         Edit Product
//       </button>
//       }
//       {
//         user && user.isadmin && <button
//         onClick={handleDelete}
//         className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
//       >
//         Delete Product
//       </button>
//       }
//       {
//         user && !user.isadmin && <button
//         onClick={handleAddToWishlist}
//         className={`w-full py-2 mt-2 text-white rounded-lg transition ${
//           user
//             ? 'bg-sky-600 hover:bg-sky-700'
//             : 'bg-slate-200 text-slate-500 cursor-not-allowed'
//         }`}
//       >
//         Add to Wishlist
//       </button>

//       }
//       </div>
//     </div>
//   );
// }

import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { WishlistContext } from '../context/WishlistContext'; 
import { deleteProduct } from '../services/productService';

export default function ProductCard({ product, onDelete }) {
  const { user } = useContext(AuthContext);
  const { addItem } = useContext(WishlistContext); 
  const isAmazon = product.source === 'amazon';
  const navigate = useNavigate();
  // State for screen reader announcements
  const [announcement, setAnnouncement] = useState('');

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(product._id);
        onDelete();
        setAnnouncement("Product successfully deleted");
        console.log("Product deleted");
      } catch (err) {
        setAnnouncement("Failed to delete product");
        console.error("Failed to delete product");
      }
    }
  };
  
  const handleAddToWishlist = async (e) => {
    e.stopPropagation();
    if (!user) {
      setAnnouncement('Please sign in to add to wishlist');
      return alert('Please sign in to add to wishlist');
    }
  
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
        _id: product._id,
        source: isAmazon ? 'amazon' : 'flipkart',
        price: product.price,
        targetPrice, 
      });
      setAnnouncement(`Added product ${product.title} to wishlist`);
      console.log(`Added product ${product.name} to wishlist with target price: ${targetPrice || 'None'}`);
    } catch (error) {
      setAnnouncement('Error adding to wishlist');
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

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

//   return (
//     <div
//       className="border border-slate-200 rounded-2xl bg-white shadow-sm hover:shadow-md hover:scale-105 transform transition duration-300 overflow-hidden cursor-pointer"
//       onClick={handleCardClick}
//       onKeyDown={handleKeyDown}
//       tabIndex="0"
//       role="article"
//       aria-label={`${product.title} product card`}
//     >

//       {/* Screen reader announcement */}
//       <div 
//         aria-live="assertive" 
//         className="sr-only" 
//         role="status"
//       >
//         {announcement}
//       </div>
      
//       <img
//         src={product.image}
//         alt={`Product image: ${product.title}`}
//         className="w-full h-64 object-contain p-4 bg-slate-50"
//         loading="lazy"
//       />

//       <div className="p-4 space-y-4">
//         <h3 className="text-base font-semibold text-slate-800 leading-snug line-clamp-2">
//           {product.title}
//         </h3>

//         <div className="text-sm space-y-1 text-slate-600">
//           <div className="flex justify-between">
//             <span className="font-medium">{isAmazon ? 'Amazon' : 'Flipkart'}</span>
//             <span className="text-emerald-600 font-semibold" aria-label={`Price: ${product.price} Rupees`}>₹{product.price}</span>
//           </div>
//           <div className="text-xs text-slate-500">
//             <span aria-label={`Rated ${product.rating} out of 5 stars with ${product.reviews} reviews`}>
//               ⭐ {product.rating} ({product.reviews})
//             </span>
//           </div>
//         </div>

//         {user && user.isadmin && (
//           <>
//             <button
//               onClick={handleEdit}
//               onKeyDown={(e) => e.stopPropagation()}
//               className="w-full py-2 mt-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
//               aria-label={`Edit product: ${product.title}`}
//             >
//               Edit Product
//             </button>
//             <button
//               onClick={handleDelete}
//               onKeyDown={(e) => e.stopPropagation()}
//               className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
//               aria-label={`Delete product: ${product.title}`}
//             >
//               Delete Product
//             </button>
//           </>
//         )}

//         {user && !user.isadmin && (
//           <button
//             onClick={handleAddToWishlist}
//             onKeyDown={(e) => e.stopPropagation()}
//             className="w-full py-2 mt-2 text-white rounded-lg transition bg-sky-600 hover:bg-sky-700"
//             aria-label={`Add ${product.title} to wishlist`}
//           >
//             Add to Wishlist
//           </button>
//         )}

//         {!user && (
//           <button
//             disabled
//             className="w-full py-2 mt-2 bg-slate-200 text-slate-500 rounded-lg cursor-not-allowed"
//             aria-label="Sign in to add to wishlist"
//           >
//             Sign in to Add to Wishlist
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }
return (
  <div
    className="border border-slate-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md hover:scale-105 transform transition duration-300 overflow-hidden cursor-pointer"
    onClick={handleCardClick}
    onKeyDown={handleKeyDown}
    tabIndex="0"
    role="article"
    aria-label={`${product.title} product card`}
  >
    {/* Screen reader announcement */}
    <div 
      aria-live="assertive" 
      className="sr-only" 
      role="status"
    >
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
            className="w-full py-2 mt-2 bg-yellow-500 dark:bg-yellow-600 text-white rounded-lg hover:bg-yellow-600 dark:hover:bg-yellow-700 transition-colors"
            aria-label={`Edit product: ${product.title}`}
          >
            Edit Product
          </button>
          <button
            onClick={handleDelete}
            onKeyDown={(e) => e.stopPropagation()}
            className="w-full py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-colors"
            aria-label={`Delete product: ${product.title}`}
          >
            Delete Product
          </button>
        </>
      )}

      {user && !user.isadmin && (
        <button
          onClick={handleAddToWishlist}
          onKeyDown={(e) => e.stopPropagation()}
          className="w-full py-2 mt-2 text-white rounded-lg transition-colors bg-sky-600 dark:bg-sky-700 hover:bg-sky-700 dark:hover:bg-sky-800"
          aria-label={`Add ${product.title} to wishlist`}
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
);
}