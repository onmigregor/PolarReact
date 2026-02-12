// ** Service layer for CompanyRoute module
import axios from 'src/configs/axios'
import { CompanyRouteType, CompanyRouteFormData } from '../types'
import { PaginatedResponse, SingleResponse } from 'src/pages/regions/types'

interface GetAllParams {
  search?: string
  region_id?: number | string
  per_page?: number
  page?: number
  [key: string]: any
}

const companyRouteService = {
  /**
   * Get paginated list of company routes
   */
  getAll: async (params: GetAllParams = {}): Promise<PaginatedResponse<CompanyRouteType>> => {
    // Map 'query' from useDataTable to 'search' for API
    const requestParams = { ...params }
    if (requestParams.query) {
      requestParams.search = requestParams.query
      delete requestParams.query
    }

    const response = await axios.get('/company-routes', { params: requestParams })

    return response.data
  },

  /**
   * Get all company routes for selectors
   */
  listAll: async (): Promise<SingleResponse<CompanyRouteType[]>> => {
    const response = await axios.get('/company-routes/all')

    return response.data
  },

  /**
   * Get a single company route by ID
   */
  getById: async (id: number | string): Promise<SingleResponse<CompanyRouteType>> => {
    const response = await axios.get(`/company-routes/${id}`)

    return response.data
  },

  /**
   * Create a new company route
   */
  store: async (data: CompanyRouteFormData): Promise<SingleResponse<CompanyRouteType>> => {
    const response = await axios.post('/company-routes', data)

    return response.data
  },

  /**
   * Update an existing company route
   */
  update: async (id: number | string, data: CompanyRouteFormData): Promise<SingleResponse<CompanyRouteType>> => {
    const response = await axios.put(`/company-routes/${id}`, data)

    return response.data
  },

  /**
   * Delete a company route
   */
  destroy: async (id: number | string): Promise<SingleResponse<null>> => {
    const response = await axios.delete(`/company-routes/${id}`)

    return response.data
  }
}

export default companyRouteService
