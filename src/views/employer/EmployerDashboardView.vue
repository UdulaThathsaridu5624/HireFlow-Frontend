<template>
  <AppShell>
    <div class="flex flex-col gap-8">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Welcome back, {{ authStore.name }}!</h1>
        <p class="text-muted-foreground text-sm mt-1">Here's an overview of your hiring activity.</p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card v-for="stat in stats" :key="stat.label">
          <CardContent class="p-6">
            <p class="text-sm font-medium text-muted-foreground">{{ stat.label }}</p>
            <p class="text-3xl font-bold text-foreground mt-1">{{ stat.value }}</p>
          </CardContent>
        </Card>
      </div>

      <!-- Quick links -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card class="hover:shadow-md transition-shadow cursor-pointer" @click="router.push(ROUTES.EMPLOYER_PIPELINES)">
          <CardHeader>
            <CardTitle class="flex items-center gap-2 text-base">
              <Users class="h-5 w-5 text-primary" /> Hiring Pipelines
            </CardTitle>
            <CardDescription>View and manage all active candidate pipelines.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" size="sm" @click.stop="router.push(ROUTES.EMPLOYER_PIPELINES)">
              Go to Pipelines <ArrowRight class="h-3.5 w-3.5 ml-1" />
            </Button>
          </CardFooter>
        </Card>

        <Card class="hover:shadow-md transition-shadow cursor-pointer" @click="router.push(ROUTES.EMPLOYER_INTERVIEWS)">
          <CardHeader>
            <CardTitle class="flex items-center gap-2 text-base">
              <Calendar class="h-5 w-5 text-primary" /> Interviews
            </CardTitle>
            <CardDescription>Schedule and manage candidate interviews.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" size="sm" @click.stop="router.push(ROUTES.EMPLOYER_INTERVIEWS)">
              Go to Interviews <ArrowRight class="h-3.5 w-3.5 ml-1" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      <!-- Stage breakdown -->
      <Card v-if="!pipelineStore.loading && pipelineStore.pipelines.length">
        <CardHeader>
          <CardTitle class="text-base">Pipeline Stage Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex flex-wrap gap-2">
            <Badge v-for="(count, stage) in stageCounts" :key="stage" variant="outline" class="text-sm px-3 py-1">
              {{ STAGE_LABELS[stage as HiringStage] }}: <span class="font-bold ml-1">{{ count }}</span>
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  </AppShell>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Users, Calendar, ArrowRight } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { usePipelineStore } from '@/stores/pipeline'
import { useInterviewStore } from '@/stores/interview'
import { ROUTES, STAGE_LABELS, HiringStage, InterviewStatus } from '@/constants'
import AppShell from '@/components/layout/AppShell.vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const router = useRouter()
const authStore = useAuthStore()
const pipelineStore = usePipelineStore()
const interviewStore = useInterviewStore()

onMounted(() => {
  pipelineStore.fetchForEmployer()
  interviewStore.fetchForEmployer()
})

const upcomingInterviews = computed(() =>
  interviewStore.interviews.filter(
    (i) => i.status === InterviewStatus.SCHEDULED || i.status === InterviewStatus.ACCEPTED,
  ),
)

const stats = computed(() => [
  { label: 'Total Pipelines', value: pipelineStore.pipelines.length },
  { label: 'Upcoming Interviews', value: upcomingInterviews.value.length },
  {
    label: 'In Interview Stage',
    value: pipelineStore.pipelines.filter((p) => p.currentStage === HiringStage.INTERVIEW).length,
  },
  {
    label: 'Offers Made',
    value: pipelineStore.pipelines.filter((p) => p.currentStage === HiringStage.OFFER || p.currentStage === HiringStage.HIRED).length,
  },
])

const stageCounts = computed(() => {
  const counts: Partial<Record<HiringStage, number>> = {}
  for (const p of pipelineStore.pipelines) {
    counts[p.currentStage] = (counts[p.currentStage] ?? 0) + 1
  }
  return counts
})
</script>
