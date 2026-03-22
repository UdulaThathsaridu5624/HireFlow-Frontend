<template>
  <AppShell>
    <div class="flex flex-col gap-6">
      <div>
        <h1 class="font-headline text-2xl font-extrabold text-foreground">My Interviews</h1>
        <p class="text-muted-foreground text-sm mt-1">View and respond to your scheduled interviews.</p>
      </div>

      <div v-if="interviewStore.loading" class="flex items-center justify-center py-16 text-muted-foreground/60">
        <Loader2 class="h-6 w-6 animate-spin mr-2" /> Loading...
      </div>
      <div v-else-if="!interviewStore.interviews.length" class="py-16 text-center text-muted-foreground/60 text-sm">
        No interviews scheduled yet.
      </div>
      <div v-else class="flex flex-col gap-4">
        <InterviewCard
          v-for="interview in interviewStore.interviews"
          :key="interview.id"
          :interview="interview"
          :show-candidate-actions="true"
          @accept="handleRespond($event, 'ACCEPT')"
          @decline="handleRespond($event, 'DECLINE')"
        />
      </div>
    </div>
  </AppShell>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import { useInterviewStore } from '@/stores/interview'
import { toast } from 'vue-sonner'
import AppShell from '@/components/layout/AppShell.vue'
import InterviewCard from '@/components/interview/InterviewCard.vue'

const interviewStore = useInterviewStore()

onMounted(() => interviewStore.fetchForCandidate())

async function handleRespond(id: string, response: 'ACCEPT' | 'DECLINE') {
  try {
    if (response === 'ACCEPT') {
      await interviewStore.accept(id)
      toast.success('Interview accepted')
    } else {
      await interviewStore.decline(id)
      toast.success('Interview declined')
    }
  } catch {
    toast.error('Failed to respond')
  }
}
</script>
