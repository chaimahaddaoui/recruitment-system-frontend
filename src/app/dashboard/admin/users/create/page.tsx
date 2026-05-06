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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        role: 'RECRUITER',
      });
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Erreur lors de la création de l'utilisateur"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3M13 7a4 4 0 11-8 0 4 4 0 018 0zM3 21v-1a6 6 0 0112 0v1H3z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Créer un utilisateur
                </h1>
                <p className="text-sm text-gray-600">
                  Ajouter un recruteur ou un responsable RH à la plateforme
                </p>
              </div>
            </div>

            <button
              onClick={() => router.back()}
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
            >
              ← Retour
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900">
                Informations de l’utilisateur
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Les champs marqués par * sont obligatoires.
              </p>
            </div>

            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 p-5 rounded-2xl">
                <p className="font-bold text-green-800">{success}</p>

                {temporaryPassword && (
                  <div className="mt-4 bg-white rounded-xl border border-green-200 p-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Mot de passe temporaire généré :
                    </p>
                    <code className="block bg-gray-100 text-indigo-700 font-mono text-lg p-3 rounded-lg border">
                      {temporaryPassword}
                    </code>
                    <p className="text-xs text-gray-500 mt-2">
                      Conservez ce mot de passe. Il sera utilisé pour la première connexion.
                    </p>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl">
                <p className="font-bold">Erreur</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rôle *
                </label>
                <select
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white font-medium"
                >
                  <option value="RECRUITER">Recruteur</option>
                  <option value="HR_MANAGER">Responsable RH</option>
                </select>
                <p className="mt-2 text-sm text-gray-500">
                  Les candidats peuvent s’inscrire eux-mêmes. L’admin crée seulement les recruteurs et les RH.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <input
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Ex : Sara"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Ex : Ben Ali"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email professionnel *
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="exemple@entreprise.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Un mot de passe temporaire sera généré pour cet utilisateur.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Téléphone <span className="text-gray-400">(optionnel)</span>
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+216 XX XXX XXX"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Création en cours...' : "Créer l'utilisateur"}
                </button>

                <button
                  type="button"
                  onClick={() => router.push('/dashboard/admin/users')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
                >
                  Annuler
                </button>
              </div>
            </form>
          </section>

          <aside className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-fit">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Règles de création
            </h3>

            <div className="space-y-4 text-sm text-gray-600">
              <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                <p className="font-semibold text-indigo-700">Recruteur</p>
                <p>Peut créer des offres, consulter les candidatures et évaluer les candidats.</p>
              </div>

              <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                <p className="font-semibold text-purple-700">Responsable RH</p>
                <p>Peut valider les offres, gérer les entretiens RH et prendre la décision finale.</p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                <p className="font-semibold text-amber-700">Sécurité</p>
                <p>L’utilisateur devra modifier son mot de passe temporaire après la première connexion.</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}