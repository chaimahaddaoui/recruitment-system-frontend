import api from '@/lib/api';
import { Interview } from '@/types';

export const interviewService = {
  // 🆕 Planifier un entretien avec meetingMode
  async create(data: {
    applicationId: number;
    type: string;
    scheduledAt: string;
    duration: number;
    location?: string;
    notes?: string;
    meetingMode?: 'LOCAL' | 'MANUAL_LINK' | 'GOOGLE_MEET';
  }) {
    console.log('📤 [INTERVIEW SERVICE] Envoi création entretien:', {
      applicationId: data.applicationId,
      type: data.type,
      meetingMode: data.meetingMode || 'LOCAL',
      location: data.location,
    });

    const payload = {
      applicationId: data.applicationId,
      type: data.type,
      scheduledAt: data.scheduledAt,
      duration: data.duration,
      location: data.meetingMode === 'GOOGLE_MEET' ? undefined : (data.location || undefined),
      notes: data.notes,
      meetingMode: data.meetingMode || 'LOCAL', // 🆕 IMPORTANT
    };

    console.log('📋 Payload envoyé:', payload);

    const response = await api.post('/interviews', payload);
    
    console.log('✅ Réponse API:', response.data);

    return response.data;
  },

  // Évaluer un entretien
  async evaluate(
    id: number,
    data: {
      evaluation: string;
      passed: boolean;
      notes?: string;
    }
  ): Promise<Interview> {
    const response = await api.patch<Interview>(`/interviews/${id}/evaluate`, data);
    return response.data;
  },

  // Annuler un entretien
  async cancel(id: number): Promise<Interview> {
    const response = await api.patch<Interview>(`/interviews/${id}/cancel`);
    return response.data;
  },

  // Voir les entretiens d'une candidature
  async getByApplication(applicationId: number): Promise<Interview[]> {
    const response = await api.get<Interview[]>(
      `/interviews/application/${applicationId}`
    );
    return response.data;
  },

  // Mes entretiens planifiés
  async getMyInterviews(): Promise<Interview[]> {
    const response = await api.get<Interview[]>('/interviews/my-interviews');
    return response.data;
  },

  // Obtenir les disponibilités pour une date
  async getAvailability(date: string, interviewerId?: number) {
    console.log('📅 [AVAILABILITY] Demande pour date:', date);

    const params: any = { date };
    if (interviewerId) {
      params.interviewerId = interviewerId;
    }

    const response = await api.get('/interviews/availability', { params });
    
    console.log('✅ [AVAILABILITY] Réponse:', response.data);

    return response.data;
  },
};