import api from '@/lib/api';
import { Interview } from '@/types';

export const interviewService = {
  // Planifier un entretien
  async create(data: {
    applicationId: number;
    type: string;
    scheduledAt: string;
    duration?: number;
    location?: string;
    notes?: string;
  }): Promise<Interview> {
    const response = await api.post<Interview>('/interviews', data);
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
    const response = await api.get<Interview[]>(`/interviews/application/${applicationId}`);
    return response.data;
  },

  // Mes entretiens planifiés
  async getMyInterviews(): Promise<Interview[]> {
    const response = await api.get<Interview[]>('/interviews/my-interviews');
    return response.data;
  },
};