'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get('/candidate/applications');
        setApplications(response.data);
      } catch (error) {
        console.error('Erreur:', error);
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
          {applications.map((app: any) => (
            <div key={app.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{app.jobTitle}</h3>
                  <p className="text-gray-600">{app.company}</p>
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