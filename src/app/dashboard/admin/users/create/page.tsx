'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function CreateUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [temporaryPassword, setTemporaryPassword] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'RECRUITER',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setTemporaryPassword('');
    setLoading(true);

    try {
      const response = await api.post('/admin/users', formData);
      
      setSuccess(response.data.message);
      setTemporaryPassword(response.data.temporaryPassword);
      
      // Réinitialiser le formulaire
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        role: 'RECRUITER',
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la création de l\'utilisateur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-red-600">
               Créer un Nouvel Utilisateur
            </h1>
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              ← Retour
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-6 rounded">
              <div className="flex items-start gap-3">
                <div className="text-2xl"></div>
                <div className="flex-1">
                  <p className="font-bold text-green-800 mb-2">{success}</p>
                  {temporaryPassword && (
                    <div className="bg-white border border-green-200 rounded p-4 mt-3">
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        Mot de passe temporaire généré :
                      </p>
                      <code className="block bg-gray-100 text-red-600 font-mono text-lg p-3 rounded border border-gray-300">
                        {temporaryPassword}
                      </code>
                      <p className="text-xs text-gray-600 mt-2">
                         Notez ce mot de passe ! Il a été envoyé par email à l'utilisateur.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
              <p className="font-medium">Erreur</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                Rôle * <span className="text-red-600">(Important)</span>
              </label>
              <select
                id="role"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg font-semibold"
              >
                <option value="RECRUITER"> Recruteur</option>
                <option value="HR_MANAGER"> RH Manager</option>
              </select>
              <p className="mt-2 text-sm text-gray-500">
                Les candidats peuvent s'inscrire eux-mêmes. Seuls les recruteurs et RH managers sont créés par l'admin.
              </p>
            </div>

            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Prénom *
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nom *
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                 
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Professionnel *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                
              />
              <p className="mt-1 text-sm text-gray-500">
                Un email avec le mot de passe temporaire sera envoyé à cette adresse
              </p>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Téléphone <span className="text-gray-400">(optionnel)</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                
              />
            </div>

            
           

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Création en cours...' : ' Créer l\'utilisateur'}
              </button>

              <button
                type="button"
                onClick={() => router.push('/dashboard/admin/users')}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}