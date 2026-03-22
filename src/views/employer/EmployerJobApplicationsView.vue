<template>
  <AppShell>
    <div class="flex flex-col gap-6">

      <!-- Header -->
      <div class="flex items-center gap-3">
        <Button variant="ghost" size="sm" @click="router.back()">
          <ArrowLeft class="h-4 w-4 mr-1" /> Back
        </Button>
        <div>
          <h1 class="font-headline text-2xl font-extrabold text-foreground">Applications</h1>
          <p class="text-muted-foreground text-sm mt-0.5">
            Reviewing applicants for <span class="font-medium text-foreground">{{ jobTitle }}</span>
          </p>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-16">
        <Loader2 class="h-8 w-8 animate-spin text-primary" />
      </div>

      <!-- Empty state -->
      <div v-else-if="applications.length === 0" class="text-center py-16">
        <Users class="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
        <h3 class="font-headline text-lg font-semibold">No applications yet</h3>
        <p class="text-muted-foreground text-sm mt-1">Candidates who apply will appear here.</p>
      </div>

      <!-- Applications list -->
      <div v-else class="flex flex-col gap-4">
        <div
          v-for="app in applications"
          :key="app.applicationId"
          class="bg-card p-5 md:p-6 rounded-xl editorial-shadow"
        >
          <div class="flex items-start justify-between gap-4">

            <!-- Candidate info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="font-headline text-base font-semibold text-foreground">
                  {{ app.candidateDetails?.fullName || app.candidateDetails?.bio || 'Candidate' }}
                </h3>
                <Badge :variant="statusVariant(app.status)">
                  {{ formatStatus(app.status) }}
                </Badge>
              </div>

              <p v-if="app.candidateDetails?.location" class="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                <MapPin class="h-3.5 w-3.5 shrink-0" />
                {{ app.candidateDetails.location }}
              </p>

              <p v-if="app.candidateDetails?.linkedinUrl" class="text-sm text-primary mt-0.5">
                <a :href="app.candidateDetails.linkedinUrl" target="_blank" rel="noopener" @click.stop>
                  LinkedIn Profile
                </a>
              </p>

              <!-- Skills -->
              <div v-if="app.candidateDetails?.skills?.length" class="flex flex-wrap gap-1.5 mt-3">
                <Badge
                  v-for="skill in app.candidateDetails.skills"
                  :key="skill.name"
                  variant="secondary"
                  class="text-xs"
                >
                  {{ skill.name }}
                  <span v-if="skill.proficiencyLevel" class="ml-1 opacity-60">&middot; {{ skill.proficiencyLevel }}</span>
                </Badge>
              </div>

              <!-- Latest resume -->
              <div v-if="defaultResume(app)" class="mt-3">
                <a
                  :href="defaultResume(app)!.fileUrl"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                  @click.stop
                >
                  <FileText class="h-3.5 w-3.5" />
                  {{ defaultResume(app)!.fileName }}
                </a>
              </div>

              <p class="text-xs text-muted-foreground mt-3">
                Applied {{ formatDate(app.appliedAt) }}
              </p>
            </div>

            <!-- Action -->
            <div class="shrink-0 flex flex-col items-end gap-2">
              <Button
                v-if="app.status === 'APPLIED'"
                :disabled="forwardingId === app.applicationId"
                class="gradient-cta"
                size="sm"
                @click="forward(app.applicationId)"
              >
                <Loader2 v-if="forwardingId === app.applicationId" class="h-3.5 w-3.5 animate-spin mr-1" />
                <SendHorizonal v-else class="h-3.5 w-3.5 mr-1" />
                {{ forwardingId === app.applicationId ? 'Forwarding...' : 'Forward to Interview' }}
              </Button>
              <span
                v-else-if="app.status === 'FORWARDED_TO_INTERVIEW'"
                class="text-xs text-tertiary-fixed-dim font-medium flex items-center gap-1"
              >
                <CheckCircle2 class="h-3.5 w-3.5" /> Forwarded
                <span v-if="app.forwardedAt" class="text-muted-foreground font-normal">
                  &middot; {{ formatDate(app.forwardedAt) }}
                </span>
              </span>
            </div>

          </div>
        </div>
      </div>

    </div>
  </AppShell>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Loader2, Users, FileText, SendHorizonal, CheckCircle2, MapPin } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import cvApi from '@/services/cvApi'
import { useJobStore } from '@/stores/jobs'
import type { ApplicationResponse } from '@/types/cv'
import AppShell from '@/components/layout/AppShell.vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const router = useRouter()
const route = useRoute()
const jobStore = useJobStore()

const jobId = route.params.jobId as string
const applications = ref<ApplicationResponse[]>([])
const loading = ref(false)
const forwardingId = ref<string | null>(null)

const jobTitle = computed(() => jobStore.myJobs.find(j => j.id === jobId)?.title ?? 'this job')

onMounted(async () => {
  loading.value = true
  try {
    if (!jobStore.myJobs.length) await jobStore.fetchMyJobs()
    const { data } = await cvApi.getJobApplications(jobId)
    applications.value = data
  } catch {
    toast.error('Failed to load applications')
  } finally {
    loading.value = false
  }
})

async function forward(applicationId: string) {
  forwardingId.value = applicationId
  try {
    const { data } = await cvApi.forwardToInterview(applicationId)
    const idx = applications.value.findIndex(a => a.applicationId === applicationId)
    if (idx !== -1) applications.value[idx] = data
    toast.success('Application forwarded to interview service')
  } catch (err: any) {
    toast.error(err?.response?.data?.message ?? 'Failed to forward application')
  } finally {
    forwardingId.value = null
  }
}

function defaultResume(app: ApplicationResponse) {
  const resumes = app.candidateDetails?.resumes
  if (!resumes?.length) return null
  return resumes.find(r => r.isDefault) ?? resumes[0]
}

function formatDate(iso: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { dateStyle: 'medium' })
}

function formatStatus(status: string) {
  return status.replace(/_/g, ' ')
}

function statusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (status === 'FORWARDED_TO_INTERVIEW') return 'secondary'
  if (status === 'WITHDRAWN' || status === 'REJECTED') return 'destructive'
  return 'outline'
}
</script>
