import React from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function AlertItem({ alert, onDelete }) {
  const { productId, title, currentPrice, targetPrice } = alert;
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="flex items-center justify-between p-4 mb-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-sm transform transition-all duration-200 hover:scale-[1.01] cursor-pointer"
    onClick={handleCardClick} >
      <div>
        <h3 className="font-semibold text-slate-800 dark:text-gray-200">{title}</h3>
        <p className="text-sm text-slate-600 dark:text-gray-400">
          Current: <span className="font-mono text-emerald-600 dark:text-emerald-400">₹{currentPrice}</span> 
          &nbsp;|&nbsp; 
          Target: <span className="font-mono text-sky-600 dark:text-sky-400">₹{targetPrice}</span>
        </p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(productId)}}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors"
        title="Delete this alert"
        aria-label={`Delete ${title} alert`}>
        <FiTrash2 className="text-red-500 dark:text-red-400 w-5 h-5 transition-colors" />
      </button>
    </div>
  );
}