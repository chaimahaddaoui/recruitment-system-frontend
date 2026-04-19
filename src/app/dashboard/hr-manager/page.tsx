'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export default function HRManagerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      const userData = JSON.parse(userCookie);
      setUser(userData);
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    router.push('/auth/login');
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-purple-600">Dashboard RH Manager</h1>
              <p className="text-gray-600 mt-1">Bienvenue, {user?.firstName} {user?.lastName} !</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-700">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions rapides */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Toutes les offres */}
            <Link
              href="/dashboard/hr-manager/jobs"
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-lg p-8 transition transform hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">📋 Toutes les Offres</h3>
                  <p className="text-blue-100">Gérer et valider les offres</p>
                </div>
                <div className="text-6xl">💼</div>
              </div>
            </Link>

            {/* Candidatures */}
            <Link
              href="/dashboard/hr-manager/applications"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg shadow-lg p-8 transition transform hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">📨 Candidatures</h3>
                  <p className="text-green-100">Gérer toutes les candidatures</p>
                </div>
                <div className="text-6xl">👥</div>
              </div>
            </Link>

            {/* Mes Entretiens RH */}
            <Link
              href="/dashboard/hr-manager/interviews"
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg shadow-lg p-8 transition transform hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">📅 Mes Entretiens RH</h3>
                  <p className="text-purple-100">Gérer mes entretiens RH</p>
                </div>
                <div className="text-6xl">🗣️</div>
              </div>
            </Link>

            {/* Statistiques Recruteurs */}
            <Link
              href="/dashboard/hr-manager/stats"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg shadow-lg p-8 transition transform hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">📊 Statistiques</h3>
                  <p className="text-orange-100">Voir les performances</p>
                </div>
                <div className="text-6xl">📈</div>
              </div>
            </Link>

            {/* Liste Utilisateurs */}
            <Link
              href="/dashboard/hr-manager/users"
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-lg shadow-lg p-8 transition transform hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">👥 Utilisateurs</h3>
                  <p className="text-indigo-100">Voir tous les utilisateurs</p>
                </div>
                <div className="text-6xl">🔍</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Informations du compte */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Informations du compte</h2>
          <div className="space-y-2">
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Nom:</strong> {user?.firstName} {user?.lastName}</p>
            <p>
              <strong>Rôle:</strong>{' '}
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                {user?.role}
              </span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}