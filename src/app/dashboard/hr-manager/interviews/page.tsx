'use client';

import { useEffect, useState } from 'react';
import { interviewService } from '@/services/interviewService';
import { Interview, InterviewType, InterviewStatus } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HRInterviewsPage() {
  const router = useRouter();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const data = await interviewService.getMyInterviews();
      setInterviews(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredInterviews = () => {
    const now = new Date();
    
    if (filter === 'upcoming') {
      return interviews.filter(i => 
        new Date(i.scheduledAt) > now && 
        i.status === InterviewStatus.SCHEDULED
      );
    }
    
    if (filter === 'past') {
      return interviews.filter(i => 
        new Date(i.scheduledAt) < now || 
        [InterviewStatus.COMPLETED, InterviewStatus.PASSED, InterviewStatus.FAILED, InterviewStatus.CANCELLED].includes(i.status)
      );
    }
    
    return interviews;
  };

  const getTypeLabel = (type: InterviewType) => {
    switch (type) {
      case InterviewType.HR:
        return '🗣️ Entretien RH #1 (Screening)';
      case InterviewType.TECHNICAL:
        return '💻 Entretien Technique';
      case InterviewType.FINAL:
        return '💼 Entretien RH #2 (Négociation)';
    }
  };

  const getStatusBadge = (status: InterviewStatus) => {
    const badges = {
      [InterviewStatus.SCHEDULED]: 'bg-blue-100 text-blue-800',
      [InterviewStatus.COMPLETED]: 'bg-gray-100 text-gray-800',
      [InterviewStatus.PASSED]: 'bg-green-100 text-green-800',
      [InterviewStatus.FAILED]: 'bg-red-100 text-red-800',
      [InterviewStatus.CANCELLED]: 'bg-orange-100 text-orange-800',
    };

    const labels = {
      [InterviewStatus.SCHEDULED]: 'Planifié',
      [InterviewStatus.COMPLETED]: 'Terminé',
      [InterviewStatus.PASSED]: 'Validé',
      [InterviewStatus.FAILED]: 'Échoué',
      [InterviewStatus.CANCELLED]: 'Annulé',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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

  const filteredInterviews = getFilteredInterviews();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-purple-600">📅 Mes Entretiens</h1>
              <p className="text-gray-600 mt-1">Gérez vos entretiens RH</p>
            </div>
            <Link
              href="/dashboard/hr-manager"
              className="text-gray-600 hover:text-gray-800 font-medium transition"
            >
              ← Retour au dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                filter === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tous ({interviews.length})
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                filter === 'upcoming'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              À venir
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                filter === 'past'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Passés
            </button>
          </div>
        </div>

        {/* Interviews List */}
        {filteredInterviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Aucun entretien</h3>
            <p className="text-gray-600">Vous n'avez pas d'entretiens {filter === 'upcoming' ? 'à venir' : filter === 'past' ? 'passés' : ''}.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInterviews.map((interview) => (
              <div key={interview.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {getTypeLabel(interview.type)}
                      </h3>
                      {getStatusBadge(interview.status)}
                    </div>
                    <p className="text-gray-600">
                      {interview.application?.job?.title}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="text-xl">👤</span>
                    <span>
                      {interview.application?.candidate?.firstName}{' '}
                      {interview.application?.candidate?.lastName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="text-xl">📧</span>
                    <span>{interview.application?.candidate?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="text-xl">🕐</span>
                    <span>{formatDate(interview.scheduledAt)}</span>
                  </div>
                  {interview.duration && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="text-xl">⏱️</span>
                      <span>{interview.duration} minutes</span>
                    </div>
                  )}
                  {interview.location && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="text-xl">📍</span>
                      <span>{interview.location}</span>
                    </div>
                  )}
                </div>

                {interview.notes && (
                  <div className="bg-gray-50 rounded p-3 mb-4">
                    <p className="text-sm text-gray-700">
                      <strong>Notes :</strong> {interview.notes}
                    </p>
                  </div>
                )}

                {interview.evaluation && (
                  <div className="bg-blue-50 rounded p-3 mb-4">
                    <p className="text-sm text-gray-700">
                      <strong>Évaluation :</strong> {interview.evaluation}
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  {interview.status === InterviewStatus.SCHEDULED && (
                    <>
                      <Link
                        href={`/dashboard/hr-manager/interviews/${interview.id}/evaluate`}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white text-center py-2 px-4 rounded-lg font-semibold transition"
                      >
                        ✅ Évaluer
                      </Link>
                      <button
                        onClick={async () => {
                          if (confirm('Voulez-vous annuler cet entretien ?')) {
                            await interviewService.cancel(interview.id);
                            fetchInterviews();
                          }
                        }}
                        className="px-6 py-2 border-2 border-red-300 text-red-700 font-semibold rounded-lg hover:bg-red-50 transition"
                      >
                        ❌ Annuler
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}