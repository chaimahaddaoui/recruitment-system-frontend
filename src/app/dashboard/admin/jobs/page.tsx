'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { jobService } from '@/services/jobService';
import { Job } from '@/types';

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await jobService.getAllJobs();
      setJobs(data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.location?.toLowerCase().includes(search.toLowerCase()) ||
        job.contractType?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === 'ALL' || job.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [jobs, search, statusFilter]);

  const stats = {
    total: jobs.length,
    open: jobs.filter((job) => job.status === 'OPEN').length,
    draft: jobs.filter((job) => job.status === 'DRAFT').length,
    closed: jobs.filter((job) => job.status === 'CLOSED').length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return (
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">
            Brouillon
          </span>
        );
      case 'OPEN':
        return (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
            Ouverte
          </span>
        );
      case 'CLOSED':
        return (
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
            Fermée
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Chargement des offres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">💼</span>
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Gestion des offres d’emploi
                </h1>
                <p className="text-sm text-gray-600">
                  Suivi global des offres créées, validées et publiées
                </p>
              </div>
            </div>

            <Link
              href="/dashboard/admin"
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <p className="text-sm font-semibold text-gray-500">Total offres</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <p className="text-sm font-semibold text-gray-500">Ouvertes</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.open}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <p className="text-sm font-semibold text-gray-500">Brouillons</p>
            <p className="text-3xl font-bold text-gray-600 mt-2">{stats.draft}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <p className="text-sm font-semibold text-gray-500">Fermées</p>
            <p className="text-3xl font-bold text-red-600 mt-2">{stats.closed}</p>
          </div>
        </div>

        {/* Recherche + filtre */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Rechercher par titre, lieu ou type de contrat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="DRAFT">Brouillon</option>
              <option value="OPEN">Ouverte</option>
              <option value="CLOSED">Fermée</option>
            </select>
          </div>
        </div>

        {/* Liste */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-lg">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Aucune offre trouvée
            </h3>
            <p className="text-gray-500">
              Essayez de modifier votre recherche ou le filtre sélectionné.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white border border-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 p-6"
              >
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {job.title}
                    </h2>

                    <div className="flex flex-wrap gap-3 text-sm text-gray-500 mt-2">
                      <span>📍 {job.location || 'Non précisé'}</span>
                      <span>💼 {job.contractType || 'Non précisé'}</span>
                      <span>📊 {job.experienceYears} ans</span>
                    </div>
                  </div>

                  {getStatusBadge(job.status)}
                </div>

                <div className="flex flex-wrap gap-3 text-sm mb-4">
                  {job.createdBy && (
                    <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium">
                      👤 {job.createdBy.firstName} {job.createdBy.lastName}
                    </span>
                  )}

                  {job._count && (
                    <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full font-medium">
                      {job._count.applications} candidature(s)
                    </span>
                  )}
                </div>

                <p className="text-gray-600 mb-5 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-5">
                  {job.skills?.slice(0, 5).map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold"
                    >
                      {skill}
                    </span>
                  ))}

                  {job.skills && job.skills.length > 5 && (
                    <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-semibold">
                      +{job.skills.length - 5} autres
                    </span>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}