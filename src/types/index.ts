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
  UNDER_REVIEW = 'UNDER_REVIEW',
  INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export interface Application {
  id: number;
  jobId: number;
  candidateId: number;
  cvPath: string | null;
  coverLetter: string | null;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  job?: Job;
  candidate?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
  };
}