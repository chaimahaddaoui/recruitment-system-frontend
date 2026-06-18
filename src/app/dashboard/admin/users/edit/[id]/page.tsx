'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { adminService } from '@/services/adminService';
import toast from 'react-hot-toast';
import { showConfirmDialog } from '@/components/ConfirmDialog';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id ? parseInt(params.id as string) : null;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'CANDIDATE',
  });

  const [showResetPassword, setShowResetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const fetchUser = async () => {
    if (!userId) return;

    try {
      const data = await adminService.getUserById(userId);
      setUser(data);
      setFormData({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || '',
        role: data.role,
      });
    } catch (error: any) {
      toast.error('Erreur lors du chargement de l\'utilisateur');
      router.push('/dashboard/admin/users');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await adminService.updateUser(userId!, {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || null,
        role: formData.role as any,
      });

      toast.success('Utilisateur modifié avec succès !');
      router.push('/dashboard/admin/users');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de la modification';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    showConfirmDialog({
      title: 'Réinitialiser le mot de passe ?',
      message: `Le mot de passe de ${user?.firstName} ${user?.lastName} sera modifié.`,
      confirmText: 'Réinitialiser',
      confirmColor: 'red',
      onConfirm: async () => {
        const loadingToast = toast.loading('Réinitialisation en cours...');
        try {
          await adminService.resetPassword(userId!, newPassword);
          toast.success('Mot de passe réinitialisé avec succès !', { id: loadingToast });
          setShowResetPassword(false);
          setNewPassword('');
          setConfirmPassword('');
        } catch (error: any) {
          toast.error('Erreur lors de la réinitialisation', { id: loadingToast });
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Modifier l'utilisateur</h1>
              <p className="text-sm text-gray-600">{user?.firstName} {user?.lastName}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Informations de base */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 mb-8">
          
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            Informations personnelles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Prénom *
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Nom *
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Rôle *
              </label>
              <select
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
              >
                <option value="ADMIN">Administrateur</option>
                <option value="HR_MANAGER">Responsable RH</option>
                <option value="RECRUITER">Recruteur</option>
                <option value="CANDIDATE">Candidat</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-6 mt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl transition-all hover:scale-105"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all hover:scale-105"
            >
              Annuler
            </button>
          </div>
        </form>

        {/* Réinitialisation du mot de passe */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            Réinitialisation du mot de passe
          </h2>

          {!showResetPassword ? (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Vous pouvez réinitialiser le mot de passe de cet utilisateur.
              </p>
              <button
                onClick={() => setShowResetPassword(true)}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Réinitialiser le mot de passe
              </button>
            </div>
          ) : (
            <div>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    placeholder="Au moins 6 caractères"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    placeholder="Retapez le mot de passe"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleResetPassword}
                  disabled={!newPassword || !confirmPassword}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Confirmer
                </button>
                <button
                  onClick={() => {
                    setShowResetPassword(false);
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all hover:scale-105"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}