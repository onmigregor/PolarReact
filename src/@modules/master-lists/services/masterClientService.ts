// ** Service layer for Master Clients module
import axios from 'src/configs/axios'
import { MasterClientType, PaginatedResponse, FilterOptionsResponse } from '../types'

interface GetAllParams {
  query?: string
  per_page?: number
  page?: number
  tp1_code?: string
  tp2_code?: string
  cit_code?: string
  has_cep?: boolean | string
}

interface GetFiltersParams {
  tp1_code?: string
  tp2_code?: string
}

const masterClientService = {
  /**
   * Get paginated list of master clients with filters
   */
  getAll: async (params: GetAllParams = {}): Promise<PaginatedResponse<MasterClientType>> => {
    // If has_cep is a boolean, convert it to a string/number that PHP can validate
    const formattedParams = { ...params }
    if (formattedParams.has_cep !== undefined) {
      formattedParams.has_cep = formattedParams.has_cep ? 'true' : 'false'
    }

    const response = await axios.get('/master-clients', { params: formattedParams })

    return response.data
  },

  /**
   * Get dynamic classification filter options
   */
  getFilters: async (params: GetFiltersParams = {}): Promise<FilterOptionsResponse> => {
    const response = await axios.get('/master-clients/filters', { params })

    return response.data
  }
}

export default masterClientService
export type { GetAllParams, GetFiltersParams }
