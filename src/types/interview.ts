import type { HiringStage, InterviewFormat, InterviewStatus } from '@/constants'

export interface Interview {
  id: string
  jobId: string
  candidateId: string
  employerId: string
  scheduledAt: string
  durationMinutes: number
  format: InterviewFormat
  meetingLink?: string
  status: InterviewStatus
  notes?: string
  candidateName?: string
  jobTitle?: string
  createdAt: string
  updatedAt: string
}

export interface CreateInterviewDto {
  applicationId: string
  scheduledAt: string
  durationMinutes: number
  format: InterviewFormat
  meetingLink?: string
  notes?: string
}

export interface UpdateInterviewDto {
  scheduledAt?: string
  durationMinutes?: number
  format?: InterviewFormat
  meetingLink?: string
  status?: InterviewStatus
  notes?: string
}

export interface HiringPipeline {
  id: string
  applicationId: string
  jobId: string
  candidateId: string
  employerId: string
  currentStage: HiringStage
  stageHistory: StageHistoryEntry[]
  candidateName?: string
  jobTitle?: string
  companyName?: string
  interviews?: Interview[]
  createdAt: string
  updatedAt: string
}

export interface StageHistoryEntry {
  stage: HiringStage
  updatedAt: string
  notes?: string
}

export interface UpdateStageDto {
  stage: HiringStage
  note?: string
}
