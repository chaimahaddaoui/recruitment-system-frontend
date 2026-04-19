'use client';

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
}