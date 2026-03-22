<template>
  <AppShell>
    <div class="flex flex-col gap-6">

      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="font-headline text-2xl font-extrabold text-foreground">My Job Listings</h1>
          <p class="text-muted-foreground text-sm mt-1">Manage all your posted job listings.</p>
        </div>
        <Button class="gradient-cta" @click="showPostDialog = true">
          <Plus class="h-4 w-4 mr-2" /> Post New Job
        </Button>
      </div>

      <!-- Stats row -->
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div class="bg-card p-5 rounded-xl editorial-shadow border-l-4 border-primary">
          <div class="flex justify-between items-start mb-2">
            <Briefcase class="h-6 w-6 text-primary" />
            <span class="text-3xl font-black text-foreground">{{ jobStore.myJobs.length }}</span>
          </div>
          <h3 class="font-headline text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Jobs</h3>
        </div>
        <div class="bg-card p-5 rounded-xl editorial-shadow border-l-4 border-tertiary-fixed-dim">
          <div class="flex justify-between items-start mb-2">
            <CheckCircle class="h-6 w-6 text-tertiary-fixed-dim" />
            <span class="text-3xl font-black text-foreground">{{ openCount }}</span>
          </div>
          <h3 class="font-headline text-xs font-bold uppercase tracking-widest text-muted-foreground">Open</h3>
        </div>
        <div class="bg-card p-5 rounded-xl editorial-shadow border-l-4 border-muted-foreground">
          <div class="flex justify-between items-start mb-2">
            <XCircle class="h-6 w-6 text-muted-foreground" />
            <span class="text-3xl font-black text-muted-foreground">{{ closedCount }}</span>
          </div>
          <h3 class="font-headline text-xs font-bold uppercase tracking-widest text-muted-foreground">Closed</h3>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="jobStore.loading" class="flex justify-center py-12">
        <Loader2 class="h-8 w-8 animate-spin text-primary" />
      </div>

      <!-- Empty state -->
      <div v-else-if="jobStore.myJobs.length === 0" class="text-center py-16">
        <Briefcase class="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
        <h3 class="font-headline text-lg font-semibold">No jobs posted yet</h3>
        <p class="text-muted-foreground text-sm mt-1">Post your first job to start receiving applications.</p>
        <Button class="mt-4 gradient-cta" @click="showPostDialog = true">
          <Plus class="h-4 w-4 mr-2" /> Post a Job
        </Button>
      </div>

      <!-- Jobs list -->
      <div v-else class="flex flex-col gap-4">
        <div
          v-for="job in jobStore.myJobs"
          :key="job.id"
          class="bg-card p-5 md:p-6 rounded-xl editorial-shadow flex gap-4 md:gap-6 hover:-translate-y-0.5 transition-transform duration-300 group"
        >
          <div class="w-12 h-12 bg-muted rounded-lg shrink-0 hidden sm:flex items-center justify-center">
            <Briefcase class="h-6 w-6 text-primary" />
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="font-headline text-base md:text-lg font-bold text-foreground">{{ job.title }}</h3>
              <Badge :variant="job.status === 'open' ? 'default' : 'secondary'">
                {{ job.status === 'open' ? 'Open' : 'Closed' }}
              </Badge>
              <Badge v-if="job.isRemote" variant="outline" class="text-[10px]">Remote</Badge>
            </div>
            <div class="flex items-center gap-1.5 text-muted-foreground text-sm mt-0.5">
              <MapPin class="h-3.5 w-3.5 shrink-0" />
              <span>{{ job.location }}</span>
            </div>
            <p class="text-muted-foreground text-sm mt-2 line-clamp-2">{{ job.description }}</p>

            <div class="flex flex-wrap gap-1.5 mt-3">
              <span
                v-for="skill in job.requiredSkills"
                :key="skill"
                class="text-[11px] font-medium px-2 py-1 bg-surface-low rounded text-muted-foreground"
              >
                {{ skill }}
              </span>
            </div>

            <div class="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <span v-if="job.salaryMin && job.salaryMax" class="flex items-center gap-1.5">
                <DollarSign class="h-3.5 w-3.5" />
                {{ job.salaryCurrency }} {{ job.salaryMin.toLocaleString() }} – {{ job.salaryMax.toLocaleString() }}
              </span>
              <span class="flex items-center gap-1.5">
                <CalendarDays class="h-3.5 w-3.5" />
                Deadline: {{ formatDate(job.deadline) }}
              </span>
              <span class="flex items-center gap-1.5">
                <Clock class="h-3.5 w-3.5" />
                Posted: {{ formatDate(job.createdAt) }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col gap-2 shrink-0">
            <Button size="sm" @click="router.push(`/employer/jobs/${job.id}/applications`)">
              <Users class="h-3.5 w-3.5 mr-1" /> Applications
            </Button>
            <Button variant="outline" size="sm" @click="openEditDialog(job)">
              <Pencil class="h-3.5 w-3.5 mr-1" /> Edit
            </Button>
            <Button
              v-if="job.status === 'open'"
              variant="destructive"
              size="sm"
              @click="confirmCloseJob(job.id)"
            >
              <X class="h-3.5 w-3.5 mr-1" /> Close
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Post Job Dialog -->
    <Dialog v-model:open="showPostDialog">
      <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle class="font-headline">Post a New Job</DialogTitle>
          <DialogDescription>Fill in the details for your new job listing.</DialogDescription>
        </DialogHeader>
        <JobForm :loading="jobStore.loading" @submit="handleCreateJob" @cancel="showPostDialog = false" />
      </DialogContent>
    </Dialog>

    <!-- Edit Job Dialog -->
    <Dialog v-model:open="showEditDialog">
      <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle class="font-headline">Edit Job</DialogTitle>
          <DialogDescription>Update the details for this job listing.</DialogDescription>
        </DialogHeader>
        <JobForm
          :initial="editingJob"
          :loading="jobStore.loading"
          @submit="handleUpdateJob"
          @cancel="showEditDialog = false"
        />
      </DialogContent>
    </Dialog>

    <!-- Close Job Confirmation -->
    <AlertDialog v-model:open="showCloseConfirm">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle class="font-headline">Close this job posting?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove the job from public listings. Candidates will no longer be able to apply.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction class="bg-destructive text-white hover:bg-destructive/90" @click="handleCloseJob">
            Close Job
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

  </AppShell>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Plus, Pencil, X, Briefcase, Loader2, Users, MapPin,
  DollarSign, CalendarDays, Clock, CheckCircle, XCircle,
} from 'lucide-vue-next'
import { useJobStore } from '@/stores/jobs'
import type { Job } from '@/services/jobApi'
import AppShell from '@/components/layout/AppShell.vue'
import JobForm from '@/components/jobs/JobForm.vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const router = useRouter()
const jobStore = useJobStore()
const showPostDialog = ref(false)
const showEditDialog = ref(false)
const editingJob = ref<Job | null>(null)
const showCloseConfirm = ref(false)
const closingJobId = ref<string | null>(null)

const openCount = computed(() => jobStore.myJobs.filter((j) => j.status === 'open').length)
const closedCount = computed(() => jobStore.myJobs.filter((j) => j.status === 'closed').length)

onMounted(() => jobStore.fetchMyJobs())

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function openEditDialog(job: Job) {
  editingJob.value = job
  showEditDialog.value = true
}

async function handleCreateJob(payload: any) {
  await jobStore.createJob(payload)
  showPostDialog.value = false
}

async function handleUpdateJob(payload: any) {
  if (!editingJob.value) return
  await jobStore.updateJob(editingJob.value.id, payload)
  showEditDialog.value = false
}

function confirmCloseJob(id: string) {
  closingJobId.value = id
  showCloseConfirm.value = true
}

async function handleCloseJob() {
  if (closingJobId.value) {
    await jobStore.closeJob(closingJobId.value)
    closingJobId.value = null
  }
}
</script>
