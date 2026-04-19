import api from '@/lib/api';
import { Job } from '@/types';

export const jobService = {
  // Créer une offre
  async createJob(data: Partial<Job>): Promise<Job> {
    const response = await api.post<Job>('/jobs', data);
    return response.data;
  },

  // Mes offres (Recruteur)
  async getMyJobs(): Promise<Job[]> {
    const response = await api.get<Job[]>('/jobs');
    return response.data;
  },

  // Toutes les offres (RH Manager / Admin)
  async getAllJobs(): Promise<Job[]> {
    const response = await api.get<Job[]>('/jobs');
    return response.data;
  },

  // Offres ouvertes (Candidats)
  async getOpenJobs(): Promise<Job[]> {
    const response = await api.get<Job[]>('/jobs/open');
    return response.data;
  },

  // Détails d'une offre
  async getJobById(id: number): Promise<Job> {
    const response = await api.get<Job>(`/jobs/${id}`);
    return response.data;
  },

  // Modifier une offre
  async updateJob(id: number, data: Partial<Job>): Promise<Job> {
    const response = await api.patch<Job>(`/jobs/${id}`, data);
    return response.data;
  },

  // Soumettre au RH (Recruteur)
  async submitForValidation(id: number): Promise<Job> {
    const response = await api.patch<Job>(`/jobs/${id}/submit`);
    return response.data;
  },

  // Valider et publier (RH)
  async validateAndPublish(id: number): Promise<Job> {
    const response = await api.patch<Job>(`/jobs/${id}/validate`);
    return response.data;
  },

  // Rejeter (RH)
  async reject(id: number, feedback: string): Promise<Job> {
    const response = await api.patch<Job>(`/jobs/${id}/reject`, { feedback });
    return response.data;
  },

  // Fermer une offre (RH)
  async closeJob(id: number): Promise<Job> {
    const response = await api.patch<Job>(`/jobs/${id}/close`);
    return response.data;
  },

 


  // Supprimer une offre
  async deleteJob(id: number): Promise<void> {
    await api.delete(`/jobs/${id}`);
  },
};

