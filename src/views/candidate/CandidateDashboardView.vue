<template>
  <AppShell>
    <div class="flex flex-col gap-8">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Welcome, {{ authStore.name }}!</h1>
        <p class="text-muted-foreground text-sm mt-1">Track your applications and upcoming interviews.</p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 gap-6">
        <Card>
          <CardContent class="p-6">
            <p class="text-sm font-medium text-muted-foreground">Active Applications</p>
            <p class="text-3xl font-bold text-foreground mt-1">{{ activeApplications }}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="p-6">
            <p class="text-sm font-medium text-muted-foreground">Upcoming Interviews</p>
            <p class="text-3xl font-bold text-foreground mt-1">{{ upcomingCount }}</p>
          </CardContent>
        </Card>
      </div>

      <!-- Recent pipelines preview -->
      <Card v-if="pipelineStore.pipelines.length">
        <CardHeader class="pb-3">
          <div class="flex items-center justify-between">
            <CardTitle class="text-base">Recent Applications</CardTitle>
            <Button variant="ghost" size="sm" @click="router.push(ROUTES.CANDIDATE_PIPELINE)">View all</Button>
          </div>
        </CardHeader>
        <CardContent class="space-y-3">
          <div
            v-for="p in pipelineStore.pipelines.slice(0, 3)"
            :key="p.id"
            class="flex items-center justify-between"
          >
            <div>
              <p class="text-sm font-medium text-foreground">{{ p.jobTitle ?? 'Position' }}</p>
              <p class="text-xs text-muted-foreground">{{ p.companyName ?? 'Company' }}</p>
            </div>
            <Badge :variant="p.currentStage === HiringStage.REJECTED ? 'destructive' : 'outline'">
              {{ STAGE_LABELS[p.currentStage] }}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <!-- Upcoming interviews preview -->
      <Card v-if="upcoming.length">
        <CardHeader class="pb-3">
          <div class="flex items-center justify-between">
            <CardTitle class="text-base">Upcoming Interviews</CardTitle>
            <Button variant="ghost" size="sm" @click="router.push(ROUTES.CANDIDATE_INTERVIEWS)">View all</Button>
          </div>
        </CardHeader>
        <CardContent class="space-y-4">
          <InterviewCard
            v-for="interview in upcoming.slice(0, 2)"
            :key="interview.id"
            :interview="interview"
            :show-candidate-actions="true"
            @accept="handleRespond($event, 'ACCEPT')"
            @decline="handleRespond($event, 'DECLINE')"
          />
        </CardContent>
      </Card>
    </div>
  </AppShell>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePipelineStore } from '@/stores/pipeline'
import { useInterviewStore } from '@/stores/interview'
import { ROUTES, HiringStage, STAGE_LABELS, InterviewStatus } from '@/constants'
import { toast } from 'vue-sonner'
import AppShell from '@/components/layout/AppShell.vue'
import InterviewCard from '@/components/interview/InterviewCard.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const router = useRouter()
const authStore = useAuthStore()
const pipelineStore = usePipelineStore()
const interviewStore = useInterviewStore()

onMounted(() => {
  pipelineStore.fetchForCandidate()
  interviewStore.fetchForCandidate()
})

const activeApplications = computed(() =>
  pipelineStore.pipelines.filter(
    (p) => p.currentStage !== HiringStage.HIRED && p.currentStage !== HiringStage.REJECTED,
  ).length,
)

const upcoming = computed(() =>
  interviewStore.interviews.filter(
    (i) => i.status === InterviewStatus.SCHEDULED || i.status === InterviewStatus.ACCEPTED,
  ),
)

const upcomingCount = computed(() => upcoming.value.length)

async function handleRespond(id: string, response: 'ACCEPT' | 'DECLINE') {
  try {
    if (response === 'ACCEPT') {
      await interviewStore.accept(id)
      toast.success('Interview accepted')
    } else {
      await interviewStore.decline(id)
      toast.success('Interview declined')
    }
  } catch {
    toast.error('Failed to respond to interview')
  }
}
</script>
