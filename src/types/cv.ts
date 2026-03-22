export interface SkillRequest {
  name: string
  proficiencyLevel: string
  yearsExperience: number | null
}

export interface EducationRequest {
  institutionName: string
  degree: string
  fieldOfStudy: string
  startDate: string | null
  endDate: string | null
  grade: string
  description: string
}

export interface WorkExperienceRequest {
  companyName: string
  jobTitle: string
  startDate: string | null
  endDate: string | null
  currentlyWorking: boolean
  description: string
}

export interface ResumeRequest {
  fileUrl: string
  fileName: string
  isDefault: boolean
}

export interface CandidateProfilePayload {
  bio: string
  location: string
  linkedinUrl: string
  skills: SkillRequest[]
  education: EducationRequest[]
  workExperience: WorkExperienceRequest[]
  resumes: ResumeRequest[]
}

export interface SkillResponse {
  name: string
  proficiencyLevel: string
  yearsExperience: number | null
}

export interface EducationResponse {
  institutionName: string
  degree: string
  fieldOfStudy: string
  startDate: string | null
  endDate: string | null
  grade: string
  description: string
}

export interface WorkExperienceResponse {
  companyName: string
  jobTitle: string
  startDate: string | null
  endDate: string | null
  currentlyWorking: boolean
  description: string
}

export interface ResumeResponse {
  fileUrl: string
  fileName: string
  isDefault: boolean
  uploadedAt: string
}

export interface CandidateProfileResponse {
  candidateId: string
  userId: string
  bio: string
  location: string
  linkedinUrl: string
  skills: SkillResponse[]
  education: EducationResponse[]
  workExperience: WorkExperienceResponse[]
  resumes: ResumeResponse[]
}

export interface ApplicationResponse {
  applicationId: string
  candidateId: string
  candidateDetails: CandidateProfileResponse | null
  jobId: string
  jobDetails: any
  status: string
  appliedAt: string
  updatedAt: string
  forwardedAt: string | null
}
