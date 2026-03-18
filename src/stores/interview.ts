import { defineStore } from 'pinia'
import { ref } from 'vue'
import interviewApi from '@/services/interviewApi'
import type { Interview, CreateInterviewDto, UpdateInterviewDto } from '@/types/interview'

export const useInterviewStore = defineStore('interview', () => {
  const interviews = ref<Interview[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchForEmployer() {
    loading.value = true
    error.value = null
    try {
      const { data } = await interviewApi.getEmployerInterviews()
      interviews.value = data
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to load interviews'
    } finally {
      loading.value = false
    }
  }

  async function fetchForCandidate() {
    loading.value = true
    error.value = null
    try {
      const { data } = await interviewApi.getCandidateInterviews()
      interviews.value = data
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to load interviews'
    } finally {
      loading.value = false
    }
  }

  async function schedule(dto: CreateInterviewDto): Promise<Interview> {
    const { data } = await interviewApi.scheduleInterview(dto)
    interviews.value.unshift(data)
    return data
  }

  async function update(id: string, dto: UpdateInterviewDto): Promise<Interview> {
    const { data } = await interviewApi.updateInterview(id, dto)
    const idx = interviews.value.findIndex((i) => i.id === id)
    if (idx !== -1) interviews.value[idx] = data
    return data
  }

  async function cancel(id: string) {
    await interviewApi.cancelInterview(id)
    interviews.value = interviews.value.filter((i) => i.id !== id)
  }

  async function accept(id: string): Promise<Interview> {
    const { data } = await interviewApi.acceptInterview(id)
    const idx = interviews.value.findIndex((i) => i.id === id)
    if (idx !== -1) interviews.value[idx] = data
    return data
  }

  async function decline(id: string): Promise<Interview> {
    const { data } = await interviewApi.declineInterview(id)
    const idx = interviews.value.findIndex((i) => i.id === id)
    if (idx !== -1) interviews.value[idx] = data
    return data
  }

  return { interviews, loading, error, fetchForEmployer, fetchForCandidate, schedule, update, cancel, accept, decline }
})
