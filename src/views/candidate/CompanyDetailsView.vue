<template>
  <AppShell>
    <div v-if="loading" class="space-y-8 animate-pulse">
      <div class="flex flex-col md:flex-row gap-8 items-start">
        <div class="h-32 w-32 rounded-xl bg-muted"></div>
        <div class="flex-1 space-y-4">
          <div class="h-8 w-1/3 bg-muted rounded"></div>
          <div class="h-4 w-1/4 bg-muted rounded"></div>
          <div class="flex gap-2">
            <div class="h-6 w-16 bg-muted rounded-full"></div>
            <div class="h-6 w-16 bg-muted rounded-full"></div>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="md:col-span-2 space-y-6">
          <div class="h-64 bg-muted rounded-xl"></div>
        </div>
        <div class="space-y-6">
          <div class="h-48 bg-muted rounded-xl"></div>
        </div>
      </div>
    </div>

    <div v-else-if="company" class="space-y-8">
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

              <div class="flex-1 space-y-4">
                <div class="flex flex-wrap items-center gap-3">
                  <h1 class="text-4xl font-extrabold tracking-tight">{{ company.companyName }}</h1>
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
        <div class="lg:col-span-2 space-y-8">
          <Card class="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
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
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-bold flex items-center gap-2">
                <LayoutGrid class="h-6 w-6 text-primary" />
                Open Opportunities
                <Badge class="ml-2 bg-primary/10 text-primary border-none">{{
                  demoJobs.length
                }}</Badge>
              </h2>
            </div>

            <div class="grid grid-cols-1 gap-4">
              <Card
                v-for="job in demoJobs"
                :key="job.id"
                class="group hover:border-primary/40 transition-all hover:shadow-md cursor-pointer border-border/40"
              >
                <CardContent class="p-6">
                  <div class="flex items-start justify-between">
                    <div class="space-y-3">
                      <div class="flex items-center gap-3">
                        <h3 class="text-lg font-bold group-hover:text-primary transition-colors">
                          {{ job.title }}
                        </h3>
                        <Badge variant="outline" class="text-[10px] uppercase tracking-wider">{{
                          job.type
                        }}</Badge>
                      </div>
                      <div class="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div class="flex items-center gap-1.5">
                          <DollarSign class="h-3.5 w-3.5" />
                          {{ job.salary }}
                        </div>
                        <div class="flex items-center gap-1.5">
                          <Clock class="h-3.5 w-3.5" />
                          Posted {{ job.postedAt }}
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
                      class="opacity-0 group-hover:opacity-100 transition-opacity"
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
        <div class="space-y-8">
          <Card
            class="border-border/40 shadow-sm overflow-hidden text-center p-6 bg-primary/5 border-primary/10"
          >
            <h3 class="font-bold text-lg mb-2">Ready to apply?</h3>
            <p class="text-sm text-muted-foreground mb-4">
              Complete your profile to start applying for jobs at {{ company.companyName }}.
            </p>
            <Button
              variant="outline"
              class="w-full bg-background border-primary/20 hover:bg-primary/5"
            >
              Update Resume
            </Button>
          </Card>

          <Card class="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle class="text-base">Company Details</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
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
                <span class="text-sm text-muted-foreground">Member Since</span>
                <span class="text-sm font-medium">{{
                  new Date(company.createdAt).getFullYear()
                }}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

    <div
      v-else
      class="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4"
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
  </AppShell>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCompanyStore } from '@/stores/company'
import { ROUTES } from '@/constants'
import AppShell from '@/components/layout/AppShell.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
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
} from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const route = useRoute()
const router = useRouter()
const companyStore = useCompanyStore()

const loading = ref(true)
const company = ref<any>(null)

// Demo jobs data as requested
const demoJobs = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    type: 'Full-time',
    salary: '$120k - $150k',
    location: 'Remote',
    postedAt: '2 days ago',
  },
  {
    id: 2,
    title: 'Product Designer',
    type: 'Contract',
    salary: '$80 - $100 / hr',
    location: 'Hybrid',
    postedAt: '4 days ago',
  },
  {
    id: 3,
    title: 'Backend Engineer (Node.js)',
    type: 'Full-time',
    salary: '$130k - $160k',
    location: 'On-site',
    postedAt: '1 week ago',
  },
]

onMounted(async () => {
  const id = parseInt(route.params.id as string)
  if (isNaN(id)) {
    router.push(ROUTES.CANDIDATE_COMPANIES)
    return
  }

  try {
    const data = await companyStore.fetchCompanyById(id)
    company.value = data
  } catch (error) {
    console.error('Failed to fetch company', error)
    toast.error('Failed to load company details')
  } finally {
    loading.value = false
  }
})

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
