'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { jobService } from '@/services/jobService';
import { Job } from '@/types';

export default function AdminJobsPage() {
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
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">Brouillon</span>;
      case 'OPEN':
        return <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-semibold">Ouverte</span>;
      case 'CLOSED':
        return <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold">Fermée</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des offres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Gestion des offres d'emploi
          </h1>
          <Link
            href="/dashboard/admin"
            className="text-blue-600 hover:underline font-medium"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {jobs.length === 0 ? (
          <div className="bg-white border rounded-lg p-10 text-center shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Aucune offre disponible
            </h3>
            <p className="text-gray-500">
              Les offres apparaîtront ici
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white border rounded-xl shadow-sm hover:shadow-md transition p-6"
              >
                
                {/* Top */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {job.title}
                    </h2>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-1">
                      <span>📍 {job.location}</span>
                      <span>💼 {job.contractType}</span>
                      <span>📊 {job.experienceYears} ans</span>
                    </div>
                  </div>

                  {getStatusBadge(job.status)}
                </div>

                {/* Creator + Applications */}
                <div className="flex flex-wrap gap-4 text-sm mb-3">
                  {job.createdBy && (
                    <span className="text-gray-600">
                      👤 {job.createdBy.firstName} {job.createdBy.lastName}
                    </span>
                  )}
                  {job._count && (
                    <span className="text-blue-600 font-medium">
                      {job._count.applications} candidature(s)
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {job.description}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {job.skills.slice(0, 5).map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.skills.length > 5 && (
                    <span className="text-gray-400 text-xs">
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