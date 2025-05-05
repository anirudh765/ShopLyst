import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getAlerts, deleteAlert } from '../services/notificationService';
import AlertItem from '../components/AlertItem';
import { FiBell } from 'react-icons/fi';
import { toast } from 'react-toastify';
import GenericModal from '../components/GenericModal';

export default function Alerts() {
  const { user } = useContext(AuthContext);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalState, setModalState] = useState({
    open: false,
    productId: null
  });

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getAlerts()
      .then(setAlerts)
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [user]);

  const handleDeleteConfirm = async () => {
    try {
      const productId = modalState.productId;
      if (!productId) return;
      
      await deleteAlert(productId);
      toast.info('Alert deleted successfully!');
      setAlerts((prev) => prev.filter((a) => a.productId !== productId));
    } catch (err) {
      console.error('Unable to delete alert:', err);
      toast.error('Failed to delete alert');
    }
  };

  const handleDelete = (productId) => {
    setModalState({
      open: true,
      productId: productId
    });
  };

  // Base styling for content that's shown when waiting for data or encountering errors
  const messageStyle = "p-4 text-center";

  if (!user) return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-900 transition-colors duration-200">
      <div className={`${messageStyle} text-gray-700 dark:text-gray-200`}>
        Please log in to view alerts.
      </div>
    </div>
  );
  
  if (loading) return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-900 transition-colors duration-200">
      <div className={`${messageStyle} text-gray-700 dark:text-gray-200`}>
        Loading alerts…
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-900 transition-colors duration-200">
      <div className={`${messageStyle} text-red-500 dark:text-red-400`}>
        {error}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <div className="pt-24 px-4 max-w-2xl mx-auto">
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

      <GenericModal
        isOpen={modalState.open}
        title="Delete Alert"
        message="Are you sure you want to delete this price alert?"
        confirmText="Delete"
        cancelText="Cancel"
        requireInput={false}
        onCancel={() => setModalState({ open: false, productId: null })}
        onConfirm={() => {
          handleDeleteConfirm();
          setModalState({ open: false, productId: null });
        }}
      />
    </div>
  );
}