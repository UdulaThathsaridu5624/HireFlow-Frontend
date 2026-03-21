<template>
  <AppShell>
    <div class="flex flex-col gap-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-foreground">Hiring Pipelines</h1>
          <p class="text-muted-foreground text-sm mt-1">
            Track all active candidates across your job postings.
          </p>
        </div>
      </div>

      <Card>
        <CardContent class="p-0">
          <div
            v-if="pipelineStore.loading"
            class="flex items-center justify-center py-16 text-muted-foreground/60"
          >
            <Loader2 class="h-6 w-6 animate-spin mr-2" /> Loading pipelines...
          </div>
          <div v-else-if="pipelineStore.error" class="py-16 text-center text-red-500 text-sm">
            {{ pipelineStore.error }}
          </div>
          <div
            v-else-if="!pipelineStore.pipelines.length"
            class="py-16 text-center text-muted-foreground/60 text-sm"
          >
            No active pipelines yet.
          </div>
          <Table v-else>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead class="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              <template v-for="pipeline in pipelineStore.pipelines" :key="pipeline.id">
                <PipelineRow
                  v-if="pipeline && typeof pipeline === 'object' && pipeline.id"
                  :pipeline="pipeline"
                  @click="navigateTo"
                />
              </template>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  </AppShell>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Loader2 } from 'lucide-vue-next'
import { usePipelineStore } from '@/stores/pipeline'
import AppShell from '@/components/layout/AppShell.vue'
import PipelineRow from '@/components/pipeline/PipelineRow.vue'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const router = useRouter()
const pipelineStore = usePipelineStore()

onMounted(() => pipelineStore.fetchForEmployer())

function navigateTo(id: string) {
  router.push(`/employer/pipelines/${id}`)
}
</script>
