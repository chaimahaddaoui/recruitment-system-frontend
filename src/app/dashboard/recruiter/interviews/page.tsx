'use client';

import { useEffect, useState } from 'react';
import { interviewService } from '@/services/interviewService';
import { Interview, InterviewType, InterviewStatus } from '@/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RecruiterInterviewsPage() {
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
      const technicalInterviews = data.filter(i => i.type === InterviewType.TECHNICAL);
      setInterviews(technicalInterviews);
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

  const getStatusBadge = (status: InterviewStatus) => {
    const badges = {
      [InterviewStatus.SCHEDULED]: 'bg-blue-100 text-blue-800 border border-blue-200',
      [InterviewStatus.COMPLETED]: 'bg-gray-100 text-gray-800 border border-gray-200',
      [InterviewStatus.PASSED]: 'bg-green-100 text-green-800 border border-green-200',
      [InterviewStatus.FAILED]: 'bg-red-100 text-red-800 border border-red-200',
      [InterviewStatus.CANCELLED]: 'bg-orange-100 text-orange-800 border border-orange-200',
    };

    const labels = {
      [InterviewStatus.SCHEDULED]: 'Planifié',
      [InterviewStatus.COMPLETED]: 'Terminé',
      [InterviewStatus.PASSED]: 'Validé',
      [InterviewStatus.FAILED]: 'Échoué',
      [InterviewStatus.CANCELLED]: 'Annulé',
    };

    const icons = {
      [InterviewStatus.SCHEDULED]: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      [InterviewStatus.COMPLETED]: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      [InterviewStatus.PASSED]: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      [InterviewStatus.FAILED]: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      [InterviewStatus.CANCELLED]: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      ),
    };

    return (
      <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold ${badges[status]}`}>
        {icons[status]}
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

  const handleCancel = async (interviewId: number) => {
    if (confirm('⚠️ Voulez-vous vraiment annuler cet entretien ?')) {
      try {
        await interviewService.cancel(interviewId);
        await fetchInterviews();
        alert('✅ Entretien annulé');
      } catch (error) {
        alert('❌ Erreur lors de l\'annulation');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement des entretiens...</p>
        </div>
      </div>
    );
  }

  const filteredInterviews = getFilteredInterviews();
  const upcomingCount = interviews.filter(i => 
    new Date(i.scheduledAt) > new Date() && 
    i.status === InterviewStatus.SCHEDULED
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mes Entretiens Techniques</h1>
                <p className="text-sm text-gray-600">
                  {interviews.length} entretien(s) au total
                  {upcomingCount > 0 && (
                    <span className="ml-3 text-purple-600 font-semibold">
                      • {upcomingCount} à venir
                    </span>
                  )}
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/recruiter"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-semibold transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour au dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Filtrer par période</h3>
          <div className="flex gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              Tous ({interviews.length})
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                filter === 'upcoming'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              À venir ({upcomingCount})
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                filter === 'past'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              Passés
            </button>
          </div>
        </div>

        {/* Interviews List */}
        {filteredInterviews.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Aucun entretien</h3>
            <p className="text-gray-600">
              Vous n'avez pas d'entretiens techniques {filter === 'upcoming' ? 'à venir' : filter === 'past' ? 'passés' : ''}.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredInterviews.map((interview) => {
              const isUpcoming = new Date(interview.scheduledAt) > new Date() && interview.status === InterviewStatus.SCHEDULED;
              
              return (
                <div 
                  key={interview.id} 
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-200 p-8 border ${
                    isUpcoming ? 'border-purple-200 bg-gradient-to-br from-white to-purple-50' : 'border-gray-100'
                  }`}
                >
                  
                  {/* Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            Entretien Technique
                          </h3>
                          {getStatusBadge(interview.status)}
                          {isUpcoming && (
                            <span className="ml-2 inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-bold border border-purple-200 animate-pulse">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              À venir
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 font-medium">
                        {interview.application?.job?.title}
                      </p>
                    </div>
                  </div>

                  {/* Informations Grid */}
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Candidat</p>
                        <p className="font-bold text-gray-900">
                          {interview.application?.candidate?.firstName}{' '}
                          {interview.application?.candidate?.lastName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Email</p>
                        <p className="font-semibold text-gray-900 text-sm">
                          {interview.application?.candidate?.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="text-xs text-blue-600 font-medium">Date & Heure</p>
                        <p className="font-bold text-blue-900 text-sm">
                          {formatDate(interview.scheduledAt)}
                        </p>
                      </div>
                    </div>

                    {interview.duration && (
                      <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="text-xs text-purple-600 font-medium">Durée</p>
                          <p className="font-bold text-purple-900">{interview.duration} minutes</p>
                        </div>
                      </div>
                    )}

                    {interview.location && (
                      <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl md:col-span-2">
                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>
                          <p className="text-xs text-orange-600 font-medium">Lieu</p>
                          <p className="font-bold text-orange-900">{interview.location}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  {interview.notes && (
                    <div className="bg-blue-50 rounded-xl p-5 mb-6 border border-blue-200">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div>
                          <p className="text-sm font-bold text-blue-900 mb-1">Notes de planification</p>
                          <p className="text-sm text-blue-800">{interview.notes}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Évaluation */}
                  {interview.evaluation && (
                    <div className="bg-green-50 rounded-xl p-5 mb-6 border border-green-200">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="text-sm font-bold text-green-900 mb-1">Évaluation technique</p>
                          <p className="text-sm text-green-800">{interview.evaluation}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-6 border-t border-gray-200">
                    {interview.status === InterviewStatus.SCHEDULED && (
                      <>
                        <Link
                          href={`/dashboard/recruiter/interviews/${interview.id}/evaluate`}
                          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-2xl text-white font-bold py-3 px-6 rounded-xl transition-all hover:scale-105"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Évaluer
                        </Link>
                        <button
                          onClick={() => handleCancel(interview.id)}
                          className="flex items-center gap-2 px-8 py-3 border-2 border-red-300 text-red-700 font-bold rounded-xl hover:bg-red-50 transition-all hover:scale-105"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Annuler
                        </button>
                      </>
                    )}
                    {interview.status !== InterviewStatus.SCHEDULED && (
                      <div className="flex-1 text-center py-3 text-gray-500 font-medium">
                        Entretien {interview.status === InterviewStatus.PASSED ? 'validé' : interview.status === InterviewStatus.FAILED ? 'échoué' : 'terminé'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}