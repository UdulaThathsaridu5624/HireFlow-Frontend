import axios from 'axios'
import type { Interview, CreateInterviewDto, UpdateInterviewDto } from '@/types/interview'

const interviewApi = axios.create({
  baseURL: import.meta.env.VITE_INTERVIEW_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

interviewApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default {
  scheduleInterview(data: CreateInterviewDto) {
    return interviewApi.post<Interview>('/api/interviews', data)
  },

  getEmployerInterviews() {
    return interviewApi.get<Interview[]>('/api/interviews/employer')
  },

  getCandidateInterviews() {
    return interviewApi.get<Interview[]>('/api/interviews/candidate')
  },

  updateInterview(id: string, data: UpdateInterviewDto) {
    return interviewApi.patch<Interview>(`/api/interviews/${id}`, data)
  },

  cancelInterview(id: string) {
    return interviewApi.delete<void>(`/api/interviews/${id}`)
  },

  acceptInterview(id: string) {
    return interviewApi.patch<Interview>(`/api/interviews/${id}/accept`)
  },

  declineInterview(id: string) {
    return interviewApi.patch<Interview>(`/api/interviews/${id}/decline`)
  },
}
