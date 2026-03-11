import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { authApi } from '@/services/authApi'
import { UserRole } from '@/constants'
import type { AuthResponse } from '@/services/authApi'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'))
  const userId = ref<string | null>(localStorage.getItem('userId'))
  const name = ref<string | null>(localStorage.getItem('name'))
  const role = ref<UserRole | null>(
    localStorage.getItem('role') as UserRole | null,
  )

  const isAuthenticated = computed(() => !!token.value)
  const isEmployer = computed(() => role.value === UserRole.EMPLOYER)
  const isCandidate = computed(() => role.value === UserRole.CANDIDATE)

  function persist(data: AuthResponse) {
    token.value = data.token
    refreshToken.value = data.refreshToken
    userId.value = data.userId
    name.value = data.name
    role.value = data.role
    localStorage.setItem('token', data.token)
    localStorage.setItem('refreshToken', data.refreshToken)
    localStorage.setItem('userId', data.userId)
    localStorage.setItem('name', data.name)
    localStorage.setItem('role', data.role)
  }

  async function login(email: string, password: string) {
    const { data } = await authApi.login(email, password)
    persist(data)
    return data.role
  }

  async function register(
    name: string,
    email: string,
    password: string,
    userRole: UserRole,
  ) {
    const { data } = await authApi.register(name, email, password, userRole)
    persist(data)
    return data.role
  }

  async function logout() {
    if (refreshToken.value) {
      await authApi.logout(refreshToken.value).catch(() => {})
    }
    token.value = null
    refreshToken.value = null
    userId.value = null
    name.value = null
    role.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userId')
    localStorage.removeItem('name')
    localStorage.removeItem('role')
  }

  return { token, refreshToken, userId, name, role, isAuthenticated, isEmployer, isCandidate, login, register, logout }
})
