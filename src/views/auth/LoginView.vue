<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-2">Welcome back</h1>
      <p class="text-gray-500 text-sm mb-6">Sign in to your HireFlow account</p>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="login-email" class="block text-sm font-medium text-gray-700 mb-1"
            >Email</label
          >
          <input
            id="login-email"
            v-model="email"
            type="email"
            required
            placeholder="you@example.com"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="login-password" class="block text-sm font-medium text-gray-700 mb-1"
            >Password</label
          >
          <input
            id="login-password"
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-60"
        >
          {{ loading ? 'Signing in...' : 'Sign in' }}
        </button>
      </form>

      <p class="text-sm text-center text-gray-500 mt-6">
        Don't have an account?
        <RouterLink :to="ROUTES.REGISTER" class="text-blue-600 hover:underline font-medium"
          >Register</RouterLink
        >
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ROUTES, UserRole } from '@/constants'

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
