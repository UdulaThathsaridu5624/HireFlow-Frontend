<template>
  <Sidebar collapsible="icon">
    <SidebarHeader>
      <div class="flex items-center gap-2 px-2 py-1">
        <span class="font-bold text-primary group-data-[collapsible=icon]:hidden">HireFlow</span>
        <Badge variant="outline" class="text-xs group-data-[collapsible=icon]:hidden">
          {{ authStore.isEmployer ? 'Employer' : 'Candidate' }}
        </Badge>
      </div>
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>{{ authStore.isEmployer ? 'Employer' : 'Candidate' }}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in navItems" :key="item.to">
              <SidebarMenuButton as-child :is-active="isActive(item.to)" :tooltip="item.label">
                <RouterLink :to="item.to">
                  <component :is="item.icon" />
                  <span>{{ item.label }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <SidebarMenuButton
                size="lg"
                class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar class="h-8 w-8 rounded-lg shrink-0">
                  <AvatarFallback class="rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                    {{ initials }}
                  </AvatarFallback>
                </Avatar>
                <div class="flex flex-col gap-0.5 text-left text-sm leading-tight overflow-hidden">
                  <span class="font-semibold truncate">{{ authStore.name }}</span>
                  <span class="text-xs text-muted-foreground truncate">
                    {{ authStore.isEmployer ? 'Employer' : 'Candidate' }}
                  </span>
                </div>
                <ChevronsUpDown class="ml-auto h-4 w-4 shrink-0" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="end" class="w-48">
              <DropdownMenuItem class="text-red-500 cursor-pointer" @click="handleLogout">
                <LogOut class="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>

  </Sidebar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { LayoutDashboard, Users, Calendar, TrendingUp, ChevronsUpDown, LogOut, Briefcase } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { ROUTES } from '@/constants'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const initials = computed(() =>
  authStore.name
    ? authStore.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?',
)

const employerNav = [
  { to: ROUTES.EMPLOYER_DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { to: ROUTES.EMPLOYER_JOBS, label: 'Job Listings', icon: Briefcase },   // ← ADD THIS
  { to: ROUTES.EMPLOYER_PIPELINES, label: 'Hiring Pipelines', icon: Users },
  { to: ROUTES.EMPLOYER_INTERVIEWS, label: 'Interviews', icon: Calendar },
]

const candidateNav = [
  { to: ROUTES.CANDIDATE_DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { to: ROUTES.CANDIDATE_JOBS, label: 'Browse Jobs', icon: Briefcase },   // ← ADD THIS
  { to: ROUTES.CANDIDATE_INTERVIEWS, label: 'My Interviews', icon: Calendar },
  { to: ROUTES.CANDIDATE_PIPELINE, label: 'My Applications', icon: TrendingUp },
]

const navItems = computed(() => (authStore.isEmployer ? employerNav : candidateNav))

function isActive(path: string) {
  return route.path === path || route.path.startsWith(path + '/')
}

async function handleLogout() {
  await authStore.logout()
  router.push(ROUTES.LOGIN)
}
</script>
