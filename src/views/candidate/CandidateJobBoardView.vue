<template>
  <AppShell>
    <div class="flex flex-col gap-6">

      <!-- Header -->
      <div>
        <h1 class="text-2xl font-bold text-foreground">Browse Jobs</h1>
        <p class="text-muted-foreground text-sm mt-1">Find your next opportunity.</p>
      </div>

      <!-- Search & Filters -->
      <Card>
        <CardContent class="p-5">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              v-model="filters.title"
              class="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              placeholder="🔍 Search by title..."
              @input="debouncedSearch"
            />
            <input
              v-model="filters.location"
              class="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              placeholder="📍 Location..."
              @input="debouncedSearch"
            />
            <input
              v-model="filters.skill"
              class="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              placeholder="🛠 Skill (e.g. Node.js)..."
              @input="debouncedSearch"
            />
            <Button variant="outline" @click="clearFilters">
              <X class="h-4 w-4 mr-1" /> Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- Results count -->
      <p class="text-sm text-muted-foreground">
        {{ jobStore.loading ? 'Searching...' : `${jobStore.jobs.length} job${jobStore.jobs.length !== 1 ? 's' : ''} found` }}
      </p>

      <!-- Loading -->
      <div v-if="jobStore.loading" class="flex justify-center py-12">
        <Loader2 class="h-8 w-8 animate-spin text-primary" />
      </div>

      <!-- Empty state -->
      <div v-else-if="jobStore.jobs.length === 0" class="text-center py-16">
        <SearchX class="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 class="text-lg font-semibold">No jobs found</h3>
        <p class="text-muted-foreground text-sm mt-1">Try adjusting your search filters.</p>
      </div>

      <!-- Job cards -->
      <div v-else class="flex flex-col gap-4">
        <Card
          v-for="job in jobStore.jobs"
          :key="job.id"
          class="hover:shadow-md transition-shadow cursor-pointer"
          @click="openJobDetail(job)"
        >
          <CardContent class="p-6">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="font-semibold text-foreground text-lg">{{ job.title }}</h3>
                  <Badge v-if="job.isRemote" variant="outline" class="text-xs">Remote</Badge>
                </div>
                <p v-if="job.company?.name" class="text-primary text-sm font-medium mt-0.5">
                  {{ job.company.name }}
                </p>
                <p class="text-muted-foreground text-sm mt-0.5">📍 {{ job.location }}</p>
                <p class="text-muted-foreground text-sm mt-2 line-clamp-2">{{ job.description }}</p>

                <!-- Skills -->
                <div class="flex flex-wrap gap-1.5 mt-3">
                  <Badge v-for="skill in job.requiredSkills.slice(0, 5)" :key="skill" variant="outline" class="text-xs">
                    {{ skill }}
                  </Badge>
                  <Badge v-if="job.requiredSkills.length > 5" variant="outline" class="text-xs">
                    +{{ job.requiredSkills.length - 5 }} more
                  </Badge>
                </div>

                <!-- Salary & Deadline -->
                <div class="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span v-if="job.salaryMin && job.salaryMax">
                    💰 {{ job.salaryCurrency }} {{ job.salaryMin.toLocaleString() }} – {{ job.salaryMax.toLocaleString() }}
                  </span>
                  <span>📅 Apply by {{ formatDate(job.deadline) }}</span>
                </div>
              </div>

              <Button size="sm" @click.stop="openJobDetail(job)">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Job Detail Dialog -->
    <Dialog v-model:open="showDetailDialog">
      <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{{ selectedJob?.title }}</DialogTitle>
          <DialogDescription>
            <span v-if="selectedJob?.company?.name" class="text-primary font-medium">
              {{ selectedJob.company.name }} •
            </span>
            {{ selectedJob?.location }}
            <Badge v-if="selectedJob?.isRemote" variant="outline" class="ml-2 text-xs">Remote</Badge>
          </DialogDescription>
        </DialogHeader>

        <div v-if="selectedJob" class="flex flex-col gap-5 mt-2">
          <!-- Salary -->
          <div v-if="selectedJob.salaryMin && selectedJob.salaryMax" class="flex items-center gap-2">
            <span class="text-sm font-medium">💰 Salary:</span>
            <span class="text-sm text-muted-foreground">
              {{ selectedJob.salaryCurrency }} {{ selectedJob.salaryMin.toLocaleString() }} – {{ selectedJob.salaryMax.toLocaleString() }}
            </span>
          </div>

          <!-- Deadline -->
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium">📅 Deadline:</span>
            <span class="text-sm text-muted-foreground">{{ formatDate(selectedJob.deadline) }}</span>
          </div>

          <!-- Description -->
          <div>
            <h4 class="text-sm font-semibold mb-2">Job Description</h4>
            <p class="text-sm text-muted-foreground whitespace-pre-line">{{ selectedJob.description }}</p>
          </div>

          <!-- Skills -->
          <div>
            <h4 class="text-sm font-semibold mb-2">Required Skills</h4>
            <div class="flex flex-wrap gap-2">
              <Badge v-for="skill in selectedJob.requiredSkills" :key="skill" variant="secondary">
                {{ skill }}
              </Badge>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-2 border-t">
            <Button variant="outline" @click="showDetailDialog = false">Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

  </AppShell>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { X, Loader2, SearchX } from 'lucide-vue-next'
import { useJobStore } from '@/stores/jobs'
import type { Job } from '@/services/jobApi'
import AppShell from '@/components/layout/AppShell.vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'

const jobStore = useJobStore()
const showDetailDialog = ref(false)
const selectedJob = ref<Job | null>(null)

const filters = ref({ title: '', location: '', skill: '' })
let debounceTimer: ReturnType<typeof setTimeout>

onMounted(() => jobStore.fetchOpenJobs())

function debouncedSearch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    const hasFilter = filters.value.title || filters.value.location || filters.value.skill
    if (hasFilter) {
      jobStore.searchJobs({
        title: filters.value.title || undefined,
        location: filters.value.location || undefined,
        skill: filters.value.skill || undefined,
      })
    } else {
      jobStore.fetchOpenJobs()
    }
  }, 400)
}

function clearFilters() {
  filters.value = { title: '', location: '', skill: '' }
  jobStore.fetchOpenJobs()
}

function openJobDetail(job: Job) {
  selectedJob.value = job
  showDetailDialog.value = true
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>