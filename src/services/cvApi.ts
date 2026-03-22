import axios from 'axios'
import type { CandidateProfilePayload, CandidateProfileResponse, ResumeResponse } from '@/types/cv'

const cvApi = axios.create({
  baseURL: import.meta.env.VITE_CV_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

cvApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default {
  getMyProfile() {
    return cvApi.get<CandidateProfileResponse>('/api/cv/profile')
  },

  uploadResume(file: File, isDefault = false) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('isDefault', String(isDefault))

    return cvApi.post<ResumeResponse>('/api/cv/resumes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  upsertProfile(payload: CandidateProfilePayload) {
    return cvApi.put<CandidateProfileResponse>('/api/cv/profile', payload)
  },
}
