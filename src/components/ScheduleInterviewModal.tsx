/* 'use client';

import { useState } from 'react';
import { interviewService } from '@/services/interviewService';
import { InterviewType } from '@/types';

interface Props {
  applicationId: number;
  interviewType: InterviewType;
  onClose: () => void;
  onSuccess: () => void;
}

type MeetingMode = 'LOCAL' | 'MANUAL_LINK' | 'GOOGLE_MEET';

type BusySlot = {
  id: number;
  type?: string;
  status?: string;
  start: string;
  end: string;
  scheduledAt?: string;
  duration?: number;
  location?: string;
  candidate?: string | null;
  candidateEmail?: string | null;
  jobTitle?: string | null;
};

type TimeSlot = {
  time: string;
  available: boolean;
  busySlot?: BusySlot;
};

type AvailabilityView = {
  slots: TimeSlot[];
  availableSlots: number;
  busySlots: number;
  reservedSlots: BusySlot[];
};

export default function ScheduleInterviewModal({
  applicationId,
  interviewType,
  onClose,
  onSuccess,
}: Props) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState('60');

  const [meetingMode, setMeetingMode] = useState<MeetingMode>('LOCAL');
  const [location, setLocation] = useState('');
  const [generatedMeetLink, setGeneratedMeetLink] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [availability, setAvailability] = useState<AvailabilityView | null>(
    null
  );
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  const getInterviewLabel = () => {
    if (interviewType === InterviewType.HR_SCREENING) return 'Entretien RH #1';
    if (interviewType === InterviewType.TECHNICAL) return 'Entretien Technique';
    if (interviewType === InterviewType.HR_FINAL) return 'Entretien RH Final';
    return 'Entretien';
  };

  const generateTimeSlots = (reservedSlots: BusySlot[]): AvailabilityView => {
    const slots: TimeSlot[] = [];

    for (let hour = 8; hour <= 17; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;

      const slotStart = new Date(`${selectedDate}T${time}:00`);
      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(slotEnd.getMinutes() + Number(duration || 60));

      const busySlot = reservedSlots.find((reserved) => {
        const reservedStart = new Date(reserved.start);
        const reservedEnd = new Date(reserved.end);

        return slotStart < reservedEnd && slotEnd > reservedStart;
      });

      slots.push({
        time,
        available: !busySlot,
        busySlot,
      });
    }

    return {
      slots,
      availableSlots: slots.filter((slot) => slot.available).length,
      busySlots: slots.filter((slot) => !slot.available).length,
      reservedSlots,
    };
  };

  const loadAvailability = async (date: string) => {
    if (!date) {
      setAvailability(null);
      return;
    }

    setLoadingAvailability(true);
    setSelectedTime('');

    try {
      const data = await interviewService.getAvailability(date);
      const reservedSlots = Array.isArray(data) ? data : [];

      setAvailability(generateTimeSlots(reservedSlots));
    } catch (err) {
      console.error('Erreur chargement disponibilités:', err);
      setAvailability(generateTimeSlots([]));
    } finally {
      setLoadingAvailability(false);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setSelectedDate(date);
    setSelectedTime('');
    setGeneratedMeetLink('');
    loadAvailability(date);
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDuration(e.target.value);
    setSelectedTime('');
    setGeneratedMeetLink('');

    if (selectedDate && availability) {
      setAvailability(generateTimeSlots(availability.reservedSlots));
    }
  };

  const handleMeetingModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as MeetingMode;
    setMeetingMode(value);
    setLocation('');
    setGeneratedMeetLink('');
  };

  const copyMeetLink = async () => {
    if (!generatedMeetLink) return;

    try {
      await navigator.clipboard.writeText(generatedMeetLink);
    } catch (err) {
      console.error('Erreur copie lien Meet:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setGeneratedMeetLink('');

    if (!selectedDate || !selectedTime) {
      setError('Veuillez sélectionner une date et une heure.');
      return;
    }

    if (meetingMode !== 'GOOGLE_MEET' && !location.trim()) {
      setError(
        meetingMode === 'LOCAL'
          ? "Veuillez saisir le lieu de l'entretien."
          : "Veuillez saisir le lien de l'entretien."
      );
      return;
    }

    setLoading(true);

    try {
      const scheduledAt = `${selectedDate}T${selectedTime}:00`;

      const result = await interviewService.create({
        applicationId,
        type: interviewType,
        scheduledAt,
        duration: Number(duration),
        location: meetingMode === 'GOOGLE_MEET' ? '' : location,
      });

      const responseData = result?.data ?? result;
      const meetLink =
        responseData?.meetingLink ||
        responseData?.data?.meetingLink ||
        responseData?.interview?.meetingLink ||
        responseData?.location ||
        responseData?.data?.location;

      if (meetingMode === 'GOOGLE_MEET' && meetLink) {
        setGeneratedMeetLink(meetLink);
        return;
      }

      onSuccess();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Erreur lors de la planification';

      setError(errorMessage);

      if (
        errorMessage.toLowerCase().includes('réservé') ||
        errorMessage.toLowerCase().includes('occupé')
      ) {
        loadAvailability(selectedDate);
      }
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Planifier un Entretien
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                {getInterviewLabel()}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl">
              <p className="text-sm text-red-700 font-semibold">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              📅 Date de l&apos;entretien *
            </label>
            <input
              type="date"
              required
              min={getMinDate()}
              value={selectedDate}
              onChange={handleDateChange}
              disabled={!!generatedMeetLink}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:bg-gray-100"
            />
          </div>

          {selectedDate && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                🕒 Heure de l&apos;entretien *
              </label>

              {loadingAvailability ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <span className="ml-3 text-gray-600">
                    Chargement des disponibilités...
                  </span>
                </div>
              ) : availability ? (
                <div>
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1 bg-green-50 border-2 border-green-200 rounded-xl p-3 text-center">
                      <div className="text-2xl font-bold text-green-700">
                        {availability.availableSlots}
                      </div>
                      <div className="text-xs text-green-600 font-semibold">
                        Créneaux libres
                      </div>
                    </div>

                    <div className="flex-1 bg-red-50 border-2 border-red-200 rounded-xl p-3 text-center">
                      <div className="text-2xl font-bold text-red-700">
                        {availability.busySlots}
                      </div>
                      <div className="text-xs text-red-600 font-semibold">
                        Créneaux occupés
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {availability.slots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available || !!generatedMeetLink}
                        onClick={() => {
                          setSelectedTime(slot.time);
                          setGeneratedMeetLink('');
                        }}
                        title={
                          slot.busySlot
                            ? `Occupé : ${
                                slot.busySlot.candidate ||
                                'Entretien planifié'
                              }`
                            : 'Disponible'
                        }
                        className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                          !slot.available || !!generatedMeetLink
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
                            : selectedTime === slot.time
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105 border-2 border-blue-600'
                              : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:scale-105 hover:shadow-md'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>

                  {availability.reservedSlots.length > 0 && (
                    <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="font-semibold text-red-700 mb-2">
                        Créneaux déjà réservés ce jour :
                      </p>

                      <div className="space-y-2">
                        {availability.reservedSlots.map((slot) => (
                          <div
                            key={slot.id}
                            className="text-sm text-red-700 bg-white border border-red-100 rounded-lg px-3 py-2"
                          >
                            {new Date(slot.start).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                            {' - '}
                            {new Date(slot.end).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                            {slot.candidate && ` | ${slot.candidate}`}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {availability.availableSlots === 0 && (
                    <div className="mt-4 bg-orange-50 border-l-4 border-orange-500 p-4 rounded-xl">
                      <p className="text-sm text-orange-700 font-semibold">
                        Aucun créneau disponible pour cette date. Veuillez
                        sélectionner une autre date.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Sélectionnez une date pour voir les disponibilités
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              ⏱️ Durée (minutes) *
            </label>
            <select
              required
              value={duration}
              onChange={handleDurationChange}
              disabled={!!generatedMeetLink}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white disabled:bg-gray-100"
            >
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">1 heure</option>
              <option value="90">1h30</option>
              <option value="120">2 heures</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              🎯 Type de l&apos;entretien *
            </label>
            <select
              required
              value={meetingMode}
              onChange={handleMeetingModeChange}
              disabled={!!generatedMeetLink}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white disabled:bg-gray-100"
            >
              <option value="LOCAL">Présentiel / Local</option>
              <option value="MANUAL_LINK">Lien manuel</option>
              <option value="GOOGLE_MEET">Google Meet automatique</option>
            </select>
          </div>

          {meetingMode === 'LOCAL' && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                📍 Lieu de l&apos;entretien *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={!!generatedMeetLink}
                placeholder="Ex: Bureau 203, Salle RH..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:bg-gray-100"
              />
            </div>
          )}

          {meetingMode === 'MANUAL_LINK' && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                🔗 Lien de l&apos;entretien *
              </label>
              <input
                type="url"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={!!generatedMeetLink}
                placeholder="Ex: https://meet.google.com/xxx-xxxx-xxx"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:bg-gray-100"
              />
            </div>
          )}

          {meetingMode === 'GOOGLE_MEET' && !generatedMeetLink && (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
              <p className="text-sm text-green-700 font-semibold">
                Google Meet automatique sélectionné.
              </p>
              <p className="text-sm text-green-600 mt-1">
                Le lien Google Meet sera généré automatiquement par le backend
                après la planification de l&apos;entretien.
              </p>
            </div>
          )}

          {generatedMeetLink && (
            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4">
              <p className="text-sm font-bold text-green-700 mb-2">
                ✅ Lien Google Meet généré avec succès
              </p>

              <a
                href={generatedMeetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-semibold underline break-all"
              >
                {generatedMeetLink}
              </a>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={copyMeetLink}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Copier le lien
                </button>

                <button
                  type="button"
                  onClick={onSuccess}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Terminer
                </button>
              </div>
            </div>
          )}

          {selectedDate && selectedTime && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
              <h3 className="text-sm font-bold text-blue-900 mb-3">
                📋 Récapitulatif
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Date :</span>
                  <span className="font-bold text-blue-900">
                    {new Date(selectedDate).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-blue-700">Heure :</span>
                  <span className="font-bold text-blue-900">
                    {selectedTime}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-blue-700">Durée :</span>
                  <span className="font-bold text-blue-900">
                    {duration} min
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-blue-700">Type :</span>
                  <span className="font-bold text-blue-900">
                    {meetingMode === 'LOCAL' && 'Présentiel / Local'}
                    {meetingMode === 'MANUAL_LINK' && 'Lien manuel'}
                    {meetingMode === 'GOOGLE_MEET' &&
                      'Google Meet automatique'}
                  </span>
                </div>

                {meetingMode !== 'GOOGLE_MEET' && location && (
                  <div className="flex justify-between gap-4">
                    <span className="text-blue-700">
                      {meetingMode === 'LOCAL' ? 'Lieu :' : 'Lien :'}
                    </span>
                    <span className="font-bold text-blue-900 text-right break-all">
                      {location}
                    </span>
                  </div>
                )}

                {generatedMeetLink && (
                  <div className="flex justify-between gap-4">
                    <span className="text-blue-700">Lien Meet :</span>
                    <span className="font-bold text-blue-900 text-right break-all">
                      {generatedMeetLink}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            {!generatedMeetLink && (
              <button
                type="submit"
                disabled={loading || !selectedTime}
                className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl transition-all hover:scale-105"
              >
                {loading ? 'Planification...' : "Planifier l'entretien"}
              </button>
            )}

            <button
              type="button"
              onClick={generatedMeetLink ? onSuccess : onClose}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all hover:scale-105"
            >
              {generatedMeetLink ? 'Fermer' : 'Annuler'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} */
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

type MeetingMode = 'LOCAL' | 'MANUAL_LINK' | 'GOOGLE_MEET';

type BusySlot = {
  id: number;
  type?: string;
  status?: string;
  start: string;
  end: string;
  scheduledAt?: string;
  duration?: number;
  location?: string;
  candidate?: string | null;
  candidateEmail?: string | null;
  jobTitle?: string | null;
};

type TimeSlot = {
  time: string;
  available: boolean;
  busySlot?: BusySlot;
};

type AvailabilityView = {
  slots: TimeSlot[];
  availableSlots: number;
  busySlots: number;
  reservedSlots: BusySlot[];
};

export default function ScheduleInterviewModal({
  applicationId,
  interviewType,
  onClose,
  onSuccess,
}: Props) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState('60');

  const [meetingMode, setMeetingMode] = useState<MeetingMode>('LOCAL');
  const [location, setLocation] = useState('');
  const [generatedMeetLink, setGeneratedMeetLink] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [availability, setAvailability] = useState<AvailabilityView | null>(
    null
  );
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  const getInterviewLabel = () => {
    if (interviewType === InterviewType.HR_SCREENING) return 'Entretien RH #1';
    if (interviewType === InterviewType.TECHNICAL) return 'Entretien Technique';
    if (interviewType === InterviewType.HR_FINAL) return 'Entretien RH Final';
    return 'Entretien';
  };

  const generateTimeSlots = (reservedSlots: BusySlot[]): AvailabilityView => {
    const slots: TimeSlot[] = [];

    for (let hour = 8; hour <= 17; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;

      const slotStart = new Date(`${selectedDate}T${time}:00`);
      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(slotEnd.getMinutes() + Number(duration || 60));

      const busySlot = reservedSlots.find((reserved) => {
        const reservedStart = new Date(reserved.start);
        const reservedEnd = new Date(reserved.end);

        return slotStart < reservedEnd && slotEnd > reservedStart;
      });

      slots.push({
        time,
        available: !busySlot,
        busySlot,
      });
    }

    return {
      slots,
      availableSlots: slots.filter((slot) => slot.available).length,
      busySlots: slots.filter((slot) => !slot.available).length,
      reservedSlots,
    };
  };

  const loadAvailability = async (date: string) => {
    if (!date) {
      setAvailability(null);
      return;
    }

    setLoadingAvailability(true);
    setSelectedTime('');

    try {
      const data = await interviewService.getAvailability(date);
      const reservedSlots = Array.isArray(data) ? data : [];

      setAvailability(generateTimeSlots(reservedSlots));
    } catch (err) {
      console.error('Erreur chargement disponibilités:', err);
      setAvailability(generateTimeSlots([]));
    } finally {
      setLoadingAvailability(false);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setSelectedDate(date);
    setSelectedTime('');
    setGeneratedMeetLink('');
    loadAvailability(date);
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDuration(e.target.value);
    setSelectedTime('');
    setGeneratedMeetLink('');

    if (selectedDate && availability) {
      setAvailability(generateTimeSlots(availability.reservedSlots));
    }
  };

  const handleMeetingModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as MeetingMode;
    setMeetingMode(value);
    setLocation('');
    setGeneratedMeetLink('');
  };

  const copyMeetLink = async () => {
    if (!generatedMeetLink) return;

    try {
      await navigator.clipboard.writeText(generatedMeetLink);
    } catch (err) {
      console.error('Erreur copie lien Meet:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setGeneratedMeetLink('');

    if (!selectedDate || !selectedTime) {
      setError('Veuillez sélectionner une date et une heure.');
      return;
    }

    if (meetingMode !== 'GOOGLE_MEET' && !location.trim()) {
      setError(
        meetingMode === 'LOCAL'
          ? "Veuillez saisir le lieu de l'entretien."
          : "Veuillez saisir le lien de l'entretien."
      );
      return;
    }

    setLoading(true);

    try {
      const scheduledAt = `${selectedDate}T${selectedTime}:00`;

      console.log('📤 Envoi avec meetingMode:', {
        meetingMode,
        location: meetingMode === 'GOOGLE_MEET' ? '' : location,
      });

      // 🆕 IMPORTANT: AJOUTE meetingMode!
      const result = await interviewService.create({
        applicationId,
        type: interviewType,
        scheduledAt,
        duration: Number(duration),
        location: meetingMode === 'GOOGLE_MEET' ? '' : location,
        meetingMode, // 🆕 C'EST ICI QUE C'ÉTAIT LE BUG!
      });

      const responseData = result?.data ?? result;
      const meetLink =
        responseData?.meetingLink ||
        responseData?.data?.meetingLink ||
        responseData?.interview?.meetingLink ||
        responseData?.location ||
        responseData?.data?.location;

      if (meetingMode === 'GOOGLE_MEET' && meetLink) {
        setGeneratedMeetLink(meetLink);
        return;
      }

      onSuccess();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Erreur lors de la planification';

      setError(errorMessage);

      if (
        errorMessage.toLowerCase().includes('réservé') ||
        errorMessage.toLowerCase().includes('occupé')
      ) {
        loadAvailability(selectedDate);
      }
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Planifier un Entretien
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                {getInterviewLabel()}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl">
              <p className="text-sm text-red-700 font-semibold">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              📅 Date de l&apos;entretien *
            </label>
            <input
              type="date"
              required
              min={getMinDate()}
              value={selectedDate}
              onChange={handleDateChange}
              disabled={!!generatedMeetLink}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:bg-gray-100"
            />
          </div>

          {selectedDate && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                🕒 Heure de l&apos;entretien *
              </label>

              {loadingAvailability ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <span className="ml-3 text-gray-600">
                    Chargement des disponibilités...
                  </span>
                </div>
              ) : availability ? (
                <div>
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1 bg-green-50 border-2 border-green-200 rounded-xl p-3 text-center">
                      <div className="text-2xl font-bold text-green-700">
                        {availability.availableSlots}
                      </div>
                      <div className="text-xs text-green-600 font-semibold">
                        Créneaux libres
                      </div>
                    </div>

                    <div className="flex-1 bg-red-50 border-2 border-red-200 rounded-xl p-3 text-center">
                      <div className="text-2xl font-bold text-red-700">
                        {availability.busySlots}
                      </div>
                      <div className="text-xs text-red-600 font-semibold">
                        Créneaux occupés
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {availability.slots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available || !!generatedMeetLink}
                        onClick={() => {
                          setSelectedTime(slot.time);
                          setGeneratedMeetLink('');
                        }}
                        title={
                          slot.busySlot
                            ? `Occupé : ${
                                slot.busySlot.candidate ||
                                'Entretien planifié'
                              }`
                            : 'Disponible'
                        }
                        className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                          !slot.available || !!generatedMeetLink
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
                            : selectedTime === slot.time
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105 border-2 border-blue-600'
                              : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:scale-105 hover:shadow-md'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>

                  {availability.reservedSlots.length > 0 && (
                    <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="font-semibold text-red-700 mb-2">
                        Créneaux déjà réservés ce jour :
                      </p>

                      <div className="space-y-2">
                        {availability.reservedSlots.map((slot) => (
                          <div
                            key={slot.id}
                            className="text-sm text-red-700 bg-white border border-red-100 rounded-lg px-3 py-2"
                          >
                            {new Date(slot.start).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                            {' - '}
                            {new Date(slot.end).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                            {slot.candidate && ` | ${slot.candidate}`}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {availability.availableSlots === 0 && (
                    <div className="mt-4 bg-orange-50 border-l-4 border-orange-500 p-4 rounded-xl">
                      <p className="text-sm text-orange-700 font-semibold">
                        Aucun créneau disponible pour cette date. Veuillez
                        sélectionner une autre date.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Sélectionnez une date pour voir les disponibilités
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              ⏱️ Durée (minutes) *
            </label>
            <select
              required
              value={duration}
              onChange={handleDurationChange}
              disabled={!!generatedMeetLink}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white disabled:bg-gray-100"
            >
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">1 heure</option>
              <option value="90">1h30</option>
              <option value="120">2 heures</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              🎯 Type de l&apos;entretien *
            </label>
            <select
              required
              value={meetingMode}
              onChange={handleMeetingModeChange}
              disabled={!!generatedMeetLink}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white disabled:bg-gray-100"
            >
              <option value="LOCAL">Présentiel / Local</option>
              <option value="MANUAL_LINK">Lien manuel</option>
              <option value="GOOGLE_MEET">Google Meet automatique</option>
            </select>
          </div>

          {meetingMode === 'LOCAL' && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                📍 Lieu de l&apos;entretien *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={!!generatedMeetLink}
                placeholder="Ex: Bureau 203, Salle RH..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:bg-gray-100"
              />
            </div>
          )}

          {meetingMode === 'MANUAL_LINK' && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                🔗 Lien de l&apos;entretien *
              </label>
              <input
                type="url"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={!!generatedMeetLink}
                placeholder="Ex: https://meet.google.com/xxx-xxxx-xxx"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:bg-gray-100"
              />
            </div>
          )}

          {meetingMode === 'GOOGLE_MEET' && !generatedMeetLink && (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
              <p className="text-sm text-green-700 font-semibold">
                Google Meet automatique sélectionné.
              </p>
              <p className="text-sm text-green-600 mt-1">
                Le lien Google Meet sera généré automatiquement par le backend
                après la planification de l&apos;entretien.
              </p>
            </div>
          )}

          {generatedMeetLink && (
            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4">
              <p className="text-sm font-bold text-green-700 mb-2">
                ✅ Lien Google Meet généré avec succès
              </p>

              <a
                href={generatedMeetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-semibold underline break-all"
              >
                {generatedMeetLink}
              </a>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={copyMeetLink}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Copier le lien
                </button>

                <button
                  type="button"
                  onClick={onSuccess}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Terminer
                </button>
              </div>
            </div>
          )}

          {selectedDate && selectedTime && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
              <h3 className="text-sm font-bold text-blue-900 mb-3">
                📋 Récapitulatif
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Date :</span>
                  <span className="font-bold text-blue-900">
                    {new Date(selectedDate).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-blue-700">Heure :</span>
                  <span className="font-bold text-blue-900">
                    {selectedTime}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-blue-700">Durée :</span>
                  <span className="font-bold text-blue-900">
                    {duration} min
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-blue-700">Type :</span>
                  <span className="font-bold text-blue-900">
                    {meetingMode === 'LOCAL' && 'Présentiel / Local'}
                    {meetingMode === 'MANUAL_LINK' && 'Lien manuel'}
                    {meetingMode === 'GOOGLE_MEET' &&
                      'Google Meet automatique'}
                  </span>
                </div>

                {meetingMode !== 'GOOGLE_MEET' && location && (
                  <div className="flex justify-between gap-4">
                    <span className="text-blue-700">
                      {meetingMode === 'LOCAL' ? 'Lieu :' : 'Lien :'}
                    </span>
                    <span className="font-bold text-blue-900 text-right break-all">
                      {location}
                    </span>
                  </div>
                )}

                {generatedMeetLink && (
                  <div className="flex justify-between gap-4">
                    <span className="text-blue-700">Lien Meet :</span>
                    <span className="font-bold text-blue-900 text-right break-all">
                      {generatedMeetLink}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            {!generatedMeetLink && (
              <button
                type="submit"
                disabled={loading || !selectedTime}
                className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl transition-all hover:scale-105"
              >
                {loading ? 'Planification...' : "Planifier l'entretien"}
              </button>
            )}

            <button
              type="button"
              onClick={generatedMeetLink ? onSuccess : onClose}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all hover:scale-105"
            >
              {generatedMeetLink ? 'Fermer' : 'Annuler'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}