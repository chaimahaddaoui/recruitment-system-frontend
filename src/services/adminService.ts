import api from '@/lib/api';

export const adminService = {
  // Obtenir tous les utilisateurs
  async getAllUsers() {
    const response = await api.get('/admin/users');
    return response.data;
  },

  // Obtenir un utilisateur par ID
  async getUserById(id: number) {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  // Mettre à jour un utilisateur
  async updateUser(id: number, data: any) {
    const response = await api.patch(`/admin/users/${id}`, data);
    return response.data;
  },

  // Réinitialiser le mot de passe
  async resetPassword(id: number, newPassword: string) {
    const response = await api.post(`/admin/users/${id}/reset-password`, {
      newPassword,
    });
    return response.data;
  },

  // Supprimer un utilisateur
  async deleteUser(id: number) {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  // Obtenir les statistiques
  async getStats() {
    const response = await api.get('/admin/stats');
    return response.data;
  },
};