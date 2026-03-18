<template>
  <Card>
    <CardContent class="pt-5 space-y-3">
      <div class="flex items-start justify-between gap-2">
        <div>
          <p class="font-semibold text-foreground">{{ interview.jobTitle ?? 'Job Interview' }}</p>
          <p v-if="interview.candidateName" class="text-sm text-muted-foreground">{{ interview.candidateName }}</p>
        </div>
        <div class="flex gap-2 shrink-0">
          <Badge :variant="formatVariant">{{ formatLabel }}</Badge>
          <Badge :variant="statusVariant">{{ STATUS_LABELS[interview.status] }}</Badge>
        </div>
      </div>

      <div class="flex items-center gap-4 text-sm text-muted-foreground">
        <span class="flex items-center gap-1">
          <Calendar class="h-3.5 w-3.5" />
          {{ formattedDate }}
        </span>
        <span class="flex items-center gap-1">
          <Clock class="h-3.5 w-3.5" />
          {{ interview.durationMinutes }} min
        </span>
      </div>

      <a
        v-if="interview.meetingLink && interview.format === InterviewFormat.ONLINE"
        :href="interview.meetingLink"
        target="_blank"
        rel="noopener noreferrer"
        class="text-xs text-primary hover:underline flex items-center gap-1"
      >
        <Link2 class="h-3 w-3" /> Join meeting
      </a>

      <p v-if="interview.notes" class="text-xs text-muted-foreground border-t pt-2">{{ interview.notes }}</p>

      <!-- Candidate actions -->
      <div
        v-if="showCandidateActions && interview.status === InterviewStatus.SCHEDULED"
        class="flex gap-2 pt-1"
      >
        <Button size="sm" @click="$emit('accept', interview.id)">Accept</Button>
        <Button size="sm" variant="outline" @click="$emit('decline', interview.id)">Decline</Button>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Calendar, Clock, Link2 } from 'lucide-vue-next'
import { InterviewFormat, InterviewStatus, STATUS_LABELS } from '@/constants'
import type { Interview } from '@/types/interview'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  interview: Interview
  showCandidateActions?: boolean
}>()

defineEmits<{ accept: [id: string]; decline: [id: string] }>()

const formattedDate = computed(() => {
  const d = new Date(props.interview.scheduledAt)
  return d.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
})

const formatLabel = computed(() =>
  props.interview.format === InterviewFormat.ONLINE ? 'Online' : 'In Person',
)

const formatVariant = computed(() =>
  props.interview.format === InterviewFormat.ONLINE ? 'secondary' : 'outline',
)

const statusVariant = computed(() => {
  switch (props.interview.status) {
    case InterviewStatus.ACCEPTED: return 'default'
    case InterviewStatus.DECLINED: return 'destructive'
    case InterviewStatus.COMPLETED: return 'secondary'
    case InterviewStatus.CANCELLED: return 'destructive'
    default: return 'outline'
  }
})
</script>
