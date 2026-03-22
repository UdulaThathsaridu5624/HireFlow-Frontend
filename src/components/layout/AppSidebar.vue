<template>
  <Sidebar collapsible="icon">
    <SidebarHeader>
      <div class="flex flex-col gap-0.5 px-2 py-2">
        <span class="font-headline text-lg font-extrabold tracking-tight text-primary group-data-[collapsible=icon]:hidden">
          HireFlow
        </span>
        <span class="text-[11px] text-muted-foreground group-data-[collapsible=icon]:hidden">
          {{ authStore.isEmployer ? 'Employer Portal' : 'Job Seeker' }}
        </span>
      </div>
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in navItems" :key="item.to">
              <SidebarMenuButton
                as-child
                :is-active="isActive(item.to)"
                :tooltip="item.label"
                class="transition-transform duration-200 hover:translate-x-0.5"
              >
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
        <!-- CTA Button -->
        <SidebarMenuItem class="group-data-[collapsible=icon]:hidden">
          <button
            class="w-full gradient-cta py-2.5 rounded-lg text-sm font-semibold transition-opacity active:opacity-80 mb-2"
            @click="handleCtaClick"
          >
            {{ authStore.isEmployer ? 'Post New Job' : 'Complete CV' }}
          </button>
        </SidebarMenuItem>

        <!-- User Profile -->
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <SidebarMenuButton
                size="lg"
                class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar class="h-8 w-8 rounded-lg shrink-0">
                  <AvatarFallback
                    class="rounded-lg bg-primary/10 text-primary text-xs font-semibold"
                  >
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
              <DropdownMenuItem class="text-destructive cursor-pointer" @click="handleLogout">
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
import {
  LayoutDashboard,
  Search,
  Users,
  Calendar,
  Building2,
  FileText,
  ChevronsUpDown,
  LogOut,
  Briefcase,
  User,
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { ROUTES } from '@/constants'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
    ? authStore.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?',
)

const employerNav = [
  { to: ROUTES.EMPLOYER_DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { to: ROUTES.EMPLOYER_JOBS, label: 'Jobs', icon: Briefcase },
  { to: ROUTES.EMPLOYER_PIPELINES, label: 'Pipelines', icon: Users },
  { to: ROUTES.EMPLOYER_INTERVIEWS, label: 'Interviews', icon: Calendar },
  { to: ROUTES.EMPLOYER_COMPANY, label: 'Company', icon: Building2 },
]

const candidateNav = [
  { to: ROUTES.CANDIDATE_DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { to: ROUTES.CANDIDATE_JOBS, label: 'Discover Jobs', icon: Search },
  { to: ROUTES.CANDIDATE_PIPELINE, label: 'My Applications', icon: FileText },
  { to: ROUTES.CANDIDATE_INTERVIEWS, label: 'Interviews', icon: Calendar },
  { to: ROUTES.CANDIDATE_CV_PROFILE, label: 'CV Profile', icon: User },
  { to: ROUTES.CANDIDATE_COMPANIES, label: 'Companies', icon: Building2 },
]

const navItems = computed(() => (authStore.isEmployer ? employerNav : candidateNav))

function isActive(path: string) {
  return route.path === path || route.path.startsWith(path + '/')
}

function handleCtaClick() {
  if (authStore.isEmployer) {
    router.push(ROUTES.EMPLOYER_JOBS)
  } else {
    router.push(ROUTES.CANDIDATE_CV_PROFILE)
  }
}

async function handleLogout() {
  await authStore.logout()
  router.push(ROUTES.LOGIN)
}
</script>
