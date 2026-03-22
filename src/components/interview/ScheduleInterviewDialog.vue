<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot>
        <Button><CalendarPlus class="h-4 w-4 mr-2" />Schedule Interview</Button>
      </slot>
    </DialogTrigger>
    <DialogContent class="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Schedule Interview</DialogTitle>
        <DialogDescription>Fill in the interview details for this candidate.</DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="flex flex-col gap-5 mt-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <Label>Date & Time</Label>
            <VueDatePicker
              v-model="form.scheduledAt"
              :dark="isDarkMode"
              model-type="iso"
              :enable-time-picker="true"
              :time-picker-inline="false"
              auto-apply
              placeholder="Select date & time"
            />
          </div>

          <div class="flex flex-col gap-2">
            <Label for="duration">Duration (minutes)</Label>
            <Input id="duration" type="number" v-model.number="form.durationMinutes" min="15" max="240" required />
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <Label>Format</Label>
          <Select v-model="form.format">
            <SelectTrigger>
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem :value="InterviewFormat.ONLINE">Online</SelectItem>
              <SelectItem :value="InterviewFormat.IN_PERSON">In Person</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div v-if="form.format === InterviewFormat.ONLINE" class="flex flex-col gap-2">
          <Label for="meetingLink">Meeting Link</Label>
          <Input id="meetingLink" type="url" v-model="form.meetingLink" placeholder="https://meet.google.com/..." />
        </div>

        <div class="flex flex-col gap-2">
          <Label for="notes">Notes <span class="text-muted-foreground font-normal">(optional)</span></Label>
          <Textarea id="notes" v-model="form.notes" rows="3" placeholder="Any instructions for the candidate..." />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" @click="open = false">Cancel</Button>
          <Button type="submit" :disabled="submitting">
            <span v-if="submitting">Scheduling...</span>
            <span v-else>Schedule</span>
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { CalendarPlus } from 'lucide-vue-next'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { useColorMode } from '@vueuse/core'
import { InterviewFormat } from '@/constants'
import type { CreateInterviewDto } from '@/types/interview'
import { useInterviewStore } from '@/stores/interview'
import { toast } from 'vue-sonner'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

const props = defineProps<{
  applicationId: string
}>()

const emit = defineEmits<{ scheduled: [] }>()

const open = ref(false)
const submitting = ref(false)
const interviewStore = useInterviewStore()
const colorMode = useColorMode()
const isDarkMode = ref(colorMode.value === 'dark')

const form = reactive({
  scheduledAt: null as string | null,
  durationMinutes: 60,
  format: InterviewFormat.ONLINE,
  meetingLink: '',
  notes: '',
})

async function handleSubmit() {
  if (!form.scheduledAt) {
    toast.error('Please select a date and time')
    return
  }
  submitting.value = true
  try {
    const dto: CreateInterviewDto = {
      applicationId: props.applicationId,
      scheduledAt: new Date(form.scheduledAt).toISOString(),
      durationMinutes: form.durationMinutes,
      format: form.format,
      meetingLink: form.meetingLink || undefined,
      notes: form.notes || undefined,
    }
    await interviewStore.schedule(dto)
    toast.success('Interview scheduled successfully')
    open.value = false
    emit('scheduled')
  } catch {
    toast.error('Failed to schedule interview')
  } finally {
    submitting.value = false
  }
}
</script>
