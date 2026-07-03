// ** Analytics Service - API calls (SOLID: Single Responsibility)
import axiosIns from 'src/configs/axios'
import {
  ReportFilters,
  AvailableFilters,
  ReportResponse,
  SalesTrendItem,
  TopProductItem,
  SalesByProductItem,
  SalesByRouteItem,
  ClientOption
} from '../types'

const BASE = '/analytics'

/**
 * Service layer for all Analytics API calls.
 * Uses the centralized Axios instance (configs/axios.ts).
 * Each method maps 1:1 to a backend endpoint.
 */
const analyticsService = {
  /** Fetch available filter options (clients, regions, products) */
  getFilters: async (): Promise<AvailableFilters> => {
    const response = await axiosIns.get(`${BASE}/filters`)

    return response.data.data
  },

  /** Fetch clients dynamically based on selected routes */
  getClientsByRoutes: async (routeIds: number[]): Promise<ClientOption[]> => {
    const params = new URLSearchParams()
    routeIds.forEach(id => params.append('routes[]', id.toString()))
    
    const response = await axiosIns.get(`${BASE}/filters/clients?${params.toString()}`)

    return response.data.data
  },

  /** Sales Trend: monthly totals (transactions, USD, BS, pending) */
  getSalesTrend: async (filters: ReportFilters): Promise<ReportResponse<SalesTrendItem>> => {
    const response = await axiosIns.post(`${BASE}/reports/sales-trend`, filters)

    return response.data
  },

  /** Top Products: ranked by quantity sold or ordered */
  getTopProducts: async (filters: ReportFilters, limit = 10, source = 'sales'): Promise<ReportResponse<TopProductItem>> => {
    const response = await axiosIns.post(`${BASE}/reports/top-products`, { ...filters, limit, source })
 
    return response.data
  },

  /** Sales by Product per Month: breakdown per product per month */
  getSalesByProduct: async (filters: ReportFilters): Promise<ReportResponse<SalesByProductItem>> => {
    const response = await axiosIns.post(`${BASE}/reports/sales-by-product`, filters)

    return response.data
  },

  /** Sales or Orders by Route: totals per route per client */
  getSalesByRoute: async (filters: ReportFilters, source = 'sales'): Promise<ReportResponse<SalesByRouteItem>> => {
    const response = await axiosIns.post(`${BASE}/reports/sales-by-route`, { ...filters, source })
 
    return response.data
  },

  /** Portfolio Variation: SAP vs Smart FQ variation per territory */
  getPortfolioVariation: async (): Promise<any> => {
    const response = await axiosIns.post(`${BASE}/reports/portfolio-variation`)

    return response.data
  }
}

export default analyticsService
