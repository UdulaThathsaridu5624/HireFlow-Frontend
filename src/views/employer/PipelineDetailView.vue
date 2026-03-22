<template>
  <AppShell>
    <div
      v-if="pipelineStore.loading"
      class="flex items-center justify-center py-20 text-muted-foreground/60"
    >
      <Loader2 class="h-6 w-6 animate-spin mr-2" /> Loading...
    </div>
    <div v-else-if="!pipeline" class="py-20 text-center text-muted-foreground/60">
      Pipeline not found.
    </div>
    <div v-else class="flex flex-col gap-6">
      <!-- Header -->
      <div class="flex items-center gap-3">
        <Button variant="ghost" size="icon" @click="router.back()">
          <ArrowLeft class="h-4 w-4" />
        </Button>
        <div>
          <h1 class="text-xl font-bold text-foreground">
            {{ pipeline.candidateName ?? 'Candidate' }}
          </h1>
          <p class="text-sm text-muted-foreground">{{ pipeline.jobTitle ?? 'Position' }}</p>
        </div>
        <Badge
          :variant="pipeline.currentStage === HiringStage.REJECTED ? 'destructive' : 'outline'"
          class="ml-auto"
        >
          {{ STAGE_LABELS[pipeline.currentStage] }}
        </Badge>
      </div>

      <!-- Hiring Stage Progress -->
      <Card>
        <CardHeader>
          <CardTitle class="text-sm font-semibold text-muted-foreground uppercase tracking-wide"
            >Hiring Progress</CardTitle
          >
        </CardHeader>
        <CardContent>
          <HiringStageProgress :current-stage="pipeline.currentStage" />
        </CardContent>
      </Card>

      <!-- Advance Stage -->
      <Card
        v-if="
          pipeline.currentStage !== HiringStage.HIRED &&
          pipeline.currentStage !== HiringStage.REJECTED
        "
      >
        <CardHeader>
          <CardTitle class="text-sm font-semibold text-muted-foreground uppercase tracking-wide"
            >Move to Stage</CardTitle
          >
        </CardHeader>
        <CardContent class="flex flex-wrap gap-2">
          <Button
            v-for="stage in availableStages"
            :key="stage"
            variant="outline"
            size="sm"
            :disabled="advancing"
            @click="handleAdvance(stage)"
          >
            {{ STAGE_LABELS[stage] }}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            :disabled="advancing"
            @click="handleAdvance(HiringStage.REJECTED)"
          >
            Reject
          </Button>
        </CardContent>
      </Card>

      <!-- Interviews -->
      <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <h2 class="font-semibold text-foreground/80">Interviews</h2>
          <ScheduleInterviewDialog
            :application-id="pipeline.applicationId"
            @scheduled="reloadInterviews"
          />
        </div>

        <!-- Upcoming -->
        <div v-if="!upcomingInterviews.length" class="text-sm text-muted-foreground/60 mb-4">
          No upcoming interviews.
        </div>
        <div class="flex flex-col gap-4">
          <InterviewCard
            v-for="interview in upcomingInterviews"
            :key="interview.id"
            :interview="interview"
          />
        </div>

        <!-- History -->
        <div v-if="historyInterviews.length">
          <button
            class="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mt-2 mb-4"
            @click="showHistory = !showHistory"
          >
            <ChevronDown
              class="h-3.5 w-3.5 transition-transform"
              :class="showHistory ? 'rotate-180' : ''"
            />
            {{ showHistory ? 'Hide history' : `Show history (${historyInterviews.length})` }}
          </button>
          <div v-if="showHistory" class="flex flex-col gap-4">
            <InterviewCard
              v-for="interview in historyInterviews"
              :key="interview.id"
              :interview="interview"
            />
          </div>
        </div>
      </div>

      <!-- Stage History -->
      <Card>
        <CardHeader>
          <CardTitle class="text-sm font-semibold text-muted-foreground uppercase tracking-wide"
            >Stage History</CardTitle
          >
        </CardHeader>
        <CardContent class="flex flex-col gap-3">
          <div
            v-for="(entry, idx) in pipeline.stageHistory"
            :key="idx"
            class="flex items-center gap-3 text-sm"
          >
            <span class="text-muted-foreground/60 text-xs w-32 shrink-0">{{
              formatDate(entry.updatedAt)
            }}</span>
            <Badge variant="outline" class="text-xs">{{ STAGE_LABELS[entry.stage] }}</Badge>
            <span v-if="entry.notes" class="text-muted-foreground">{{ entry.notes }}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  </AppShell>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Loader2, ArrowLeft, ChevronDown } from 'lucide-vue-next'
import { usePipelineStore } from '@/stores/pipeline'
import { useInterviewStore } from '@/stores/interview'
import { HiringStage, InterviewStatus, STAGE_LABELS, HIRING_STAGE_ORDER } from '@/constants'
import { toast } from 'vue-sonner'
import AppShell from '@/components/layout/AppShell.vue'
import HiringStageProgress from '@/components/pipeline/HiringStageProgress.vue'
import InterviewCard from '@/components/interview/InterviewCard.vue'
import ScheduleInterviewDialog from '@/components/interview/ScheduleInterviewDialog.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const route = useRoute()
const router = useRouter()
const pipelineStore = usePipelineStore()
const interviewStore = useInterviewStore()
const advancing = ref(false)
const showHistory = ref(false)

const id = route.params.id as string

onMounted(async () => {
  await pipelineStore.fetchForEmployer()
  await interviewStore.fetchForEmployer()
})

const pipeline = computed(() => pipelineStore.pipelines.find((p) => p.id === id))

const pipelineInterviews = computed(() =>
  interviewStore.interviews.filter(
    (i) =>
      pipeline.value &&
      i.candidateId === pipeline.value.candidateId &&
      i.jobId === pipeline.value.jobId,
  ),
)

const upcomingInterviews = computed(() =>
  pipelineInterviews.value.filter(
    (i) => i.status === InterviewStatus.SCHEDULED || i.status === InterviewStatus.ACCEPTED,
  ),
)

const historyInterviews = computed(() =>
  pipelineInterviews.value.filter(
    (i) =>
      i.status === InterviewStatus.COMPLETED ||
      i.status === InterviewStatus.CANCELLED ||
      i.status === InterviewStatus.DECLINED,
  ),
)

const availableStages = computed(() => {
  if (!pipeline.value) return []
  const currentIdx = HIRING_STAGE_ORDER.indexOf(pipeline.value.currentStage)
  return HIRING_STAGE_ORDER.slice(currentIdx + 1)
})

async function handleAdvance(stage: HiringStage) {
  if (!pipeline.value) return
  advancing.value = true
  try {
    await pipelineStore.advanceStage(pipeline.value.id, { stage })
    toast.success(`Stage updated to ${STAGE_LABELS[stage]}`)
  } catch {
    toast.error('Failed to update stage')
  } finally {
    advancing.value = false
  }
}

async function reloadInterviews() {
  await interviewStore.fetchForEmployer()
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { dateStyle: 'medium' })
}
</script>
