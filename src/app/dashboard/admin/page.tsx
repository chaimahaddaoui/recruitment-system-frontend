'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface JobStats {
  id: number;
  title: string;
  status: string;
  totalApplications: number;
  submitted: number;
  shortlisted: number;
  inInterview: number;
  accepted: number;
  rejected: number;
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    recruiters: 0,
    hrManagers: 0,
    candidates: 0,
    totalJobs: 0,
    openJobs: 0,
    draftJobs: 0,
    closedJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0,
  });
  const [jobStats, setJobStats] = useState<JobStats[]>([]);
  const [showReports, setShowReports] = useState(false);

  useEffect(() => {
    const userStr = Cookies.get('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Charger les utilisateurs
      const usersRes = await api.get('/admin/users');
      const users = usersRes.data;

      // Charger toutes les offres
      const jobsRes = await api.get('/jobs');
      const jobs = jobsRes.data;

      // Calculer les stats des candidatures par offre
      const jobStatsData: JobStats[] = [];
      let totalApps = 0;
      let pendingApps = 0;
      let acceptedApps = 0;
      let rejectedApps = 0;

      for (const job of jobs) {
        try {
          const appsRes = await api.get(`/applications/job/${job.id}`);
          const applications = appsRes.data;

          const jobStat: JobStats = {
            id: job.id,
            title: job.title,
            status: job.status,
            totalApplications: applications.length,
            submitted: applications.filter((a: any) => a.status === 'SUBMITTED').length,
            shortlisted: applications.filter((a: any) => a.status === 'SHORTLISTED').length,
            inInterview: applications.filter((a: any) => 
              a.status === 'INTERVIEW_HR_SCREENING' || 
              a.status === 'INTERVIEW_TECHNICAL' || 
              a.status === 'INTERVIEW_HR_FINAL'
            ).length,
            accepted: applications.filter((a: any) => a.status === 'ACCEPTED').length,
            rejected: applications.filter((a: any) => a.status === 'REJECTED').length,
            createdAt: job.createdAt,
          };

          jobStatsData.push(jobStat);

          totalApps += applications.length;
          pendingApps += jobStat.submitted;
          acceptedApps += jobStat.accepted;
          rejectedApps += jobStat.rejected;
        } catch (error) {
          console.error(`Erreur pour l'offre ${job.id}:`, error);
        }
      }

      setJobStats(jobStatsData);

      setStats({
        totalUsers: users.length,
        recruiters: users.filter((u: any) => u.role === 'RECRUITER').length,
        hrManagers: users.filter((u: any) => u.role === 'HR_MANAGER').length,
        candidates: users.filter((u: any) => u.role === 'CANDIDATE').length,
        totalJobs: jobs.length,
        openJobs: jobs.filter((j: any) => j.status === 'OPEN').length,
        draftJobs: jobs.filter((j: any) => j.status === 'DRAFT').length,
        closedJobs: jobs.filter((j: any) => j.status === 'CLOSED').length,
        totalApplications: totalApps,
        pendingApplications: pendingApps,
        acceptedApplications: acceptedApps,
        rejectedApplications: rejectedApps,
      });
    } catch (error) {
      console.error('Erreur lors du chargement des stats:', error);
      alert('Erreur lors du chargement des statistiques');
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
                <p className="text-sm text-gray-600">
                  Bienvenue, {user?.firstName} {user?.lastName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
             
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
              >
                Déconnexion
              </button>
              <Link
  href="/dashboard/change-password"
  className="px-5 py-2.5 rounded-xl border border-indigo-200 text-indigo-700 font-semibold hover:bg-indigo-50 transition"
>
  Modifier mot de passe
</Link>
            </div>
            
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Vue d'ensemble de la plateforme</h2>
          
          {/* Primary Stats - Utilisateurs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stats.totalUsers}</p>
              <p className="text-sm text-gray-600">Total utilisateurs</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stats.recruiters}</p>
              <p className="text-sm text-gray-600">Recruteurs</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stats.hrManagers}</p>
              <p className="text-sm text-gray-600">RH Managers</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stats.candidates}</p>
              <p className="text-sm text-gray-600">Candidats</p>
            </div>

          </div>

          {/* Secondary Stats - Offres & Candidatures */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            
            {/* Offres d'emploi */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-lg p-6 border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-900">{stats.totalJobs}</p>
                  <p className="text-sm text-blue-700 font-medium">Offres d'emploi totales</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {stats.openJobs} ouvertes
                </div>
                <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                  {stats.draftJobs} brouillons
                </div>
                <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                  {stats.closedJobs} fermées
                </div>
              </div>
            </div>

            {/* Candidatures */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl shadow-lg p-6 border border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-3xl font-bold text-purple-900">{stats.totalApplications}</p>
                  <p className="text-sm text-purple-700 font-medium">Candidatures totales</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">
                  {stats.pendingApplications} en attente
                </div>
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                  {stats.acceptedApplications} acceptées
                </div>
                <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                  {stats.rejectedApplications} rejetées
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Rapport détaillé par offre */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Rapport détaillé par offre</h2>
            <button
              onClick={() => setShowReports(!showReports)}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-semibold transition-all"
            >
              {showReports ? 'Masquer' : 'Afficher'} les détails
              <svg className={`w-5 h-5 transition-transform ${showReports ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {showReports && (
            <div className="space-y-4">
              {jobStats.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Aucune offre disponible</h3>
                  <p className="text-gray-600">Aucune donnée à afficher pour le moment.</p>
                </div>
              ) : (
                jobStats.map((job) => (
                  <div key={job.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            job.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                            job.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {job.status === 'OPEN' ? 'Ouverte' : job.status === 'DRAFT' ? 'Brouillon' : 'Fermée'}
                          </span>
                          <span className="text-sm text-gray-500">
                            Créée le {new Date(job.createdAt).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-indigo-600">{job.totalApplications}</p>
                        <p className="text-sm text-gray-600">Candidatures</p>
                      </div>
                    </div>

                    {/* Stats détaillées */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                        <p className="text-2xl font-bold text-blue-900">{job.submitted}</p>
                        <p className="text-xs text-blue-700">Soumises</p>
                      </div>
                      <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                        <p className="text-2xl font-bold text-yellow-900">{job.shortlisted}</p>
                        <p className="text-xs text-yellow-700">Pré-sélectionnées</p>
                      </div>
                      <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                        <p className="text-2xl font-bold text-purple-900">{job.inInterview}</p>
                        <p className="text-xs text-purple-700">En entretien</p>
                      </div>
                      <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                        <p className="text-2xl font-bold text-green-900">{job.accepted}</p>
                        <p className="text-xs text-green-700">Acceptées</p>
                      </div>
                      <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                        <p className="text-2xl font-bold text-red-900">{job.rejected}</p>
                        <p className="text-xs text-red-700">Rejetées</p>
                      </div>
                    </div>

                    {/* Taux de conversion */}
                    {job.totalApplications > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Taux d'acceptation:</span>
                          <span className="font-bold text-green-600">
                            {((job.accepted / job.totalApplications) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-2">
                          <span className="text-gray-600">Taux de rejet:</span>
                          <span className="font-bold text-red-600">
                            {((job.rejected / job.totalApplications) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Actions Admin (reste inchangé) */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestion & Administration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <Link
              href="/dashboard/admin/users/create"
              className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-200 border border-gray-100 hover:border-indigo-200 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <svg className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Créer un utilisateur</h3>
              <p className="text-gray-600 text-sm">Ajouter un nouveau compte utilisateur</p>
            </Link>

            <Link
              href="/dashboard/admin/users"
              className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-200 border border-gray-100 hover:border-blue-200 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Gérer les utilisateurs</h3>
              <p className="text-gray-600 text-sm">Modifier ou supprimer des comptes</p>
              <div className="mt-4 inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                {stats.totalUsers} utilisateur{stats.totalUsers > 1 ? 's' : ''}
              </div>
            </Link>

            <Link
              href="/dashboard/admin/jobs"
              className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-200 border border-gray-100 hover:border-green-200 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <svg className="w-6 h-6 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Gérer les offres</h3>
              <p className="text-gray-600 text-sm">Superviser toutes les offres d'emploi</p>
              <div className="mt-4 inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                {stats.totalJobs} offre{stats.totalJobs > 1 ? 's' : ''}
              </div>
            </Link>

          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">État du système</h2>
              <p className="text-sm text-gray-600">Tous les services fonctionnent normalement</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">API Backend</span>
              </div>
              <span className="text-xs font-bold text-green-700">Opérationnel</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Base de données</span>
              </div>
              <span className="text-xs font-bold text-green-700">Opérationnel</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Emails</span>
              </div>
              <span className="text-xs font-bold text-green-700">Opérationnel</span>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}