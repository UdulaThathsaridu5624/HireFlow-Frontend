<template>
  <AppShell>
    <div v-if="loading" class="flex flex-col gap-8 animate-pulse">
      <div class="flex flex-col md:flex-row gap-8 items-start">
        <div class="h-32 w-32 rounded-xl bg-muted"></div>
        <div class="flex-1 flex flex-col gap-4">
          <div class="h-8 w-1/3 bg-muted rounded"></div>
          <div class="h-4 w-1/4 bg-muted rounded"></div>
          <div class="flex gap-2">
            <div class="h-6 w-16 bg-muted rounded-full"></div>
            <div class="h-6 w-16 bg-muted rounded-full"></div>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="md:col-span-2 flex flex-col gap-6">
          <div class="h-64 bg-muted rounded-xl"></div>
        </div>
        <div class="flex flex-col gap-6">
          <div class="h-48 bg-muted rounded-xl"></div>
        </div>
      </div>
    </div>

    <div v-else-if="company" class="flex flex-col gap-8">
      <!-- Header Section -->
      <div class="relative group">
        <div
          class="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur opacity-25"
        ></div>
        <Card class="relative border-none shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
          <CardContent class="p-8">
            <div class="flex flex-col md:flex-row gap-8 items-start md:items-center">
              <Avatar class="h-32 w-32 rounded-2xl border-4 border-background shadow-xl">
                <AvatarImage :src="company.logoUrl" :alt="company.companyName" />
                <AvatarFallback class="text-3xl bg-primary/10 text-primary rounded-2xl">
                  {{ company.companyName.charAt(0) }}
                </AvatarFallback>
              </Avatar>

              <div class="flex-1 flex flex-col gap-4">
                <div class="flex flex-wrap items-center gap-3">
                  <h1 class="font-headline text-4xl font-extrabold tracking-tight">{{ company.companyName }}</h1>
                  <Badge variant="secondary" class="h-6 px-3">{{ company.industry }}</Badge>
                </div>

                <div class="flex flex-wrap gap-6 text-muted-foreground">
                  <div class="flex items-center gap-2">
                    <MapPin class="h-4 w-4 text-primary/70" />
                    <span>{{ company.location }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <Globe class="h-4 w-4 text-primary/70" />
                    <a
                      :href="company.website"
                      target="_blank"
                      class="hover:text-primary transition-colors hover:underline"
                    >
                      {{ company.website.replace(/^https?:\/\//, '') }}
                    </a>
                  </div>
                  <div class="flex items-center gap-2">
                    <Users class="h-4 w-4 text-primary/70" />
                    <span>{{ company.followersCount }} Followers</span>
                  </div>
                </div>

                <div class="flex flex-wrap gap-2 pt-2">
                  <Badge
                    v-for="tag in company.cultureTags"
                    :key="tag"
                    variant="outline"
                    class="bg-primary/5 border-primary/10 text-xs font-semibold py-1"
                  >
                    # {{ tag }}
                  </Badge>
                </div>
              </div>

              <div class="flex flex-col gap-3 min-w-[160px]">
                <Button
                  :variant="company.followedByMe ? 'secondary' : 'default'"
                  class="w-full text-base font-semibold shadow-sm h-12"
                  @click="toggleFollow"
                >
                  <CheckCircle2 v-if="company.followedByMe" class="mr-2 h-5 w-5 text-primary" />
                  <UserPlus v-else class="mr-2 h-5 w-5" />
                  {{ company.followedByMe ? 'Following' : 'Follow' }}
                </Button>
                <p class="text-[10px] text-center text-muted-foreground">
                  Follow to get notified about new openings
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 flex flex-col gap-8">
          <Card class="editorial-shadow">
            <CardHeader>
              <CardTitle class="font-headline flex items-center gap-2">
                <Briefcase class="h-5 w-5 text-primary" />
                Company Background
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {{ company.background }}
              </p>
            </CardContent>
          </Card>

          <!-- Job Listings Section -->
          <div class="flex flex-col gap-6">
            <div class="flex items-center justify-between">
              <h2 class="font-headline text-2xl font-bold flex items-center gap-2">
                <LayoutGrid class="h-6 w-6 text-primary" />
                Open Opportunities
                <Badge class="ml-2 bg-primary/10 text-primary border-none">{{
                  companyJobs.length
                }}</Badge>
              </h2>
            </div>

            <div v-if="!companyJobs.length" class="text-sm text-muted-foreground py-4">
              No open positions at the moment.
            </div>
            <div class="grid grid-cols-1 gap-4">
              <Card
                v-for="job in companyJobs"
                :key="job.id"
                class="group editorial-shadow hover:border-primary/40 transition-all hover:shadow-md cursor-pointer"
              >
                <CardContent class="p-6">
                  <div class="flex items-start justify-between">
                    <div class="flex flex-col gap-3">
                      <div class="flex items-center gap-3">
                        <h3 class="text-lg font-bold group-hover:text-primary transition-colors">
                          {{ job.title }}
                        </h3>
                        <Badge v-if="job.isRemote" variant="outline" class="text-[10px] uppercase tracking-wider">Remote</Badge>
                      </div>
                      <div class="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div v-if="job.salaryMin && job.salaryMax" class="flex items-center gap-1.5">
                          <DollarSign class="h-3.5 w-3.5" />
                          {{ job.salaryCurrency }} {{ job.salaryMin.toLocaleString() }} – {{ job.salaryMax.toLocaleString() }}
                        </div>
                        <div class="flex items-center gap-1.5">
                          <Clock class="h-3.5 w-3.5" />
                          {{ formatPostedAt(job.createdAt) }}
                        </div>
                        <div class="flex items-center gap-1.5">
                          <MapPin class="h-3.5 w-3.5" />
                          {{ job.location }}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      class="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      @click.stop="openJobDetail(job)"
                    >
                      View Details
                      <ExternalLink class="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="flex flex-col gap-8">
          <Card class="editorial-shadow">
            <CardHeader>
              <CardTitle class="font-headline text-base">Ready to Apply?</CardTitle>
            </CardHeader>
            <CardContent class="flex flex-col gap-4">
              <div v-if="cvStore.profile?.resumes?.length" class="flex flex-col gap-2">
                <p class="text-xs text-muted-foreground uppercase font-semibold tracking-wide">Your Resumes</p>
                <div
                  v-for="resume in cvStore.profile.resumes"
                  :key="resume.fileUrl"
                  class="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                >
                  <div class="flex flex-col gap-0.5 min-w-0">
                    <p class="text-sm font-medium truncate">{{ resume.fileName }}</p>
                    <Badge v-if="resume.isDefault" variant="secondary" class="text-[10px] w-fit">Default</Badge>
                  </div>
                  <a
                    :href="resume.fileUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-primary hover:underline text-xs shrink-0 ml-2"
                  >View</a>
                </div>
              </div>
              <div v-else class="text-sm text-muted-foreground text-center py-2">
                No resume uploaded yet.
              </div>
              <Button
                variant="outline"
                class="w-full"
                @click="showResumeDialog = true"
              >
                <Upload class="h-4 w-4 mr-2" />
                {{ cvStore.profile?.resumes?.length ? 'Upload New Resume' : 'Upload Resume' }}
              </Button>
            </CardContent>
          </Card>

          <Card class="editorial-shadow">
            <CardHeader>
              <CardTitle class="font-headline text-base">Company Details</CardTitle>
            </CardHeader>
            <CardContent class="flex flex-col gap-4">
              <div
                class="flex justify-between items-center py-2 border-b border-border/40 last:border-0"
              >
                <span class="text-sm text-muted-foreground">Industry</span>
                <span class="text-sm font-medium">{{ company.industry }}</span>
              </div>
              <div
                class="flex justify-between items-center py-2 border-b border-border/40 last:border-0"
              >
                <span class="text-sm text-muted-foreground">Location</span>
                <span class="text-sm font-medium">{{ company.location }}</span>
              </div>
              <div
                v-if="company.reputationScore > 0"
                class="flex justify-between items-center py-2 border-b border-border/40 last:border-0"
              >
                <span class="text-sm text-muted-foreground">Reputation</span>
                <div class="flex items-center gap-1">
                  <Star class="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <span class="text-sm font-medium">{{ company.reputationScore }}/100</span>
                </div>
              </div>
              <div
                class="flex justify-between items-center py-2 border-b border-border/40 last:border-0"
              >
                <span class="text-sm text-muted-foreground">Open Positions</span>
                <span class="text-sm font-medium">{{ companyJobs.length }}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

    <div
      v-else
      class="flex flex-col items-center justify-center min-h-[400px] text-center gap-4"
    >
      <div class="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
        <AlertTriangle class="h-10 w-10 text-destructive" />
      </div>
      <div>
        <h2 class="text-2xl font-bold">Company not found</h2>
        <p class="text-muted-foreground">
          The company profile you are looking for doesn't exist or was removed.
        </p>
      </div>
      <Button @click="router.push(ROUTES.CANDIDATE_COMPANIES)">Back to Explore</Button>
    </div>

    <!-- Upload Resume Dialog -->
    <Dialog v-model:open="showResumeDialog">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Resume</DialogTitle>
          <DialogDescription>Select a PDF file to upload as your resume.</DialogDescription>
        </DialogHeader>
        <div class="flex flex-col gap-4 mt-2">
          <input
            type="file"
            accept="application/pdf"
            @change="onResumeFileChange"
            class="text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
          />
          <div class="flex justify-end gap-3 pt-2 border-t border-border">
            <Button variant="outline" @click="showResumeDialog = false">Cancel</Button>
            <Button :disabled="!resumeFile || uploadingResume" @click="uploadResume">
              <Loader2 v-if="uploadingResume" class="h-4 w-4 animate-spin mr-2" />
              <Upload v-else class="h-4 w-4 mr-2" />
              {{ uploadingResume ? 'Uploading...' : 'Upload' }}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Job Detail Dialog -->
    <Dialog v-model:open="showJobDialog">
      <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle class="font-headline">{{ selectedJob?.title }}</DialogTitle>
          <DialogDescription>
            {{ company?.companyName }} &bull; {{ selectedJob?.location }}
            <Badge v-if="selectedJob?.isRemote" variant="secondary" class="ml-2 text-xs">Remote</Badge>
          </DialogDescription>
        </DialogHeader>
        <div v-if="selectedJob" class="flex flex-col gap-5 mt-2">
          <div v-if="selectedJob.salaryMin && selectedJob.salaryMax" class="flex items-center gap-2">
            <DollarSign class="h-4 w-4 text-muted-foreground" />
            <span class="text-sm font-medium">Salary:</span>
            <span class="text-sm text-muted-foreground">
              {{ selectedJob.salaryCurrency }} {{ selectedJob.salaryMin.toLocaleString() }} – {{ selectedJob.salaryMax.toLocaleString() }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <Clock class="h-4 w-4 text-muted-foreground" />
            <span class="text-sm font-medium">Deadline:</span>
            <span class="text-sm text-muted-foreground">{{ new Date(selectedJob.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }}</span>
          </div>
          <div class="flex flex-col gap-2">
            <h4 class="font-headline text-sm font-semibold">Job Description</h4>
            <p class="text-sm text-muted-foreground whitespace-pre-line">{{ selectedJob.description }}</p>
          </div>
          <div v-if="selectedJob.requiredSkills?.length" class="flex flex-col gap-2">
            <h4 class="font-headline text-sm font-semibold">Required Skills</h4>
            <div class="flex flex-wrap gap-2">
              <Badge v-for="skill in selectedJob.requiredSkills" :key="skill" variant="secondary">{{ skill }}</Badge>
            </div>
          </div>
          <div class="flex justify-end gap-3 pt-2 border-t border-border">
            <Button variant="outline" @click="showJobDialog = false">Close</Button>
            <Button
              :variant="selectedJob && appliedJobIds.has(selectedJob.id) ? 'secondary' : 'default'"
              :disabled="!selectedJob || appliedJobIds.has(selectedJob.id) || applyingJobId === selectedJob?.id"
              @click="applyForJob(selectedJob!.id)"
            >
              <Loader2 v-if="applyingJobId === selectedJob?.id" class="h-4 w-4 animate-spin mr-1" />
              <CheckCircle2 v-else-if="selectedJob && appliedJobIds.has(selectedJob.id)" class="h-4 w-4 mr-1" />
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
import { useRoute, useRouter } from 'vue-router'
import { useCompanyStore } from '@/stores/company'
import { useCvStore } from '@/stores/cv'
import { jobsApi, type Job } from '@/services/jobApi'
import cvApi from '@/services/cvApi'
import { ROUTES } from '@/constants'
import AppShell from '@/components/layout/AppShell.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import {
  MapPin,
  Globe,
  Users,
  Briefcase,
  LayoutGrid,
  DollarSign,
  Clock,
  ExternalLink,
  Star,
  UserPlus,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Upload,
} from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const route = useRoute()
const router = useRouter()
const companyStore = useCompanyStore()
const cvStore = useCvStore()

const loading = ref(true)
const company = ref<any>(null)
const companyJobs = ref<Job[]>([])
const showJobDialog = ref(false)
const selectedJob = ref<Job | null>(null)
const appliedJobIds = ref<Set<string>>(new Set())
const applyingJobId = ref<string | null>(null)
const showResumeDialog = ref(false)
const resumeFile = ref<File | null>(null)
const uploadingResume = ref(false)

function onResumeFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files?.[0]) resumeFile.value = target.files[0]
}

async function uploadResume() {
  if (!resumeFile.value) return
  uploadingResume.value = true
  try {
    const isDefault = !cvStore.profile?.resumes?.length
    const uploaded = await cvStore.uploadResume(resumeFile.value, isDefault)
    const newResume = {
      fileName: uploaded.fileName,
      fileUrl: uploaded.fileUrl,
      isDefault: uploaded.isDefault ?? isDefault,
      uploadedAt: uploaded.uploadedAt ?? new Date().toISOString(),
    }
    const p = cvStore.profile
    const updatedResumes = [...(p?.resumes ?? []), newResume]
    await cvStore.upsertProfile({
      fullName: p?.fullName ?? '',
      bio: p?.bio ?? '',
      location: p?.location ?? '',
      linkedinUrl: p?.linkedinUrl ?? '',
      skills: (p?.skills ?? []).map(s => ({ name: s.name, proficiencyLevel: s.proficiencyLevel, yearsExperience: s.yearsExperience })),
      education: (p?.education ?? []).map(e => ({ institutionName: e.institutionName, degree: e.degree, fieldOfStudy: e.fieldOfStudy, startDate: e.startDate, endDate: e.endDate, grade: e.grade, description: e.description })),
      workExperience: (p?.workExperience ?? []).map(w => ({ companyName: w.companyName, jobTitle: w.jobTitle, startDate: w.startDate, endDate: w.endDate, currentlyWorking: w.currentlyWorking, description: w.description })),
      resumes: updatedResumes.map(r => ({ fileUrl: r.fileUrl, fileName: r.fileName, isDefault: r.isDefault })),
    })
    resumeFile.value = null
    showResumeDialog.value = false
    toast.success('Resume uploaded')
  } catch {
    toast.error('Failed to upload resume')
  } finally {
    uploadingResume.value = false
  }
}

function openJobDetail(job: Job) {
  selectedJob.value = job
  showJobDialog.value = true
}

async function applyForJob(jobId: string) {
  applyingJobId.value = jobId
  try {
    await cvApi.applyForJob(jobId)
    appliedJobIds.value = new Set([...appliedJobIds.value, jobId])
    showJobDialog.value = false
    toast.success('Application submitted successfully!')
  } catch {
    toast.error('Failed to apply. Please try again.')
  } finally {
    applyingJobId.value = null
  }
}

onMounted(async () => {
  const id = parseInt(route.params.id as string)
  if (isNaN(id)) {
    router.push(ROUTES.CANDIDATE_COMPANIES)
    return
  }

  try {
    const [data, myApps] = await Promise.all([
      companyStore.fetchCompanyById(id),
      cvApi.getMyApplications().catch(() => ({ data: [] })),
      cvStore.fetchMyProfile(),
    ])
    company.value = data
    appliedJobIds.value = new Set(myApps.data.map((a: any) => a.jobId))
    const { data: allJobs } = await jobsApi.getAllOpenJobs()
    companyJobs.value = allJobs.filter((j) => j.employerId === String(data.employeeId))
  } catch (error) {
    console.error('Failed to fetch company', error)
    toast.error('Failed to load company details')
  } finally {
    loading.value = false
  }
})

function formatPostedAt(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Posted today'
  if (days === 1) return 'Posted yesterday'
  if (days < 7) return `Posted ${days} days ago`
  if (days < 14) return 'Posted 1 week ago'
  return `Posted ${Math.floor(days / 7)} weeks ago`
}

const toggleFollow = async () => {
  if (!company.value) return

  const originalStatus = company.value.followedByMe
  const originalCount = company.value.followersCount

  // Optimistic UI update
  company.value.followedByMe = !originalStatus
  company.value.followersCount += originalStatus ? -1 : 1

  try {
    if (originalStatus) {
      await companyStore.unfollow(company.value.id)
      toast.success(`No longer following ${company.value.companyName}`)
    } else {
      await companyStore.follow(company.value.id)
      toast.success(`Now following ${company.value.companyName}`)
    }
  } catch (error) {
    // Revert on error
    company.value.followedByMe = originalStatus
    company.value.followersCount = originalCount
    toast.error('Could not update follow status')
  }
}
</script>
