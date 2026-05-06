'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { interviewService } from '@/services/interviewService';

export default function EvaluateInterviewPage() {
  const router = useRouter();
  const params = useParams();
  const interviewId = parseInt(params.id as string);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    evaluation: '',
    passed: true,
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await interviewService.evaluate(interviewId, formData);
      alert('✅ Évaluation enregistrée avec succès !');
      router.push('/dashboard/hr-manager/interviews');
    } catch (error) {
      alert('❌ Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Évaluer l'Entretien</h1>
              <p className="text-sm text-gray-600">Renseignez votre évaluation complète du candidat</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 space-y-8 border border-gray-100">
          
          {/* Décision */}
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Décision finale *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, passed: true })}
                className={`relative overflow-hidden py-6 px-8 rounded-2xl font-bold text-lg transition-all duration-200 ${
                  formData.passed
                    ? 'bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-2xl scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Candidat Validé</span>
                  {formData.passed && (
                    <span className="text-sm font-normal opacity-90">Le candidat passe à l'étape suivante</span>
                  )}
                </div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, passed: false })}
                className={`relative overflow-hidden py-6 px-8 rounded-2xl font-bold text-lg transition-all duration-200 ${
                  !formData.passed
                    ? 'bg-gradient-to-br from-red-600 to-rose-600 text-white shadow-2xl scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                }`}
              >
                <div className="flex flex-col items-center gap-3">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Candidat Refusé</span>
                  {!formData.passed && (
                    <span className="text-sm font-normal opacity-90">La candidature sera rejetée</span>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Évaluation détaillée */}
          <div>
            <label htmlFor="evaluation" className="block text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Évaluation détaillée *
            </label>
            <div className="relative">
              <textarea
                id="evaluation"
                value={formData.evaluation}
                onChange={(e) => setFormData({ ...formData, evaluation: e.target.value })}
                required
                rows={10}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none"
                placeholder="Décrivez en détail votre évaluation du candidat :&#10;&#10;• Compétences techniques et professionnelles&#10;• Soft skills et savoir-être&#10;• Motivation et adéquation avec le poste&#10;• Points forts et axes d'amélioration&#10;• Recommandations pour la suite"
              />
              <div className="absolute bottom-4 right-4 text-sm text-gray-400">
                {formData.evaluation.length} caractères
              </div>
            </div>
          </div>

          {/* Notes complémentaires */}
          <div>
            <label htmlFor="notes" className="block text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              Notes complémentaires
              <span className="text-sm font-normal text-gray-500">(optionnel)</span>
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={5}
              className="w-full px-5 py-4 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none"
              placeholder="Ajoutez des remarques additionnelles, des points de vigilance, ou des informations à partager avec l'équipe..."
            />
          </div>

          {/* Info Box */}
          <div className={`rounded-2xl p-6 border-2 ${
            formData.passed 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                formData.passed ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <svg className={`w-6 h-6 ${formData.passed ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className={`font-bold mb-2 ${formData.passed ? 'text-green-900' : 'text-red-900'}`}>
                  {formData.passed ? 'Validation du candidat' : 'Refus du candidat'}
                </h4>
                <p className={`text-sm ${formData.passed ? 'text-green-800' : 'text-red-800'}`}>
                  {formData.passed 
                    ? "Le candidat recevra un email de félicitations et passera à l'étape suivante du processus de recrutement."
                    : "Le candidat recevra un email de refus poli. Cette action est définitive et marquera la fin du processus pour ce candidat."
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading || !formData.evaluation}
              className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl transition-all hover:scale-105"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enregistrement...
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Enregistrer l'évaluation
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center gap-2 px-8 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Annuler
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}