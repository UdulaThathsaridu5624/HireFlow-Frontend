<template>
  <div class="flex flex-col gap-5 py-2">

    <!-- Title -->
    <div class="flex flex-col gap-1.5">
      <label class="text-sm font-medium text-foreground">Job Title <span class="text-destructive">*</span></label>
      <input
        v-model="form.title"
        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        placeholder="e.g. Senior Backend Engineer"
      />
      <p v-if="errors.title" class="text-xs text-destructive">{{ errors.title }}</p>
    </div>

    <!-- Description -->
    <div class="flex flex-col gap-1.5">
      <label class="text-sm font-medium text-foreground">Description <span class="text-destructive">*</span></label>
      <textarea
        v-model="form.description"
        rows="4"
        class="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
        placeholder="Describe the role, responsibilities and requirements..."
      />
      <p v-if="errors.description" class="text-xs text-destructive">{{ errors.description }}</p>
    </div>

    <!-- Required Skills -->
    <div class="flex flex-col gap-1.5">
      <label class="text-sm font-medium text-foreground">Required Skills <span class="text-destructive">*</span></label>
      <div class="flex gap-2">
        <input
          v-model="skillInput"
          class="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="e.g. Node.js"
          @keydown.enter.prevent="addSkill"
        />
        <Button type="button" variant="outline" size="sm" @click="addSkill">Add</Button>
      </div>
      <div class="flex flex-wrap gap-1.5 mt-1">
        <Badge
          v-for="skill in form.requiredSkills"
          :key="skill"
          variant="secondary"
          class="cursor-pointer text-xs"
          @click="removeSkill(skill)"
        >
          {{ skill }} <X class="h-3 w-3 ml-1" />
        </Badge>
      </div>
      <p v-if="errors.requiredSkills" class="text-xs text-destructive">{{ errors.requiredSkills }}</p>
    </div>

    <!-- Location + Remote -->
    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium text-foreground">Location <span class="text-destructive">*</span></label>
        <input
          v-model="form.location"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="e.g. Colombo, Sri Lanka"
        />
        <p v-if="errors.location" class="text-xs text-destructive">{{ errors.location }}</p>
      </div>
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium text-foreground">Work Type</label>
        <div class="flex items-center gap-3 h-10">
          <input id="remote" v-model="form.isRemote" type="checkbox" class="h-4 w-4 accent-primary" />
          <label for="remote" class="text-sm text-foreground cursor-pointer">Remote / Hybrid</label>
        </div>
      </div>
    </div>

    <!-- Salary -->
    <div class="grid grid-cols-3 gap-4">
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium text-foreground">Min Salary</label>
        <input
          v-model.number="form.salaryMin"
          type="number"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="80000"
        />
      </div>
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium text-foreground">Max Salary</label>
        <input
          v-model.number="form.salaryMax"
          type="number"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="120000"
        />
      </div>
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium text-foreground">Currency</label>
        <select
          v-model="form.salaryCurrency"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="USD">USD</option>
          <option value="LKR">LKR</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
      </div>
    </div>

    <!-- Deadline -->
    <div class="flex flex-col gap-1.5">
      <label class="text-sm font-medium text-foreground">Application Deadline <span class="text-destructive">*</span></label>
      <input
        v-model="form.deadline"
        type="date"
        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [color-scheme:light] dark:[color-scheme:dark]"
      />
      <p v-if="errors.deadline" class="text-xs text-destructive">{{ errors.deadline }}</p>
    </div>

    <!-- Actions -->
    <div class="flex justify-end gap-3 pt-2 border-t border-border">
      <Button type="button" variant="outline" @click="$emit('cancel')">Cancel</Button>
      <Button type="button" :disabled="loading" @click="handleSubmit">
        <Loader2 v-if="loading" class="h-4 w-4 mr-2 animate-spin" />
        {{ initial ? 'Save Changes' : 'Post Job' }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { X, Loader2 } from 'lucide-vue-next'
import type { Job } from '@/services/jobApi'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const props = defineProps<{
  initial?: Job | null
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', payload: any): void
  (e: 'cancel'): void
}>()

const skillInput = ref('')
const errors = ref<Record<string, string>>({})

const form = ref({
  title: '',
  description: '',
  requiredSkills: [] as string[],
  location: '',
  isRemote: false,
  salaryMin: undefined as number | undefined,
  salaryMax: undefined as number | undefined,
  salaryCurrency: 'USD',
  deadline: '',
})

watch(() => props.initial, (job) => {
  if (job) {
    form.value = {
      title: job.title,
      description: job.description,
      requiredSkills: [...job.requiredSkills],
      location: job.location,
      isRemote: job.isRemote,
      salaryMin: job.salaryMin ?? undefined,
      salaryMax: job.salaryMax ?? undefined,
      salaryCurrency: job.salaryCurrency ?? 'USD',
      deadline: job.deadline ? job.deadline.split('T')[0] : '',
    }
  }
}, { immediate: true })

function addSkill() {
  const s = skillInput.value.trim()
  if (s && !form.value.requiredSkills.includes(s)) {
    form.value.requiredSkills.push(s)
  }
  skillInput.value = ''
}

function removeSkill(skill: string) {
  form.value.requiredSkills = form.value.requiredSkills.filter((s) => s !== skill)
}

function validate() {
  errors.value = {}
  if (!form.value.title.trim()) errors.value.title = 'Title is required'
  if (!form.value.description.trim()) errors.value.description = 'Description is required'
  if (!form.value.location.trim()) errors.value.location = 'Location is required'
  if (!form.value.deadline) errors.value.deadline = 'Deadline is required'
  if (form.value.requiredSkills.length === 0) errors.value.requiredSkills = 'Add at least one skill'
  return Object.keys(errors.value).length === 0
}

function handleSubmit() {
  if (!validate()) return
  emit('submit', {
    ...form.value,
    deadline: new Date(form.value.deadline).toISOString(),
  })
}
</script>