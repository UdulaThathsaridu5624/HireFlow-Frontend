<template>
  <div class="min-h-screen flex">
    <!-- Left Panel — Branding -->
    <div class="hidden lg:flex lg:w-1/2 gradient-cta relative overflow-hidden flex-col justify-between p-12">
      <div class="relative z-10">
        <h1 class="font-headline text-4xl font-extrabold text-white tracking-tight">HireFlow</h1>
        <p class="text-white/70 text-sm mt-1">Your Career, Curated.</p>
      </div>
      <div class="relative z-10 max-w-md">
        <h2 class="font-headline text-3xl font-bold text-white leading-tight">
          Start your journey<br />with HireFlow today.
        </h2>
        <p class="text-white/60 mt-4 text-sm leading-relaxed">
          Whether you're hiring or seeking, HireFlow gives you the tools to manage the entire process — from posting to offer.
        </p>
      </div>
      <div class="relative z-10 text-white/40 text-xs">
        &copy; {{ new Date().getFullYear() }} HireFlow. All rights reserved.
      </div>
      <div class="absolute right-[-20%] top-[-20%] w-125 h-125 bg-white/5 rounded-full blur-[100px]"></div>
      <div class="absolute left-[-10%] bottom-[-10%] w-75 h-75 bg-white/5 rounded-full blur-[80px]"></div>
    </div>

    <!-- Right Panel — Form -->
    <div class="flex-1 flex items-center justify-center px-6 py-12 bg-background">
      <div class="w-full max-w-md">
        <div class="lg:hidden mb-8">
          <h1 class="font-headline text-2xl font-extrabold text-primary tracking-tight">HireFlow</h1>
        </div>

        <h2 class="font-headline text-2xl font-bold text-foreground mb-2">Create an account</h2>
        <p class="text-muted-foreground text-sm mb-8">Join HireFlow as an Employer or Candidate</p>

        <form @submit.prevent="handleRegister" class="space-y-5">
          <div class="space-y-2">
            <label for="reg-name" class="block text-sm font-medium text-foreground">Full Name</label>
            <Input
              id="reg-name"
              v-model="name"
              type="text"
              required
              placeholder="John Doe"
            />
          </div>

          <div class="space-y-2">
            <label for="reg-email" class="block text-sm font-medium text-foreground">Email</label>
            <Input
              id="reg-email"
              v-model="email"
              type="email"
              required
              placeholder="you@example.com"
            />
          </div>

          <div class="space-y-2">
            <label for="reg-password" class="block text-sm font-medium text-foreground">Password</label>
            <Input
              id="reg-password"
              v-model="password"
              type="password"
              required
              placeholder="Min. 6 characters"
            />
          </div>

          <fieldset class="space-y-3">
            <legend class="block text-sm font-medium text-foreground">I am a...</legend>
            <div class="grid grid-cols-2 gap-3">
              <label
                class="flex flex-col items-center justify-center gap-2 rounded-xl px-4 py-5 cursor-pointer text-sm font-semibold transition-all duration-200 editorial-shadow"
                :class="
                  role === UserRole.EMPLOYER
                    ? 'bg-primary text-white scale-[1.02]'
                    : 'bg-card text-muted-foreground hover:bg-accent'
                "
              >
                <Briefcase class="h-6 w-6" />
                <input type="radio" v-model="role" :value="UserRole.EMPLOYER" class="hidden" />
                Employer
              </label>
              <label
                class="flex flex-col items-center justify-center gap-2 rounded-xl px-4 py-5 cursor-pointer text-sm font-semibold transition-all duration-200 editorial-shadow"
                :class="
                  role === UserRole.CANDIDATE
                    ? 'bg-primary text-white scale-[1.02]'
                    : 'bg-card text-muted-foreground hover:bg-accent'
                "
              >
                <User class="h-6 w-6" />
                <input type="radio" v-model="role" :value="UserRole.CANDIDATE" class="hidden" />
                Candidate
              </label>
            </div>
          </fieldset>

          <p v-if="error" class="text-destructive text-sm">{{ error }}</p>

          <button
            type="submit"
            :disabled="loading || !role"
            class="w-full gradient-cta font-semibold py-2.5 rounded-lg transition-opacity disabled:opacity-60 active:scale-[0.98] duration-200"
          >
            {{ loading ? 'Creating account...' : 'Create account' }}
          </button>
        </form>

        <p class="text-sm text-center text-muted-foreground mt-8">
          Already have an account?
          <RouterLink :to="ROUTES.LOGIN" class="text-primary hover:underline font-medium">
            Sign in
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Briefcase, User } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { UserRole, ROUTES } from '@/constants'
import { Input } from '@/components/ui/input'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const role = ref<UserRole | null>(null)
const error = ref('')
const loading = ref(false)

async function handleRegister() {
  if (!role.value) return
  error.value = ''
  loading.value = true
  try {
    const assignedRole = await authStore.register(
      name.value,
      email.value,
      password.value,
      role.value,
    )
    if (assignedRole === UserRole.EMPLOYER) {
      router.push(ROUTES.EMPLOYER_DASHBOARD)
    } else {
      router.push(ROUTES.CANDIDATE_DASHBOARD)
    }
  } catch (e: any) {
    error.value = e?.response?.data?.message ?? 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
