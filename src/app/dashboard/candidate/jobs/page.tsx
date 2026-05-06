'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { jobService } from '@/services/jobService';
import { Job } from '@/types';
import { useRouter } from 'next/navigation';

export default function CandidateJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await jobService.getOpenJobs();
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  /* 🔄 LOADER */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">

      {/* 🔥 HEADER */}
      <header className="bg-white/80 backdrop-blur-md border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">

          <div className="flex items-center gap-4 mb-4">

            {/* 🔙 BOUTON RETOUR */}
            <button
              onClick={() => router.push('/dashboard/candidate')}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl text-sm font-medium transition"
            >
              ⬅ Retour
            </button>

            {/* TITRE */}
            <h1 className="text-3xl font-bold text-gray-900">
               Offres d'emploi
            </h1>
          </div>

          {/* 🔍 SEARCH */}
          <input
            type="text"
            placeholder="Rechercher par titre, lieu ou compétence..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-xl px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />

        </div>
      </header>

      {/* 🔥 LIST */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        <p className="text-gray-600 mb-6">
          {filteredJobs.length} offre(s) trouvée(s)
        </p>

        <div className="grid gap-6">

          {filteredJobs.map(job => (
            <div
              key={job.id}
              className="bg-white rounded-2xl p-6 shadow hover:shadow-xl transition duration-300 border"
            >

              {/* TOP */}
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-bold text-gray-900">
                  {job.title}
                </h2>

                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Ouverte
                </span>
              </div>

              {/* INFOS */}
              <p className="text-gray-600 mb-2">📍 {job.location}</p>
              <p className="text-gray-500 mb-4">{job.contractType}</p>

              {/* SKILLS */}
              <div className="flex flex-wrap gap-2 mb-4">
                {job.skills.map((s, i) => (
                  <span
                    key={i}
                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3">

                <Link
                  href={`/dashboard/candidate/jobs/${job.id}`}
                  className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                >
                  Voir
                </Link>

                <Link
                  href={`/dashboard/candidate/jobs/${job.id}/apply`}
                  className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
                >
                  Postuler
                </Link>

              </div>

            </div>
          ))}

        </div>

      </main>
    </div>
  );
}