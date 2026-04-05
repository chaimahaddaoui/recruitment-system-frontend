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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold"> Brouillon</span>;
      case 'OPEN':
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold"> Ouverte</span>;
      case 'CLOSED':
        return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold"> Fermée</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
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
            <h1 className="text-3xl font-bold text-purple-600">
               Toutes les Offres d'Emploi
            </h1>
            <Link
              href="/dashboard/hr-manager"
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              ← Retour au dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {jobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Aucune offre pour le moment
            </h3>
            <p className="text-gray-600">
              Les offres créées par les recruteurs apparaîtront ici
            </p>
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
                      <span> {job.location}</span>
                      <span> {job.contractType}</span>
                      <span> {job.experienceYears} ans</span>
                      {job.createdBy && (
                        <span>👤 Par: {job.createdBy.firstName} {job.createdBy.lastName}</span>
                      )}
                      {job._count && (
                        <span> {job._count.applications} candidature(s)</span>
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
                      className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm"
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
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}