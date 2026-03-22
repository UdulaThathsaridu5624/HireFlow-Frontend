<template>
  <AppShell>
    <div class="flex flex-col gap-6">
      <div>
        <h1 class="text-2xl font-bold text-foreground">My Applications</h1>
        <p class="text-muted-foreground text-sm mt-1">Track where you stand in each hiring process.</p>
      </div>

      <div v-if="loadingApps" class="flex items-center justify-center py-16 text-muted-foreground/60">
        <Loader2 class="h-6 w-6 animate-spin mr-2" /> Loading...
      </div>
      <div v-else-if="!applications.length" class="py-16 text-center text-muted-foreground/60 text-sm">
        You haven't applied to any jobs yet.
      </div>
      <div v-else class="flex flex-col gap-5">
        <Card v-for="app in applications" :key="app.applicationId">
          <CardHeader class="pb-3">
            <div class="flex items-center justify-between gap-2">
              <div>
                <CardTitle class="text-base">{{ app.jobDetails?.title ?? 'Position' }}</CardTitle>
                <p class="text-sm text-muted-foreground mt-0.5">{{ app.jobDetails?.company?.name ?? 'Company' }}</p>
              </div>
              <Badge :variant="app.status === 'WITHDRAWN' ? 'destructive' : 'outline'">
                {{ app.status }}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div v-if="getPipelineForApp(app.applicationId)">
                <HiringStageProgress :current-stage="getPipelineForApp(app.applicationId)!.currentStage" />
                <p class="text-xs text-muted-foreground mt-2">Hiring Stage: {{ STAGE_LABELS[getPipelineForApp(app.applicationId)!.currentStage] }}</p>
            </div>
            
            <div class="flex justify-between items-center mt-4">
              <p class="text-xs text-muted-foreground/60">
                Applied {{ formatDate(app.appliedAt) }}
              </p>
              <Button v-if="!['WITHDRAWN', 'REJECTED', 'HIRED'].includes(app.status)" 
                 variant="destructive" size="sm" 
                 @click="withdraw(app.applicationId)">
                 Withdraw
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </AppShell>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import { usePipelineStore } from '@/stores/pipeline'
import { HiringStage, STAGE_LABELS } from '@/constants'
import AppShell from '@/components/layout/AppShell.vue'
import HiringStageProgress from '@/components/pipeline/HiringStageProgress.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import cvApi from '@/services/cvApi'
import type { ApplicationResponse } from '@/types/cv'
import { toast } from 'vue-sonner'

const pipelineStore = usePipelineStore()
const applications = ref<ApplicationResponse[]>([])
const loadingApps = ref(false)

async function fetchData() {
  loadingApps.value = true
  await Promise.all([
    pipelineStore.fetchForCandidate(),
    cvApi.getMyApplications().then(res => applications.value = res.data).catch(e => console.error(e))
  ])
  loadingApps.value = false
}

onMounted(() => {
  fetchData()
})

const getPipelineForApp = (appId: string) => {
  return pipelineStore.pipelines.find(p => p.applicationId === appId)
}

function formatDate(iso: string) {
  if(!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { dateStyle: 'medium' })
}

async function withdraw(appId: string) {
  if(!confirm('Are you sure you want to withdraw your application?')) return
  try {
    await cvApi.withdrawApplication(appId)
    toast.success('Application withdrawn')
    fetchData()
  } catch (error) {
    toast.error('Failed to withdraw application')
  }
}
</script>