'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { interviewService } from '@/services/interviewService';

export default function RecruiterEvaluateInterviewPage() {
  const router = useRouter();
  const params = useParams();
  const interviewId = parseInt(params.id as string);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    evaluation: '',
    passed: true,
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await interviewService.evaluate(interviewId, formData);
      alert('Évaluation enregistrée avec succès !');
      router.push('/dashboard/recruiter/interviews');
    } catch (error) {
      alert('Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-blue-600">📝 Évaluer l'Entretien Technique</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
          {/* Décision */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Décision *
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, passed: true })}
                className={`flex-1 py-4 px-6 rounded-lg font-bold text-lg transition ${
                  formData.passed
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ✅ Compétences Validées
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, passed: false })}
                className={`flex-1 py-4 px-6 rounded-lg font-bold text-lg transition ${
                  !formData.passed
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ❌ Compétences Insuffisantes
              </button>
            </div>
          </div>

          {/* Évaluation */}
          <div>
            <label htmlFor="evaluation" className="block text-sm font-semibold text-gray-700 mb-2">
              Évaluation technique détaillée *
            </label>
            <textarea
              id="evaluation"
              value={formData.evaluation}
              onChange={(e) => setFormData({ ...formData, evaluation: e.target.value })}
              required
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Évaluez les compétences techniques du candidat, sa capacité à résoudre des problèmes, son niveau de maîtrise..."
            />
          </div>

          {/* Notes additionnelles */}
          <div>
            <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
              Notes complémentaires (optionnel)
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Points forts, axes d'amélioration, recommandations..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading || !formData.evaluation}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition shadow-lg"
            >
              {loading ? 'Enregistrement...' : '💾 Enregistrer l\'évaluation'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
            >
              Annuler
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}