'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { applicationService } from '@/services/applicationService';
import { jobService } from '@/services/jobService';
import { interviewService } from '@/services/interviewService';
import { Application, Job, InterviewType, ApplicationStatus } from '@/types';
import ScheduleInterviewModal from '@/components/ScheduleInterviewModal';

export default function RecruiterApplicationsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = parseInt(params.id as string);

  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ApplicationStatus | 'all'>('all');
  
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<number | null>(null);
  const [selectedInterviewType, setSelectedInterviewType] = useState<InterviewType>(InterviewType.TECHNICAL);

  useEffect(() => {
    fetchData();
  }, [jobId]);

  const fetchData = async () => {
    try {
      const [jobData, applicationsData] = await Promise.all([
        jobService.getJobById(jobId),
        applicationService.getApplicationsByJob(jobId),
      ]);
      setJob(jobData);
      setApplications(applicationsData);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId: number, newStatus: ApplicationStatus) => {
    try {
      await applicationService.updateStatus(applicationId, newStatus);
      await fetchData();
      alert('Statut mis à jour avec succès !');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  const openScheduleModal = (applicationId: number, type: InterviewType) => {
    setSelectedApplication(applicationId);
    setSelectedInterviewType(type);
    setShowScheduleModal(true);
  };

  const getStatusLabel = (status: ApplicationStatus) => {
    const labels: Record<ApplicationStatus, string> = {
      [ApplicationStatus.SUBMITTED]: 'Soumise',
      [ApplicationStatus.UNDER_REVIEW]: 'En révision',
      [ApplicationStatus.INTERVIEW_SCHEDULED]: 'Entretien planifié',
      [ApplicationStatus.ACCEPTED]: 'Acceptée',
      [ApplicationStatus.REJECTED]: 'Rejetée',
    };
    return labels[status] || status;
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    const badges: Record<ApplicationStatus, string> = {
      [ApplicationStatus.SUBMITTED]: 'bg-blue-100 text-blue-800',
      [ApplicationStatus.UNDER_REVIEW]: 'bg-yellow-100 text-yellow-800',
      [ApplicationStatus.INTERVIEW_SCHEDULED]: 'bg-purple-100 text-purple-800',
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <button
                onClick={() => router.push('/dashboard/recruiter/jobs')}
                className="text-blue-600 hover:text-blue-800 font-medium mb-2 transition"
              >
                ← Retour aux offres
              </button>
              <h1 className="text-3xl font-bold text-blue-600">
                📨 Candidatures : {job?.title}
              </h1>
              <p className="text-gray-600 mt-1">
                {applications.length} candidature(s) reçue(s)
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Toutes ({applications.length})
            </button>
            <button
              onClick={() => setFilter(ApplicationStatus.SUBMITTED)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === ApplicationStatus.SUBMITTED
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Nouvelles ({applications.filter(a => a.status === ApplicationStatus.SUBMITTED).length})
            </button>
            <button
              onClick={() => setFilter(ApplicationStatus.UNDER_REVIEW)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === ApplicationStatus.UNDER_REVIEW
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              En révision ({applications.filter(a => a.status === ApplicationStatus.UNDER_REVIEW).length})
            </button>
            <button
              onClick={() => setFilter(ApplicationStatus.INTERVIEW_SCHEDULED)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === ApplicationStatus.INTERVIEW_SCHEDULED
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Entretiens ({applications.filter(a => a.status === ApplicationStatus.INTERVIEW_SCHEDULED).length})
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
                ? 'Vous n\'avez pas encore reçu de candidatures pour cette offre.'
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
                    <div className="flex flex-col gap-1 text-gray-600">
                      <p>📧 {application.candidate?.email}</p>
                      {application.candidate?.phone && <p>📱 {application.candidate.phone}</p>}
                      <p className="text-sm text-gray-500">
                        📅 Postulé le {new Date(application.createdAt).toLocaleDateString('fr-FR')}
                      </p>
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
                  {application.status === ApplicationStatus.SUBMITTED && (
                    <>
                      <button
                        onClick={() => handleStatusChange(application.id, ApplicationStatus.UNDER_REVIEW)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                      >
                        👁️ Mettre en révision
                      </button>
                      <button
                        onClick={() => handleStatusChange(application.id, ApplicationStatus.REJECTED)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
                      >
                        ❌ Rejeter
                      </button>
                    </>
                  )}

                  {application.status === ApplicationStatus.UNDER_REVIEW && (
                    <>
                      <button
                        onClick={() => openScheduleModal(application.id, InterviewType.TECHNICAL)}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition"
                      >
                        📅 Planifier entretien technique
                      </button>
                      <button
                        onClick={() => handleStatusChange(application.id, ApplicationStatus.REJECTED)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
                      >
                        ❌ Rejeter
                      </button>
                    </>
                  )}

                  {application.status === ApplicationStatus.INTERVIEW_SCHEDULED && (
                    <button
                      onClick={() => router.push(`/dashboard/recruiter/interviews`)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                    >
                      📅 Voir les entretiens
                    </button>
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
          }}
        />
      )}
    </div>
  );
}