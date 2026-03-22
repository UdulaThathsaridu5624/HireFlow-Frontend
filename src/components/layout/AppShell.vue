<template>
  <TooltipProvider :delay-duration="0">
    <SidebarProvider :open="sidebarOpen" @update:open="sidebarOpen = $event">
      <AppSidebar />
      <SidebarInset>
        <header class="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 px-4 glass-surface editorial-shadow">
          <SidebarTrigger class="-ml-1 text-foreground hover:text-primary transition-colors" />
          <div class="hidden sm:block text-sm font-medium text-muted-foreground">
            {{ authStore.isEmployer ? 'Employer' : 'Candidate' }} Portal
          </div>
          <div class="ml-auto flex items-center gap-2">
            <ModeToggle />
            <Avatar class="h-8 w-8 rounded-full shrink-0 cursor-pointer">
              <AvatarFallback
                class="rounded-full bg-primary/10 text-primary text-xs font-semibold"
              >
                {{ initials }}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main class="flex-1 p-6 md:p-8 lg:p-12 overflow-auto bg-background min-h-[calc(100vh-3.5rem)]">
          <div class="max-w-screen-xl mx-auto">
            <slot />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  </TooltipProvider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { TooltipProvider } from 'reka-ui'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuthStore } from '@/stores/auth'
import AppSidebar from './AppSidebar.vue'
import ModeToggle from '@/components/ModeToggle.vue'

const sidebarOpen = useLocalStorage('sidebar_open', true)
const authStore = useAuthStore()

const initials = computed(() =>
  authStore.name
    ? authStore.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?',
)
</script>
