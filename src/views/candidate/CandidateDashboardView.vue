<template>
  <AppShell>
    <div class="flex flex-col gap-10">
      <!-- Welcome Banner -->
      <section
        class="relative overflow-hidden bg-primary-container rounded-xl p-8 md:p-10 text-white"
      >
        <div class="relative z-10 max-w-xl">
          <h1 class="font-headline text-3xl lg:text-4xl font-extrabold tracking-tight mb-3">
            Hello, {{ authStore.name?.split(' ')[0] || 'there' }}!
          </h1>
          <p class="text-white/70 text-sm md:text-base leading-relaxed">
            Ready for your next career move? Track your applications, prepare for interviews, and
            land the role you deserve.
          </p>
          <div class="mt-6 flex flex-wrap gap-3">
            <button
              class="bg-tertiary-fixed text-on-tertiary-fixed px-5 py-2.5 rounded-lg font-semibold text-sm hover:brightness-110 active:scale-95 transition-all duration-200"
              @click="router.push(ROUTES.CANDIDATE_CV_PROFILE)"
            >
              Complete CV
            </button>
            <button
              class="bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-white/20 active:scale-95 transition-all duration-200"
              @click="router.push(ROUTES.CANDIDATE_JOBS)"
            >
              Browse Jobs
            </button>
          </div>
        </div>
        <!-- Decorative blurs -->
        <div
          class="absolute right-[-10%] top-[-30%] w-80 h-80 bg-primary rounded-full blur-[80px] opacity-40"
        ></div>
        <div
          class="absolute left-[-5%] bottom-[-20%] w-48 h-48 bg-white/5 rounded-full blur-[60px]"
        ></div>
      </section>

      <!-- Status Tracker Cards -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div
          v-for="stat in statusCards"
          :key="stat.label"
          class="bg-card p-5 rounded-xl editorial-shadow border-l-4"
          :class="stat.borderClass"
        >
          <div class="flex justify-between items-start mb-3">
            <component :is="stat.icon" class="h-7 w-7" :class="stat.iconClass" />
            <span class="text-3xl font-black text-foreground">{{ stat.value }}</span>
          </div>
          <h3
            class="font-headline text-xs font-bold uppercase tracking-widest text-muted-foreground"
          >
            {{ stat.label }}
          </h3>
          <p class="text-[11px] text-muted-foreground mt-0.5">{{ stat.subtitle }}</p>
        </div>
      </section>

      <!-- Two-column layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <!-- Left: Recent Applications (2/3) -->
        <div class="lg:col-span-2 flex flex-col gap-6">
          <div class="flex items-center justify-between">
            <h2 class="font-headline text-xl font-extrabold text-foreground">
              Recent Applications
            </h2>
            <button
              class="text-primary-container dark:text-primary text-sm font-semibold hover:underline"
              @click="router.push(ROUTES.CANDIDATE_PIPELINE)"
            >
              View all
            </button>
          </div>

          <div v-if="pipelineStore.loading" class="flex justify-center py-12">
            <Loader2 class="h-8 w-8 animate-spin text-primary" />
          </div>

          <div v-else-if="!pipelineStore.pipelines.length" class="text-center py-12">
            <FileText class="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p class="text-sm text-muted-foreground">No applications yet. Start browsing jobs!</p>
          </div>

          <div v-else class="flex flex-col gap-3">
            <div
              v-for="p in pipelineStore.pipelines.slice(0, 4)"
              :key="p.id"
              class="bg-card p-5 rounded-xl editorial-shadow flex gap-4 hover:-translate-y-0.5 transition-transform duration-300 group cursor-pointer"
              @click="router.push(ROUTES.CANDIDATE_PIPELINE)"
            >
              <div
                class="w-12 h-12 bg-muted rounded-lg flex-shrink-0 flex items-center justify-center"
              >
                <Briefcase class="h-6 w-6 text-primary" />
              </div>
              <div class="flex-1 min-w-0">
                <h4
                  class="font-headline text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate"
                >
                  {{ p.jobTitle ?? 'Position' }}
                </h4>
                <p class="text-muted-foreground text-xs mt-0.5">{{ p.companyName ?? 'Company' }}</p>
              </div>
              <div class="flex items-center">
                <Badge
                  :variant="p.currentStage === HiringStage.REJECTED ? 'destructive' : 'secondary'"
                  class="text-xs"
                >
                  {{ STAGE_LABELS[p.currentStage] }}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Sidebar (1/3) -->
        <div class="flex flex-col gap-6">
          <!-- Next Interview -->
          <div class="bg-card p-6 rounded-xl editorial-shadow">
            <h3 class="font-headline text-base font-extrabold text-foreground mb-4">
              Next Interview
            </h3>

            <div v-if="!nextInterview" class="text-center py-6">
              <Calendar class="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
              <p class="text-xs text-muted-foreground">No upcoming interviews</p>
            </div>

            <div
              v-else
              class="bg-surface-low rounded-xl p-4 border-l-4 border-tertiary-fixed-dim flex flex-col gap-3"
            >
              <div class="flex items-center gap-3 text-sm text-muted-foreground">
                <Calendar class="h-4 w-4 text-primary shrink-0" />
                <span>{{ formatInterviewDate(nextInterview.scheduledAt) }}</span>
              </div>
              <div class="flex items-center gap-3 text-sm text-muted-foreground">
                <Clock class="h-4 w-4 text-primary shrink-0" />
                <span
                  >{{ formatInterviewTime(nextInterview.scheduledAt) }} ({{
                    nextInterview.durationMinutes ?? 45
                  }}
                  min)</span
                >
              </div>
              <div class="flex items-center gap-3 text-sm text-muted-foreground">
                <Video class="h-4 w-4 text-primary shrink-0" />
                <span>{{
                  nextInterview.format === 'ONLINE' ? 'Online Meeting' : 'In Person'
                }}</span>
              </div>
              <a
                v-if="nextInterview.meetingLink"
                :href="nextInterview.meetingLink"
                target="_blank"
                rel="noopener"
                class="block w-full mt-3 bg-tertiary-container text-white font-semibold py-2.5 rounded-lg text-sm text-center hover:brightness-110 active:scale-95 transition-all"
              >
                Join Meeting
              </a>
            </div>
          </div>

          <!-- Profile Strength -->
          <div class="bg-card p-6 rounded-xl editorial-shadow flex flex-col gap-4">
            <div class="flex justify-between items-center">
              <h3 class="font-headline text-base font-extrabold text-foreground">
                Profile Strength
              </h3>
              <span class="text-primary font-black text-sm">{{ profileStrength }}%</span>
            </div>
            <div class="w-full h-2 bg-surface-high rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-500"
                style="
                  background: linear-gradient(
                    90deg,
                    var(--primary) 0%,
                    var(--primary-container) 100%
                  );
                "
                :style="{ width: profileStrength + '%' }"
              ></div>
            </div>
            <ul class="flex flex-col gap-3">
              <li
                v-for="item in profileChecklist"
                :key="item.label"
                class="flex items-start gap-3"
                :class="{ 'opacity-50': !item.done }"
              >
                <CheckCircle
                  v-if="item.done"
                  class="h-4 w-4 text-tertiary-fixed-dim shrink-0 mt-0.5"
                />
                <Circle v-else class="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p class="text-sm font-medium text-foreground">{{ item.label }}</p>
                  <p class="text-[11px] text-muted-foreground">{{ item.hint }}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </AppShell>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Send,
  Eye,
  MessageSquare,
  CheckCircle,
  Circle,
  Calendar,
  Clock,
  Video,
  Loader2,
  FileText,
  Briefcase,
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { usePipelineStore } from '@/stores/pipeline'
import { useInterviewStore } from '@/stores/interview'
import { useCvStore } from '@/stores/cv'
import { ROUTES, HiringStage, STAGE_LABELS, InterviewStatus } from '@/constants'
import AppShell from '@/components/layout/AppShell.vue'
import { Badge } from '@/components/ui/badge'

const router = useRouter()
const authStore = useAuthStore()
const pipelineStore = usePipelineStore()
const interviewStore = useInterviewStore()
const cvStore = useCvStore()

onMounted(() => {
  pipelineStore.fetchForCandidate()
  interviewStore.fetchForCandidate()
  cvStore.fetchMyProfile()
})

// Status tracker counts
const appliedCount = computed(
  () => pipelineStore.pipelines.filter((p) => p.currentStage === HiringStage.APPLIED).length,
)
const screeningCount = computed(
  () => pipelineStore.pipelines.filter((p) => p.currentStage === HiringStage.SCREENING).length,
)
const interviewingCount = computed(
  () => pipelineStore.pipelines.filter((p) => p.currentStage === HiringStage.INTERVIEW).length,
)
const offerCount = computed(
  () =>
    pipelineStore.pipelines.filter(
      (p) => p.currentStage === HiringStage.OFFER || p.currentStage === HiringStage.HIRED,
    ).length,
)

const statusCards = computed(() => [
  {
    label: 'Applied',
    value: appliedCount.value,
    subtitle: `${pipelineStore.pipelines.length} total applications`,
    icon: Send,
    iconClass: 'text-primary',
    borderClass: 'border-primary',
  },
  {
    label: 'Screening',
    value: screeningCount.value,
    subtitle: 'Under review by HR',
    icon: Eye,
    iconClass: 'text-muted-foreground',
    borderClass: 'border-secondary',
  },
  {
    label: 'Interviewing',
    value: interviewingCount.value,
    subtitle: nextInterview.value ? 'Next one coming up' : 'None scheduled',
    icon: MessageSquare,
    iconClass: 'text-tertiary-fixed-dim',
    borderClass: 'border-tertiary-fixed-dim',
  },
  {
    label: 'Offer',
    value: offerCount.value,
    subtitle: offerCount.value > 0 ? 'Response required' : 'No offers yet',
    icon: CheckCircle,
    iconClass: 'text-tertiary-container',
    borderClass: 'border-tertiary-container',
  },
])

// Next interview
const nextInterview = computed(() => {
  const upcoming = interviewStore.interviews.filter(
    (i) => i.status === InterviewStatus.SCHEDULED || i.status === InterviewStatus.ACCEPTED,
  )
  if (!upcoming.length) return null
  return upcoming.sort(
    (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
  )[0]
})

// Profile strength
const profileChecklist = computed(() => {
  const profile = cvStore.profile
  return [
    {
      label: 'Basic Info',
      hint: profile?.bio ? 'Bio added' : 'Add a bio and location',
      done: Boolean(profile?.bio),
    },
    {
      label: 'Skills',
      hint: profile?.skills?.length ? `${profile.skills.length} skills added` : 'Add your skills',
      done: Boolean(profile?.skills?.length),
    },
    {
      label: 'Education',
      hint: profile?.education?.length ? 'Education documented' : 'Add your education',
      done: Boolean(profile?.education?.length),
    },
    {
      label: 'Work Experience',
      hint: profile?.workExperience?.length
        ? `${profile.workExperience.length} roles documented`
        : 'Add work history',
      done: Boolean(profile?.workExperience?.length),
    },
    {
      label: 'Resume',
      hint: profile?.resumes?.length ? 'Resume uploaded' : 'Upload your resume',
      done: Boolean(profile?.resumes?.length),
    },
  ]
})

const profileStrength = computed(() => {
  const done = profileChecklist.value.filter((i) => i.done).length
  return Math.round((done / profileChecklist.value.length) * 100)
})

function formatInterviewDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })
}

function formatInterviewTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}
</script>
