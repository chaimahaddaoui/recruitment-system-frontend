'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HRManagerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = Cookies.get('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-purple-600">
                 Dashboard RH
              </h1>
              <p className="text-gray-500 mt-1">
                Bienvenue, {user?.firstName} {user?.lastName} !
              </p>
            </div>
            {user && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold text-gray-800">{user.email}</p>
                  <p className="text-sm text-purple-600 font-medium">{user.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                   Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Utilisateurs</p>
                <p className="text-3xl font-bold text-purple-600"></p>
              </div>
              <div className="text-4xl"></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Offres Totales</p>
                <p className="text-3xl font-bold text-blue-600"></p>
              </div>
              <div className="text-4xl"></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Candidatures</p>
                <p className="text-3xl font-bold text-green-600"></p>
              </div>
              <div className="text-4xl"></div>
            </div>
          </div>

         
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow mb-8 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Actions Rapides
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Voir toutes les offres */}
            <Link
              href="/dashboard/hr-manager/jobs"
              className="group bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl p-6 transition-all transform hover:scale-105 shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="text-5xl"></div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Toutes les Offres</h3>
                  <p className="text-purple-100 text-sm">
                    Consultez et gérez toutes les offres d'emploi
                  </p>
                </div>
                <div className="text-2xl group-hover:translate-x-2 transition-transform">
                  →
                </div>
              </div>
            </Link>

            {/* Gérer les utilisateurs */}
            <Link
              href="/dashboard/hr-manager/users"
              className="group bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl p-6 transition-all transform hover:scale-105 shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="text-5xl"></div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Utilisateurs</h3>
                  <p className="text-blue-100 text-sm">
                    Gérez les comptes et les permissions
                  </p>
                </div>
                <div className="text-2xl group-hover:translate-x-2 transition-transform">
                  →
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
               Vue d'Ensemble
            </h3>
            <div className="space-y-3">
              <div className="p-4 border border-gray-200 rounded-lg">
                <p className="text-gray-500 text-sm text-center py-8">
                  Statistiques globales à venir
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
               Activité Récente
            </h3>
            <div className="space-y-3">
              <div className="p-4 border border-gray-200 rounded-lg">
                <p className="text-gray-500 text-sm text-center py-8">
                  Aucune activité récente
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}