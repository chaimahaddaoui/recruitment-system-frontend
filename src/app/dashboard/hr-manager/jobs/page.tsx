'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jobService } from '@/services/jobService';
import { Job } from '@/types';
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

      await jobService.validate(id);

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
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between">
          <h1 className="text-3xl font-bold text-purple-600">
            Dashboard RH - Offres
          </h1>

          <Link href="/dashboard/hr-manager" className="text-gray-600">
            ← Retour
          </Link>
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

                  {/* 🔵 Modifier */}
                  <button
                    onClick={() => handleEdit(job.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Modifier
                  </button>

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