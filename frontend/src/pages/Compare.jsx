import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import { FiArrowLeft, FiExternalLink } from 'react-icons/fi';

export default function Compare() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const leftId = params.get('left');
  const rightId = params.get('right');

  const [leftProd, setLeftProd] = useState(null);
  const [rightProd, setRightProd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBoth = async () => {
      setLoading(true);
      try {
        const [lp, rp] = await Promise.all([
          productService.getProductById(leftId),
          productService.getProductById(rightId)
        ]);
        setLeftProd(lp);
        setRightProd(rp);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    if (leftId && rightId) fetchBoth();
  }, [leftId, rightId]);

  if (loading) return <p className="pt-20 text-center">Loading comparison...</p>;
  if (error) return <p className="pt-20 text-center text-red-500">{error}</p>;
  if (!leftProd || !rightProd) return <p className="pt-20 text-center">Invalid products to compare.</p>;

  const keys = Array.from(new Set([
    ...Object.keys(leftProd.features || {}),
    ...Object.keys(rightProd.features || {})
  ]));

  return (
    <div className="min-h-screen pt-20 px-4 bg-gradient-to-br from-zinc-100 to-gray-200 dark:from-zinc-900 dark:to-black transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div
          className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow transition-colors opacity-0 animate-fade-in-up relative"
          style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
        >
          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 flex items-center gap-1 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-all duration-200 group"
            aria-label="Go back"
          >
            <FiArrowLeft className="text-lg group-hover:scale-110 transition-transform" />
            <span className="group-hover:text-lg transition-all font-medium">Back</span>
          </button>
          
          <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-900 dark:text-white">
            Compare Products
          </h1>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr>
                  <th className="p-4 border-b"></th>
                  <th className="p-4 border-b text-left">
                  <button 
                    onClick={() => navigate(`/product/${leftId}`)}
                    className="text-lg font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all group flex items-center hover:scale-105 origin-left"
                    aria-label={`View ${leftProd.title} details`}
                  >
                    {leftProd.title}
                    <FiExternalLink 
                      className="ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" 
                      size={16} 
                    />
                  </button>
                  </th>
                  <th className="p-4 border-b text-left">
                    <button 
                      onClick={() => navigate(`/product/${rightId}`)}
                      className="text-lg font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all group flex items-center hover:scale-105 origin-left"
                      aria-label={`View ${rightProd.title} details`}
                    >
                      {rightProd.title}
                      <FiExternalLink 
                        className="ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" 
                        size={16} 
                      />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {keys.map(key => (
                  <tr key={key} className="even:bg-gray-50 dark:even:bg-zinc-700">
                    <td className="p-4 font-medium text-gray-800 dark:text-gray-200">{key}</td>
                    <td className="p-4 text-gray-700 dark:text-gray-300">{leftProd.features?.[key] ?? '-'}</td>
                    <td className="p-4 text-gray-700 dark:text-gray-300">{rightProd.features?.[key] ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}