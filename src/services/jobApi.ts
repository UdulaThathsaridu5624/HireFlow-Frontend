import axios from 'axios'

const jobApi = axios.create({
  baseURL: import.meta.env.VITE_JOB_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

jobApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Job {
  id: string
  employerId: string
  companyId: string | null
  title: string
  description: string
  requiredSkills: string[]
  salaryMin: number | null
  salaryMax: number | null
  salaryCurrency: string | null
  location: string
  isRemote: boolean
  deadline: string
  status: 'open' | 'closed'
  createdAt: string
  updatedAt: string
  companyName?: string | null
  companyLogo?: string | null
  company?: { id: string; name: string; logo?: string } | null
}

export interface CreateJobPayload {
  title: string
  description: string
  requiredSkills: string[]
  salaryMin?: number
  salaryMax?: number
  salaryCurrency?: string
  location: string
  isRemote: boolean
  deadline: string
}

export interface SearchJobsParams {
  title?: string
  location?: string
  skill?: string
  salaryMin?: number
  salaryMax?: number
}

// ─── API calls ────────────────────────────────────────────────────────────────

export const jobsApi = {
  // Employer
  createJob(payload: CreateJobPayload) {
    return jobApi.post<Job>('/jobs', payload)
  },
  getMyJobs() {
    return jobApi.get<Job[]>('/jobs/my-jobs')
  },
  updateJob(id: string, payload: Partial<CreateJobPayload>) {
    return jobApi.patch<Job>(`/jobs/${id}`, payload)
  },
  closeJob(id: string) {
    return jobApi.patch<Job>(`/jobs/${id}/close`)
  },

  // Candidate / Public
  getAllOpenJobs() {
    return jobApi.get<Job[]>('/jobs')
  },
  searchJobs(params: SearchJobsParams) {
    return jobApi.get<Job[]>('/jobs/search', { params })
  },
  getJobById(id: string) {
    return jobApi.get<Job>(`/jobs/${id}`)
  },
}

export default jobApi
