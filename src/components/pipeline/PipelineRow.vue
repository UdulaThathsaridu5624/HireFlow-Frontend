<template>
  <TableRow class="cursor-pointer hover:bg-muted/50" @click="$emit('click', pipeline.id)">
    <TableCell>
      <div class="flex items-center gap-2">
        <Avatar class="h-8 w-8">
          <AvatarFallback class="text-xs bg-primary/10 text-primary">{{ initials }}</AvatarFallback>
        </Avatar>
        <span class="font-medium text-foreground">{{ pipeline.candidateName ?? 'Candidate' }}</span>
      </div>
    </TableCell>
    <TableCell class="text-muted-foreground">{{ pipeline.jobTitle ?? '—' }}</TableCell>
    <TableCell>
      <Badge :variant="stageVariant" class="capitalize">{{ STAGE_LABELS[pipeline.currentStage] }}</Badge>
    </TableCell>
    <TableCell class="text-muted-foreground text-sm">{{ relativeTime }}</TableCell>
    <TableCell @click.stop>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="icon" class="h-7 w-7">
            <MoreHorizontal class="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem @click="$emit('click', pipeline.id)">View Details</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TableCell>
  </TableRow>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { MoreHorizontal } from 'lucide-vue-next'
import { HiringStage, STAGE_LABELS } from '@/constants'
import type { HiringPipeline } from '@/types/interview'
import { TableRow, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const props = defineProps<{ pipeline: HiringPipeline }>()
defineEmits<{ click: [id: string] }>()

const initials = computed(() => {
  const name = props.pipeline.candidateName ?? ''
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?'
})

const relativeTime = computed(() => {
  const d = new Date(props.pipeline.updatedAt)
  const diff = Date.now() - d.getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return `${days}d ago`
})

const stageVariant = computed(() => {
  switch (props.pipeline.currentStage) {
    case HiringStage.HIRED: return 'default'
    case HiringStage.REJECTED: return 'destructive'
    case HiringStage.OFFER: return 'secondary'
    default: return 'outline'
  }
})
</script>
