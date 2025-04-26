import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import { FiExternalLink } from 'react-icons/fi' ;

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
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          ← Back
        </button>
        <div
          className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow transition-colors opacity-0 animate-fade-in-up"
          style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
        >
          <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-900 dark:text-white">
            Compare Products
          </h1>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr>
                  <th className="p-4 border-b"></th>
                  <th className="p-4 border-b text-left text-lg font-semibold text-gray-800 dark:text-gray-200">{leftProd.title}</th>
                  <th className="p-4 border-b text-left text-lg font-semibold text-gray-800 dark:text-gray-200">{rightProd.title}
                    <button
                      onClick={() => navigate(`/product/${rightId}`)}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      <FiExternalLink className="inline-block ml-1" size={16} />
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