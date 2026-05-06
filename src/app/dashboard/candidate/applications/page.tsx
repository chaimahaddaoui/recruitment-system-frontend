'use client';

import { JSX, useEffect, useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function ApplicationsPage(): JSX.Element {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get('/applications/my-applications');

        if (Array.isArray(response.data)) {
          setApplications(response.data);
        } else if (Array.isArray(response.data.applications)) {
          setApplications(response.data.applications);
        } else {
          setApplications([]);
        }

      } catch (error) {
        console.error('Erreur:', error);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  /* 🔄 LOADER */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="h-14 w-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">

      {/* 🔥 HEADER */}
      <header className="bg-white/80 backdrop-blur-md border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-4">

            {/* 🔙 BOUTON RETOUR */}
            <button
              onClick={() => router.push('/dashboard/candidate')}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl text-sm font-medium transition"
            >
              ⬅ Retour
            </button>

            {/* TITRE */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                📄 Mes candidatures
              </h1>
              <p className="text-gray-500 text-sm">
                Suivez l'état de vos candidatures
              </p>
            </div>

          </div>

        </div>
      </header>

      {/* 🔥 CONTENU */}
      <main className="max-w-5xl mx-auto px-6 py-8">

        {applications.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow text-center">
            <p className="text-gray-500 text-lg">
              Aucune candidature pour le moment
            </p>
          </div>
        ) : (

          <div className="grid gap-6">

            {applications.map((app: any) => {

              const statusStyle =
                app.status === 'PENDING'
                  ? 'bg-yellow-100 text-yellow-800'
                  : app.status === 'ACCEPTED'
                  ? 'bg-green-100 text-green-800'
                  : app.status === 'INTERVIEW_SCHEDULED'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-red-100 text-red-800';

              return (
                <div
                  key={app.id}
                  className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition duration-300 border"
                >

                  {/* TOP */}
                  <div className="flex justify-between items-start gap-4">

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {app.job?.title || 'Titre non disponible'}
                      </h3>

                      <p className="text-gray-500 mt-1">
                        {app.job?.company || 'Entreprise'}
                      </p>
                    </div>

                    <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${statusStyle}`}>
                      {app.status}
                    </span>
                  </div>

                  {/* DATE */}
                  <p className="text-gray-400 text-sm mt-3">
                    📅 Envoyée le {new Date(app.createdAt).toLocaleDateString()}
                  </p>

                  {/* COVER LETTER */}
                  {app.coverLetter && (
                    <div className="mt-4 bg-gray-50 p-4 rounded-xl border">
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {app.coverLetter}
                      </p>
                    </div>
                  )}

                  {/* ACTIONS */}
                  <div className="mt-4 flex gap-3">

                    {app.interview && (
                      <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700">
                        👁️ Voir entretien
                      </button>
                    )}

                    {app.status === 'ACCEPTED' && (
                      <span className="text-green-600 text-sm font-semibold">
                        🎉 Acceptée
                      </span>
                    )}

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </main>
    </div>
  );
}