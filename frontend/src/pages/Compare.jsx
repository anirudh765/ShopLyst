import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import productService from '../services/productService';

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
  if (error)   return <p className="pt-20 text-center text-red-500">{error}</p>;
  if (!leftProd || !rightProd) return <p className="pt-20 text-center">Invalid products to compare.</p>;

  // build feature union
  const keys = Array.from(new Set([
    ...Object.keys(leftProd.features || {}),
    ...Object.keys(rightProd.features || {})
  ]));

  return (
    <div className="min-h-screen pt-20 px-4 bg-gray-100 dark:bg-gray-900">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
      >
        ← Back
      </button>
      <div className="max-w-6xl mx-auto bg-white dark:bg-zinc-800 p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Compare Products
        </h1>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="p-3 border-b"></th>
                <th className="p-3 border-b text-left">{leftProd.title}</th>
                <th className="p-3 border-b text-left">{rightProd.title}</th>
              </tr>
            </thead>
            <tbody>
              {keys.map(key => (
                <tr key={key} className="even:bg-gray-50 dark:even:bg-zinc-700">
                  <td className="p-3 font-medium text-gray-800 dark:text-gray-200">{key}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">{leftProd.features?.[key] ?? '-'}</td>
                  <td className="p-3 text-gray-700 dark:text-gray-300">{rightProd.features?.[key] ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
