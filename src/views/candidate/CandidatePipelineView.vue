<template>
  <AppShell>
    <div class="flex flex-col gap-6">
      <div>
        <h1 class="text-2xl font-bold text-foreground">My Applications</h1>
        <p class="text-muted-foreground text-sm mt-1">Track where you stand in each hiring process.</p>
      </div>

      <div v-if="pipelineStore.loading" class="flex items-center justify-center py-16 text-muted-foreground/60">
        <Loader2 class="h-6 w-6 animate-spin mr-2" /> Loading...
      </div>
      <div v-else-if="!pipelineStore.pipelines.length" class="py-16 text-center text-muted-foreground/60 text-sm">
        You haven't applied to any jobs yet.
      </div>
      <div v-else class="flex flex-col gap-5">
        <Card v-for="pipeline in pipelineStore.pipelines" :key="pipeline.id">
          <CardHeader class="pb-3">
            <div class="flex items-center justify-between gap-2">
              <div>
                <CardTitle class="text-base">{{ pipeline.jobTitle ?? 'Position' }}</CardTitle>
                <p class="text-sm text-muted-foreground mt-0.5">{{ pipeline.companyName ?? 'Company' }}</p>
              </div>
              <Badge :variant="pipeline.currentStage === HiringStage.REJECTED ? 'destructive' : 'outline'">
                {{ STAGE_LABELS[pipeline.currentStage] }}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <HiringStageProgress :current-stage="pipeline.currentStage" />
            <p class="text-xs text-muted-foreground/60 mt-3">
              Applied {{ formatDate(pipeline.createdAt) }}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  </AppShell>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import { usePipelineStore } from '@/stores/pipeline'
import { HiringStage, STAGE_LABELS } from '@/constants'
import AppShell from '@/components/layout/AppShell.vue'
import HiringStageProgress from '@/components/pipeline/HiringStageProgress.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const pipelineStore = usePipelineStore()

onMounted(() => pipelineStore.fetchForCandidate())

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { dateStyle: 'medium' })
}
</script>
