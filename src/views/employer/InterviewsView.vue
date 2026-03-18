<template>
  <AppShell>
    <div class="flex flex-col gap-6">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Interviews</h1>
        <p class="text-muted-foreground text-sm mt-1">All scheduled interviews across your job postings.</p>
      </div>

      <Tabs v-model="activeTab">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value="all" class="mt-4">
          <InterviewTable :interviews="filtered('all')" @cancel="handleCancel" />
        </TabsContent>
        <TabsContent value="upcoming" class="mt-4">
          <InterviewTable :interviews="filtered('upcoming')" @cancel="handleCancel" />
        </TabsContent>
        <TabsContent value="completed" class="mt-4">
          <InterviewTable :interviews="filtered('completed')" @cancel="handleCancel" />
        </TabsContent>
        <TabsContent value="cancelled" class="mt-4">
          <InterviewTable :interviews="filtered('cancelled')" @cancel="handleCancel" />
        </TabsContent>
      </Tabs>
    </div>
  </AppShell>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useInterviewStore } from '@/stores/interview'
import { InterviewStatus } from '@/constants'
import type { Interview } from '@/types/interview'
import { toast } from 'vue-sonner'
import AppShell from '@/components/layout/AppShell.vue'
import InterviewTable from '@/components/interview/InterviewTable.vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const interviewStore = useInterviewStore()
const activeTab = ref('all')

onMounted(() => interviewStore.fetchForEmployer())

function filtered(tab: string): Interview[] {
  switch (tab) {
    case 'upcoming':
      return interviewStore.interviews.filter(
        (i) => i.status === InterviewStatus.SCHEDULED || i.status === InterviewStatus.ACCEPTED,
      )
    case 'completed':
      return interviewStore.interviews.filter((i) => i.status === InterviewStatus.COMPLETED)
    case 'cancelled':
      return interviewStore.interviews.filter(
        (i) => i.status === InterviewStatus.CANCELLED || i.status === InterviewStatus.DECLINED,
      )
    default:
      return interviewStore.interviews
  }
}

async function handleCancel(id: string) {
  try {
    await interviewStore.cancel(id)
    toast.success('Interview cancelled')
  } catch {
    toast.error('Failed to cancel interview')
  }
}
</script>
