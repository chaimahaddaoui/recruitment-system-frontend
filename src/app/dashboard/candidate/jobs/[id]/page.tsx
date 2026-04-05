'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { jobService } from '@/services/jobService';
import { Job } from '@/types';
import Link from 'next/link';

export default function JobDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = parseInt(params.id as string);
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const data = await jobService.getJobById(jobId);
      setJob(data);
    } catch (err: any) {
      setError('Erreur lors du chargement de l\'offre');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow p-8 text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Offre introuvable</h3>
          <p className="text-gray-600 mb-6">{error || 'Cette offre n\'existe pas ou a été supprimée.'}</p>
          <Link
            href="/dashboard/candidate/jobs"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            ← Retour aux offres
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link
              href="/dashboard/candidate/jobs"
              className="text-gray-600 hover:text-gray-800 font-medium transition"
            >
              ← Retour aux offres
            </Link>
            <Link
              href={`/dashboard/candidate/jobs/${jobId}/apply`}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-8 rounded-lg transition-colors shadow-lg"
            >
              ✉️ Postuler maintenant
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Job Header Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {job.title}
              </h1>
              
              {/* Quick Info */}
              <div className="flex flex-wrap gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📍</span>
                  <span className="font-medium">{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">💼</span>
                  <span className="font-medium">{job.contractType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">📊</span>
                  <span className="font-medium">{job.experienceYears} ans d'expérience</span>
                </div>
              </div>
            </div>

            <div>
              <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-bold">
                ✅ Ouverte
              </span>
            </div>
          </div>

          {/* Salary */}
          {(job.salaryMin || job.salaryMax) && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💰</span>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Rémunération annuelle</p>
                  <p className="text-xl font-bold text-blue-700">
                    {job.salaryMin?.toLocaleString()} - {job.salaryMax?.toLocaleString()} €/an
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Skills */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase">Compétences requises</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Apply Button */}
          <div className="pt-4 border-t border-gray-200">
            <Link
              href={`/dashboard/candidate/jobs/${jobId}/apply`}
              className="block w-full bg-green-600 hover:bg-green-700 text-white text-center font-bold py-4 px-6 rounded-lg transition-colors shadow-lg text-lg"
            >
              ✉️ Postuler à cette offre
            </Link>
          </div>
        </div>

        {/* Job Details Sections */}
        <div className="space-y-6">
          {/* Description */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>📋</span>
              Description du poste
            </h2>
            <div className="prose max-w-none text-gray-700 whitespace-pre-line">
              {job.description}
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>✅</span>
              Exigences et qualifications
            </h2>
            <div className="prose max-w-none text-gray-700 whitespace-pre-line">
              {job.requirements}
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>ℹ️</span>
              Informations complémentaires
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-l-4 border-purple-500 pl-4">
                <p className="text-sm text-gray-500 font-medium mb-1">Niveau d'études</p>
                <p className="text-lg font-semibold text-gray-900">{job.educationLevel}</p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <p className="text-sm text-gray-500 font-medium mb-1">Expérience requise</p>
                <p className="text-lg font-semibold text-gray-900">{job.experienceYears} année(s)</p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-sm text-gray-500 font-medium mb-1">Type de contrat</p>
                <p className="text-lg font-semibold text-gray-900">{job.contractType}</p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <p className="text-sm text-gray-500 font-medium mb-1">Localisation</p>
                <p className="text-lg font-semibold text-gray-900">{job.location}</p>
              </div>
            </div>
          </div>

          {/* Company Info (if available) */}
          {job.createdBy && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span>🏢</span>
                À propos du recruteur
              </h2>
              <p className="text-gray-700">
                Cette offre a été publiée par <strong>{job.createdBy.firstName} {job.createdBy.lastName}</strong>
              </p>
            </div>
          )}
        </div>

        {/* Bottom Apply Button */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Intéressé(e) par cette opportunité ?
            </h3>
            <p className="text-gray-600 mb-6">
              Postulez maintenant et faites partie de l'aventure !
            </p>
            <Link
              href={`/dashboard/candidate/jobs/${jobId}/apply`}
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-12 rounded-lg transition-colors shadow-lg text-lg"
            >
              ✉️ Envoyer ma candidature
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}