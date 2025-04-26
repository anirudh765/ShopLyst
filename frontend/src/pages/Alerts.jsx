import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getAlerts, deleteAlert } from '../services/notificationService';
import AlertItem from '../components/AlertItem';
import { FiBell } from 'react-icons/fi';

export default function Alerts() {
  const { user } = useContext(AuthContext);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getAlerts()
      .then(setAlerts)
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async (productId) => {
    if (!window.confirm('Delete this alert?')) return;
    try {
      await deleteAlert(productId);
    } catch (err) {
      console.error('Unable to delete alert:', err);
    }
    setAlerts((prev) => prev.filter((a) => a.productId !== productId));
  };

  if (!user) return <p className="p-4 text-gray-700 dark:text-gray-200">Please log in to view alerts.</p>;
  if (loading) return <p className="p-4 text-gray-700 dark:text-gray-200">Loading alerts…</p>;
  if (error) return <p className="p-4 text-red-500 dark:text-red-400">{error}</p>;

  return (
    <div className="pt-24 px-4 max-w-2xl mx-auto min-h-screen bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <h1 className="text-2xl font-bold mb-6 dark:text-gray-200 transition-colors">
        Your Price‑Drop Alerts
      </h1>
      {alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-600 dark:text-gray-400">
          <FiBell className="w-12 h-12 mb-4 opacity-75" />
          <p className="text-lg">No active price alerts</p>
          <p className="text-sm mt-2">We'll notify you when prices drop!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <AlertItem
              key={alert.productId}
              alert={alert}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}