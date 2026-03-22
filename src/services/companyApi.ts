import axios from 'axios'

export interface CompanyMetadata {
  employeeId: string | number
  companyName: string
  location: string
  industry: string
  background: string
  website: string
  cultureTags: string[]
}

export interface CompanyResponse extends CompanyMetadata {
  id: number
  logoUrl: string
  reputationScore: number
  createdAt: string
  followersCount: number
  followedByMe: boolean
}

export interface CompanyAnalytics {
  profileViews: number
  jobPosts: number
  applicationsReceived: number
  followersCount: number
  lastUpdated: string
}

const companyApi = axios.create({
  baseURL: import.meta.env.VITE_COMPANY_API_URL,
})

companyApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default {
  createCompany(metadata: CompanyMetadata, logo: File) {
    const formData = new FormData()
    // Convert metadata to a string first, then wrap it in a Blob
    const jsonString = JSON.stringify(metadata)
    const jsonBlob = new Blob([jsonString], { type: 'application/json' })
    formData.append('company', jsonBlob)
    formData.append('logo', logo)

    return companyApi.post<CompanyResponse>('/companies', formData)
  },

  getCompanyByEmployee(employeeId: string) {
    // Explicitly ensure employeeId is a string to avoid 400 errors with UUIDs
    return companyApi.get<CompanyResponse>(`/companies/employee/${String(employeeId)}`)
  },

  getCompanyById(id: number) {
    return companyApi.get<CompanyResponse>(`/companies/${id}`)
  },

  updateCompany(id: number, metadata: CompanyMetadata, logo?: File) {
    const formData = new FormData()
    const jsonString = JSON.stringify(metadata)
    const jsonBlob = new Blob([jsonString], { type: 'application/json' })
    formData.append('company', jsonBlob)
    if (logo) {
      formData.append('logo', logo)
    }

    return companyApi.put<CompanyResponse>(`/companies/${id}`, formData)
  },

  deleteCompany(id: number) {
    return companyApi.delete(`/companies/${id}`)
  },

  getAllCompanies() {
    return companyApi.get<CompanyResponse[]>('/companies')
  },

  searchCompanies(query: string) {
    return companyApi.get<CompanyResponse[]>(`/companies/search`, {
      params: { query }
    })
  },

  followCompany(id: number) {
    return companyApi.post(`/companies/${id}/follow`)
  },

  unfollowCompany(id: number) {
    return companyApi.delete(`/companies/${id}/follow`)
  },

  getCompanyAnalytics(id: number) {
    return companyApi.get<CompanyAnalytics>(`/companies/${id}/analytics`)
  }
}
