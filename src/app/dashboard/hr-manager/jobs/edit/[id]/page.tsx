'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { jobService } from '@/services/jobService';
import { ContractType, Job } from '@/types';

export default function HREditJobPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.id ? parseInt(params.id as string) : null;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    contractType: ContractType.CDI,
    salaryMin: '',
    salaryMax: '',
    experienceYears: '',
    educationLevel: '',
    skills: '',
  });

  useEffect(() => {
    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  const fetchJob = async () => {
    if (!jobId) return;

    try {
      const jobData = await jobService.getJobById(jobId);
      setJob(jobData);

      setFormData({
        title: jobData.title,
        description: jobData.description,
        requirements: jobData.requirements,
        location: jobData.location,
        contractType: jobData.contractType,
        salaryMin: jobData.salaryMin?.toString() || '',
        salaryMax: jobData.salaryMax?.toString() || '',
        experienceYears: jobData.experienceYears.toString(),
        educationLevel: jobData.educationLevel,
        skills: jobData.skills.join(', '),
      });

      setLoading(false);
    } catch (err: any) {
      console.error('Erreur:', err);
      setError('Erreur lors du chargement de l\'offre');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const updateData = {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        location: formData.location,
        contractType: formData.contractType,
        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
        salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : undefined,
        experienceYears: parseInt(formData.experienceYears),
        educationLevel: formData.educationLevel,
        skills: formData.skills
          .split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0),
      };

      await jobService.updateJob(jobId!, updateData);

      alert('✅ Offre modifiée avec succès');
      router.push('/dashboard/hr-manager/jobs');

    } catch (err: any) {
      console.error('Erreur:', err);
      const errorMessage = err.response?.data?.message || 'Erreur lors de la modification';
      setError(errorMessage);
      alert('❌ ' + errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!confirm('Voulez-vous modifier ET publier cette offre ?')) return;

    setSaving(true);
    setError('');

    try {
      // D'abord modifier
      const updateData = {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        location: formData.location,
        contractType: formData.contractType,
        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
        salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : undefined,
        experienceYears: parseInt(formData.experienceYears),
        educationLevel: formData.educationLevel,
        skills: formData.skills
          .split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0),
      };

      await jobService.updateJob(jobId!, updateData);

      // Puis publier
      await jobService.validateAndPublish(jobId!);

      alert('✅ Offre modifiée et publiée avec succès');
      router.push('/dashboard/hr-manager/jobs');

    } catch (err: any) {
      console.error('Erreur:', err);
      const errorMessage = err.response?.data?.message || 'Erreur lors de la publication';
      setError(errorMessage);
      alert('❌ ' + errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-red-600 font-bold mb-4">{error}</p>
          <button
            onClick={() => router.push('/dashboard/hr-manager/jobs')}
            className="bg-purple-600 text-white px-6 py-2 rounded-xl"
          >
            Retour aux offres
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      
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
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Modifier & Valider l'Offre</h1>
              <p className="text-sm text-gray-600">En tant que RH Manager</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-5 rounded-xl">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="font-semibold">{error}</p>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-purple-900 mb-2">Rôle RH Manager</h4>
              <p className="text-sm text-purple-800">
                En tant que RH Manager, vous pouvez modifier toutes les offres avant de les publier. 
                Une fois modifiée, vous pouvez soit l'enregistrer, soit l'enregistrer et la publier directement.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 space-y-8">
          
          {/* Section 1 : Informations principales */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Informations principales
            </h2>

            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2">
                Titre du poste *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">
                Description du poste *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={8}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none"
              />
            </div>

            <div>
              <label htmlFor="requirements" className="block text-sm font-bold text-gray-700 mb-2">
                Exigences & Qualifications *
              </label>
              <textarea
                id="requirements"
                name="requirements"
                required
                rows={8}
                value={formData.requirements}
                onChange={handleChange}
                className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none"
              />
            </div>
          </div>

          {/* Section 2 : Détails du contrat */}
          <div className="pt-8 border-t border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              Détails du contrat
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="location" className="block text-sm font-bold text-gray-700 mb-2">
                  Localisation *
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                />
              </div>

              <div>
                <label htmlFor="contractType" className="block text-sm font-bold text-gray-700 mb-2">
                  Type de contrat *
                </label>
                <select
                  id="contractType"
                  name="contractType"
                  required
                  value={formData.contractType}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white"
                >
                  <option value={ContractType.CDI}>CDI</option>
                  <option value={ContractType.CDD}>CDD</option>
                  <option value={ContractType.STAGE}>Stage</option>
                  <option value={ContractType.ALTERNANCE}>Alternance</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3 : Rémunération */}
          <div className="pt-8 border-t border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Rémunération
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="salaryMin" className="block text-sm font-bold text-gray-700 mb-2">
                  Salaire minimum (DT/an)
                </label>
                <input
                  id="salaryMin"
                  name="salaryMin"
                  type="number"
                  value={formData.salaryMin}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                />
              </div>

              <div>
                <label htmlFor="salaryMax" className="block text-sm font-bold text-gray-700 mb-2">
                  Salaire maximum (DT/an)
                </label>
                <input
                  id="salaryMax"
                  name="salaryMax"
                  type="number"
                  value={formData.salaryMax}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 4 : Profil recherché */}
          <div className="pt-8 border-t border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              Profil recherché
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="experienceYears" className="block text-sm font-bold text-gray-700 mb-2">
                  Années d'expérience *
                </label>
                <input
                  id="experienceYears"
                  name="experienceYears"
                  type="number"
                  required
                  min="0"
                  value={formData.experienceYears}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                />
              </div>

              <div>
                <label htmlFor="educationLevel" className="block text-sm font-bold text-gray-700 mb-2">
                  Niveau d'études *
                </label>
                <input
                  id="educationLevel"
                  name="educationLevel"
                  type="text"
                  required
                  value={formData.educationLevel}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="skills" className="block text-sm font-bold text-gray-700 mb-2">
                Compétences requises *
              </label>
              <input
                id="skills"
                name="skills"
                type="text"
                required
                value={formData.skills}
                onChange={handleChange}
                className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              />
              <p className="mt-2 text-sm text-gray-500">Séparez les compétences par des virgules</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-4 pt-6 border-t border-gray-200">
            
            {/* Enregistrer ET Publier */}
            {job?.status === 'DRAFT' && (
              <button
                type="button"
                onClick={handlePublish}
                disabled={saving}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-2xl disabled:opacity-50 text-white font-bold py-4 px-8 rounded-xl transition-all hover:scale-105"
              >
                {saving ? 'Publication en cours...' : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Modifier ET Publier l'offre
                  </>
                )}
              </button>
            )}

            <div className="flex gap-4">
              {/* Enregistrer seulement */}
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-2xl disabled:opacity-50 text-white font-bold py-4 px-8 rounded-xl transition-all hover:scale-105"
              >
                {saving ? 'Enregistrement...' : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Enregistrer les modifications
                  </>
                )}
              </button>

              {/* Annuler */}
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

          </div>

        </form>

      </main>
    </div>
  );
}