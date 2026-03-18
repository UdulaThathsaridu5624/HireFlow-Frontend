import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ROUTES, UserRole } from '@/constants'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: ROUTES.LOGIN,
    },
    {
      path: ROUTES.LOGIN,
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
      meta: { guest: true },
    },
    {
      path: ROUTES.REGISTER,
      name: 'register',
      component: () => import('../views/auth/RegisterView.vue'),
      meta: { guest: true },
    },
    // Employer routes
    {
      path: ROUTES.EMPLOYER_DASHBOARD,
      name: 'employer-dashboard',
      component: () => import('../views/employer/EmployerDashboardView.vue'),
      meta: { requiresAuth: true, role: UserRole.EMPLOYER },
    },
    {
      path: ROUTES.EMPLOYER_PIPELINES,
      name: 'employer-pipelines',
      component: () => import('../views/employer/PipelinesView.vue'),
      meta: { requiresAuth: true, role: UserRole.EMPLOYER },
    },
    {
      path: '/employer/pipelines/:id',
      name: 'employer-pipeline-detail',
      component: () => import('../views/employer/PipelineDetailView.vue'),
      meta: { requiresAuth: true, role: UserRole.EMPLOYER },
    },
    {
      path: ROUTES.EMPLOYER_INTERVIEWS,
      name: 'employer-interviews',
      component: () => import('../views/employer/InterviewsView.vue'),
      meta: { requiresAuth: true, role: UserRole.EMPLOYER },
    },
    // Candidate routes
    {
      path: ROUTES.CANDIDATE_DASHBOARD,
      name: 'candidate-dashboard',
      component: () => import('../views/candidate/CandidateDashboardView.vue'),
      meta: { requiresAuth: true, role: UserRole.CANDIDATE },
    },
    {
      path: ROUTES.CANDIDATE_INTERVIEWS,
      name: 'candidate-interviews',
      component: () => import('../views/candidate/CandidateInterviewsView.vue'),
      meta: { requiresAuth: true, role: UserRole.CANDIDATE },
    },
    {
      path: ROUTES.CANDIDATE_PIPELINE,
      name: 'candidate-pipeline',
      component: () => import('../views/candidate/CandidatePipelineView.vue'),
      meta: { requiresAuth: true, role: UserRole.CANDIDATE },
    },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  // Redirect authenticated users away from guest-only pages
  if (to.meta.guest && authStore.isAuthenticated) {
    return authStore.isEmployer ? ROUTES.EMPLOYER_DASHBOARD : ROUTES.CANDIDATE_DASHBOARD
  }

  // Redirect unauthenticated users to login
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return ROUTES.LOGIN
  }

  // Redirect users accessing the wrong role's dashboard
  if (to.meta.role && authStore.isAuthenticated && authStore.role !== to.meta.role) {
    return authStore.isEmployer ? ROUTES.EMPLOYER_DASHBOARD : ROUTES.CANDIDATE_DASHBOARD
  }
})

export default router
