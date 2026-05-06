'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jobService } from '@/services/jobService';
import { applicationService } from '@/services/applicationService';
import { Application, Job, InterviewType, ApplicationStatus } from '@/types';
import ScheduleInterviewModal from '@/components/ScheduleInterviewModal';

export default function HRApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ApplicationStatus | 'all'>('all');
  
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<number | null>(null);
  const [selectedInterviewType, setSelectedInterviewType] = useState<InterviewType>(InterviewType.HR_SCREENING);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const jobsData = await jobService.getAllJobs();
      setJobs(jobsData);

      const allApplications: Application[] = [];
      for (const job of jobsData) {
        const apps = await applicationService.getApplicationsByJob(job.id);
        allApplications.push(...apps);
      }
      setApplications(allApplications);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const openScheduleModal = (applicationId: number, type: InterviewType) => {
    setSelectedApplication(applicationId);
    setSelectedInterviewType(type);
    setShowScheduleModal(true);
  };

  const handleReject = async (applicationId: number) => {
    if (!confirm('Voulez-vous vraiment rejeter ce candidat ?')) return;
    
    try {
      await applicationService.reject(applicationId);
      await fetchData();
      alert('✅ Candidat rejeté');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erreur lors du rejet');
    }
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

  const candidatesReadyForScreening = applications.filter(
    a => a.status === ApplicationStatus.SHORTLISTED
  ).length;

  const candidatesReadyForFinal = applications.filter(
    a => a.status === ApplicationStatus.INTERVIEW_HR_FINAL
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement des candidatures...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Toutes les Candidatures</h1>
                <p className="text-sm text-gray-600">
                  {applications.length} candidature(s) au total
                  {candidatesReadyForScreening > 0 && (
                    <span className="ml-3 text-purple-600 font-semibold">
                      • {candidatesReadyForScreening} à planifier
                    </span>
                  )}
                  {candidatesReadyForFinal > 0 && (
                    <span className="ml-3 text-violet-600 font-semibold">
                      • {candidatesReadyForFinal} finaux
                    </span>
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/dashboard/hr-manager')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Alert pour candidats validés technique */}
        {candidatesReadyForFinal > 0 && (
          <div className="bg-gradient-to-r from-violet-50 to-purple-50 border-l-4 border-violet-500 p-6 rounded-2xl mb-8 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-violet-900 mb-2">
                  🎯 Action requise : Entretiens RH finaux à planifier
                </h3>
                <p className="text-violet-800 mb-4">
                  <strong>{candidatesReadyForFinal} candidat(s)</strong> ont été validés par le recruteur 
                  après l'entretien technique. Vous devez planifier les entretiens RH finaux pour la négociation.
                </p>
                <button
                  onClick={() => setFilter(ApplicationStatus.INTERVIEW_HR_FINAL)}
                  className="bg-violet-600 hover:bg-violet-700 hover:scale-105 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-lg"
                >
                  📅 Voir les candidats validés ({candidatesReadyForFinal})
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
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-105' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              Toutes ({applications.length})
            </button>
            <button
              onClick={() => setFilter(ApplicationStatus.SHORTLISTED)}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                filter === ApplicationStatus.SHORTLISTED 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-105' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              🎯 Pré-sélectionnées ({candidatesReadyForScreening})
            </button>
            <button
              onClick={() => setFilter(ApplicationStatus.INTERVIEW_HR_SCREENING)}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                filter === ApplicationStatus.INTERVIEW_HR_SCREENING 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-105' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              RH #1 ({applications.filter(a => a.status === ApplicationStatus.INTERVIEW_HR_SCREENING).length})
            </button>
            <button
              onClick={() => setFilter(ApplicationStatus.INTERVIEW_TECHNICAL)}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                filter === ApplicationStatus.INTERVIEW_TECHNICAL 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-105' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              💻 Technique ({applications.filter(a => a.status === ApplicationStatus.INTERVIEW_TECHNICAL).length})
            </button>
            <button
              onClick={() => setFilter(ApplicationStatus.INTERVIEW_HR_FINAL)}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                filter === ApplicationStatus.INTERVIEW_HR_FINAL 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-105' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              🎯 RH Final ({candidatesReadyForFinal})
            </button>
            <button
              onClick={() => setFilter(ApplicationStatus.ACCEPTED)}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                filter === ApplicationStatus.ACCEPTED 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-105' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              ✅ Acceptées ({applications.filter(a => a.status === ApplicationStatus.ACCEPTED).length})
            </button>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Aucune candidature</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'Aucune candidature pour le moment.'
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
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {application.candidate?.firstName} {application.candidate?.lastName}
                        </h3>
                        <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold mt-1 ${getStatusBadge(application.status)}`}>
                          {getStatusLabel(application.status)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 font-semibold mb-3">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{application.job?.title}</span>
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
                  {application.status === ApplicationStatus.SHORTLISTED && (
                    <>
                      <button
                        onClick={() => openScheduleModal(application.id, InterviewType.HR_SCREENING)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-xl text-white font-bold rounded-xl transition-all hover:scale-105"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Planifier RH #1
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

                  {application.status === ApplicationStatus.INTERVIEW_HR_SCREENING && (
                    <button
                      onClick={() => router.push('/dashboard/hr-manager/interviews')}
                      className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 hover:shadow-xl text-white font-bold rounded-xl transition-all hover:scale-105"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Voir les entretiens
                    </button>
                  )}

                  {application.status === ApplicationStatus.INTERVIEW_TECHNICAL && (
                    <div className="flex items-center gap-2 px-6 py-3 bg-indigo-100 text-indigo-800 font-semibold rounded-xl border-2 border-indigo-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      Entretien technique en cours
                    </div>
                  )}

                  {application.status === ApplicationStatus.INTERVIEW_HR_FINAL && (
                    <>
                      <div className="flex-1 bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-violet-300 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <svg className="w-6 h-6 text-violet-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <p className="text-sm font-bold text-violet-900 mb-1">
                              Candidat validé en technique
                            </p>
                            <p className="text-xs text-violet-700">
                              Planifiez l'entretien RH final pour la négociation
                            </p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => openScheduleModal(application.id, InterviewType.HR_FINAL)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:shadow-2xl text-white font-bold rounded-xl transition-all hover:scale-105"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Planifier RH Final
                      </button>
                    </>
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
          interviewType={selectedInterviewType}
          onClose={() => {
            setShowScheduleModal(false);
            setSelectedApplication(null);
          }}
          onSuccess={() => {
            setShowScheduleModal(false);
            setSelectedApplication(null);
            fetchData();
            alert('✅ Entretien planifié avec succès !');
          }}
        />
      )}
    </div>
  );
}