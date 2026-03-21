<template>
  <AppShell>
    <div class="flex flex-col gap-8 max-w-4xl">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Company Profile</h1>
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
        <h3 class="text-lg font-semibold text-foreground">No Company Profile Yet</h3>
        <p class="text-muted-foreground mb-6">
          Create a profile to showcase your company to candidates.
        </p>
        <Button @click="startCreate"> <Plus class="h-4 w-4 mr-2" /> Create Profile </Button>
      </div>

      <div v-if="companyStore.company && !isEditing" class="space-y-6">
        <!-- Analytics Section -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card class="p-4 bg-primary/5 border-primary/20">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-primary/10 rounded-lg"><Eye class="h-4 w-4 text-primary" /></div>
              <div>
                <p class="text-xs text-muted-foreground uppercase font-semibold">Views</p>
                <h3 class="text-xl font-bold">{{ companyStore.analytics?.profileViews || 0 }}</h3>
              </div>
            </div>
          </Card>
          <Card class="p-4 bg-blue-500/5 border-blue-500/20">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-blue-500/10 rounded-lg">
                <Users class="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p class="text-xs text-muted-foreground uppercase font-semibold">Followers</p>
                <h3 class="text-xl font-bold">{{ companyStore.analytics?.followersCount || 0 }}</h3>
              </div>
            </div>
          </Card>
          <Card class="p-4 bg-emerald-500/5 border-emerald-500/20">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-emerald-500/10 rounded-lg">
                <Briefcase class="h-4 w-4 text-emerald-500" />
              </div>
              <div>
                <p class="text-xs text-muted-foreground uppercase font-semibold">Jobs</p>
                <h3 class="text-xl font-bold">{{ companyStore.analytics?.jobPosts || 0 }}</h3>
              </div>
            </div>
          </Card>
          <Card class="p-4 bg-amber-500/5 border-amber-500/20">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-amber-500/10 rounded-lg">
                <TrendingUp class="h-4 w-4 text-amber-500" />
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

        <Card>
          <CardHeader class="flex flex-row items-center gap-6">
            <div
              class="h-20 w-20 rounded-lg bg-muted overflow-hidden shrink-0 border border-border"
            >
              <img
                v-if="companyStore.company.logoUrl"
                :src="companyStore.company.logoUrl"
                class="h-full w-full object-cover"
              />
              <Building2 v-else class="h-10 w-10 mx-auto mt-5 text-muted-foreground/30" />
            </div>
            <div class="flex-1">
              <CardTitle class="text-2xl">{{ companyStore.company.companyName }}</CardTitle>
              <div class="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                <span class="flex items-center gap-1"
                  ><MapPin class="h-3.5 w-3.5" /> {{ companyStore.company.location }}</span
                >
                <span class="flex items-center gap-1"
                  ><Briefcase class="h-3.5 w-3.5" /> {{ companyStore.company.industry }}</span
                >
                <span class="flex items-center gap-1"
                  ><Globe class="h-3.5 w-3.5" /> {{ companyStore.company.website }}</span
                >
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <Button variant="outline" size="sm" @click="startEdit">
                <Pencil class="h-4 w-4 mr-2" /> Edit
              </Button>
              <Button variant="destructive" size="sm" @click="handleDelete">
                <Trash2 class="h-4 w-4 mr-2" /> Delete
              </Button>
            </div>
          </CardHeader>
          <CardContent class="space-y-6">
            <div>
              <h4 class="text-sm font-semibold text-foreground mb-2">Background</h4>
              <p class="text-sm text-muted-foreground leading-relaxed">
                {{ companyStore.company.background }}
              </p>
            </div>
            <div>
              <h4 class="text-sm font-semibold text-foreground mb-2">Culture & Tags</h4>
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
      <Card v-if="isEditing">
        <CardHeader>
          <CardTitle>{{ editingId ? 'Update' : 'Create' }} Company Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-sm font-medium">Company Name</label>
                <input
                  v-model="form.companyName"
                  required
                  class="w-full border rounded-lg px-4 py-2 bg-background focus:ring-2 focus:ring-primary/50 outline-none"
                  placeholder="e.g. HireFlow Tech"
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium">Industry</label>
                <input
                  v-model="form.industry"
                  required
                  class="w-full border rounded-lg px-4 py-2 bg-background focus:ring-2 focus:ring-primary/50 outline-none"
                  placeholder="e.g. IT, Healthcare"
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium">Location</label>
                <input
                  v-model="form.location"
                  required
                  class="w-full border rounded-lg px-4 py-2 bg-background focus:ring-2 focus:ring-primary/50 outline-none"
                  placeholder="e.g. Colombo, Sri Lanka"
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium">Website URL</label>
                <input
                  v-model="form.website"
                  required
                  type="url"
                  class="w-full border rounded-lg px-4 py-2 bg-background focus:ring-2 focus:ring-primary/50 outline-none"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium">Company Background</label>
              <textarea
                v-model="form.background"
                required
                rows="4"
                class="w-full border rounded-lg px-4 py-2 bg-background focus:ring-2 focus:ring-primary/50 outline-none resize-none"
                placeholder="Describe your company..."
              ></textarea>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium">Culture Tags (Comma separated)</label>
              <input
                v-model="cultureTagsInput"
                class="w-full border rounded-lg px-4 py-2 bg-background focus:ring-2 focus:ring-primary/50 outline-none"
                placeholder="Remote-First, High-Growth, Inclusive"
              />
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium">Company Logo</label>
              <div class="mt-1 flex items-center gap-4">
                <div
                  v-if="logoPreview || (companyStore.company?.logoUrl && !logoFile)"
                  class="h-16 w-16 rounded border overflow-hidden shrink-0"
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
              <Button type="submit" :disabled="loading">
                <Loader2 v-if="loading" class="h-4 w-4 mr-2 animate-spin" />
                {{ editingId ? 'Update Profile' : 'Create Profile' }}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </AppShell>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCompanyStore } from '@/stores/company'
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
import { toast } from 'vue-sonner'

const authStore = useAuthStore()
const companyStore = useCompanyStore()

const isEditing = ref(false)
const editingId = ref<number | null>(null)
const loading = ref(false)

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
    employeeId: String(authStore.userId), // Backend expects UUID string
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

async function handleDelete() {
  if (!companyStore.company || !confirm('Are you sure you want to delete your company profile?'))
    return

  try {
    await companyStore.deleteCompany(companyStore.company.id)
    toast.success('Company profile deleted')
  } catch {
    toast.error('Failed to delete profile')
  }
}
</script>
