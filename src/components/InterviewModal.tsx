/* 'use client';

import { useState } from 'react';
import { interviewService } from '@/services/interviewService';
import { InterviewType, InterviewStatus, Interview, Application } from '@/types';

export default function InterviewModal({
  application,
  onClose,
  onSuccess,
}: {
  application: Application;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [type, setType] = useState<InterviewType>(
    InterviewType.HR_SCREENING,
  );
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = async () => {
    await interviewService.create({
      applicationId: application.id,
      type,
      scheduledAt: date,
      location,
      duration: 0
    });

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded w-[400px]">
        <h2 className="text-lg font-bold mb-4">
          Planifier entretien
        </h2>

        <select
          className="w-full border p-2 mb-3"
          value={type}
          onChange={(e) => setType(e.target.value as InterviewType)}
        >
          <option value="HR_SCREENING">RH Screening</option>
          <option value="TECHNICAL">Technique</option>
          <option value="HR_FINAL">RH Final</option>
        </select>

        <input
          type="datetime-local"
          className="w-full border p-2 mb-3"
          onChange={(e) => setDate(e.target.value)}
        />

        <input
          placeholder="Lieu / lien meeting"
          className="w-full border p-2 mb-3"
          onChange={(e) => setLocation(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Annuler</button>
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
} */

  'use client';

import { useState } from 'react';
import { interviewService } from '@/services/interviewService';
import { InterviewType, Application } from '@/types';

type MeetingMode = 'LOCAL' | 'MANUAL_LINK' | 'GOOGLE_MEET';

export default function InterviewModal({
  application,
  onClose,
  onSuccess,
}: {
  application: Application;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [type, setType] = useState<InterviewType>(
    InterviewType.HR_SCREENING,
  );
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('60');
  const [meetingMode, setMeetingMode] = useState<MeetingMode>('LOCAL');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');

    // Validation
    if (!date) {
      setError('Veuillez sélectionner une date');
      return;
    }

    if (meetingMode !== 'GOOGLE_MEET' && !location.trim()) {
      setError(
        meetingMode === 'LOCAL'
          ? 'Veuillez saisir le lieu'
          : 'Veuillez saisir le lien'
      );
      return;
    }

    setLoading(true);

    try {
      console.log('📤 Envoi données:', {
        applicationId: application.id,
        type,
        scheduledAt: date,
        duration: Number(duration),
        location: meetingMode === 'GOOGLE_MEET' ? '' : location,
        meetingMode, // 🆕 IMPORTANT!
      });

      const result = await interviewService.create({
        applicationId: application.id,
        type,
        scheduledAt: date,
        duration: Number(duration),
        location: meetingMode === 'GOOGLE_MEET' ? '' : location,
        meetingMode, // 🆕 IMPORTANT!
      });

      console.log('✅ Réponse:', result);

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('❌ Erreur:', err);
      setError(err.response?.data?.message || 'Erreur lors de la planification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[500px] shadow-lg">
        <h2 className="text-lg font-bold mb-4">Planifier un entretien</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Type d'entretien */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Type d'entretien *</label>
          <select
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={type}
            onChange={(e) => setType(e.target.value as InterviewType)}
            disabled={loading}
          >
            <option value="HR_SCREENING">RH Screening</option>
            <option value="TECHNICAL">Technique</option>
            <option value="HR_FINAL">RH Final</option>
          </select>
        </div>

        {/* Date et heure */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Date et heure *</label>
          <input
            type="datetime-local"
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Durée */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Durée (minutes)</label>
          <select
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            disabled={loading}
          >
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">1 heure</option>
            <option value="90">1h30</option>
            <option value="120">2 heures</option>
          </select>
        </div>

        {/* Mode de rencontre */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Type de rencontre *</label>
          <select
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={meetingMode}
            onChange={(e) => setMeetingMode(e.target.value as MeetingMode)}
            disabled={loading}
          >
            <option value="LOCAL">Présentiel / Local</option>
            <option value="MANUAL_LINK">Lien manuel</option>
            <option value="GOOGLE_MEET">🎥 Google Meet automatique</option>
          </select>
        </div>

        {/* Affichage conditionnel du champ location/lien */}
        {meetingMode === 'LOCAL' && (
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Lieu *</label>
            <input
              type="text"
              placeholder="Ex: Bureau 203, Salle RH..."
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={loading}
            />
          </div>
        )}

        {meetingMode === 'MANUAL_LINK' && (
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Lien de l'entretien *</label>
            <input
              type="url"
              placeholder="Ex: https://meet.google.com/xxx-xxxx-xxx"
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={loading}
            />
          </div>
        )}

        {meetingMode === 'GOOGLE_MEET' && (
          <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded">
            <p className="text-sm text-green-700 font-semibold">
              ✅ Google Meet sera généré automatiquement
            </p>
            <p className="text-xs text-green-600 mt-1">
              Le lien sera créé et envoyé au candidat par email
            </p>
          </div>
        )}

        {/* Boutons */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border rounded hover:bg-gray-100 transition disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !date}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Planification...' : 'Confirmer'}
          </button>
        </div>
      </div>
    </div>
  );
}