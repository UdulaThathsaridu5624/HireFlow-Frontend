<template>
  <AppShell>
    <div class="flex flex-col gap-6">

      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-foreground">My Job Listings</h1>
          <p class="text-muted-foreground text-sm mt-1">Manage all your posted job listings.</p>
        </div>
        <Button @click="showPostDialog = true">
          <Plus class="h-4 w-4 mr-2" /> Post New Job
        </Button>
      </div>

      <!-- Stats row -->
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent class="p-5">
            <p class="text-sm text-muted-foreground">Total Jobs</p>
            <p class="text-3xl font-bold">{{ jobStore.myJobs.length }}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="p-5">
            <p class="text-sm text-muted-foreground">Open</p>
            <p class="text-3xl font-bold text-green-600">{{ openCount }}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="p-5">
            <p class="text-sm text-muted-foreground">Closed</p>
            <p class="text-3xl font-bold text-muted-foreground">{{ closedCount }}</p>
          </CardContent>
        </Card>
      </div>

      <!-- Loading -->
      <div v-if="jobStore.loading" class="flex justify-center py-12">
        <Loader2 class="h-8 w-8 animate-spin text-primary" />
      </div>

      <!-- Empty state -->
      <div v-else-if="jobStore.myJobs.length === 0" class="text-center py-16">
        <Briefcase class="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 class="text-lg font-semibold">No jobs posted yet</h3>
        <p class="text-muted-foreground text-sm mt-1">Post your first job to start receiving applications.</p>
        <Button class="mt-4" @click="showPostDialog = true">
          <Plus class="h-4 w-4 mr-2" /> Post a Job
        </Button>
      </div>

      <!-- Jobs list -->
      <div v-else class="flex flex-col gap-4">
        <Card v-for="job in jobStore.myJobs" :key="job.id" class="hover:shadow-md transition-shadow">
          <CardContent class="p-6">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="font-semibold text-foreground text-lg">{{ job.title }}</h3>
                  <Badge :variant="job.status === 'open' ? 'default' : 'secondary'">
                    {{ job.status === 'open' ? 'Open' : 'Closed' }}
                  </Badge>
                  <Badge v-if="job.isRemote" variant="outline">Remote</Badge>
                </div>
                <p class="text-muted-foreground text-sm mt-1">{{ job.location }}</p>
                <p class="text-muted-foreground text-sm mt-2 line-clamp-2">{{ job.description }}</p>

                <!-- Skills -->
                <div class="flex flex-wrap gap-1.5 mt-3">
                  <Badge v-for="skill in job.requiredSkills" :key="skill" variant="outline" class="text-xs">
                    {{ skill }}
                  </Badge>
                </div>

                <!-- Salary & Deadline -->
                <div class="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span v-if="job.salaryMin && job.salaryMax">
                    💰 {{ job.salaryCurrency }} {{ job.salaryMin.toLocaleString() }} – {{ job.salaryMax.toLocaleString() }}
                  </span>
                  <span>📅 Deadline: {{ formatDate(job.deadline) }}</span>
                  <span>🕐 Posted: {{ formatDate(job.createdAt) }}</span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-2 shrink-0">
                <Button variant="outline" size="sm" @click="openEditDialog(job)">
                  <Pencil class="h-3.5 w-3.5 mr-1" /> Edit
                </Button>
                <Button
                  v-if="job.status === 'open'"
                  variant="destructive"
                  size="sm"
                  @click="handleCloseJob(job.id)"
                >
                  <X class="h-3.5 w-3.5 mr-1" /> Close
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Post Job Dialog -->
    <Dialog v-model:open="showPostDialog">
      <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post a New Job</DialogTitle>
          <DialogDescription>Fill in the details for your new job listing.</DialogDescription>
        </DialogHeader>
        <JobForm :loading="jobStore.loading" @submit="handleCreateJob" @cancel="showPostDialog = false" />
      </DialogContent>
    </Dialog>

    <!-- Edit Job Dialog -->
    <Dialog v-model:open="showEditDialog">
      <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Job</DialogTitle>
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

  </AppShell>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Plus, Pencil, X, Briefcase, Loader2 } from 'lucide-vue-next'
import { useJobStore } from '@/stores/jobs'
import type { Job } from '@/services/jobApi'
import AppShell from '@/components/layout/AppShell.vue'
import JobForm from '@/components/jobs/JobForm.vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'

const jobStore = useJobStore()
const showPostDialog = ref(false)
const showEditDialog = ref(false)
const editingJob = ref<Job | null>(null)

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

async function handleCloseJob(id: string) {
  if (confirm('Are you sure you want to close this job posting?')) {
    await jobStore.closeJob(id)
  }
}
</script>