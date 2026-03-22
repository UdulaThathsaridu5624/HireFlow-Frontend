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
          Find the right talent.<br />Land the right role.
        </h2>
        <p class="text-white/60 mt-4 text-sm leading-relaxed">
          HireFlow connects employers with top candidates through a streamlined hiring pipeline — from application to offer.
        </p>
      </div>
      <div class="relative z-10 text-white/40 text-xs">
        &copy; {{ new Date().getFullYear() }} HireFlow. All rights reserved.
      </div>
      <!-- Decorative blur -->
      <div class="absolute right-[-20%] top-[-20%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px]"></div>
      <div class="absolute left-[-10%] bottom-[-10%] w-[300px] h-[300px] bg-white/5 rounded-full blur-[80px]"></div>
    </div>

    <!-- Right Panel — Form -->
    <div class="flex-1 flex items-center justify-center px-6 py-12 bg-background">
      <div class="w-full max-w-md">
        <div class="lg:hidden mb-8">
          <h1 class="font-headline text-2xl font-extrabold text-primary tracking-tight">HireFlow</h1>
        </div>

        <h2 class="font-headline text-2xl font-bold text-foreground mb-2">Welcome back</h2>
        <p class="text-muted-foreground text-sm mb-8">Sign in to your HireFlow account</p>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div class="space-y-2">
            <label for="login-email" class="block text-sm font-medium text-foreground">Email</label>
            <Input
              id="login-email"
              v-model="email"
              type="email"
              required
              placeholder="you@example.com"
            />
          </div>

          <div class="space-y-2">
            <label for="login-password" class="block text-sm font-medium text-foreground">Password</label>
            <Input
              id="login-password"
              v-model="password"
              type="password"
              required
              placeholder="Enter your password"
            />
          </div>

          <p v-if="error" class="text-destructive text-sm">{{ error }}</p>

          <button
            type="submit"
            :disabled="loading"
            class="w-full gradient-cta font-semibold py-2.5 rounded-lg transition-opacity disabled:opacity-60 active:scale-[0.98] duration-200"
          >
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>

        <p class="text-sm text-center text-muted-foreground mt-8">
          Don't have an account?
          <RouterLink :to="ROUTES.REGISTER" class="text-primary hover:underline font-medium">
            Register
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ROUTES, UserRole } from '@/constants'
import { Input } from '@/components/ui/input'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    const role = await authStore.login(email.value, password.value)
    if (role === UserRole.EMPLOYER) {
      router.push(ROUTES.EMPLOYER_DASHBOARD)
    } else {
      router.push(ROUTES.CANDIDATE_DASHBOARD)
    }
  } catch (e: any) {
    error.value = e?.response?.data?.message ?? 'Invalid email or password.'
  } finally {
    loading.value = false
  }
}
</script>
