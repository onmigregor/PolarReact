// ** Analytics Service - API calls (SOLID: Single Responsibility)
import axiosIns from 'src/configs/axios'
import {
  ReportFilters,
  AvailableFilters,
  ReportResponse,
  SalesTrendItem,
  TopProductItem,
  SalesByProductItem,
  SalesByRouteItem
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

  /** Sales Trend: monthly totals (transactions, USD, BS, pending) */
  getSalesTrend: async (filters: ReportFilters): Promise<ReportResponse<SalesTrendItem>> => {
    const response = await axiosIns.post(`${BASE}/reports/sales-trend`, filters)

    return response.data
  },

  /** Top Products: ranked by quantity sold */
  getTopProducts: async (filters: ReportFilters, limit = 10): Promise<ReportResponse<TopProductItem>> => {
    const response = await axiosIns.post(`${BASE}/reports/top-products`, { ...filters, limit })

    return response.data
  },

  /** Sales by Product per Month: breakdown per product per month */
  getSalesByProduct: async (filters: ReportFilters): Promise<ReportResponse<SalesByProductItem>> => {
    const response = await axiosIns.post(`${BASE}/reports/sales-by-product`, filters)

    return response.data
  },

  /** Sales by Route: totals per route per client */
  getSalesByRoute: async (filters: ReportFilters): Promise<ReportResponse<SalesByRouteItem>> => {
    const response = await axiosIns.post(`${BASE}/reports/sales-by-route`, filters)

    return response.data
  }
}

export default analyticsService
