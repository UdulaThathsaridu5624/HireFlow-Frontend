import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ROUTES, UserRole } from '@/constants'
import LoginView from '../views/auth/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LoginView, // Temporary to avoid redirect loops
      meta: { guest: true },
    },
    {
      path: ROUTES.LOGIN,
      name: 'login',
      component: LoginView,
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
    {
      path: ROUTES.EMPLOYER_COMPANY,
      name: 'employer-company',
      component: () => import('../views/employer/CompanyProfileView.vue'),
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
    {
      path: ROUTES.CANDIDATE_CV_PROFILE,
      name: 'candidate-cv-profile',
      component: () => import('../views/candidate/CandidateCvProfileView.vue'),
      meta: { requiresAuth: true, role: UserRole.CANDIDATE },
    },
    {
      path: ROUTES.CANDIDATE_COMPANIES,
      name: 'candidate-companies',
      component: () => import('../views/candidate/ExploreCompaniesView.vue'),
      meta: { requiresAuth: true, role: UserRole.CANDIDATE },
    },
    {
      path: ROUTES.CANDIDATE_COMPANY_DETAIL,
      name: 'candidate-company-detail',
      component: () => import('../views/candidate/CompanyDetailsView.vue'),
      meta: { requiresAuth: true, role: UserRole.CANDIDATE },
    },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  // Redirect authenticated users away from guest-only pages
  if (to.meta.guest && authStore.isAuthenticated) {
    const nextRoute = authStore.isEmployer ? ROUTES.EMPLOYER_DASHBOARD : ROUTES.CANDIDATE_DASHBOARD
    if (to.path !== nextRoute) return nextRoute
  }

  // Redirect unauthenticated users to login
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    if (to.path !== ROUTES.LOGIN) return ROUTES.LOGIN
  }

  // Redirect users accessing the wrong role's dashboard
  if (to.meta.role && authStore.isAuthenticated && authStore.role !== to.meta.role) {
    const nextRoute = authStore.isEmployer ? ROUTES.EMPLOYER_DASHBOARD : ROUTES.CANDIDATE_DASHBOARD
    if (to.path !== nextRoute) return nextRoute
  }
})

export default router
