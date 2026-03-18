<template>
  <p v-if="!interviews.length" class="text-sm text-muted-foreground/60 py-6 text-center">
    No interviews in this category.
  </p>
  <Table v-else>
    <TableHeader>
      <TableRow>
        <TableHead>Candidate</TableHead>
        <TableHead>Job</TableHead>
        <TableHead>Date & Time</TableHead>
        <TableHead>Format</TableHead>
        <TableHead>Status</TableHead>
        <TableHead class="w-10" />
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="interview in interviews" :key="interview.id">
        <TableCell class="font-medium">{{ interview.candidateName ?? '—' }}</TableCell>
        <TableCell>{{ interview.jobTitle ?? '—' }}</TableCell>
        <TableCell class="text-sm text-muted-foreground">
          {{ formatDate(interview.scheduledAt) }}
        </TableCell>
        <TableCell>
          <Badge variant="outline" class="text-xs">
            {{ interview.format === 'ONLINE' ? 'Online' : 'In Person' }}
          </Badge>
        </TableCell>
        <TableCell>
          <Badge :variant="statusVariantMap[interview.status]">
            {{ STATUS_LABELS[interview.status] }}
          </Badge>
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" size="icon" class="h-7 w-7">
                <MoreHorizontal class="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                v-if="interview.status === InterviewStatus.SCHEDULED"
                class="text-destructive cursor-pointer"
                @click="$emit('cancel', interview.id)"
              >
                Cancel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>

<script setup lang="ts">
import { MoreHorizontal } from 'lucide-vue-next'
import { InterviewStatus, STATUS_LABELS } from '@/constants'
import type { Interview } from '@/types/interview'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

defineProps<{ interviews: Interview[] }>()
defineEmits<{ cancel: [id: string] }>()

const statusVariantMap: Record<InterviewStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  [InterviewStatus.SCHEDULED]: 'outline',
  [InterviewStatus.ACCEPTED]: 'default',
  [InterviewStatus.DECLINED]: 'destructive',
  [InterviewStatus.COMPLETED]: 'secondary',
  [InterviewStatus.CANCELLED]: 'destructive',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
}
</script>
