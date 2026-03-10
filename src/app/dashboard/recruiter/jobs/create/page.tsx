'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { jobService } from '@/services/jobService';
import { ContractType } from '@/types';

export default function CreateJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Convertir les skills de string à array
      const skillsArray = formData.skills
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const jobData = {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        location: formData.location,
        contractType: formData.contractType as ContractType,
        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
        salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : undefined,
        experienceYears: parseInt(formData.experienceYears),
        educationLevel: formData.educationLevel,
        skills: skillsArray,
      };

      const job = await jobService.create(jobData);
      
      // Rediriger vers la liste des offres
      router.push('/dashboard/recruiter/jobs');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la création de l\'offre');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-blue-600">
            ➕ Créer une Offre d'Emploi
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
              <p className="font-medium">Erreur</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Titre */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                Titre du poste *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Développeur Full Stack"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Description du poste *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={6}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Décrivez les missions et responsabilités..."
              />
            </div>

            {/* Exigences */}
            <div>
              <label htmlFor="requirements" className="block text-sm font-semibold text-gray-700 mb-2">
                Exigences / Qualifications *
              </label>
              <textarea
                id="requirements"
                name="requirements"
                required
                rows={6}
                value={formData.requirements}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="- Diplôme requis&#10;- Expérience nécessaire&#10;- Compétences techniques..."
              />
            </div>

            {/* Localisation et Type de contrat */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                  Localisation *
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Paris, France"
                />
              </div>

              <div>
                <label htmlFor="contractType" className="block text-sm font-semibold text-gray-700 mb-2">
                  Type de contrat *
                </label>
                <select
                  id="contractType"
                  name="contractType"
                  required
                  value={formData.contractType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={ContractType.CDI}>CDI</option>
                  <option value={ContractType.CDD}>CDD</option>
                  <option value={ContractType.STAGE}>Stage</option>
                  <option value={ContractType.ALTERNANCE}>Alternance</option>
                  
                </select>
              </div>
            </div>

            {/* Salaire */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="salaryMin" className="block text-sm font-semibold text-gray-700 mb-2">
                  Salaire minimum (dt/an)
                </label>
                <input
                  id="salaryMin"
                  name="salaryMin"
                  type="number"
                  value={formData.salaryMin}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                
                />
              </div>

              <div>
                <label htmlFor="salaryMax" className="block text-sm font-semibold text-gray-700 mb-2">
                  Salaire maximum (dt/an)
                </label>
                <input
                  id="salaryMax"
                  name="salaryMax"
                  type="number"
                  value={formData.salaryMax}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  
                />
              </div>
            </div>

            {/* Expérience et Niveau d'études */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="experienceYears" className="block text-sm font-semibold text-gray-700 mb-2">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 3"
                />
              </div>

              <div>
                <label htmlFor="educationLevel" className="block text-sm font-semibold text-gray-700 mb-2">
                  Niveau d'études *
                </label>
                <input
                  id="educationLevel"
                  name="educationLevel"
                  type="text"
                  required
                  value={formData.educationLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Bac+5, Master, Ingénieur"
                />
              </div>
            </div>

            {/* Compétences */}
            <div>
              <label htmlFor="skills" className="block text-sm font-semibold text-gray-700 mb-2">
                Compétences requises * <span className="text-gray-500 text-xs">(séparées par des virgules)</span>
              </label>
              <input
                id="skills"
                name="skills"
                type="text"
                required
                value={formData.skills}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: React, Node.js, TypeScript, PostgreSQL"
              />
              <p className="mt-1 text-sm text-gray-500">
                Entrez les compétences séparées par des virgules
              </p>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Création...' : ' Créer l\'offre (Brouillon)'}
              </button>

              <button
                type="button"
                onClick={() => router.back()}
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