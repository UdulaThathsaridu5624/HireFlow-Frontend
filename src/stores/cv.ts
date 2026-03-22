import { defineStore } from 'pinia'
import { ref } from 'vue'
import cvApi from '@/services/cvApi'
import type { CandidateProfilePayload, CandidateProfileResponse, ResumeResponse } from '@/types/cv'

export const useCvStore = defineStore('cv', () => {
  const profile = ref<CandidateProfileResponse | null>(null)
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)

  function normalizeProfile(data: CandidateProfileResponse): CandidateProfileResponse {
    return {
      candidateId: data.candidateId,
      userId: data.userId,
      fullName: data.fullName ?? '',
      bio: data.bio ?? '',
      location: data.location ?? '',
      linkedinUrl: data.linkedinUrl ?? '',
      skills: (data.skills ?? []).map((skill) => ({
        name: skill.name ?? '',
        proficiencyLevel: skill.proficiencyLevel ?? '',
        yearsExperience: skill.yearsExperience ?? null,
      })),
      education: (data.education ?? []).map((entry) => ({
        institutionName: entry.institutionName ?? '',
        degree: entry.degree ?? '',
        fieldOfStudy: entry.fieldOfStudy ?? '',
        startDate: entry.startDate ?? null,
        endDate: entry.endDate ?? null,
        grade: entry.grade ?? '',
        description: entry.description ?? '',
      })),
      workExperience: (data.workExperience ?? []).map((entry) => ({
        companyName: entry.companyName ?? '',
        jobTitle: entry.jobTitle ?? '',
        startDate: entry.startDate ?? null,
        endDate: entry.endDate ?? null,
        currentlyWorking: Boolean(entry.currentlyWorking),
        description: entry.description ?? '',
      })),
      resumes: (data.resumes ?? []).map((entry) => ({
        fileUrl: entry.fileUrl ?? '',
        fileName: entry.fileName ?? '',
        isDefault: Boolean(entry.isDefault),
        uploadedAt: entry.uploadedAt,
      })),
    }
  }

  async function fetchMyProfile() {
    loading.value = true
    error.value = null
    try {
      const { data } = await cvApi.getMyProfile()
      const normalized = normalizeProfile(data)
      profile.value = normalized
      return normalized
    } catch (e: any) {
      if (e?.response?.status === 404) {
        profile.value = null
        return null
      }
      error.value = e?.message || 'Failed to load candidate profile'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function upsertProfile(payload: CandidateProfilePayload) {
    saving.value = true
    error.value = null
    try {
      const { data } = await cvApi.upsertProfile(payload)
      const normalized = normalizeProfile(data)
      profile.value = normalized
      return normalized
    } catch (e: any) {
      error.value = e?.message || 'Failed to save candidate profile'
      throw e
    } finally {
      saving.value = false
    }
  }

  async function uploadResume(file: File, isDefault = false): Promise<ResumeResponse> {
    const { data } = await cvApi.uploadResume(file, isDefault)
    return data
  }

  return {
    profile,
    loading,
    saving,
    error,
    fetchMyProfile,
    upsertProfile,
    uploadResume,
  }
})
