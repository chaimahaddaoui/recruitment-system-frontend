'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';
import { applicationService } from '@/services/applicationService';

export default function ApplyPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params?.id ? parseInt(params.id as string) : null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    coverLetter: '',
    cvFile: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Vérifier le type de fichier
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setError('Format de fichier non supporté. Utilisez PDF ou DOCX.');
        return;
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Le fichier est trop volumineux (max 5 MB)');
        return;
      }

      setFormData({
        ...formData,
        cvFile: file,
      });
      setError('');
    }
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  // Validation
  if (!formData.coverLetter.trim()) {
    setError('La lettre de motivation est obligatoire');
    setLoading(false);
    return;
  }

  if (!formData.cvFile) {
    setError('Le CV est obligatoire');
    setLoading(false);
    return;
  }

  try {
    // Utiliser le service
    if (!jobId) {
      setError('ID de l\'offre invalide');
      setLoading(false);
      return;
    }
    await applicationService.apply(jobId, formData.coverLetter, formData.cvFile);

    setSuccess(true);
    
    // Rediriger après 2 secondes
    setTimeout(() => {
      router.push('/dashboard/candidate/applications');
    }, 2000);
  } catch (err: any) {
    setError(err.response?.data?.message || 'Erreur lors de l\'envoi de la candidature');
  } finally {
    setLoading(false);
  }
};

  if (success) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-12 text-center max-w-md">
          <div className="text-6xl mb-6 animate-bounce">🎉</div>
          <h2 className="text-3xl font-bold text-green-600 mb-4">
            Candidature envoyée !
          </h2>
          <p className="text-gray-600 mb-6">
            Votre candidature a été transmise avec succès. Vous serez notifié de la réponse du recruteur.
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-4">Redirection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-blue-600">
              ✉️ Postuler à l'offre
            </h1>
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-800 font-medium transition"
            >
              ← Retour
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Info Box */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded mb-8">
            <div className="flex items-start gap-3">
              <div className="text-3xl">ℹ️</div>
              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-2">
                  Conseils pour votre candidature
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>✅ Personnalisez votre lettre de motivation</li>
                  <li>✅ Mettez en avant vos compétences pertinentes</li>
                  <li>✅ Vérifiez votre CV avant de l'envoyer</li>
                  <li>✅ Soyez concis et professionnel</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
              <p className="font-medium">Erreur</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cover Letter */}
            <div>
              <label htmlFor="coverLetter" className="block text-sm font-semibold text-gray-700 mb-2">
                Lettre de motivation * <span className="text-gray-500 font-normal">(minimum 100 caractères)</span>
              </label>
              <textarea
                id="coverLetter"
                name="coverLetter"
                required
                rows={12}
                value={formData.coverLetter}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Madame, Monsieur,&#10;&#10;Je me permets de vous adresser ma candidature pour le poste de...&#10;&#10;Fort(e) de [X] années d'expérience dans...&#10;&#10;Cordialement,"
                minLength={100}
              />
              <div className="flex justify-between mt-2">
                <p className="text-sm text-gray-500">
                  {formData.coverLetter.length} caractère(s)
                </p>
                {formData.coverLetter.length >= 100 && (
                  <p className="text-sm text-green-600 font-medium">✅ Longueur suffisante</p>
                )}
              </div>
            </div>

            {/* CV Upload */}
            <div>
              <label htmlFor="cvFile" className="block text-sm font-semibold text-gray-700 mb-2">
                Curriculum Vitae (CV) * <span className="text-gray-500 font-normal">(PDF ou DOCX, max 5 MB)</span>
              </label>
              
              <div className="mt-2">
                <label
                  htmlFor="cvFile"
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {formData.cvFile ? (
                      <>
                        <div className="text-5xl mb-3">📄</div>
                        <p className="text-sm font-semibold text-gray-700">{formData.cvFile.name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {(formData.cvFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <p className="text-xs text-green-600 font-medium mt-2">✅ Fichier sélectionné</p>
                      </>
                    ) : (
                      <>
                        <div className="text-5xl mb-3">📎</div>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Cliquez pour uploader</span> ou glissez-déposez
                        </p>
                        <p className="text-xs text-gray-500">PDF ou DOCX (max 5 MB)</p>
                      </>
                    )}
                  </div>
                  <input
                    id="cvFile"
                    name="cvFile"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    required
                  />
                </label>
              </div>

              {formData.cvFile && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, cvFile: null })}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  🗑️ Supprimer le fichier
                </button>
              )}
            </div>

            {/* Privacy Notice */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="privacy"
                  required
                  className="mt-1"
                />
                <label htmlFor="privacy" className="text-sm text-gray-700">
                  J'accepte que mes données personnelles soient traitées dans le cadre de cette candidature conformément à la politique de confidentialité.
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading || !formData.cvFile || formData.coverLetter.length < 100}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-colors shadow-lg text-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Envoi en cours...
                  </span>
                ) : (
                  '✉️ Envoyer ma candidature'
                )}
              </button>

              <button
                type="button"
                onClick={() => router.back()}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span>💡</span>
            Astuces pour maximiser vos chances
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">•</span>
              <span>Adaptez votre CV à l'offre en mettant en avant les compétences demandées</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">•</span>
              <span>Mentionnez des exemples concrets de vos réalisations passées</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">•</span>
              <span>Relisez-vous pour éviter les fautes d'orthographe</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">•</span>
              <span>Soyez honnête et authentique dans votre présentation</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}