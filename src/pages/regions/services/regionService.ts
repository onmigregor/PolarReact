// ** Service layer for Regions module
import axios from 'src/configs/axios'
import { RegionType, RegionFormData, PaginatedResponse, SingleResponse } from '../types'

interface GetAllParams {
  query?: string
  per_page?: number
  page?: number
}

const regionService = {
  /**
   * Get paginated list of regions
   */
  getAll: async (params: GetAllParams = {}): Promise<PaginatedResponse<RegionType>> => {
    const response = await axios.get('/regions', { params })

    return response.data
  },

  /**
   * Get all regions for selectors
   */
  getAllRegions: async (): Promise<SingleResponse<RegionType[]>> => {
    const response = await axios.get('/regions/all')

    return response.data
  },

  /**
   * Create a new region
   */
  store: async (data: RegionFormData): Promise<SingleResponse<RegionType>> => {
    const response = await axios.post('/regions', data)

    return response.data
  },

  /**
   * Update an existing region
   */
  update: async (id: number, data: RegionFormData): Promise<SingleResponse<RegionType>> => {
    const response = await axios.put(`/regions/${id}`, data)

    return response.data
  },

  /**
   * Delete a region
   */
  destroy: async (id: number): Promise<SingleResponse<null>> => {
    const response = await axios.delete(`/regions/${id}`)

    return response.data
  }
}

export default regionService
