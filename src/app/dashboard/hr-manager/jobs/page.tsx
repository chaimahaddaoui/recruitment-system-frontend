'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jobService } from '@/services/jobService';
import { Job, JobStatus } from '@/types';
import Link from 'next/link';

export default function HRJobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await jobService.getAllJobs();
      setJobs(data);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Publier offre (DRAFT → OPEN)
  const handlePublish = async (id: number) => {
    try {
      setLoadingId(id);

      await jobService.updateJob(id, { status: JobStatus.OPEN });

      await fetchJobs();

      alert('✅ Offre publiée avec succès !');
    } catch (err) {
      console.error(err);
      alert('❌ Erreur lors de la publication');
    } finally {
      setLoadingId(null);
    }
  };

  // 🔵 Modifier offre
  const handleEdit = (id: number) => {
    router.push(`/dashboard/hr-manager/jobs/edit/${id}`);
  };

  // 🏷️ badge status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return (
          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
            Brouillon
          </span>
        );
      case 'OPEN':
        return (
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
            Publiée
          </span>
        );
      case 'CLOSED':
        return (
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
            Fermée
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* HEADER */}
     

<header className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Offres</h1>
          <p className="text-sm text-gray-600">Valider et publier les offres d'emploi</p>
        </div>
      </div>
      <Link 
        href="/dashboard/hr-manager" 
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold transition"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Retour
      </Link>
    </div>
  </div>
</header>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-4 py-8">

        {jobs.length === 0 ? (
          <p>Aucune offre trouvée</p>
        ) : (
          <div className="grid gap-6">

            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white p-6 rounded shadow hover:shadow-lg transition"
              >

                {/* TITLE + STATUS */}
                <div className="flex justify-between">
                  <h2 className="text-xl font-bold">{job.title}</h2>
                  {getStatusBadge(job.status)}
                </div>

                {/* INFO */}
                <div className="text-gray-600 mt-2 text-sm">
                  📍 {job.location} | 💼 {job.contractType} | ⏳ {job.experienceYears} ans
                </div>

                {/* DESCRIPTION */}
                <p className="mt-3 text-gray-700">
                  {job.description}
                </p>

                {/* SKILLS */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {job.skills?.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* BUTTONS */}
                <div className="flex gap-3 mt-5">

                 
                {/* Modifier */}
                <Link
                  href={`/dashboard/hr-manager/jobs/edit/${job.id}`}
                  className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-semibold transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Modifier
                </Link>

                  {/* 🟢 Publier (seulement DRAFT) */}
                  {job.status === 'DRAFT' && (
                    <button
                      onClick={() => handlePublish(job.id)}
                      disabled={loadingId === job.id}
                      className={`px-4 py-2 rounded text-white ${
                        loadingId === job.id
                          ? 'bg-gray-400'
                          : 'bg-green-500 hover:bg-green-600'
                      }`}
                    >
                      {loadingId === job.id ? 'Publication...' : 'Publier'}
                    </button>
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