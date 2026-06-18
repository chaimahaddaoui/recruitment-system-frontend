'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { applicationService } from '@/services/applicationService';
import { jobService } from '@/services/jobService';
import { Application, Job } from '@/types';
import toast from 'react-hot-toast';

export default function AIScoreDetailsPage() {
  const params = useParams();
  const router = useRouter();
  
  const jobId = params?.id ? parseInt(params.id as string) : null;
  const applicationId = params?.applicationId ? parseInt(params.applicationId as string) : null;

  const [job, setJob] = useState<Job | null>(null);
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (jobId && applicationId) {
      fetchData();
    }
  }, [jobId, applicationId]);

  const fetchData = async () => {
    try {
      const appData = await applicationService.getApplicationById(applicationId!);
      const jobData = await jobService.getJobById(jobId!);
      
      setApplication(appData);
      setJob(jobData);
    } catch (error: any) {
      toast.error('❌ Erreur lors du chargement des données');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement du score IA...</p>
        </div>
      </div>
    );
  }

  if (!application || !job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-red-600 font-bold mb-4">Erreur : Données non disponibles</p>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  const aiAnalysis = application.aiAnalysis as any;
  const matchingResult = aiAnalysis?.matchingResult || {};
  const skillsAnalysis = matchingResult?.skills_analysis || {};
  const score = application.aiMatchScore || 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    if (score >= 40) return 'bg-orange-100';
    return 'bg-red-100';
  };

  // Récupère toutes les compétences requises
  const requiredSkills = skillsAnalysis.total_required || 0;
  const matchedSkills = skillsAnalysis.total_matched || 0;
  const presentSkills = skillsAnalysis.exact_match || [];
  const missingSkills = skillsAnalysis.missing_skills || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold mb-4 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5h.01" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {application.candidate?.firstName} {application.candidate?.lastName}
              </h1>
              <p className="text-gray-600 mt-1">Poste : {job?.title}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Score Principal */}
        <div className={`${getScoreBgColor(score)} rounded-2xl shadow-xl p-8 mb-12 border-2 ${score >= 80 ? 'border-green-300' : score >= 60 ? 'border-yellow-300' : 'border-orange-300'}`}>
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0">
              <div className={`w-28 h-28 rounded-full flex items-center justify-center ${score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-orange-500'}`}>
                <span className="text-5xl font-bold text-white">{Math.round(score)}%</span>
              </div>
            </div>
            <div className="flex-1">
              <h2 className={`text-3xl font-bold ${getScoreColor(score)} mb-2`}>
                {score >= 80 ? '✅ Excellent Match' : score >= 60 ? '⚠️ Bon Match' : score >= 40 ? '⚠️ Match Moyen' : '❌ Match Faible'}
              </h2>
              <p className="text-gray-700 text-lg mb-3">
                Ce candidat correspond à <strong>{Math.round(score)}%</strong> aux critères de la position.
              </p>
              <div className="flex gap-6">
                <div>
                  <p className="text-sm text-gray-600">Compétences matchées</p>
                  <p className="text-2xl font-bold text-blue-600">{matchedSkills}/{requiredSkills}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Taux de compatibilité</p>
                  <p className="text-2xl font-bold text-indigo-600">{requiredSkills > 0 ? Math.round((matchedSkills / requiredSkills) * 100) : 0}%</p>
                </div>
              </div>
              {matchingResult.recommendation && (
                <p className="text-gray-600 mt-4 italic text-sm">
                  "📌 {matchingResult.recommendation}"
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Compétences - Vue d'ensemble */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Analyse des Compétences Requises
          </h2>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Toutes les compétences de l'offre</h3>
              
              {requiredSkills === 0 ? (
                <p className="text-gray-500 text-center py-8">Aucune compétence requise définie</p>
              ) : (
                <div className="space-y-3">
                  {/* Compétences présentes */}
                  {presentSkills.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <p className="font-semibold text-gray-800">Compétences Présentes ({presentSkills.length})</p>
                      </div>
                      <div className="flex flex-wrap gap-3 ml-6 mb-6">
                        {presentSkills.map((skill: string) => (
                          <div
                            key={skill}
                            className="bg-green-50 border-2 border-green-300 text-green-800 px-4 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-green-100 transition"
                          >
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {skill}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Compétences manquantes */}
                  {missingSkills.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                        <p className="font-semibold text-gray-800">Compétences Manquantes ({missingSkills.length})</p>
                      </div>
                      <div className="flex flex-wrap gap-3 ml-6">
                        {missingSkills.map((skill: string) => (
                          <div
                            key={skill}
                            className="bg-red-50 border-2 border-red-300 text-red-800 px-4 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-red-100 transition"
                          >
                            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            {skill}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Barre de progression */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <div className="flex justify-between mb-3">
                <p className="font-semibold text-gray-800">Couverture des compétences</p>
                <p className="font-bold text-blue-600">{requiredSkills > 0 ? Math.round((matchedSkills / requiredSkills) * 100) : 0}%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${requiredSkills > 0 ? (matchedSkills / requiredSkills) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-green-50 rounded-xl border-2 border-green-200 p-6">
            <div className="text-sm text-green-600 font-semibold mb-2">✅ Compétences Présentes</div>
            <div className="text-3xl font-bold text-green-700">{presentSkills.length}</div>
            <p className="text-xs text-green-600 mt-2">correspondances trouvées</p>
          </div>
          
          <div className="bg-red-50 rounded-xl border-2 border-red-200 p-6">
            <div className="text-sm text-red-600 font-semibold mb-2">❌ Compétences Manquantes</div>
            <div className="text-3xl font-bold text-red-700">{missingSkills.length}</div>
            <p className="text-xs text-red-600 mt-2">à développer</p>
          </div>

          <div className="bg-blue-50 rounded-xl border-2 border-blue-200 p-6">
            <div className="text-sm text-blue-600 font-semibold mb-2">📊 Total Requis</div>
            <div className="text-3xl font-bold text-blue-700">{requiredSkills}</div>
            <p className="text-xs text-blue-600 mt-2">compétences requises</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition-all hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour à la liste
          </button>
          
          <button
            onClick={() => router.push(`/dashboard/recruiter/jobs/${jobId}/applications`)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2 1m2-1l-2-1m2 1v2.5" />
            </svg>
            Voir toutes les candidatures
          </button>
        </div>
      </main>
    </div>
  );
}