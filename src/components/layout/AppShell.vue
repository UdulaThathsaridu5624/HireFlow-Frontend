<template>
  <SidebarProvider :open="sidebarOpen" @update:open="sidebarOpen = $event">
    <AppSidebar />
    <SidebarInset>
      <header class="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
        <SidebarTrigger class="-ml-1 text-foreground" />
        <ModeToggle class="ml-auto" />
      </header>
      <main class="flex-1 p-8 overflow-auto bg-muted/30 min-h-[calc(100vh-3.5rem)]">
        <slot />
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import AppSidebar from './AppSidebar.vue'
import ModeToggle from '@/components/ModeToggle.vue'

// useLocalStorage persists across AppShell remounts (route changes) within the same session
const sidebarOpen = useLocalStorage('sidebar_open', true)
</script>
