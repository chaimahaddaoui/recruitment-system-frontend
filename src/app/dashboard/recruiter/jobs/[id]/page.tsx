'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { jobService } from '@/services/jobService';
import { Job } from '@/types';

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.id ? parseInt(params.id as string) : null;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  const fetchJob = async () => {
    if (!jobId) return;

    try {
      const data = await jobService.getJobById(jobId);
      setJob(data);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du chargement de l\'offre');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async () => {
    if (!confirm('Voulez-vous vraiment fermer cette offre ?')) return;

    try {
      await jobService.closeJob(jobId!);
      alert('✅ Offre fermée avec succès');
      router.push('/dashboard/recruiter/jobs');
    } catch (error) {
      alert('❌ Erreur lors de la fermeture');
    }
  };

  const handlePublish = async () => {
    try {
      await jobService.validateAndPublish(jobId!);
      await fetchJob();
      alert('✅ Offre publiée avec succès');
    } catch (error) {
      alert('❌ Erreur lors de la publication');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-bold mb-4">Offre introuvable</p>
          <button
            onClick={() => router.push('/dashboard/recruiter/jobs')}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl"
          >
            Retour aux offres
          </button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-bold border border-gray-200">📝 Brouillon</span>;
      case 'OPEN':
        return <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-bold border border-green-200">✅ Ouverte</span>;
      case 'CLOSED':
        return <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-bold border border-red-200">🔒 Fermée</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour
            </button>
            {getStatusBadge(job.status)}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Titre */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {job.location}
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {job.contractType}
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {job.experienceYears} ans d'expérience
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {job.educationLevel}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Description du poste</h2>
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">{job.description}</p>
        </div>

        {/* Exigences */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Exigences & Qualifications</h2>
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">{job.requirements}</p>
        </div>

        {/* Rémunération */}
        {(job.salaryMin || job.salaryMax) && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Rémunération</h2>
            <p className="text-2xl font-bold text-green-600">
              {job.salaryMin && job.salaryMax
                ? `${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} DT/an`
                : job.salaryMin
                ? `À partir de ${job.salaryMin.toLocaleString()} DT/an`
                : `Jusqu'à ${job.salaryMax?.toLocaleString()} DT/an`}
            </p>
          </div>
        )}

        {/* Compétences */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Compétences requises</h2>
          <div className="flex flex-wrap gap-3">
            {job.skills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium border border-blue-100"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Actions</h2>
          <div className="flex flex-wrap gap-4">
            
            {/* Modifier */}
            {(job.status === 'DRAFT' || job.status === 'OPEN') && (
              <button
                onClick={() => router.push(`/dashboard/recruiter/jobs/${job.id}/edit`)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Modifier
              </button>
            )}

            {/* Publier */}
            {job.status === 'DRAFT' && (
              <button
                onClick={handlePublish}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Publier
              </button>
            )}

            {/* Fermer */}
            {job.status === 'OPEN' && (
              <button
                onClick={handleClose}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Fermer l'offre
              </button>
            )}

            {/* Candidatures */}
            <button
              onClick={() => router.push(`/dashboard/recruiter/jobs/${job.id}/applications`)}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Voir les candidatures ({job._count?.applications || 0})
            </button>

          </div>
        </div>

      </main>
    </div>
  );
}