// src/pages/Alerts.jsx
import React from 'react';

export default function Alerts() {
  return (
    <main 
      className="min-h-screen pt-20 px-4 bg-gray-100 dark:bg-zinc-900 transition-colors duration-300"
      aria-label="Notifications and alerts"
    >
      <div className="max-w-3xl mx-auto text-center py-12">
        <h1 className="text-4xl font-bold mb-4 text-slate-800 dark:text-slate-200">
          Notifications & Alerts
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          You’ll see your latest price drop alerts, restock notices, and more here.
        </p>
        <p 
          className="mt-6 text-lg text-gray-500 dark:text-gray-300"
          role="status"
          aria-live="polite"
        >
          No new alerts yet. Stay tuned for important updates!
        </p>
      </div>
    </main>
  );
}