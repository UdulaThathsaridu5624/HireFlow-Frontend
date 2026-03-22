<template>
  <AppShell>
    <div class="flex flex-col gap-6">

      <!-- Header -->
      <div>
        <h1 class="font-headline text-2xl font-extrabold text-foreground">Discover Jobs</h1>
        <p class="text-muted-foreground text-sm mt-1">Find your next opportunity.</p>
      </div>

      <!-- Search & Filters -->
      <div class="bg-card rounded-xl editorial-shadow p-5">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              v-model="filters.title"
              class="pl-10"
              placeholder="Search by title..."
              @input="debouncedSearch"
            />
          </div>
          <div class="relative">
            <MapPin class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              v-model="filters.location"
              class="pl-10"
              placeholder="Location..."
              @input="debouncedSearch"
            />
          </div>
          <div class="relative">
            <Wrench class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              v-model="filters.skill"
              class="pl-10"
              placeholder="Skill (e.g. Node.js)..."
              @input="debouncedSearch"
            />
          </div>
          <Button variant="outline" @click="clearFilters">
            <X class="h-4 w-4 mr-1" /> Clear
          </Button>
        </div>
      </div>

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
        <SearchX class="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
        <h3 class="font-headline text-lg font-semibold">No jobs found</h3>
        <p class="text-muted-foreground text-sm mt-1">Try adjusting your search filters.</p>
      </div>

      <!-- Job cards -->
      <div v-else class="flex flex-col gap-4">
        <div
          v-for="job in jobStore.jobs"
          :key="job.id"
          class="bg-card p-5 md:p-6 rounded-xl editorial-shadow flex gap-4 md:gap-6 hover:-translate-y-0.5 transition-transform duration-300 group cursor-pointer"
          @click="openJobDetail(job)"
        >
          <!-- Icon box -->
          <div class="w-12 h-12 bg-muted rounded-lg shrink-0 hidden sm:flex items-center justify-center">
            <Briefcase class="h-6 w-6 text-primary" />
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="font-headline text-base md:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                {{ job.title }}
              </h3>
              <Badge v-if="job.isRemote" variant="secondary" class="text-[10px] uppercase tracking-tight">Remote</Badge>
            </div>
            <p v-if="job.company?.name || job.companyName" class="text-primary text-sm font-medium mt-0.5">
              {{ job.company?.name || job.companyName }}
            </p>
            <div class="flex items-center gap-1.5 text-muted-foreground text-sm mt-0.5">
              <MapPin class="h-3.5 w-3.5 shrink-0" />
              <span>{{ job.location }}</span>
            </div>

            <!-- Skills -->
            <div class="flex flex-wrap gap-1.5 mt-3">
              <span
                v-for="skill in job.requiredSkills"
                :key="skill"
                class="text-[11px] font-medium px-2 py-1 bg-surface-low rounded text-muted-foreground"
              >
                {{ skill }}
              </span>
            </div>

            <!-- Salary & Deadline -->
            <div class="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
              <span v-if="job.salaryMin && job.salaryMax" class="flex items-center gap-1.5">
                <DollarSign class="h-3.5 w-3.5" />
                {{ job.salaryCurrency }} {{ job.salaryMin.toLocaleString() }} – {{ job.salaryMax.toLocaleString() }}
              </span>
              <span class="flex items-center gap-1.5">
                <CalendarDays class="h-3.5 w-3.5" />
                Apply by {{ formatDate(job.deadline) }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col gap-2 shrink-0 items-end justify-center">
            <span v-if="job.salaryMin && job.salaryMax" class="text-base font-bold text-foreground hidden lg:block">
              {{ job.salaryCurrency }} {{ job.salaryMax.toLocaleString() }}
            </span>
            <Button
              size="sm"
              :class="appliedJobIds.has(job.id) ? 'opacity-60' : 'gradient-cta'"
              :variant="appliedJobIds.has(job.id) ? 'secondary' : 'default'"
              :disabled="appliedJobIds.has(job.id) || applyingJobId === job.id"
              @click.stop="applyForJob(job.id)"
            >
              <Loader2 v-if="applyingJobId === job.id" class="h-3 w-3 animate-spin mr-1" />
              <CheckCircle v-else-if="appliedJobIds.has(job.id)" class="h-3 w-3 mr-1" />
              {{ appliedJobIds.has(job.id) ? 'Applied' : applyingJobId === job.id ? 'Applying...' : 'Apply Now' }}
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Job Detail Dialog -->
    <Dialog v-model:open="showDetailDialog">
      <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle class="font-headline">{{ selectedJob?.title }}</DialogTitle>
          <DialogDescription>
            <span v-if="selectedJob?.company?.name" class="text-primary font-medium">
              {{ selectedJob.company.name }} &bull;
            </span>
            {{ selectedJob?.location }}
            <Badge v-if="selectedJob?.isRemote" variant="secondary" class="ml-2 text-xs">Remote</Badge>
          </DialogDescription>
        </DialogHeader>

        <div v-if="selectedJob" class="flex flex-col gap-5 mt-2">
          <!-- Salary -->
          <div v-if="selectedJob.salaryMin && selectedJob.salaryMax" class="flex items-center gap-2">
            <DollarSign class="h-4 w-4 text-muted-foreground" />
            <span class="text-sm font-medium">Salary:</span>
            <span class="text-sm text-muted-foreground">
              {{ selectedJob.salaryCurrency }} {{ selectedJob.salaryMin.toLocaleString() }} – {{ selectedJob.salaryMax.toLocaleString() }}
            </span>
          </div>

          <!-- Deadline -->
          <div class="flex items-center gap-2">
            <CalendarDays class="h-4 w-4 text-muted-foreground" />
            <span class="text-sm font-medium">Deadline:</span>
            <span class="text-sm text-muted-foreground">{{ formatDate(selectedJob.deadline) }}</span>
          </div>

          <!-- Description -->
          <div class="flex flex-col gap-2">
            <h4 class="font-headline text-sm font-semibold">Job Description</h4>
            <p class="text-sm text-muted-foreground whitespace-pre-line">{{ selectedJob.description }}</p>
          </div>

          <!-- Skills -->
          <div class="flex flex-col gap-2">
            <h4 class="font-headline text-sm font-semibold">Required Skills</h4>
            <div class="flex flex-wrap gap-2">
              <Badge v-for="skill in selectedJob.requiredSkills" :key="skill" variant="secondary">
                {{ skill }}
              </Badge>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-2 border-t border-border">
            <Button variant="outline" @click="showDetailDialog = false">Close</Button>
            <Button
              :class="selectedJob && appliedJobIds.has(selectedJob.id) ? '' : 'gradient-cta'"
              :variant="selectedJob && appliedJobIds.has(selectedJob.id) ? 'secondary' : 'default'"
              :disabled="!selectedJob || appliedJobIds.has(selectedJob.id) || applyingJobId === selectedJob?.id"
              @click="applyForJob(selectedJob!.id)"
            >
              <Loader2 v-if="applyingJobId === selectedJob?.id" class="h-4 w-4 animate-spin mr-1" />
              <CheckCircle v-else-if="selectedJob && appliedJobIds.has(selectedJob.id)" class="h-4 w-4 mr-1" />
              {{ selectedJob && appliedJobIds.has(selectedJob.id) ? 'Applied' : applyingJobId === selectedJob?.id ? 'Applying...' : 'Apply Now' }}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

  </AppShell>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  X, Loader2, SearchX, Search, MapPin, Wrench, DollarSign,
  CalendarDays, Briefcase, CheckCircle,
} from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { useJobStore } from '@/stores/jobs'
import type { Job } from '@/services/jobApi'
import AppShell from '@/components/layout/AppShell.vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import cvApi from '@/services/cvApi'

const jobStore = useJobStore()
const showDetailDialog = ref(false)
const selectedJob = ref<Job | null>(null)
const applyingJobId = ref<string | null>(null)
const applyError = ref<string | null>(null)
const appliedJobIds = ref<Set<string>>(new Set())

const filters = ref({ title: '', location: '', skill: '' })
let debounceTimer: ReturnType<typeof setTimeout>

onMounted(async () => {
  await jobStore.fetchOpenJobs()
  try {
    const { data } = await cvApi.getMyApplications()
    appliedJobIds.value = new Set(data.map(a => a.jobId))
  } catch {
    // not critical
  }
})

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

async function applyForJob(jobId: string) {
  applyingJobId.value = jobId
  applyError.value = null
  try {
    await cvApi.applyForJob(jobId)
    appliedJobIds.value = new Set([...appliedJobIds.value, jobId])
    showDetailDialog.value = false
    toast.success('Application submitted successfully!')
  } catch (err: any) {
    applyError.value = err?.response?.data?.message ?? 'Failed to apply. Please try again.'
    toast.error(applyError.value!)
  } finally {
    applyingJobId.value = null
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>
