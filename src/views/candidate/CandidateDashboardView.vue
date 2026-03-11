<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
      <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 class="text-lg font-bold text-blue-600">HireFlow</h1>
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-600">{{ authStore.name }}</span>
          <span class="text-xs bg-green-100 text-green-700 font-medium px-2 py-1 rounded-full"
            >Candidate</span
          >
          <button @click="handleLogout" class="text-sm text-gray-500 hover:text-red-500 transition">
            Sign out
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-5xl mx-auto px-6 py-12">
      <h2 class="text-2xl font-bold text-gray-800 mb-2">Welcome, {{ authStore.name }}!</h2>
      <p class="text-gray-500">Your candidate dashboard is ready. Features coming soon.</p>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ROUTES } from '@/constants'

const router = useRouter()
const authStore = useAuthStore()

async function handleLogout() {
  await authStore.logout()
  router.push(ROUTES.LOGIN)
}
</script>
