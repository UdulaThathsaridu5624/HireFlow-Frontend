<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between gap-1">
      <template v-for="(stage, idx) in visibleStages" :key="stage">
        <div class="flex flex-col items-center gap-1 flex-1">
          <div
            :class="cn(
              'h-2.5 w-2.5 rounded-full border-2 transition-all',
              getStageState(stage) === 'completed' ? 'bg-primary border-primary' :
              getStageState(stage) === 'current' ? 'bg-background border-primary ring-2 ring-primary/20' :
              'bg-background border-border'
            )"
          />
          <span
            :class="cn(
              'text-xs font-medium text-center leading-tight',
              getStageState(stage) === 'completed' ? 'text-primary' :
              getStageState(stage) === 'current' ? 'text-primary font-semibold' :
              'text-muted-foreground'
            )"
          >{{ STAGE_LABELS[stage] }}</span>
        </div>
        <div
          v-if="idx < visibleStages.length - 1"
          :class="cn(
            'h-0.5 flex-1 mb-4 transition-all',
            isStageCompleted(stage) ? 'bg-primary' : 'bg-border'
          )"
        />
      </template>
    </div>
    <div v-if="currentStage === HiringStage.REJECTED" class="mt-2">
      <Badge variant="destructive">Rejected</Badge>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { HiringStage, HIRING_STAGE_ORDER, STAGE_LABELS } from '@/constants'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const props = defineProps<{ currentStage: HiringStage }>()

const visibleStages = HIRING_STAGE_ORDER

function getStageIndex(stage: HiringStage) {
  return HIRING_STAGE_ORDER.indexOf(stage)
}

const currentIndex = computed(() =>
  props.currentStage === HiringStage.REJECTED ? -1 : getStageIndex(props.currentStage),
)

function getStageState(stage: HiringStage): 'completed' | 'current' | 'upcoming' {
  const idx = getStageIndex(stage)
  if (props.currentStage === HiringStage.REJECTED) return 'upcoming'
  if (idx < currentIndex.value) return 'completed'
  if (idx === currentIndex.value) return 'current'
  return 'upcoming'
}

function isStageCompleted(stage: HiringStage): boolean {
  return getStageState(stage) === 'completed'
}
</script>
