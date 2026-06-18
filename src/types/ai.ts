/**
 * Types pour l'analyse IA des candidatures
 */

export interface ExtractedData {
  email: string | null;
  phone: string | null;
  skills: string[];
  experience_years: number;
  education_level: string;
}

export interface SkillsAnalysis {
  exact_match: string[];
  similar_match: Record<string, string>;
  missing_skills: string[];
  total_matched: number;
  total_required: number;
}

export interface Breakdown {
  tfidf_similarity: number;
  tfidf_score: number;
  spacy_similarity: number;
  spacy_score: number;
  skills_match_percentage: number;
  skills_score: number;
  experience_ratio: number;
  experience_score: number;
}

export interface MatchingResult {
  final_score: number;
  recommendation: string;
  breakdown: Breakdown;
  skills_analysis: SkillsAnalysis;
  details: {
    cv_experience: number;
    required_experience: number;
    cv_skills_count: number;
    job_skills_count: number;
  };
  pandas_analysis?: Array<{
    Critère: string;
    'Score Brut (%)': number;
    'Pondération (%)': number;
    'Score Pondéré': number;
  }>;
}

export interface AiAnalysis {
  extracted_data: ExtractedData | null;
  matching_result: MatchingResult | null;
  analyzed_at: string;
  cv_file: string;
  error?: string;
  status?: string;
}

export type RecommendationType = 
  | 'FORTEMENT RECOMMANDÉ' 
  | 'RECOMMANDÉ' 
  | 'À EXAMINER' 
  | 'NON RECOMMANDÉ'
  | 'NON ÉVALUÉ';