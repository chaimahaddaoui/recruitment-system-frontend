import api from '@/lib/api';
import { Job, CreateJobDto } from '@/types';

export const jobService = {
  // Créer une offre
  async create(data: CreateJobDto): Promise<Job> {
    const response = await api.post<Job>('/jobs', data);
    return response.data;
  },

  // Liste des offres ouvertes (pour candidats)
  async getOpenJobs(): Promise<Job[]> {
    const response = await api.get<Job[]>('/jobs/open');
    return response.data;
  },

  // Liste de toutes les offres (pour recruteurs/RH)
  async getAllJobs(): Promise<Job[]> {
    const response = await api.get<Job[]>('/jobs');
    return response.data;
  },

  // Détails d'une offre
  async getJobById(id: number): Promise<Job> {
    const response = await api.get<Job>(`/jobs/${id}`);
    return response.data;
  },

  // Modifier une offre
  async update(id: number, data: Partial<CreateJobDto>): Promise<Job> {
    const response = await api.patch<Job>(`/jobs/${id}`, data);
    return response.data;
  },

  // Publier une offre
  async publish(id: number): Promise<Job> {
    const response = await api.patch<Job>(`/jobs/${id}/publish`);
    return response.data;
  },

  // Fermer une offre
  async close(id: number): Promise<Job> {
    const response = await api.patch<Job>(`/jobs/${id}/close`);
    return response.data;
  },

  // Supprimer une offre
  async delete(id: number): Promise<void> {
    await api.delete(`/jobs/${id}`);
  },
};