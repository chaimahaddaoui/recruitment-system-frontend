export enum Role {
  CANDIDATE = 'CANDIDATE',
  RECRUITER = 'RECRUITER',
  HR_MANAGER = 'HR_MANAGER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
  message?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: Role;
}

export interface LoginData {
  email: string;
  password: string;
}



export enum ContractType {
  CDI = 'CDI',
  CDD = 'CDD',
  STAGE = 'STAGE',
  ALTERNANCE = 'ALTERNANCE',
  FREELANCE = 'FREELANCE',
}

export enum JobStatus {
  DRAFT = 'DRAFT',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export interface Job {
  salary: string;
  id: number;
  title: string;
  description: string;
  requirements: string;
  location: string;
  contractType: ContractType;
  salaryMin?: number;
  salaryMax?: number;
  experienceYears: number;
  educationLevel: string;
  skills: string[];
  status: JobStatus;
  createdById: number;
  createdBy?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  _count?: {
    applications: number;
  };
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
}

export interface CreateJobDto {
  title: string;
  description: string;
  requirements: string;
  location: string;
  contractType: ContractType;
  salaryMin?: number;
  salaryMax?: number;
  experienceYears: number;
  educationLevel: string;
  skills: string[];
}
// ... (garder les types existants)

export enum ApplicationStatus {
  SUBMITTED = 'SUBMITTED',
  SHORTLISTED = 'SHORTLISTED',
  INTERVIEW_HR_SCREENING = 'INTERVIEW_HR_SCREENING',
  INTERVIEW_TECHNICAL = 'INTERVIEW_TECHNICAL',
  INTERVIEW_HR_FINAL = 'INTERVIEW_HR_FINAL',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}
export enum InterviewType {
  HR_SCREENING = 'HR_SCREENING',
  TECHNICAL = 'TECHNICAL',
  HR_FINAL = 'HR_FINAL',
}

export enum InterviewStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  
}

/* export interface Application {
  id: number;
  jobId: number;
  candidateId: number;
  cvPath: string | null;
  coverLetter: string | null;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  job?: {
    id: number;
    title: string;
    location: string;
    contractType: string;
    salaryMin?: number;
    salaryMax?: number;
    createdBy?: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  candidate?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
  };
  interviews?: Interview[];
} */
// ... (garder tout le code existant jusqu'à avant Application)

// ✅ TYPES IA - 
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

// ✅ MODIFIER L'INTERFACE APPLICATION (ajouter les champs IA)
export interface Application {
  id: number;
  jobId: number;
  candidateId: number;
  cvPath: string | null;
  coverLetter: string | null;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  
  // ✅ NOUVEAUX CHAMPS IA
  aiMatchScore?: number | null;
  aiAnalysis?: AiAnalysis | null;
  
  job?: {
    id: number;
    title: string;
    location: string;
    contractType: string;
    salaryMin?: number;
    salaryMax?: number;
    skills?: string[]; // ✅ Ajouter aussi
    createdBy?: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  candidate?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
  };
  interviews?: Interview[];
}






export interface Interview {
  interview: any;
  data: any;
  meetingLink: any;
  id: number;
  applicationId: number;
  type: InterviewType;
  status: InterviewStatus;
  scheduledAt: string;
  duration?: number;
  location?: string;
  interviewerId: number;
  interviewer?: {
    firstName: string;
    lastName: string;
    email: string;
    role?: string;
  };
  notes?: string;
  evaluation?: string;
  passed?: boolean;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  application?: {
    candidate?: {
      firstName: string;
      lastName: string;
      email: string;
    };
    job?: {
      title: string;
    };
  };
}