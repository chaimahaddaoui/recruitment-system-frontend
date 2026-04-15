'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { jobService } from '@/services/jobService';
import { applicationService } from '@/services/applicationService';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export default function RecruiterDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    pendingReview: 0,
    scheduledInterviews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      const userData = JSON.parse(userCookie);
      setUser(userData);
      fetchStats();
    }
  }, []);

  const fetchStats = async () => {
    try {
      const jobs = await jobService.getAllJobs();
      const activeJobs = jobs.filter(j => j.status === 'OPEN').length;
      
      // Calculer le total de candidatures
      let totalApps = 0;
      let pendingReview = 0;
      
      for (const job of jobs) {
        const apps = await applicationService.getApplicationsByJob(job.id);
        totalApps += apps.length;
        pendingReview += apps.filter(a => a.status === 'SUBMITTED').length;
      }

      setStats({
        activeJobs,
        totalApplications: totalApps,
        pendingReview,
        scheduledInterviews: 0, // TODO: compter les entretiens
      });
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
              <h1 className="text-3xl font-bold text-blue-600">Dashboard Recruteur</h1>
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Offres actives</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.activeJobs}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Candidatures reçues</h3>
            <p className="text-3xl font-bold text-green-600">{stats.totalApplications}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">En attente</h3>
            <p className="text-3xl font-bold text-orange-600">{stats.pendingReview}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Entretiens planifiés</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.scheduledInterviews}</p>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Créer une offre */}
            <Link
              href="/dashboard/recruiter/jobs/create"
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-lg p-8 transition transform hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">➕ Créer une offre</h3>
                  <p className="text-blue-100">Publier une nouvelle offre d'emploi</p>
                </div>
                <div className="text-6xl">📝</div>
              </div>
            </Link>

            {/* Voir mes offres */}
            <Link
              href="/dashboard/recruiter/jobs"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg shadow-lg p-8 transition transform hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">📋 Voir mes offres</h3>
                  <p className="text-green-100">Gérer mes offres et candidatures</p>
                </div>
                <div className="text-6xl">💼</div>
              </div>
            </Link>

            {/* Mes Entretiens */}
            <Link
              href="/dashboard/recruiter/interviews"
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg shadow-lg p-8 transition transform hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">📅 Mes Entretiens</h3>
                  <p className="text-purple-100">Gérer mes entretiens techniques planifiés</p>
                </div>
                <div className="text-6xl">💻</div>
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
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                {user?.role}
              </span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}