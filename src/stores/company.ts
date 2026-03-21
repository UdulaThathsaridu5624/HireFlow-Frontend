import { defineStore } from 'pinia'
import { ref } from 'vue'
import companyApi, { type CompanyResponse, type CompanyMetadata } from '@/services/companyApi'

export const useCompanyStore = defineStore('company', () => {
  const company = ref<CompanyResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchByEmployee(employeeId: string | number) {
    loading.value = true
    error.value = null
    try {
      const { data } = await companyApi.getCompanyByEmployee(employeeId)
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

  return { company, loading, error, fetchByEmployee, createCompany, updateCompany, deleteCompany }
})
