'use client';

import { useEffect } from 'react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Erreur dashboard:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-5 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-3xl">
          ⚠️
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Une erreur est survenue
        </h1>

        <p className="text-gray-600 mb-6">
          Une erreur inattendue s’est produite dans le dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => reset()}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-xl shadow hover:shadow-md transition"
          >
            Réessayer
          </button>

          <button
            onClick={() => window.location.href = '/dashboard'}
            className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition"
          >
            Retour dashboard
          </button>
        </div>
      </div>
    </div>
  );
}