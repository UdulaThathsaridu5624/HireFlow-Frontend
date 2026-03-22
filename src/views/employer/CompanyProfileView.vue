<template>
  <AppShell>
    <div class="flex flex-col gap-8 max-w-4xl">
      <div>
        <h1 class="font-headline text-2xl font-extrabold text-foreground">Company Profile</h1>
        <p class="text-muted-foreground text-sm mt-1">
          Manage your company's presence on HireFlow.
        </p>
      </div>

      <div v-if="companyStore.loading && !companyStore.company" class="py-20 flex justify-center">
        <Loader2 class="h-8 w-8 animate-spin text-primary" />
      </div>

      <div
        v-else-if="!companyStore.company && !isEditing"
        class="py-20 text-center border-2 border-dashed rounded-xl border-border"
      >
        <Building2 class="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
        <h3 class="font-headline text-lg font-semibold text-foreground">No Company Profile Yet</h3>
        <p class="text-muted-foreground mb-6">
          Create a profile to showcase your company to candidates.
        </p>
        <Button class="gradient-cta" @click="startCreate"> <Plus class="h-4 w-4 mr-2" /> Create Profile </Button>
      </div>

      <div v-if="companyStore.company && !isEditing" class="flex flex-col gap-6">
        <!-- Analytics Section -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card class="p-4 editorial-shadow border-l-4 border-primary">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-muted rounded-lg"><Eye class="h-4 w-4 text-primary" /></div>
              <div>
                <p class="text-xs text-muted-foreground uppercase font-semibold">Views</p>
                <h3 class="text-xl font-bold">{{ companyStore.analytics?.profileViews || 0 }}</h3>
              </div>
            </div>
          </Card>
          <Card class="p-4 editorial-shadow border-l-4 border-secondary">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-muted rounded-lg">
                <Users class="h-4 w-4 text-primary" />
              </div>
              <div>
                <p class="text-xs text-muted-foreground uppercase font-semibold">Followers</p>
                <h3 class="text-xl font-bold">{{ companyStore.analytics?.followersCount || 0 }}</h3>
              </div>
            </div>
          </Card>
          <Card class="p-4 editorial-shadow border-l-4 border-tertiary-fixed-dim">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-muted rounded-lg">
                <Briefcase class="h-4 w-4 text-tertiary-fixed-dim" />
              </div>
              <div>
                <p class="text-xs text-muted-foreground uppercase font-semibold">Jobs</p>
                <h3 class="text-xl font-bold">{{ jobStore.myJobs.length }}</h3>
              </div>
            </div>
          </Card>
          <Card class="p-4 editorial-shadow border-l-4 border-tertiary-container">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-muted rounded-lg">
                <TrendingUp class="h-4 w-4 text-tertiary-container" />
              </div>
              <div>
                <p class="text-xs text-muted-foreground uppercase font-semibold">Apps</p>
                <h3 class="text-xl font-bold">
                  {{ companyStore.analytics?.applicationsReceived || 0 }}
                </h3>
              </div>
            </div>
          </Card>
        </div>

        <Card class="editorial-shadow">
          <CardHeader class="flex flex-row items-center gap-6">
            <div
              class="h-20 w-20 rounded-lg bg-muted overflow-hidden shrink-0"
            >
              <img
                v-if="companyStore.company.logoUrl"
                :src="companyStore.company.logoUrl"
                class="h-full w-full object-cover"
              />
              <Building2 v-else class="h-10 w-10 mx-auto mt-5 text-muted-foreground/30" />
            </div>
            <div class="flex-1">
              <CardTitle class="font-headline text-2xl">{{ companyStore.company.companyName }}</CardTitle>
              <div class="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                <span class="flex items-center gap-1"
                  ><MapPin class="h-3.5 w-3.5" /> {{ companyStore.company.location }}</span
                >
                <span class="flex items-center gap-1"
                  ><Briefcase class="h-3.5 w-3.5" /> {{ companyStore.company.industry }}</span
                >
                <a
                  :href="companyStore.company.website"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-1 hover:text-primary hover:underline transition-colors"
                  ><Globe class="h-3.5 w-3.5" /> {{ companyStore.company.website }}</a
                >
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <Button variant="outline" size="sm" @click="startEdit">
                <Pencil class="h-4 w-4 mr-2" /> Edit
              </Button>
              <Button variant="destructive" size="sm" @click="confirmDelete">
                <Trash2 class="h-4 w-4 mr-2" /> Delete
              </Button>
            </div>
          </CardHeader>
          <CardContent class="flex flex-col gap-6">
            <div>
              <h4 class="font-headline text-sm font-semibold text-foreground mb-2">Background</h4>
              <p class="text-sm text-muted-foreground leading-relaxed">
                {{ companyStore.company.background }}
              </p>
            </div>
            <div>
              <h4 class="font-headline text-sm font-semibold text-foreground mb-2">Culture & Tags</h4>
              <div class="flex flex-wrap gap-2">
                <Badge
                  v-for="tag in companyStore.company.cultureTags"
                  :key="tag"
                  variant="secondary"
                  >{{ tag }}</Badge
                >
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Create / Edit Form -->
      <Card v-if="isEditing" class="editorial-shadow">
        <CardHeader>
          <CardTitle class="font-headline">{{ editingId ? 'Update' : 'Create' }} Company Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleSubmit" class="flex flex-col gap-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium">Company Name</label>
                <Input
                  v-model="form.companyName"
                  required
                  placeholder="e.g. HireFlow Tech"
                />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium">Industry</label>
                <Input
                  v-model="form.industry"
                  required
                  placeholder="e.g. IT, Healthcare"
                />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium">Location</label>
                <Input
                  v-model="form.location"
                  required
                  placeholder="e.g. Colombo, Sri Lanka"
                />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-medium">Website URL</label>
                <Input
                  v-model="form.website"
                  required
                  type="url"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium">Company Background</label>
              <Textarea
                v-model="form.background"
                required
                rows="4"
                placeholder="Describe your company..."
              />
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium">Culture Tags</label>
              <Input
                v-model="cultureTagsInput"
                placeholder="Remote-First, High-Growth, Inclusive"
              />
            </div>

            <div class="flex flex-col gap-2">
              <label class="text-sm font-medium">Company Logo</label>
              <div class="mt-1 flex items-center gap-4">
                <div
                  v-if="logoPreview || (companyStore.company?.logoUrl && !logoFile)"
                  class="h-16 w-16 rounded overflow-hidden shrink-0"
                >
                  <img
                    :src="logoPreview || companyStore.company?.logoUrl"
                    class="h-full w-full object-cover"
                  />
                </div>
                <input
                  type="file"
                  @change="handleFileChange"
                  accept="image/*"
                  class="text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" @click="isEditing = false">Cancel</Button>
              <Button type="submit" :disabled="loading" class="gradient-cta">
                <Loader2 v-if="loading" class="h-4 w-4 mr-2 animate-spin" />
                {{ editingId ? 'Update Profile' : 'Create Profile' }}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <!-- Delete Confirmation -->
      <AlertDialog v-model:open="showDeleteConfirm">
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle class="font-headline">Delete company profile?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your company profile? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction class="bg-destructive text-white hover:bg-destructive/90" @click="handleDelete">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  </AppShell>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCompanyStore } from '@/stores/company'
import { useJobStore } from '@/stores/jobs'
import {
  Building2,
  Plus,
  Loader2,
  MapPin,
  Briefcase,
  Globe,
  Pencil,
  Trash2,
  Eye,
  Users,
  TrendingUp,
} from 'lucide-vue-next'
import AppShell from '@/components/layout/AppShell.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'vue-sonner'

const authStore = useAuthStore()
const companyStore = useCompanyStore()
const jobStore = useJobStore()

const isEditing = ref(false)
const editingId = ref<number | null>(null)
const loading = ref(false)
const showDeleteConfirm = ref(false)

const form = reactive({
  companyName: '',
  location: '',
  industry: '',
  background: '',
  website: '',
})

const cultureTagsInput = ref('')
const logoFile = ref<File | null>(null)
const logoPreview = ref<string | null>(null)

onMounted(async () => {
  if (authStore.userId) {
    await companyStore.fetchByEmployee(authStore.userId)
    if (companyStore.company?.id) {
      await companyStore.fetchAnalytics(companyStore.company.id)
    }
    await jobStore.fetchMyJobs()
  }
})

function startCreate() {
  isEditing.value = true
  editingId.value = null
  resetForm()
}

function startEdit() {
  if (!companyStore.company) return
  isEditing.value = true
  editingId.value = companyStore.company.id
  form.companyName = companyStore.company.companyName
  form.location = companyStore.company.location
  form.industry = companyStore.company.industry
  form.background = companyStore.company.background
  form.website = companyStore.company.website
  cultureTagsInput.value = companyStore.company.cultureTags.join(', ')
  logoPreview.value = null
  logoFile.value = null
}

function resetForm() {
  form.companyName = ''
  form.location = ''
  form.industry = ''
  form.background = ''
  form.website = ''
  cultureTagsInput.value = ''
  logoFile.value = null
  logoPreview.value = null
}

function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    logoFile.value = target.files[0]
    logoPreview.value = URL.createObjectURL(target.files[0])
  }
}

async function handleSubmit() {
  if (!authStore.userId) return

  const tags = cultureTagsInput.value
    ? cultureTagsInput.value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : []

  const metadata = {
    ...form,
    employeeId: String(authStore.userId),
    cultureTags: tags,
  }

  loading.value = true
  try {
    if (editingId.value) {
      await companyStore.updateCompany(editingId.value, metadata, logoFile.value || undefined)
      toast.success('Company profile updated')
    } else {
      if (!logoFile.value) {
        toast.error('Please upload a company logo')
        loading.value = false
        return
      }
      await companyStore.createCompany(metadata, logoFile.value)
      toast.success('Company profile created')
    }
    isEditing.value = false
  } catch (e) {
    toast.error('Failed to save company profile')
  } finally {
    loading.value = false
  }
}

function confirmDelete() {
  showDeleteConfirm.value = true
}

async function handleDelete() {
  if (!companyStore.company) return
  try {
    await companyStore.deleteCompany(companyStore.company.id)
    toast.success('Company profile deleted')
  } catch {
    toast.error('Failed to delete profile')
  }
}
</script>
