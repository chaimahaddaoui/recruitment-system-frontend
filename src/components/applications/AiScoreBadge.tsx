import React from 'react';

interface AiScoreBadgeProps {
  score: number;
  recommendation?: string;
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
}

export default function AiScoreBadge({
  score,
  recommendation,
  size = 'md',
  showDescription = true,
}: AiScoreBadgeProps) {
  const getScoreColor = (score: number): string => {
    if (score >= 75) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 60) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (score >= 45) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getScoreIcon = (score: number): string => {
    if (score >= 75) return '🌟';
    if (score >= 60) return '✅';
    if (score >= 45) return '⚠️';
    return '❌';
  };

  /**
   * ✅ PHRASE DE DÉCISION CLAIRE ET ACTIONNABLE
   */
  const getDecisionMessage = (score: number): string => {
    if (score >= 75) {
      return 'Candidat hautement qualifié. Profil fortement aligné avec les exigences du poste (compétences techniques, expérience et contexte sémantique). Recommandé pour un entretien prioritaire.';
    }

    if (score >= 60) {
      return 'Profil intéressant et pertinent. La majorité des critères correspondent aux attentes (bon match sémantique et compétences). Candidat à considérer sérieusement pour un entretien.';
    }

    if (score >= 45) {
      return 'Profil modérément aligné. Certaines compétences clés peuvent manquer ou l\'expérience peut être insuffisante. Examiner le CV en détail avant de décider.';
    }

    return 'Faible correspondance avec les exigences. Plusieurs compétences essentielles manquent ou l\'expérience ne correspond pas au niveau requis. Candidat peu adapté au poste actuel.';
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const descriptionClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const scoreClasses = getScoreColor(score);
  const icon = getScoreIcon(score);
  const decisionMessage = getDecisionMessage(score);

  return (
    <div className="flex flex-col gap-2">
      {/* Badge avec score et recommandation */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={`
            inline-flex items-center gap-1.5 rounded-full border font-semibold
            ${scoreClasses} ${sizeClasses[size]}
          `}
        >
          <span>{icon}</span>
          <span>{score.toFixed(1)}%</span>
        </span>

        {recommendation && size !== 'sm' && (
          <span className={`text-xs font-bold ${scoreClasses.replace('bg-', 'text-').replace('-100', '-700')}`}>
            {recommendation}
          </span>
        )}
      </div>

      {/* ✅ PHRASE EXPLICATIVE POUR LA DÉCISION */}
      {showDescription && size !== 'sm' && (
        <div className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
          <svg 
            className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" 
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
          <p className={`${descriptionClasses[size]} text-gray-700 leading-relaxed`}>
            <span className="font-semibold text-gray-900">Décision recommandée : </span>
            {decisionMessage}
          </p>
        </div>
      )}
    </div>
  );
}