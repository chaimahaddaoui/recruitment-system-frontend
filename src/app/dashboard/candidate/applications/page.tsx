'use client';

import { JSX, useEffect, useState } from 'react';
import api from '@/lib/api';

export default function ApplicationsPage(): JSX.Element {
  const [applications, setApplications] = useState<any[]>([]); // ✅ tableau typé
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // 🔥 CORRECTION URL
        const response = await api.get('/applications/my-applications');

        console.log('API RESPONSE:', response.data);

        // 🔥 CORRECTION DATA
        if (Array.isArray(response.data)) {
          setApplications(response.data);
        } else if (Array.isArray(response.data.applications)) {
          setApplications(response.data.applications);
        } else {
          setApplications([]);
        }

      } catch (error) {
        console.error('Erreur:', error);
        setApplications([]); // sécurité
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Mes Candidatures</h1>
      
      {applications.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500">Aucune candidature pour le moment</p>
        </div>
      ) : (
        <div className="grid gap-4">
          
          {/* 🔥 PROTECTION */}
          {Array.isArray(applications) && applications.map((app: any) => (
            
            <div key={app.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="flex justify-between items-start">
                <div>
                  {/* 🔥 BACKEND CORRECTION */}
                  <h3 className="text-xl font-semibold">
                    {app.job?.title || 'Titre non disponible'}
                  </h3>
                  <p className="text-gray-600">
                    {app.job?.company || 'Entreprise'}
                  </p>
                </div>

                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  app.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {app.status}
                </span>
              </div>

              <p className="text-gray-500 text-sm mt-2">
                Candidature envoyée le {new Date(app.createdAt).toLocaleDateString()}
              </p>
            </div>

          ))}

        </div>
      )}
    </div>
  );
}