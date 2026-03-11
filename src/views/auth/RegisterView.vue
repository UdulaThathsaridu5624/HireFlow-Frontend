<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-2">Create an account</h1>
      <p class="text-gray-500 text-sm mb-6">Join HireFlow as an Employer or Candidate</p>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label for="reg-name" class="block text-sm font-medium text-gray-700 mb-1"
            >Full Name</label
          >
          <input
            id="reg-name"
            v-model="name"
            type="text"
            required
            placeholder="John Doe"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="reg-email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            id="reg-email"
            v-model="email"
            type="email"
            required
            placeholder="you@example.com"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="reg-password" class="block text-sm font-medium text-gray-700 mb-1"
            >Password</label
          >
          <input
            id="reg-password"
            v-model="password"
            type="password"
            required
            placeholder="Min. 6 characters"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <fieldset>
          <legend class="block text-sm font-medium text-gray-700 mb-2">I am a...</legend>
          <div class="grid grid-cols-2 gap-3">
            <label
              class="flex items-center justify-center gap-2 border rounded-lg px-4 py-3 cursor-pointer text-sm font-medium transition"
              :class="
                role === UserRole.EMPLOYER
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300 text-gray-600'
              "
            >
              <input type="radio" v-model="role" :value="UserRole.EMPLOYER" class="hidden" />
              Employer
            </label>
            <label
              class="flex items-center justify-center gap-2 border rounded-lg px-4 py-3 cursor-pointer text-sm font-medium transition"
              :class="
                role === UserRole.CANDIDATE
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300 text-gray-600'
              "
            >
              <input type="radio" v-model="role" :value="UserRole.CANDIDATE" class="hidden" />
              Candidate
            </label>
          </div>
        </fieldset>

        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading || !role"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-60"
        >
          {{ loading ? 'Creating account...' : 'Create account' }}
        </button>
      </form>

      <p class="text-sm text-center text-gray-500 mt-6">
        Already have an account?
        <RouterLink :to="ROUTES.LOGIN" class="text-blue-600 hover:underline font-medium"
          >Sign in</RouterLink
        >
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { UserRole, ROUTES } from '@/constants'

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
