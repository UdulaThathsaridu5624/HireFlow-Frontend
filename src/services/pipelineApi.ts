import axios from 'axios'
import type { HiringPipeline, UpdateStageDto } from '@/types/interview'

const pipelineApi = axios.create({
  baseURL: import.meta.env.VITE_INTERVIEW_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

pipelineApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default {
  getEmployerPipelines() {
    return pipelineApi.get<HiringPipeline[]>('/api/pipelines/employer')
  },

  getCandidatePipelines() {
    return pipelineApi.get<HiringPipeline[]>('/api/pipelines/candidate')
  },

  advanceStage(id: string, data: UpdateStageDto) {
    return pipelineApi.patch<HiringPipeline>(`/api/pipelines/${id}/stage`, data)
  },
}
