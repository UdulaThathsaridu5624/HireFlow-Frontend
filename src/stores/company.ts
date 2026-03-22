import { defineStore } from 'pinia'
import { ref } from 'vue'
import companyApi, { type CompanyResponse, type CompanyMetadata, type CompanyAnalytics } from '@/services/companyApi'

export const useCompanyStore = defineStore('company', () => {
  const company = ref<CompanyResponse | null>(null)
  const companies = ref<CompanyResponse[]>([])
  const analytics = ref<CompanyAnalytics | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAllCompanies() {
    loading.value = true
    error.value = null
    try {
      const { data } = await companyApi.getAllCompanies()
      companies.value = data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch companies'
    } finally {
      loading.value = false
    }
  }

  async function fetchCompanyById(id: number) {
    loading.value = true
    error.value = null
    try {
      const { data } = await companyApi.getCompanyById(id)
      company.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch company'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function search(query: string) {
    loading.value = true
    error.value = null
    try {
      const { data } = await companyApi.searchCompanies(query)
      companies.value = data
    } catch (e: any) {
      error.value = e.message || 'Search failed'
    } finally {
      loading.value = false
    }
  }

  async function fetchAnalytics(id: number) {
    try {
      const { data } = await companyApi.getCompanyAnalytics(id)
      analytics.value = data
    } catch (e: any) {
      console.error('Failed to fetch analytics', e)
    }
  }

  async function follow(id: number) {
    try {
      await companyApi.followCompany(id)
      // Refresh to get new follower count
      const updated = companies.value.find(c => c.id === id)
      if (updated) updated.followersCount++
    } catch (e: any) {
      console.error('Follow failed', e)
    }
  }

  async function unfollow(id: number) {
    try {
      await companyApi.unfollowCompany(id)
      const updated = companies.value.find(c => c.id === id)
      if (updated) updated.followersCount--
    } catch (e: any) {
      console.error('Unfollow failed', e)
    }
  }

  async function fetchByEmployee(employeeId: string | number) {
    loading.value = true
    error.value = null
    try {
      const { data } = await companyApi.getCompanyByEmployee(String(employeeId))
      company.value = data
    } catch (e: any) {
      if (e.response?.status === 404) {
        company.value = null
      } else {
        error.value = e.message || 'Failed to fetch company profile'
      }
    } finally {
      loading.value = false
    }
  }

  async function createCompany(metadata: CompanyMetadata, logo: File) {
    loading.value = true
    error.value = null
    try {
      const { data } = await companyApi.createCompany(metadata, logo)
      company.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to create company profile'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateCompany(id: number, metadata: CompanyMetadata, logo?: File) {
    loading.value = true
    error.value = null
    try {
      const { data } = await companyApi.updateCompany(id, metadata, logo)
      company.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to update company profile'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteCompany(id: number) {
    loading.value = true
    error.value = null
    try {
      await companyApi.deleteCompany(id)
      company.value = null
    } catch (e: any) {
      error.value = e.message || 'Failed to delete company profile'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    company,
    companies,
    analytics,
    loading,
    error,
    fetchAllCompanies,
    search,
    fetchAnalytics,
    follow,
    unfollow,
    fetchByEmployee,
    fetchCompanyById,
    createCompany,
    updateCompany,
    deleteCompany
  }
})
