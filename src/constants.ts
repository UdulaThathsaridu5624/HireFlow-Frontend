export enum UserRole {
  EMPLOYER = 'EMPLOYER',
  CANDIDATE = 'CANDIDATE',
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
  CANDIDATE_DASHBOARD: '/candidate/dashboard',
} as const
