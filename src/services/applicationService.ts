import api from '@/lib/api';
import { Application, ApplicationStatus } from '@/types';

export const applicationService = {
  // Postuler à une offre
  async apply(jobId: number, coverLetter: string, cvFile: File): Promise<Application> {
    const formData = new FormData();
    formData.append('jobId', jobId.toString());
    formData.append('coverLetter', coverLetter);
    formData.append('cv', cvFile);

    const response = await api.post<Application>('/applications', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Mes candidatures (Candidat)
  async getMyApplications(): Promise<Application[]> {
    const response = await api.get<Application[]>('/applications/my-applications');
    return response.data;
  },

  // Candidatures pour une offre (Recruteur/RH)
  async getApplicationsByJob(jobId: number): Promise<Application[]> {
    const response = await api.get<Application[]>(`/applications/job/${jobId}`);
    return response.data;
  },

  // Détails d'une candidature
  async getApplicationById(id: number): Promise<Application> {
    const response = await api.get<Application>(`/applications/${id}`);
    return response.data;
  },

  // Pré-sélectionner un candidat (Recruteur)
  async shortlist(id: number): Promise<Application> {
    const response = await api.patch<Application>(`/applications/${id}/shortlist`);
    return response.data;
  },

  // Rejeter un candidat
  async reject(id: number): Promise<Application> {
    const response = await api.patch<Application>(`/applications/${id}/reject`);
    return response.data;
  },

  // Changer le statut
  async updateStatus(id: number, status: ApplicationStatus): Promise<Application> {
    const response = await api.patch<Application>(`/applications/${id}/status`, { status });
    return response.data;
  },

  // Supprimer une candidature
  async delete(id: number): Promise<void> {
    await api.delete(`/applications/${id}`);
  },
};