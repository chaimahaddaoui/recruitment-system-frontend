'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jobService } from '@/services/jobService';
import { Job } from '@/types';
import Link from 'next/link';

export default function RecruiterJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await jobService.getAllJobs();
      setJobs(data);
    } catch (err: any) {
      setError('Erreur lors du chargement des offres');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id: number) => {
    try {
      await jobService.publish(id);
      fetchJobs(); // Recharger la liste
    } catch (err) {
      alert('Erreur lors de la publication');
    }
  };

  const handleClose = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir fermer cette offre ?')) {
      try {
        await jobService.close(id);
        fetchJobs();
      } catch (err) {
        alert('Erreur lors de la fermeture');
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      try {
        await jobService.delete(id);
        fetchJobs();
      } catch (err) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">📝 Brouillon</span>;
      case 'OPEN':
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">✅ Ouverte</span>;
      case 'CLOSED':
        return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">🔒 Fermée</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des offres...</p>
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
            <h1 className="text-3xl font-bold text-blue-600">
              💼 Mes Offres d'Emploi
            </h1>
            <Link
              href="/dashboard/recruiter/jobs/create"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              ➕ Nouvelle Offre
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
            {error}
          </div>
        )}

        {jobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Aucune offre pour le moment
            </h3>
            <p className="text-gray-600 mb-6">
              Créez votre première offre d'emploi pour commencer à recevoir des candidatures
            </p>
            <Link
              href="/dashboard/recruiter/jobs/create"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              ➕ Créer une offre
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        📍 {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        💼 {job.contractType}
                      </span>
                      <span className="flex items-center gap-1">
                        📊 {job.experienceYears} ans d'expérience
                      </span>
                      {job._count && (
                        <span className="flex items-center gap-1">
                          👥 {job._count.applications} candidature(s)
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(job.status)}
                  </div>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-2">
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.slice(0, 5).map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.skills.length > 5 && (
                    <span className="text-gray-500 text-sm">
                      +{job.skills.length - 5} autres
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Link
                    href={`/dashboard/recruiter/jobs/${job.id}`}
                    className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                  >
                    👁️ Voir détails
                  </Link>

                  {job.status === 'DRAFT' && (
                    <button
                      onClick={() => handlePublish(job.id)}
                      className="text-green-600 hover:text-green-800 font-semibold text-sm"
                    >
                      ✅ Publier
                    </button>
                  )}

                  {job.status === 'OPEN' && (
                    <button
                      onClick={() => handleClose(job.id)}
                      className="text-orange-600 hover:text-orange-800 font-semibold text-sm"
                    >
                      🔒 Fermer
                    </button>
                  )}

                  <Link
                    href={`/dashboard/recruiter/jobs/${job.id}/edit`}
                    className="text-purple-600 hover:text-purple-800 font-semibold text-sm"
                  >
                    ✏️ Modifier
                  </Link>

                  <button
                    onClick={() => handleDelete(job.id)}
                    className="text-red-600 hover:text-red-800 font-semibold text-sm"
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}