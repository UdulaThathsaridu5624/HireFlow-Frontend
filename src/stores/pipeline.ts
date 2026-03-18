import { defineStore } from 'pinia'
import { ref } from 'vue'
import pipelineApi from '@/services/pipelineApi'
import type { HiringPipeline, UpdateStageDto } from '@/types/interview'

export const usePipelineStore = defineStore('pipeline', () => {
  const pipelines = ref<HiringPipeline[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchForEmployer() {
    loading.value = true
    error.value = null
    try {
      const { data } = await pipelineApi.getEmployerPipelines()
      pipelines.value = data
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to load pipelines'
    } finally {
      loading.value = false
    }
  }

  async function fetchForCandidate() {
    loading.value = true
    error.value = null
    try {
      const { data } = await pipelineApi.getCandidatePipelines()
      pipelines.value = data
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to load pipelines'
    } finally {
      loading.value = false
    }
  }

  async function advanceStage(id: string, dto: UpdateStageDto): Promise<HiringPipeline> {
    const { data } = await pipelineApi.advanceStage(id, dto)
    const idx = pipelines.value.findIndex((p) => p.id === id)
    if (idx !== -1) pipelines.value[idx] = data
    return data
  }

  return { pipelines, loading, error, fetchForEmployer, fetchForCandidate, advanceStage }
})
