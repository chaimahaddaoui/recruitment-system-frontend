'use client';

import { useState } from 'react';
import { interviewService } from '@/services/interviewService';
import { InterviewType } from '@/types';

interface Props {
  applicationId: number;
  interviewType: InterviewType;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ScheduleInterviewModal({
  applicationId,
  interviewType,
  onClose,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    scheduledAt: '',
    duration: 60,
    location: '',
    notes: '',
  });

  const getTypeLabel = () => {
    switch (interviewType) {
      case InterviewType.HR_SCREENING:
        return '🗣️ Entretien RH #1 (Screening)';
      case InterviewType.TECHNICAL:
        return '💻 Entretien Technique';
      case InterviewType.HR_FINAL:
        return '💼 Entretien RH #2 (Négociation)';
    }
  };

  const getTypeDescription = () => {
    switch (interviewType) {
      case InterviewType.HR_SCREENING:
        return 'Évaluer la communication, la motivation et l\'adéquation culturelle';
      case InterviewType.TECHNICAL:
        return 'Évaluer les compétences techniques et la résolution de problèmes';
      case InterviewType.HR_FINAL:
        return 'Négocier le salaire, les avantages et finaliser l\'offre';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await interviewService.create({
        applicationId,
        type: interviewType,
        scheduledAt: formData.scheduledAt,
        duration: formData.duration,
        location: formData.location,
        notes: formData.notes,
      });
      onSuccess();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erreur lors de la planification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              📅 Planifier : {getTypeLabel()}
            </h2>
            <p className="text-sm text-gray-600 mt-1">{getTypeDescription()}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Date et heure */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date et heure *
            </label>
            <input
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
              required
              min={new Date().toISOString().slice(0, 16)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Durée */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Durée (minutes) *
            </label>
            <select
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>1 heure</option>
              <option value={90}>1h30</option>
              <option value={120}>2 heures</option>
            </select>
          </div>

          {/* Lieu */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Lieu ou lien visio *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
              placeholder="Salle de réunion 3A ou https://meet.google.com/..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Notes (optionnel)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              placeholder="Points à aborder, documents à préparer..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition shadow-lg"
            >
              {loading ? 'Planification...' : '✅ Planifier l\'entretien'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}