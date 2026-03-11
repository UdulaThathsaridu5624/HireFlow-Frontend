import api from './api'
import { AUTH_ENDPOINTS, UserRole } from '@/constants'

export interface AuthResponse {
  token: string
  refreshToken: string
  userId: string
  name: string
  role: UserRole
}

export const authApi = {
  login(email: string, password: string) {
    return api.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, { email, password })
  },

  register(name: string, email: string, password: string, role: UserRole) {
    return api.post<AuthResponse>(AUTH_ENDPOINTS.REGISTER, { name, email, password, role })
  },

  logout(refreshToken: string) {
    return api.post(AUTH_ENDPOINTS.LOGOUT, { refreshToken })
  },

  refresh(refreshToken: string) {
    return api.post<AuthResponse>(AUTH_ENDPOINTS.REFRESH, { refreshToken })
  },
}
