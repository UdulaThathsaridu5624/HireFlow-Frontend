import { ref } from 'vue'
import { defineStore } from 'pinia'
import { jobsApi, type Job, type CreateJobPayload, type SearchJobsParams } from '@/services/jobApi'
import { toast } from 'vue-sonner'

export const useJobStore = defineStore('jobs', () => {
  const jobs = ref<Job[]>([])
  const myJobs = ref<Job[]>([])
  const currentJob = ref<Job | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ─── Employer ──────────────────────────────────────────────────────────────

  async function fetchMyJobs() {
    loading.value = true
    error.value = null
    try {
      const { data } = await jobsApi.getMyJobs()
      myJobs.value = data
    } catch (e: any) {
      error.value = e?.response?.data?.message ?? 'Failed to fetch jobs'
    } finally {
      loading.value = false
    }
  }

  async function createJob(payload: CreateJobPayload) {
    loading.value = true
    error.value = null
    try {
      const { data } = await jobsApi.createJob(payload)
      myJobs.value.unshift(data)
      toast.success('Job posted successfully!')
      return data
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? 'Failed to create job'
      error.value = msg
      toast.error(msg)
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateJob(id: string, payload: Partial<CreateJobPayload>) {
    loading.value = true
    try {
      const { data } = await jobsApi.updateJob(id, payload)
      const idx = myJobs.value.findIndex((j) => j.id === id)
      if (idx !== -1) myJobs.value[idx] = data
      toast.success('Job updated successfully!')
      return data
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Failed to update job')
      throw e
    } finally {
      loading.value = false
    }
  }

  async function closeJob(id: string) {
    try {
      const { data } = await jobsApi.closeJob(id)
      const idx = myJobs.value.findIndex((j) => j.id === id)
      if (idx !== -1) myJobs.value[idx] = data
      toast.success('Job closed successfully!')
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Failed to close job')
      throw e
    }
  }

  // ─── Candidate / Public ────────────────────────────────────────────────────

  async function fetchOpenJobs() {
    loading.value = true
    error.value = null
    try {
      const { data } = await jobsApi.getAllOpenJobs()
      jobs.value = data
    } catch (e: any) {
      error.value = e?.response?.data?.message ?? 'Failed to fetch jobs'
    } finally {
      loading.value = false
    }
  }

  async function searchJobs(params: SearchJobsParams) {
    loading.value = true
    error.value = null
    try {
      const { data } = await jobsApi.searchJobs(params)
      jobs.value = data
    } catch (e: any) {
      error.value = e?.response?.data?.message ?? 'Failed to search jobs'
    } finally {
      loading.value = false
    }
  }

  async function fetchJobById(id: string) {
    loading.value = true
    try {
      const { data } = await jobsApi.getJobById(id)
      currentJob.value = data
      return data
    } catch (e: any) {
      error.value = e?.response?.data?.message ?? 'Failed to fetch job'
    } finally {
      loading.value = false
    }
  }

  return {
    jobs,
    myJobs,
    currentJob,
    loading,
    error,
    fetchMyJobs,
    createJob,
    updateJob,
    closeJob,
    fetchOpenJobs,
    searchJobs,
    fetchJobById,
  }
})
