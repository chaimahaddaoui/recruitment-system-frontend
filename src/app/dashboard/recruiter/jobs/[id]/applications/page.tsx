'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { applicationService } from '@/services/applicationService';
import { jobService } from '@/services/jobService';
import { Application, Job, InterviewType, ApplicationStatus } from '@/types';
import ScheduleInterviewModal from '@/components/ScheduleInterviewModal';

export default function RecruiterApplicationsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.id ? parseInt(params.id as string) : null;

  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ApplicationStatus | 'all'>('all');
  
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<number | null>(null);

  useEffect(() => {
    if (jobId) {
      fetchData();
    }
  }, [jobId]);

  const fetchData = async () => {
    if (!jobId) return;

    try {
      const [jobData, applicationsData] = await Promise.all([
        jobService.getJobById(jobId),
        applicationService.getApplicationsByJob(jobId),
      ]);

      setJob(jobData);
      setApplications(applicationsData);
    } catch (error: any) {
      console.error('❌ Erreur:', error);
      alert(`Erreur: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleShortlist = async (applicationId: number) => {
    try {
      await applicationService.shortlist(applicationId);
      await fetchData();
      alert('✅ Candidat pré-sélectionné avec succès !');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erreur lors de la pré-sélection');
    }
  };

  const handleReject = async (applicationId: number) => {
    if (!confirm('⚠️ Voulez-vous vraiment rejeter ce candidat ?')) return;
    
    try {
      await applicationService.reject(applicationId);
      await fetchData();
      alert('✅ Candidat rejeté');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erreur lors du rejet');
    }
  };

  const openScheduleModal = (applicationId: number) => {
    setSelectedApplication(applicationId);
    setShowScheduleModal(true);
  };

  const getStatusLabel = (status: ApplicationStatus) => {
    const labels: Record<ApplicationStatus, string> = {
      [ApplicationStatus.SUBMITTED]: 'Soumise',
      [ApplicationStatus.SHORTLISTED]: 'Pré-sélectionnée',
      [ApplicationStatus.INTERVIEW_HR_SCREENING]: 'Entretien RH #1',
      [ApplicationStatus.INTERVIEW_TECHNICAL]: 'Entretien Technique',
      [ApplicationStatus.INTERVIEW_HR_FINAL]: 'Entretien RH Final',
      [ApplicationStatus.ACCEPTED]: 'Acceptée',
      [ApplicationStatus.REJECTED]: 'Rejetée',
    };
    return labels[status] || status;
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    const badges: Record<ApplicationStatus, string> = {
      [ApplicationStatus.SUBMITTED]: 'bg-blue-100 text-blue-800 border border-blue-200',
      [ApplicationStatus.SHORTLISTED]: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      [ApplicationStatus.INTERVIEW_HR_SCREENING]: 'bg-purple-100 text-purple-800 border border-purple-200',
      [ApplicationStatus.INTERVIEW_TECHNICAL]: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
      [ApplicationStatus.INTERVIEW_HR_FINAL]: 'bg-violet-100 text-violet-800 border border-violet-200',
      [ApplicationStatus.ACCEPTED]: 'bg-green-100 text-green-800 border border-green-200',
      [ApplicationStatus.REJECTED]: 'bg-red-100 text-red-800 border border-red-200',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getFilteredApplications = () => {
    if (filter === 'all') return applications;
    return applications.filter(app => app.status === filter);
  };

  const filteredApplications = getFilteredApplications();

  const candidatesReadyForTechnical = applications.filter(
    a => a.status === ApplicationStatus.INTERVIEW_HR_SCREENING
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement des candidatures...</p>
        </div>
      </div>
    );
  }

  if (!jobId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-red-600 font-bold mb-4">Erreur : ID de l'offre invalide</p>
          <button
            onClick={() => router.push('/dashboard/recruiter/jobs')}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Retour aux offres
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <button
                onClick={() => router.push('/dashboard/recruiter/jobs')}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold mb-3 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Retour aux offres
              </button>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Candidatures : {job?.title || 'Chargement...'}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {applications.length} candidature(s) reçue(s)
                    {candidatesReadyForTechnical > 0 && (
                      <span className="ml-3 text-purple-600 font-semibold">
                        • {candidatesReadyForTechnical} validé(s) RH
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Alert pour candidats validés RH */}
        {candidatesReadyForTechnical > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-l-4 border-purple-500 p-6 rounded-2xl mb-8 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-purple-900 mb-2">
                  🎯 Action requise : Entretiens techniques à planifier
                </h3>
                <p className="text-purple-800 mb-4">
                  <strong>{candidatesReadyForTechnical} candidat(s)</strong> ont été validés par le RH Manager 
                  après l'entretien RH #1. Vous devez maintenant planifier leurs entretiens techniques.
                </p>
                <button
                  onClick={() => setFilter(ApplicationStatus.INTERVIEW_HR_SCREENING)}
                  className="bg-purple-600 hover:bg-purple-700 hover:scale-105 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-lg"
                >
                  📅 Voir les candidats à planifier ({candidatesReadyForTechnical})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Filtrer par statut</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              Toutes ({applications.length})
            </button>
            <button
              onClick={() => setFilter(ApplicationStatus.SUBMITTED)}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                filter === ApplicationStatus.SUBMITTED
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              Nouvelles ({applications.filter(a => a.status === ApplicationStatus.SUBMITTED).length})
            </button>
            <button
              onClick={() => setFilter(ApplicationStatus.SHORTLISTED)}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                filter === ApplicationStatus.SHORTLISTED
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              Pré-sélectionnées ({applications.filter(a => a.status === ApplicationStatus.SHORTLISTED).length})
            </button>
            <button
              onClick={() => setFilter(ApplicationStatus.INTERVIEW_HR_SCREENING)}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                filter === ApplicationStatus.INTERVIEW_HR_SCREENING
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              🎯 Validés RH ({applications.filter(a => a.status === ApplicationStatus.INTERVIEW_HR_SCREENING).length})
            </button>
            <button
              onClick={() => setFilter(ApplicationStatus.INTERVIEW_TECHNICAL)}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                filter === ApplicationStatus.INTERVIEW_TECHNICAL
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              💻 Technique ({applications.filter(a => a.status === ApplicationStatus.INTERVIEW_TECHNICAL).length})
            </button>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Aucune candidature</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'Vous n\'avez pas encore reçu de candidatures pour cette offre.'
                : `Aucune candidature avec le statut "${getStatusLabel(filter as ApplicationStatus)}".`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredApplications.map((application) => (
              <div key={application.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-200 p-8 border border-gray-100">
                
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {application.candidate?.firstName} {application.candidate?.lastName}
                        </h3>
                        <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold mt-1 ${getStatusBadge(application.status)}`}>
                          {getStatusLabel(application.status)}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>{application.candidate?.email}</span>
                      </div>
                      {application.candidate?.phone && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span>{application.candidate.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Postulé le {new Date(application.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cover Letter Preview */}
                {application.coverLetter && (
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-5 mb-6 border border-gray-200">
                    <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Lettre de motivation
                    </p>
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {application.coverLetter}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  
                  {/* Voir le CV */}
                  {application.cvPath && (
                    <a
                      href={`http://localhost:3000/uploads/cvs/${application.cvPath.split('/').pop()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all hover:scale-105"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Voir le CV
                    </a>
                  )}

                  {/* Actions selon le statut */}
                  {application.status === ApplicationStatus.SUBMITTED && (
                    <>
                      <button
                        onClick={() => handleShortlist(application.id)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-yellow-600 to-amber-600 hover:shadow-xl text-white font-bold rounded-xl transition-all hover:scale-105"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        Pré-sélectionner
                      </button>
                      <button
                        onClick={() => handleReject(application.id)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 hover:shadow-xl text-white font-bold rounded-xl transition-all hover:scale-105"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Rejeter
                      </button>
                    </>
                  )}

                  {application.status === ApplicationStatus.SHORTLISTED && (
                    <div className="flex items-center gap-2 px-6 py-3 bg-yellow-100 text-yellow-800 font-semibold rounded-xl border-2 border-yellow-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      En attente de l'entretien RH (planifié par le RH Manager)
                    </div>
                  )}

                  {/* Candidat validé RH, prêt pour technique */}
                  {application.status === ApplicationStatus.INTERVIEW_HR_SCREENING && (
                    <>
                      <div className="flex-1 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-300 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <svg className="w-6 h-6 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <p className="text-sm font-bold text-purple-900 mb-1">
                              Candidat validé par le RH Manager
                            </p>
                            <p className="text-xs text-purple-700">
                              L'entretien RH #1 a été validé. Vous devez planifier l'entretien technique.
                            </p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => openScheduleModal(application.id)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-2xl text-white font-bold rounded-xl transition-all hover:scale-105"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Planifier Entretien Technique
                      </button>
                    </>
                  )}

                  {application.status === ApplicationStatus.INTERVIEW_TECHNICAL && (
                    <>
                      <div className="flex items-center gap-2 px-6 py-3 bg-indigo-100 text-indigo-800 font-semibold rounded-xl border-2 border-indigo-200">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        Entretien technique planifié
                      </div>
                      <button
                        onClick={() => router.push('/dashboard/recruiter/interviews')}
                        className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 hover:shadow-xl text-white font-bold rounded-xl transition-all hover:scale-105"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Voir les entretiens
                      </button>
                    </>
                  )}

                  {application.status === ApplicationStatus.INTERVIEW_HR_FINAL && (
                    <div className="flex items-center gap-2 px-6 py-3 bg-violet-100 text-violet-800 font-semibold rounded-xl border-2 border-violet-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Entretien RH final en cours (géré par le RH Manager)
                    </div>
                  )}

                  {application.status === ApplicationStatus.ACCEPTED && (
                    <div className="flex items-center gap-2 px-6 py-3 bg-green-100 text-green-800 font-semibold rounded-xl border-2 border-green-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Candidat accepté
                    </div>
                  )}

                  {application.status === ApplicationStatus.REJECTED && (
                    <div className="flex items-center gap-2 px-6 py-3 bg-red-100 text-red-800 font-semibold rounded-xl border-2 border-red-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Candidature rejetée
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Schedule Interview Modal */}
      {showScheduleModal && selectedApplication && (
        <ScheduleInterviewModal
          applicationId={selectedApplication}
          interviewType={InterviewType.TECHNICAL}
          onClose={() => {
            setShowScheduleModal(false);
            setSelectedApplication(null);
          }}
          onSuccess={() => {
            setShowScheduleModal(false);
            setSelectedApplication(null);
            fetchData();
            alert('✅ Entretien technique planifié avec succès !');
          }}
        />
      )}
    </div>
  );
}