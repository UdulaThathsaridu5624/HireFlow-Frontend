<template>
  <AppShell>
    <div class="flex flex-col gap-6">
      <div>
        <h1 class="font-headline text-2xl font-extrabold text-foreground">My Applications</h1>
        <p class="text-muted-foreground text-sm mt-1">Track where you stand in each hiring process.</p>
      </div>

      <div v-if="loadingApps" class="flex items-center justify-center py-16 text-muted-foreground/60">
        <Loader2 class="h-6 w-6 animate-spin mr-2" /> Loading...
      </div>
      <div v-else-if="!applications.length" class="py-16 text-center text-muted-foreground/60 text-sm">
        <FileText class="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
        <h3 class="font-headline text-lg font-semibold text-foreground">No applications yet</h3>
        <p class="text-muted-foreground text-sm mt-1">You haven't applied to any jobs yet.</p>
      </div>
      <div v-else class="flex flex-col gap-5">
        <Card v-for="app in applications" :key="app.applicationId" class="editorial-shadow">
          <CardHeader class="pb-3">
            <div class="flex items-center justify-between gap-2">
              <div>
                <CardTitle class="font-headline text-base">{{ app.jobDetails?.title ?? 'Position' }}</CardTitle>
                <p class="text-sm text-muted-foreground mt-0.5">{{ app.jobDetails?.company?.name ?? 'Company' }}</p>
              </div>
              <Badge :variant="statusVariant(app.status)">
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
                 @click="confirmWithdraw(app.applicationId)">
                 Withdraw
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Withdraw Confirmation -->
      <AlertDialog v-model:open="showWithdrawConfirm">
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle class="font-headline">Withdraw application?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to withdraw your application? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction class="bg-destructive text-white hover:bg-destructive/90" @click="handleWithdraw">
              Withdraw
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  </AppShell>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Loader2, FileText } from 'lucide-vue-next'
import { usePipelineStore } from '@/stores/pipeline'
import { STAGE_LABELS } from '@/constants'
import AppShell from '@/components/layout/AppShell.vue'
import HiringStageProgress from '@/components/pipeline/HiringStageProgress.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import cvApi from '@/services/cvApi'
import type { ApplicationResponse } from '@/types/cv'
import { toast } from 'vue-sonner'

const pipelineStore = usePipelineStore()
const applications = ref<ApplicationResponse[]>([])
const loadingApps = ref(false)
const showWithdrawConfirm = ref(false)
const withdrawingId = ref<string | null>(null)

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

function statusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (status === 'WITHDRAWN' || status === 'REJECTED') return 'destructive'
  if (status === 'HIRED') return 'secondary'
  return 'outline'
}

function confirmWithdraw(appId: string) {
  withdrawingId.value = appId
  showWithdrawConfirm.value = true
}

async function handleWithdraw() {
  if (!withdrawingId.value) return
  try {
    await cvApi.withdrawApplication(withdrawingId.value)
    toast.success('Application withdrawn')
    fetchData()
  } catch (error) {
    toast.error('Failed to withdraw application')
  } finally {
    withdrawingId.value = null
  }
}
</script>
