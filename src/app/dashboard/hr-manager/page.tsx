'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function HRManagerDashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = Cookies.get('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-purple-600">
              👔 Dashboard RH Manager
            </h1>
            {user && (
              <div className="text-right">
                <p className="font-semibold text-gray-800">{user.firstName} {user.lastName}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user ? (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm text-gray-500 mb-1">Total utilisateurs</div>
                <div className="text-3xl font-bold text-purple-600">245</div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm text-gray-500 mb-1">Offres totales</div>
                <div className="text-3xl font-bold text-blue-600">48</div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm text-gray-500 mb-1">Candidatures totales</div>
                <div className="text-3xl font-bold text-green-600">1,234</div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm text-gray-500 mb-1">Taux de conversion</div>
                <div className="text-3xl font-bold text-yellow-600">18%</div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Actions rapides</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition">
                  👥 Gérer les utilisateurs
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition">
                  📊 Voir les statistiques
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition">
                  ✅ Validations en attente
                </button>
              </div>
            </div>

            {/* Informations utilisateur */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Informations du compte</h2>
              <div className="space-y-2">
                <p><span className="font-semibold">ID:</span> {user.id}</p>
                <p><span className="font-semibold">Email:</span> {user.email}</p>
                <p><span className="font-semibold">Nom:</span> {user.firstName} {user.lastName}</p>
                <p><span className="font-semibold">Rôle:</span> <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">{user.role}</span></p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        )}
      </main>
    </div>
  );
}