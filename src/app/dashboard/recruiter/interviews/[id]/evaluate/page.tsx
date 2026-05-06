'use client';

import { useState, useEffect } from 'react';
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
    
    if (!formData.evaluation.trim()) {
      alert('⚠️ Veuillez saisir une évaluation');
      return;
    }

    setLoading(true);

    try {
      await interviewService.evaluate(interviewId, formData);
      alert('✅ Évaluation enregistrée avec succès !');
      router.push('/dashboard/recruiter/interviews');
    } catch (error) {
      alert('❌ Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      
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
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Évaluer l'Entretien Technique</h1>
              <p className="text-sm text-gray-600">Enregistrez votre évaluation du candidat</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 space-y-8 border border-gray-100">
          
          {/* Décision */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Décision finale *
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, passed: true })}
                className={`group relative p-8 rounded-2xl border-2 transition-all duration-200 ${
                  formData.passed
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-500 shadow-xl scale-105'
                    : 'bg-white border-gray-200 hover:border-green-300 hover:shadow-lg hover:scale-105'
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${
                    formData.passed ? 'bg-green-500' : 'bg-gray-100 group-hover:bg-green-100'
                  }`}>
                    <svg className={`w-8 h-8 ${formData.passed ? 'text-white' : 'text-gray-400 group-hover:text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${formData.passed ? 'text-green-900' : 'text-gray-700'}`}>
                    ✅ Compétences Validées
                  </h3>
                  <p className={`text-sm ${formData.passed ? 'text-green-700' : 'text-gray-500'}`}>
                    Le candidat a démontré les compétences techniques requises
                  </p>
                </div>
                {formData.passed && (
                  <div className="absolute top-3 right-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, passed: false })}
                className={`group relative p-8 rounded-2xl border-2 transition-all duration-200 ${
                  !formData.passed
                    ? 'bg-gradient-to-br from-red-50 to-rose-50 border-red-500 shadow-xl scale-105'
                    : 'bg-white border-gray-200 hover:border-red-300 hover:shadow-lg hover:scale-105'
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all ${
                    !formData.passed ? 'bg-red-500' : 'bg-gray-100 group-hover:bg-red-100'
                  }`}>
                    <svg className={`w-8 h-8 ${!formData.passed ? 'text-white' : 'text-gray-400 group-hover:text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${!formData.passed ? 'text-red-900' : 'text-gray-700'}`}>
                    ❌ Compétences Insuffisantes
                  </h3>
                  <p className={`text-sm ${!formData.passed ? 'text-red-700' : 'text-gray-500'}`}>
                    Le candidat n'a pas le niveau technique attendu
                  </p>
                </div>
                {!formData.passed && (
                  <div className="absolute top-3 right-3">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Info box contextuelle */}
          {formData.passed !== undefined && (
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
                    {formData.passed ? 'Candidat validé - Prochaine étape' : 'Candidat rejeté - Fin du processus'}
                  </h4>
                  <p className={`text-sm ${formData.passed ? 'text-green-800' : 'text-red-800'}`}>
                    {formData.passed 
                      ? 'Le candidat passera à l\'entretien RH final avec le RH Manager. Un email de confirmation lui sera envoyé.'
                      : 'Le processus de recrutement s\'arrête ici. Un email de refus poli sera envoyé au candidat.'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Évaluation */}
          <div className="pt-8 border-t border-gray-200">
            <label htmlFor="evaluation" className="block text-sm font-bold text-gray-700 mb-3">
              Évaluation technique détaillée *
            </label>
            <textarea
              id="evaluation"
              value={formData.evaluation}
              onChange={(e) => setFormData({ ...formData, evaluation: e.target.value })}
              required
              rows={10}
              className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
              placeholder="Évaluez en détail les compétences techniques du candidat :&#10;&#10;• Maîtrise des technologies demandées&#10;• Capacité à résoudre des problèmes complexes&#10;• Qualité du code produit&#10;• Architecture et design patterns&#10;• Communication et explication des choix techniques&#10;• Points forts et axes d'amélioration"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-gray-500">Minimum 50 caractères recommandés</p>
              <p className="text-sm text-gray-500">{formData.evaluation.length} caractères</p>
            </div>
          </div>

          {/* Notes additionnelles */}
          <div>
            <label htmlFor="notes" className="block text-sm font-bold text-gray-700 mb-3">
              Notes complémentaires (optionnel)
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={5}
              className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
              placeholder="Ajoutez des informations complémentaires :&#10;&#10;• Soft skills observées&#10;• Comportement durant l'entretien&#10;• Recommandations pour la suite&#10;• Points à creuser lors de l'entretien RH final"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading || !formData.evaluation.trim()}
              className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl transition-all hover:scale-105"
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