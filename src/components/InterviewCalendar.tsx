'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

interface Interview {
  id: number;
  scheduledAt: string;
  application?: {
    candidate?: {
      firstName: string;
      lastName: string;
    };
  };
}

export default function InterviewCalendar({ interviews }: { interviews: Interview[] }) {
  
  const events = interviews.map((i) => ({
    id: i.id.toString(),
    title: i.application?.candidate
      ? `${i.application.candidate.firstName} ${i.application.candidate.lastName}`
      : 'Entretien',
    date: i.scheduledAt,
  }));

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">📅 Calendrier des entretiens</h2>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="auto"
      />
    </div>
  );
}