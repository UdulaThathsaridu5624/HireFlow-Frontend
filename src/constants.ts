export enum UserRole {
  EMPLOYER = 'EMPLOYER',
  CANDIDATE = 'CANDIDATE',
}

export enum HiringStage {
  APPLIED = 'APPLIED',
  SCREENING = 'SCREENING',
  INTERVIEW = 'INTERVIEW',
  OFFER = 'OFFER',
  HIRED = 'HIRED',
  REJECTED = 'REJECTED',
}

export enum InterviewFormat {
  ONLINE = 'ONLINE',
  IN_PERSON = 'IN_PERSON',
}

export enum InterviewStatus {
  SCHEDULED = 'SCHEDULED',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export const AUTH_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  LOGOUT: '/api/auth/logout',
  REFRESH: '/api/auth/refresh',
  VALIDATE: '/api/auth/validate',
} as const

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  EMPLOYER_DASHBOARD: '/employer/dashboard',
  EMPLOYER_JOBS: '/employer/jobs', // ← ADD THIS
  EMPLOYER_PIPELINES: '/employer/pipelines',
  EMPLOYER_PIPELINE_DETAIL: '/employer/pipelines/:id',
  EMPLOYER_INTERVIEWS: '/employer/interviews',
  EMPLOYER_COMPANY: '/employer/company',
  CANDIDATE_DASHBOARD: '/candidate/dashboard',
  CANDIDATE_JOBS: '/candidate/jobs', // ← ADD THIS
  CANDIDATE_INTERVIEWS: '/candidate/interviews',
  CANDIDATE_PIPELINE: '/candidate/pipeline',
  CANDIDATE_COMPANIES: '/candidate/companies',
  CANDIDATE_COMPANY_DETAIL: '/candidate/companies/:id',
} as const

export const HIRING_STAGE_ORDER: HiringStage[] = [
  HiringStage.APPLIED,
  HiringStage.SCREENING,
  HiringStage.INTERVIEW,
  HiringStage.OFFER,
  HiringStage.HIRED,
]

export const STAGE_LABELS: Record<HiringStage, string> = {
  [HiringStage.APPLIED]: 'Applied',
  [HiringStage.SCREENING]: 'Screening',
  [HiringStage.INTERVIEW]: 'Interview',
  [HiringStage.OFFER]: 'Offer',
  [HiringStage.HIRED]: 'Hired',
  [HiringStage.REJECTED]: 'Rejected',
}

export const STATUS_LABELS: Record<InterviewStatus, string> = {
  [InterviewStatus.SCHEDULED]: 'Scheduled',
  [InterviewStatus.ACCEPTED]: 'Accepted',
  [InterviewStatus.DECLINED]: 'Declined',
  [InterviewStatus.COMPLETED]: 'Completed',
  [InterviewStatus.CANCELLED]: 'Cancelled',
}
