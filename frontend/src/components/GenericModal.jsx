import React, { useState, useEffect } from 'react';

export default function GenericModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  requireInput = false,
  inputLabel = '',
  placeholder = '',
  onCancel,
  onConfirm,
}) {
  const [inputValue, setInputValue] = useState('');

  // reset input if modal reopened
  useEffect(() => {
    if (isOpen) setInputValue('');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (requireInput) {
      onConfirm(inputValue);
    } else {
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-80">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{message}</p>
        {requireInput && (
          <div className="mb-4">
            {inputLabel && (
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {inputLabel}
              </label>
            )}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={placeholder}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>
        )}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
