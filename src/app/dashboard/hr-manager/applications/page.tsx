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
      // Récupérer toutes les offres
      const jobsData = await jobService.getAllJobs();
      setJobs(jobsData);

      // Récupérer toutes les candidatures de toutes les offres
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
      alert('Candidat rejeté');
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
      [ApplicationStatus.SUBMITTED]: 'bg-blue-100 text-blue-800',
      [ApplicationStatus.SHORTLISTED]: 'bg-yellow-100 text-yellow-800',
      [ApplicationStatus.INTERVIEW_HR_SCREENING]: 'bg-purple-100 text-purple-800',
      [ApplicationStatus.INTERVIEW_TECHNICAL]: 'bg-indigo-100 text-indigo-800',
      [ApplicationStatus.INTERVIEW_HR_FINAL]: 'bg-violet-100 text-violet-800',
      [ApplicationStatus.ACCEPTED]: 'bg-green-100 text-green-800',
      [ApplicationStatus.REJECTED]: 'bg-red-100 text-red-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getFilteredApplications = () => {
    if (filter === 'all') return applications;
    return applications.filter(app => app.status === filter);
  };

  const filteredApplications = getFilteredApplications();

  // Statistiques
  const candidatesReadyForScreening = applications.filter(
    a => a.status === ApplicationStatus.SHORTLISTED
  ).length;

  const candidatesReadyForFinal = applications.filter(
    a => a.status === ApplicationStatus.INTERVIEW_HR_FINAL
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-purple-600">📨 Toutes les Candidatures</h1>
              <p className="text-gray-600 mt-1">
                {applications.length} candidature(s) au total
                {candidatesReadyForScreening > 0 && (
                  <span className="ml-4 text-purple-600 font-semibold">
                    • {candidatesReadyForScreening} à planifier (RH #1)
                  </span>
                )}
                {candidatesReadyForFinal > 0 && (
                  <span className="ml-4 text-violet-600 font-semibold">
                    • {candidatesReadyForFinal} validé(s) technique (RH Final)
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={() => router.push('/dashboard/hr-manager')}
              className="text-gray-600 hover:text-gray-800 font-medium transition"
            >
              ← Retour au dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert pour candidats validés technique */}
        {candidatesReadyForFinal > 0 && (
          <div className="bg-violet-50 border-l-4 border-violet-500 p-6 rounded-lg mb-6">
            <div className="flex items-start gap-3">
              <span className="text-3xl">🎯</span>
              <div>
                <h3 className="text-lg font-bold text-violet-900 mb-2">
                  Action requise : Entretiens RH finaux à planifier
                </h3>
                <p className="text-violet-800">
                  <strong>{candidatesReadyForFinal} candidat(s)</strong> ont été validés par le recruteur 
                  après l'entretien technique. Vous devez planifier les entretiens RH finaux pour la négociation.
                </p>
                <button
                  onClick={() => setFilter(ApplicationStatus.INTERVIEW_HR_FINAL)}
                  className="mt-3 bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                >
                  📅 Voir les candidats validés technique
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Toutes ({applications.length})
            </button>
            <button
              onClick={() => setFilter(ApplicationStatus.SHORTLISTED)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === ApplicationStatus.SHORTLISTED ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🎯 Pré-sélectionnées (À planifier RH #1) ({candidatesReadyForScreening})
            </button>
            <button
              onClick={() => setFilter(ApplicationStatus.INTERVIEW_HR_SCREENING)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === ApplicationStatus.INTERVIEW_HR_SCREENING ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Entretien RH #1 ({applications.filter(a => a.status === ApplicationStatus.INTERVIEW_HR_SCREENING).length})
            </button>
            <button
              onClick={() => setFilter(ApplicationStatus.INTERVIEW_TECHNICAL)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === ApplicationStatus.INTERVIEW_TECHNICAL ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Entretien Technique ({applications.filter(a => a.status === ApplicationStatus.INTERVIEW_TECHNICAL).length})
            </button>
            <button
              onClick={() => setFilter(ApplicationStatus.INTERVIEW_HR_FINAL)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === ApplicationStatus.INTERVIEW_HR_FINAL ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🎯 Validés Technique (À planifier RH Final) ({candidatesReadyForFinal})
            </button>
            <button
              onClick={() => setFilter(ApplicationStatus.ACCEPTED)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === ApplicationStatus.ACCEPTED ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Acceptées ({applications.filter(a => a.status === ApplicationStatus.ACCEPTED).length})
            </button>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Aucune candidature</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'Aucune candidature pour le moment.'
                : `Aucune candidature avec le statut "${getStatusLabel(filter as ApplicationStatus)}".`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <div key={application.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {application.candidate?.firstName} {application.candidate?.lastName}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(application.status)}`}>
                        {getStatusLabel(application.status)}
                      </span>
                    </div>
                    <p className="text-gray-600 font-semibold">
                      💼 Offre : {application.job?.title}
                    </p>
                    <div className="flex flex-col gap-1 text-gray-600 mt-2">
                      <p>📧 {application.candidate?.email}</p>
                      {application.candidate?.phone && <p>📱 {application.candidate.phone}</p>}
                    </div>
                  </div>
                </div>

                {/* Cover Letter Preview */}
                {application.coverLetter && (
                  <div className="bg-gray-50 rounded p-4 mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Lettre de motivation :</p>
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
                      href={`http://localhost:3000${application.cvPath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition"
                    >
                      📄 Voir le CV
                    </a>
                  )}

                  {/* Actions selon le statut */}
                  {application.status === ApplicationStatus.SHORTLISTED && (
                    <>
                      <button
                        onClick={() => openScheduleModal(application.id, InterviewType.HR_SCREENING)}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition"
                      >
                        📅 Planifier Entretien RH #1
                      </button>
                      <button
                        onClick={() => handleReject(application.id)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
                      >
                        ❌ Rejeter
                      </button>
                    </>
                  )}

                  {application.status === ApplicationStatus.INTERVIEW_HR_SCREENING && (
                    <button
                      onClick={() => router.push('/dashboard/hr-manager/interviews')}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                    >
                      👁️ Voir les entretiens RH
                    </button>
                  )}

                  {application.status === ApplicationStatus.INTERVIEW_TECHNICAL && (
                    <div className="px-4 py-2 bg-indigo-100 text-indigo-800 font-semibold rounded-lg">
                      💻 Entretien technique en cours (géré par le recruteur)
                    </div>
                  )}

                  {/* NOUVEAU : Candidat validé en technique, prêt pour RH final */}
                  {application.status === ApplicationStatus.INTERVIEW_HR_FINAL && (
                    <>
                      <div className="flex-1 bg-violet-50 border-2 border-violet-300 rounded-lg p-3">
                        <p className="text-sm font-semibold text-violet-900 mb-1">
                          ✅ Candidat validé en technique par le recruteur
                        </p>
                        <p className="text-xs text-violet-700">
                          L'entretien technique a été validé. Vous devez planifier l'entretien RH final (négociation).
                        </p>
                      </div>
                      <button
                        onClick={() => openScheduleModal(application.id, InterviewType.HR_FINAL)}
                        className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-lg transition shadow-lg"
                      >
                        📅 Planifier Entretien RH Final
                      </button>
                    </>
                  )}

                  {application.status === ApplicationStatus.ACCEPTED && (
                    <div className="px-4 py-2 bg-green-100 text-green-800 font-semibold rounded-lg">
                      ✅ Candidat accepté
                    </div>
                  )}

                  {application.status === ApplicationStatus.REJECTED && (
                    <div className="px-4 py-2 bg-red-100 text-red-800 font-semibold rounded-lg">
                      ❌ Candidature rejetée
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
            alert('Entretien planifié avec succès !');
          }}
        />
      )}
    </div>
  );
}