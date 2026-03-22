<template>
  <AppShell>
    <div class="flex flex-col gap-6 max-w-5xl">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="font-headline text-2xl font-extrabold text-foreground">My CV Profile</h1>
          <p class="text-muted-foreground text-sm mt-1">
            {{ isEditing ? 'Edit your CV information' : 'Your CV profile' }}
          </p>
        </div>
        <Button
          v-if="cvStore.profile && !isEditing"
          @click="startEdit"
          class="gap-2"
        >
          <Pencil class="h-4 w-4" /> Edit Profile
        </Button>
      </div>

      <div v-if="!initialized || cvStore.loading" class="flex items-center justify-center py-16 text-muted-foreground/60">
        <Loader2 class="h-6 w-6 animate-spin mr-2" /> Loading profile...
      </div>

      <!-- Display Mode -->
      <template v-else-if="cvStore.profile && !isEditing">
        <div class="flex flex-col gap-6">
          <!-- Basic Info Card -->
          <Card class="editorial-shadow">
            <CardHeader>
              <CardTitle class="font-headline">Basic Information</CardTitle>
            </CardHeader>
            <CardContent class="flex flex-col gap-4">
              <div>
                <p class="text-xs font-semibold text-muted-foreground uppercase">Full Name</p>
                <p class="text-sm text-foreground mt-1">{{ cvStore.profile.fullName || '-' }}</p>
              </div>
              <div>
                <p class="text-xs font-semibold text-muted-foreground uppercase">Bio</p>
                <p class="text-sm text-foreground mt-1 whitespace-pre-wrap">{{ cvStore.profile.bio || '-' }}</p>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-xs font-semibold text-muted-foreground uppercase">Location</p>
                  <p class="text-sm text-foreground mt-1">{{ cvStore.profile.location || '-' }}</p>
                </div>
                <div>
                  <p class="text-xs font-semibold text-muted-foreground uppercase">LinkedIn</p>
                  <p class="text-sm text-foreground mt-1">
                    <a
                      v-if="cvStore.profile.linkedinUrl"
                      :href="cvStore.profile.linkedinUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-primary hover:underline"
                    >
                      {{ cvStore.profile.linkedinUrl }}
                    </a>
                    <span v-else>-</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Skills Card -->
          <Card v-if="cvStore.profile.skills?.length" class="editorial-shadow">
            <CardHeader>
              <CardTitle class="font-headline">Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="flex flex-col gap-3">
                <div
                  v-for="(skill, idx) in cvStore.profile.skills"
                  :key="`skill-display-${idx}`"
                  class="flex items-start justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <p class="font-medium text-foreground">{{ skill.name }}</p>
                    <p class="text-sm text-muted-foreground">{{ formatProficiency(skill.proficiencyLevel) }}</p>
                  </div>
                  <p class="text-sm text-muted-foreground">{{ formatYears(skill.yearsExperience) }}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Education Card -->
          <Card v-if="cvStore.profile.education?.length" class="editorial-shadow">
            <CardHeader>
              <CardTitle class="font-headline">Education</CardTitle>
            </CardHeader>
            <CardContent class="flex flex-col gap-4">
              <div
                v-for="(edu, idx) in cvStore.profile.education"
                :key="`edu-display-${idx}`"
                class="pb-4 border-b last:pb-0 last:border-b-0"
              >
                <p class="font-medium text-foreground">{{ edu.degree }} in {{ edu.fieldOfStudy }}</p>
                <p class="text-sm text-muted-foreground">{{ edu.institutionName }}</p>
                <p class="text-xs text-muted-foreground mt-1">
                  {{ formatDate(edu.startDate) }} - {{ edu.endDate ? formatDate(edu.endDate) : 'Present' }}
                </p>
                <p v-if="edu.grade" class="text-sm text-muted-foreground mt-1">Grade: {{ edu.grade }}</p>
                <p v-if="edu.description" class="text-sm text-foreground mt-2 whitespace-pre-wrap">
                  {{ edu.description }}
                </p>
              </div>
            </CardContent>
          </Card>

          <!-- Work Experience Card -->
          <Card v-if="cvStore.profile.workExperience?.length" class="editorial-shadow">
            <CardHeader>
              <CardTitle class="font-headline">Work Experience</CardTitle>
            </CardHeader>
            <CardContent class="flex flex-col gap-4">
              <div
                v-for="(exp, idx) in cvStore.profile.workExperience"
                :key="`exp-display-${idx}`"
                class="pb-4 border-b last:pb-0 last:border-b-0"
              >
                <p class="font-medium text-foreground">{{ exp.jobTitle }}</p>
                <p class="text-sm text-muted-foreground">{{ exp.companyName }}</p>
                <p class="text-xs text-muted-foreground mt-1">
                  {{ formatDate(exp.startDate) }} - {{ exp.currentlyWorking ? 'Present' : formatDate(exp.endDate) }}
                </p>
                <p v-if="exp.description" class="text-sm text-foreground mt-2 whitespace-pre-wrap">
                  {{ exp.description }}
                </p>
              </div>
            </CardContent>
          </Card>

          <!-- Resumes Card -->
          <Card v-if="cvStore.profile.resumes?.length" class="editorial-shadow">
            <CardHeader>
              <CardTitle class="font-headline">Resumes</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="flex flex-col gap-2">
                <div
                  v-for="(resume, idx) in cvStore.profile.resumes"
                  :key="`resume-display-${idx}`"
                  class="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <p class="font-medium text-foreground">{{ resume.fileName }}</p>
                    <p class="text-xs text-muted-foreground">
                      {{ resume.isDefault ? '(Default)' : '' }}
                    </p>
                  </div>
                  <a
                    :href="resume.fileUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-primary hover:underline text-sm"
                  >
                    View
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </template>

      <!-- Edit Form Mode -->
      <Card v-else class="editorial-shadow">
        <CardContent class="pt-6">
          <form class="flex flex-col gap-8" @submit.prevent="handleSave">
            <section class="flex flex-col gap-4">
              <h2 class="font-headline text-lg font-semibold text-foreground">Personal Information</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex flex-col gap-2 md:col-span-2">
                  <label class="text-sm font-medium">Full Name</label>
                  <Input
                    v-model="form.fullName"
                    placeholder="e.g. John Smith"
                  />
                </div>
                <div class="flex flex-col gap-2 md:col-span-2">
                  <label class="text-sm font-medium">Bio</label>
                  <Textarea
                    v-model="form.bio"
                    rows="4"
                    placeholder="Tell employers about yourself"
                  />
                </div>
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium">Location</label>
                  <Input
                    v-model="form.location"
                    placeholder="e.g. Colombo, Sri Lanka"
                  />
                </div>
                <div class="flex flex-col gap-2">
                  <label class="text-sm font-medium">LinkedIn URL</label>
                  <Input
                    v-model="form.linkedinUrl"
                    type="url"
                    placeholder="https://linkedin.com/in/your-profile"
                  />
                </div>
              </div>
            </section>

            <section class="flex flex-col gap-4 py-6">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-foreground pb-6">Skills</h2>
                <Button type="button" variant="outline" size="sm" @click="addSkill">
                  <Plus class="h-4 w-4 mr-1" /> Add Skill
                </Button>
              </div>

              <div v-if="!form.skills.length" class="text-sm text-muted-foreground">No skills added.</div>

              <div class="flex flex-col gap-4 pb-6">
                  <div
                    v-for="(skill, index) in form.skills"
                    :key="`skill-${index}`"
                    class="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-lg border p-4"
                  >
                    <div class="flex flex-col gap-2">
                      <label class="text-xs font-medium text-muted-foreground">Skill</label>
                      <Input
                        v-model="skill.name"
                        placeholder="Java, Vue, SQL"
                      />
                    </div>
                    <div class="flex flex-col gap-2">
                      <label class="text-xs font-medium text-muted-foreground">Proficiency</label>
                      <Select v-model="skill.proficiencyLevel">
                        <SelectTrigger class="w-full">
                          <SelectValue placeholder="Select proficiency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BEGINNER">Beginner</SelectItem>
                          <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                          <SelectItem value="ADVANCED">Advanced</SelectItem>
                          <SelectItem value="EXPERT">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div class="flex flex-col gap-2">
                      <label class="text-xs font-medium text-muted-foreground">Years Experience</label>
                      <div class="flex gap-2">
                        <Input
                          :model-value="skill.yearsExperience ?? undefined"
                          type="number"
                          min="0"
                          placeholder="0"
                          @update:model-value="skill.yearsExperience = $event ? Number($event) : null"
                        />
                        <Button type="button" variant="ghost" size="icon" @click="removeSkill(index)">
                          <Trash2 class="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
              </div>
            </section>

            <section class="flex flex-col gap-4 py-6">
              <div class="flex items-center justify-between pb-4">
                <h2 class="font-headline text-lg font-semibold text-foreground">Education</h2>
                <Button type="button" variant="outline" size="sm" @click="addEducation">
                  <Plus class="h-4 w-4 mr-1" /> Add Education
                </Button>
              </div>

              <div v-if="!form.education.length" class="text-sm text-muted-foreground">No education added.</div>

              <div
                v-for="(education, index) in form.education"
                :key="`education-${index}`"
                class="rounded-lg border p-4 flex flex-col gap-3"
              >
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pb-6">
                  <Input
                    v-model="education.institutionName"
                    placeholder="Institution"
                  />
                  <Input
                    v-model="education.degree"
                    placeholder="Degree"
                  />
                  <Input
                    v-model="education.fieldOfStudy"
                    placeholder="Field of study"
                  />
                  <Input
                    v-model="education.grade"
                    placeholder="Grade"
                  />
                  <div class="flex flex-col gap-2">
                    <label class="text-xs font-medium text-muted-foreground">Start Date</label>
                    <VueDatePicker
                      v-model="education.startDate"
                      :dark="isDarkMode"
                      model-type="yyyy-MM-dd"
                      format="yyyy-MM-dd"
                      :enable-time-picker="false"
                      auto-apply
                      placeholder="Select start date"
                    />
                  </div>
                  <div class="flex flex-col gap-2">
                    <label class="text-xs font-medium text-muted-foreground">End Date</label>
                    <VueDatePicker
                      v-model="education.endDate"
                      :dark="isDarkMode"
                      model-type="yyyy-MM-dd"
                      format="yyyy-MM-dd"
                      :enable-time-picker="false"
                      auto-apply
                      placeholder="Select end date"
                    />
                  </div>
                </div>
                <Textarea
                  v-model="education.description"
                  rows="3"
                  placeholder="Description"
                />
                <div class="flex justify-end">
                  <Button type="button" variant="ghost" size="sm" @click="removeEducation(index)">
                    <Trash2 class="h-4 w-4 mr-1 text-destructive" /> Remove
                  </Button>
                </div>
              </div>
            </section>

            <section class="flex flex-col gap-4 py-6">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-foreground pb-6">Work Experience</h2>
                <Button type="button" variant="outline" size="sm" @click="addWorkExperience">
                  <Plus class="h-4 w-4 mr-1" /> Add Experience
                </Button>
              </div>

              <div v-if="!form.workExperience.length" class="text-sm text-muted-foreground">
                No work experience added.
              </div>

              <div
                v-for="(experience, index) in form.workExperience"
                :key="`experience-${index}`"
                class="rounded-lg border p-4 flex flex-col gap-3"
              >
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    v-model="experience.companyName"
                    placeholder="Company"
                  />
                  <Input
                    v-model="experience.jobTitle"
                    placeholder="Job title"
                  />
                  <div class="flex flex-col gap-2">
                    <label class="text-xs font-medium text-muted-foreground">Start Date</label>
                    <VueDatePicker
                      v-model="experience.startDate"
                      :dark="isDarkMode"
                      model-type="yyyy-MM-dd"
                      format="yyyy-MM-dd"
                      :enable-time-picker="false"
                      auto-apply
                      placeholder="Select start date"
                    />
                  </div>
                  <div class="flex flex-col gap-2">
                    <label class="text-xs font-medium text-muted-foreground">End Date</label>
                    <VueDatePicker
                      v-model="experience.endDate"
                      :dark="isDarkMode"
                      model-type="yyyy-MM-dd"
                      format="yyyy-MM-dd"
                      :enable-time-picker="false"
                      auto-apply
                      :disabled="experience.currentlyWorking"
                      placeholder="Select end date"
                    />
                  </div>
                </div>
                <label class="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <input v-model="experience.currentlyWorking" type="checkbox" class="rounded border" />
                  I currently work here
                </label>
                <Textarea
                  v-model="experience.description"
                  rows="3"
                  placeholder="Responsibilities and achievements"
                />
                <div class="flex justify-end">
                  <Button type="button" variant="ghost" size="sm" @click="removeWorkExperience(index)">
                    <Trash2 class="h-4 w-4 mr-1 text-destructive" /> Remove
                  </Button>
                </div>
              </div>
            </section>

            <section class="flex flex-col gap-4">
              <div class="flex items-center justify-between pb-4">
                <h2 class="font-headline text-lg font-semibold text-foreground">Resumes</h2>
                <div class="flex items-center gap-2">
                  <Button type="button" variant="outline" size="sm" @click="addResume">
                    <Plus class="h-4 w-4 mr-1" /> Add Resume Link
                  </Button>
                </div>
              </div>

              <div class="rounded-lg border p-4 flex flex-col gap-3">
                <p class="text-sm font-medium text-foreground">Upload Resume (PDF)</p>
                <div class="flex flex-col md:flex-row md:items-center gap-3">
                  <input
                    type="file"
                    accept="application/pdf"
                    @change="onResumeFileChange"
                    class="text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    :disabled="!resumeFile || uploadingResume"
                    @click="uploadSelectedResume"
                  >
                    <Loader2 v-if="uploadingResume" class="h-4 w-4 mr-2 animate-spin" />
                    <Upload v-else class="h-4 w-4 mr-2" />
                    Upload PDF
                  </Button>
                </div>
                <p class="text-xs text-muted-foreground">
                  Upload will generate a resume URL and add it below.
                </p>
              </div>

              <div v-if="!form.resumes.length" class="text-sm text-muted-foreground">No resumes added.</div>

              <div
                v-for="(resume, index) in form.resumes"
                :key="`resume-${index}`"
                class="rounded-lg border p-4 flex flex-col gap-3"
              >
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    v-model="resume.fileName"
                    placeholder="Resume name"
                  />
                  <Input
                    v-model="resume.fileUrl"
                    type="url"
                    placeholder="https://..."
                  />
                </div>
                <div class="flex items-center justify-between">
                  <label class="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <input
                      :checked="resume.isDefault"
                      type="checkbox"
                      class="rounded border"
                      @change="setDefaultResume(index)"
                    />
                    Set as default resume
                  </label>
                  <Button type="button" variant="ghost" size="sm" @click="removeResume(index)">
                    <Trash2 class="h-4 w-4 mr-1 text-destructive" /> Remove
                  </Button>
                </div>
              </div>
            </section>

            <div class="flex justify-end gap-3 pt-6 border-t">
              <Button type="button" variant="outline" :disabled="cvStore.saving" @click="cancelEdit">
                Cancel
              </Button>
              <Button type="submit" :disabled="cvStore.saving">
                <Loader2 v-if="cvStore.saving" class="h-4 w-4 mr-2 animate-spin" />
                Save CV Profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </AppShell>
</template>

<script setup lang="ts">
import { computed, reactive, onMounted, ref } from 'vue'
import { Loader2, Plus, Trash2, Pencil, Upload } from 'lucide-vue-next'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { useColorMode } from '@vueuse/core'
import { toast } from 'vue-sonner'
import AppShell from '@/components/layout/AppShell.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCvStore } from '@/stores/cv'
import type {
  CandidateProfilePayload,
  CandidateProfileResponse,
  EducationRequest,
  ResumeRequest,
  SkillRequest,
  WorkExperienceRequest,
} from '@/types/cv'

const cvStore = useCvStore()
const mode = useColorMode()
const isEditing = ref(false)
const initialized = ref(false)
const isDarkMode = computed(() => mode.value === 'dark')
const resumeFile = ref<File | null>(null)
const uploadingResume = ref(false)

const form = reactive<CandidateProfilePayload>({
  fullName: '',
  bio: '',
  location: '',
  linkedinUrl: '',
  skills: [],
  education: [],
  workExperience: [],
  resumes: [],
})

onMounted(() => {
  loadProfile()
})

async function loadProfile() {
  initialized.value = false
  try {
    const profile = await cvStore.fetchMyProfile()
    if (profile) {
      mapToForm(profile)
      isEditing.value = false
    } else {
      resetForm()
      isEditing.value = true
    }
  } catch {
    isEditing.value = false
    toast.error('Failed to load CV profile')
  } finally {
    initialized.value = true
  }
}

function startEdit() {
  isEditing.value = true
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-'
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
  } catch {
    return dateStr
  }
}

function formatProficiency(value: string): string {
  if (!value) return '-'
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function formatYears(value: number | null): string {
  if (value === null || value === undefined) return '-'
  return `${value} ${value === 1 ? 'year' : 'years'}`
}

function resetForm() {
  form.fullName = ''
  form.bio = ''
  form.location = ''
  form.linkedinUrl = ''
  form.skills = []
  form.education = []
  form.workExperience = []
  form.resumes = []
}

function mapToForm(profile: CandidateProfileResponse) {
  form.fullName = profile.fullName ?? ''
  form.bio = profile.bio ?? ''
  form.location = profile.location ?? ''
  form.linkedinUrl = profile.linkedinUrl ?? ''
  form.skills = (profile.skills ?? []).map((skill) => ({
    name: skill.name ?? '',
    proficiencyLevel: skill.proficiencyLevel ?? '',
    yearsExperience: skill.yearsExperience ?? null,
  }))
  form.education = (profile.education ?? []).map((education) => ({
    institutionName: education.institutionName ?? '',
    degree: education.degree ?? '',
    fieldOfStudy: education.fieldOfStudy ?? '',
    startDate: education.startDate ?? null,
    endDate: education.endDate ?? null,
    grade: education.grade ?? '',
    description: education.description ?? '',
  }))
  form.workExperience = (profile.workExperience ?? []).map((experience) => ({
    companyName: experience.companyName ?? '',
    jobTitle: experience.jobTitle ?? '',
    startDate: experience.startDate ?? null,
    endDate: experience.endDate ?? null,
    currentlyWorking: Boolean(experience.currentlyWorking),
    description: experience.description ?? '',
  }))
  form.resumes = (profile.resumes ?? []).map((resume) => ({
    fileName: resume.fileName ?? '',
    fileUrl: resume.fileUrl ?? '',
    isDefault: Boolean(resume.isDefault),
  }))
}

function addSkill() {
  form.skills.push(emptySkill())
}

function removeSkill(index: number) {
  form.skills.splice(index, 1)
}

function addEducation() {
  form.education.push(emptyEducation())
}

function removeEducation(index: number) {
  form.education.splice(index, 1)
}

function addWorkExperience() {
  form.workExperience.push(emptyWorkExperience())
}

function removeWorkExperience(index: number) {
  form.workExperience.splice(index, 1)
}

function addResume() {
  form.resumes.push(emptyResume())
}

function removeResume(index: number) {
  form.resumes.splice(index, 1)
}

function onResumeFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    resumeFile.value = target.files[0]
  }
}

async function uploadSelectedResume() {
  if (!resumeFile.value) {
    toast.error('Please select a PDF file first')
    return
  }

  uploadingResume.value = true
  try {
    const isDefault = form.resumes.length === 0
    const uploaded = await cvStore.uploadResume(resumeFile.value, isDefault)

    form.resumes.push({
      fileName: uploaded.fileName,
      fileUrl: uploaded.fileUrl,
      isDefault,
    })

    resumeFile.value = null
    toast.success('Resume uploaded')
  } catch {
    toast.error('Failed to upload resume')
  } finally {
    uploadingResume.value = false
  }
}

function setDefaultResume(index: number) {
  form.resumes = form.resumes.map((resume, i) => ({
    ...resume,
    isDefault: i === index,
  }))
}

async function handleSave() {
  try {
    await cvStore.upsertProfile(toPayload())
    toast.success('CV profile saved successfully')
    await loadProfile()
  } catch {
    toast.error('Failed to save CV profile')
  }
}

function cancelEdit() {
  if (cvStore.profile) {
    isEditing.value = false
  }
}

function toPayload(): CandidateProfilePayload {
  return {
    fullName: form.fullName.trim(),
    bio: form.bio.trim(),
    location: form.location.trim(),
    linkedinUrl: form.linkedinUrl.trim(),
    skills: form.skills
      .filter((skill) => skill.name.trim() || skill.proficiencyLevel.trim() || skill.yearsExperience !== null)
      .map((skill) => ({
        name: skill.name.trim(),
        proficiencyLevel: skill.proficiencyLevel.trim(),
        yearsExperience: toNumberOrNull(skill.yearsExperience),
      })),
    education: form.education
      .filter(
        (entry) =>
          entry.institutionName.trim() ||
          entry.degree.trim() ||
          entry.fieldOfStudy.trim() ||
          Boolean(entry.startDate) ||
          Boolean(entry.endDate) ||
          entry.grade.trim() ||
          entry.description.trim(),
      )
      .map((entry) => ({
        institutionName: entry.institutionName.trim(),
        degree: entry.degree.trim(),
        fieldOfStudy: entry.fieldOfStudy.trim(),
        startDate: toDateOrNull(entry.startDate),
        endDate: toDateOrNull(entry.endDate),
        grade: entry.grade.trim(),
        description: entry.description.trim(),
      })),
    workExperience: form.workExperience
      .filter(
        (entry) =>
          entry.companyName.trim() ||
          entry.jobTitle.trim() ||
          Boolean(entry.startDate) ||
          Boolean(entry.endDate) ||
          entry.currentlyWorking ||
          entry.description.trim(),
      )
      .map((entry) => ({
        companyName: entry.companyName.trim(),
        jobTitle: entry.jobTitle.trim(),
        startDate: toDateOrNull(entry.startDate),
        endDate: entry.currentlyWorking ? null : toDateOrNull(entry.endDate),
        currentlyWorking: entry.currentlyWorking,
        description: entry.description.trim(),
      })),
    resumes: form.resumes
      .filter((resume) => resume.fileName.trim() || resume.fileUrl.trim())
      .map((resume) => ({
        fileName: resume.fileName.trim(),
        fileUrl: resume.fileUrl.trim(),
        isDefault: resume.isDefault,
      })),
  }
}

function toNumberOrNull(value: number | null): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function toDateOrNull(value: string | null): string | null {
  if (!value) return null
  const trimmed = value.trim()
  return trimmed.length ? trimmed : null
}

function emptySkill(): SkillRequest {
  return {
    name: '',
    proficiencyLevel: '',
    yearsExperience: null,
  }
}

function emptyEducation(): EducationRequest {
  return {
    institutionName: '',
    degree: '',
    fieldOfStudy: '',
    startDate: null,
    endDate: null,
    grade: '',
    description: '',
  }
}

function emptyWorkExperience(): WorkExperienceRequest {
  return {
    companyName: '',
    jobTitle: '',
    startDate: null,
    endDate: null,
    currentlyWorking: false,
    description: '',
  }
}

function emptyResume(): ResumeRequest {
  return {
    fileName: '',
    fileUrl: '',
    isDefault: false,
  }
}
</script>
