'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { jobService } from '@/services/jobService';
import { ContractType } from '@/types';
import toast from "react-hot-toast";

export default function CreateJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const skillsArray = formData.skills
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const jobData = {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        location: formData.location,
        contractType: formData.contractType as ContractType,
        salaryMin: formData.salaryMin
          ? parseInt(formData.salaryMin)
          : undefined,
        salaryMax: formData.salaryMax
          ? parseInt(formData.salaryMax)
          : undefined,
        experienceYears: parseInt(formData.experienceYears),
        educationLevel: formData.educationLevel,
        skills: skillsArray,
      };

      await jobService.createJob(jobData);

      toast.success(
        "Offre créée avec succès ! Elle est maintenant en brouillon.",
        {
          duration: 4000,
        }
      );

      setTimeout(() => {
        router.push('/dashboard/recruiter/jobs');
      }, 1000);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          "Erreur lors de la création de l'offre",
        {
          duration: 5000,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Créer une Offre d'Emploi
              </h1>
              <p className="text-sm text-gray-600">
                Remplissez les informations ci-dessous
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                Informations principales
              </h2>

              <div className="mb-6">
                <label
                  htmlFor="title"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Titre du poste *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Ex: Développeur Full Stack Senior"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="description"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Description du poste *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={8}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  placeholder="Décrivez les missions principales, responsabilités, objectifs et environnement de travail"
                />
              </div>

              <div>
                <label
                  htmlFor="requirements"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Exigences & Qualifications *
                </label>
                <textarea
                  id="requirements"
                  name="requirements"
                  required
                  rows={8}
                  value={formData.requirements}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  placeholder="Listez les diplômes, expériences, compétences techniques et certifications"
                />
              </div>
            </div>

            <div className="pt-8 border-t border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                Détails du contrat
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-bold text-gray-700 mb-2"
                  >
                    Localisation *
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Tunis, Tunisie"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contractType"
                    className="block text-sm font-bold text-gray-700 mb-2"
                  >
                    Type de contrat *
                  </label>
                  <select
                    id="contractType"
                    name="contractType"
                    required
                    value={formData.contractType}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                  >
                    <option value={ContractType.CDI}>CDI</option>
                    <option value={ContractType.CDD}>CDD</option>
                    <option value={ContractType.STAGE}>Stage</option>
                    <option value={ContractType.ALTERNANCE}>Alternance</option>
                    <option value={ContractType.FREELANCE}>Freelance</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                Rémunération
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  id="salaryMin"
                  name="salaryMin"
                  type="number"
                  value={formData.salaryMin}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Salaire minimum"
                />

                <input
                  id="salaryMax"
                  name="salaryMax"
                  type="number"
                  value={formData.salaryMax}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Salaire maximum"
                />
              </div>
            </div>

            <div className="pt-8 border-t border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                Profil recherché
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <input
                  id="experienceYears"
                  name="experienceYears"
                  type="number"
                  required
                  min="0"
                  max="50"
                  value={formData.experienceYears}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Années d'expérience"
                />

                <input
                  id="educationLevel"
                  name="educationLevel"
                  type="text"
                  required
                  value={formData.educationLevel}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Niveau d'études"
                />
              </div>

              <input
                id="skills"
                name="skills"
                type="text"
                required
                value={formData.skills}
                onChange={handleChange}
                className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="React, Node.js, TypeScript, PostgreSQL"
              />

              <p className="mt-2 text-sm text-gray-500">
                Séparez les compétences par des virgules.
              </p>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
              <h4 className="font-bold text-blue-900 mb-2">
                Création en mode brouillon
              </h4>
              <p className="text-sm text-blue-800">
                Cette offre sera créée en tant que <strong>brouillon</strong>.
                Elle devra être validée par le RH Manager avant d'être publiée.
              </p>
            </div>

            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl transition-all hover:scale-105"
              >
                {loading ? 'Création en cours...' : "Créer l'offre"}
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
        </div>
      </main>
    </div>
  );
}