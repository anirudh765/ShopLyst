import React, { useEffect, useRef } from 'react';
import { FiX } from 'react-icons/fi';

export default function NotificationToast({ notification, onClose }) {
  const { _id, title, message } = notification;
  const toastRef = useRef(null);
  
  // Auto-dismiss timer
  useEffect(() => {
    const timer = setTimeout(() => onClose(_id), 5000);
    return () => clearTimeout(timer);
  }, [_id, onClose]);

  // Handle Escape key to dismiss
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose(_id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [_id, onClose]);

  // Focus management - focus the toast when it appears
  useEffect(() => {
    if (toastRef.current) {
      toastRef.current.focus();
    }
  }, []);

  return (
    <div
      ref={toastRef}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      tabIndex={0}
      className="max-w-sm w-full bg-sky-50 shadow-xl rounded-2xl flex ring-1 ring-sky-200 overflow-hidden mb-4 focus:outline-none focus:ring-2 focus:ring-sky-400"
    >
      <div className="flex-1 p-4">
        <h3 className="font-semibold text-slate-800">{title}</h3>
        <p className="mt-1 text-sm text-slate-600">{message}</p>
      </div>
      <div className="p-3 flex items-start">
        <button
          onClick={() => onClose(_id)}
          aria-label="Close notification"
          className="text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-400 rounded"
        >
          <FiX className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}