<template>
  <AppShell>
    <div class="flex flex-col gap-10">

      <!-- Welcome Banner -->
      <section class="relative overflow-hidden bg-primary-container rounded-xl p-8 md:p-10 text-white">
        <div class="relative z-10 max-w-xl">
          <h1 class="font-headline text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            Welcome back, {{ authStore.name?.split(' ')[0] || 'there' }}!
          </h1>
          <p class="text-white/70 text-sm md:text-base leading-relaxed">
            Here's an overview of your hiring activity. Manage jobs, review candidates, and schedule interviews.
          </p>
          <div class="mt-6 flex flex-wrap gap-3">
            <button
              class="bg-tertiary-fixed text-on-tertiary-fixed px-5 py-2.5 rounded-lg font-semibold text-sm hover:brightness-110 active:scale-95 transition-all duration-200"
              @click="router.push(ROUTES.EMPLOYER_JOBS)"
            >
              Post New Job
            </button>
            <button
              class="bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-white/20 active:scale-95 transition-all duration-200"
              @click="router.push(ROUTES.EMPLOYER_PIPELINES)"
            >
              View Pipelines
            </button>
          </div>
        </div>
        <div class="absolute right-[-10%] top-[-30%] w-80 h-80 bg-primary rounded-full blur-[80px] opacity-40"></div>
      </section>

      <!-- Stats Cards -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="bg-card p-5 rounded-xl editorial-shadow border-l-4"
          :class="stat.borderClass"
        >
          <div class="flex justify-between items-start mb-3">
            <component :is="stat.icon" class="h-7 w-7" :class="stat.iconClass" />
            <span class="text-3xl font-black text-foreground">{{ stat.value }}</span>
          </div>
          <h3 class="font-headline text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {{ stat.label }}
          </h3>
          <p class="text-[11px] text-muted-foreground mt-0.5">{{ stat.subtitle }}</p>
        </div>
      </section>

      <!-- Two-column layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

        <!-- Left: Quick Actions (2/3) -->
        <div class="lg:col-span-2 space-y-6">
          <h2 class="font-headline text-xl font-extrabold text-foreground">Quick Actions</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              class="bg-card p-6 rounded-xl editorial-shadow flex items-start gap-4 hover:-translate-y-0.5 transition-transform duration-300 cursor-pointer group"
              @click="router.push(ROUTES.EMPLOYER_PIPELINES)"
            >
              <div class="w-12 h-12 bg-muted rounded-lg shrink-0 flex items-center justify-center">
                <Users class="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 class="font-headline text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                  Hiring Pipelines
                </h4>
                <p class="text-xs text-muted-foreground mt-1">View and manage all active candidate pipelines.</p>
              </div>
            </div>

            <div
              class="bg-card p-6 rounded-xl editorial-shadow flex items-start gap-4 hover:-translate-y-0.5 transition-transform duration-300 cursor-pointer group"
              @click="router.push(ROUTES.EMPLOYER_INTERVIEWS)"
            >
              <div class="w-12 h-12 bg-muted rounded-lg shrink-0 flex items-center justify-center">
                <CalendarCheck class="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 class="font-headline text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                  Interviews
                </h4>
                <p class="text-xs text-muted-foreground mt-1">Schedule and manage candidate interviews.</p>
              </div>
            </div>

            <div
              class="bg-card p-6 rounded-xl editorial-shadow flex items-start gap-4 hover:-translate-y-0.5 transition-transform duration-300 cursor-pointer group"
              @click="router.push(ROUTES.EMPLOYER_JOBS)"
            >
              <div class="w-12 h-12 bg-muted rounded-lg shrink-0 flex items-center justify-center">
                <Briefcase class="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 class="font-headline text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                  Job Listings
                </h4>
                <p class="text-xs text-muted-foreground mt-1">Post new jobs and manage existing listings.</p>
              </div>
            </div>

            <div
              class="bg-card p-6 rounded-xl editorial-shadow flex items-start gap-4 hover:-translate-y-0.5 transition-transform duration-300 cursor-pointer group"
              @click="router.push(ROUTES.EMPLOYER_COMPANY)"
            >
              <div class="w-12 h-12 bg-muted rounded-lg shrink-0 flex items-center justify-center">
                <Building2 class="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 class="font-headline text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                  Company Profile
                </h4>
                <p class="text-xs text-muted-foreground mt-1">Manage your company's presence on HireFlow.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Pipeline Breakdown (1/3) -->
        <div class="space-y-6">
          <div class="bg-card p-6 rounded-xl editorial-shadow">
            <h3 class="font-headline text-base font-extrabold text-foreground mb-4">Pipeline Breakdown</h3>

            <div v-if="pipelineStore.loading" class="flex justify-center py-8">
              <Loader2 class="h-6 w-6 animate-spin text-primary" />
            </div>

            <div v-else-if="!pipelineStore.pipelines.length" class="text-center py-8">
              <Users class="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
              <p class="text-xs text-muted-foreground">No active pipelines yet</p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="(count, stage) in stageCounts"
                :key="stage"
                class="flex items-center justify-between p-3 bg-surface-low rounded-lg"
              >
                <span class="text-sm font-medium text-foreground">
                  {{ STAGE_LABELS[stage as HiringStage] }}
                </span>
                <span class="text-sm font-black text-primary">{{ count }}</span>
              </div>
            </div>
          </div>

          <!-- Upcoming Interviews Preview -->
          <div class="bg-card p-6 rounded-xl editorial-shadow">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-headline text-base font-extrabold text-foreground">Upcoming Interviews</h3>
              <button
                class="text-primary text-xs font-semibold hover:underline"
                @click="router.push(ROUTES.EMPLOYER_INTERVIEWS)"
              >
                View all
              </button>
            </div>

            <div v-if="!upcomingInterviews.length" class="text-center py-6">
              <CalendarCheck class="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
              <p class="text-xs text-muted-foreground">No upcoming interviews</p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="interview in upcomingInterviews.slice(0, 3)"
                :key="interview.id"
                class="p-3 bg-surface-low rounded-lg"
              >
                <p class="text-sm font-medium text-foreground">{{ interview.candidateName || 'Candidate' }}</p>
                <div class="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <Calendar class="h-3 w-3" />
                  <span>{{ formatDate(interview.scheduledAt) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </AppShell>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  Users,
  CalendarCheck,
  Briefcase,
  Building2,
  Loader2,
  Calendar,
  ClipboardList,
  UserCheck,
  BriefcaseBusiness,
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { usePipelineStore } from '@/stores/pipeline'
import { useInterviewStore } from '@/stores/interview'
import { useJobStore } from '@/stores/jobs'
import { ROUTES, STAGE_LABELS, HiringStage, InterviewStatus } from '@/constants'
import AppShell from '@/components/layout/AppShell.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const pipelineStore = usePipelineStore()
const interviewStore = useInterviewStore()
const jobStore = useJobStore()

function fetchData() {
  pipelineStore.fetchForEmployer()
  interviewStore.fetchForEmployer()
  jobStore.fetchMyJobs()
}

onMounted(() => fetchData())

watch(
  () => route.fullPath,
  () => {
    if (route.name === 'employer-dashboard') fetchData()
  },
)

const upcomingInterviews = computed(
  () =>
    interviewStore.interviews?.filter(
      (i) => i.status === InterviewStatus.SCHEDULED || i.status === InterviewStatus.ACCEPTED,
    ) ?? [],
)

const stats = computed(() => {
  const activeJobs = jobStore.myJobs.filter(j => j.status === 'open').length
  const totalApps = pipelineStore.pipelines.length
  const inInterview = pipelineStore.pipelines.filter(p => p.currentStage === HiringStage.INTERVIEW).length
  const offers = pipelineStore.pipelines.filter(p => p.currentStage === HiringStage.OFFER || p.currentStage === HiringStage.HIRED).length

  return [
    {
      label: 'Active Jobs',
      value: activeJobs,
      subtitle: `${jobStore.myJobs.length} total posted`,
      icon: BriefcaseBusiness,
      iconClass: 'text-primary',
      borderClass: 'border-primary',
    },
    {
      label: 'Applications',
      value: totalApps,
      subtitle: 'Across all jobs',
      icon: ClipboardList,
      iconClass: 'text-muted-foreground',
      borderClass: 'border-secondary',
    },
    {
      label: 'In Interview',
      value: inInterview,
      subtitle: `${upcomingInterviews.value.length} scheduled`,
      icon: UserCheck,
      iconClass: 'text-tertiary-fixed-dim',
      borderClass: 'border-tertiary-fixed-dim',
    },
    {
      label: 'Offers Made',
      value: offers,
      subtitle: offers > 0 ? 'Awaiting response' : 'No offers yet',
      icon: CalendarCheck,
      iconClass: 'text-tertiary-container',
      borderClass: 'border-tertiary-container',
    },
  ]
})

const stageCounts = computed(() => {
  const counts: Partial<Record<HiringStage, number>> = {}
  if (!pipelineStore.pipelines) return counts
  for (const p of pipelineStore.pipelines) {
    counts[p.currentStage] = (counts[p.currentStage] ?? 0) + 1
  }
  return counts
})

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>
