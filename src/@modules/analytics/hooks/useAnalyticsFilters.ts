// ** Custom hook for managing analytics filter state
import { useState, useEffect, useCallback } from 'react'
import { format, startOfMonth } from 'date-fns'
import analyticsService from '../services/analyticsService'
import { ReportFilters, AvailableFilters, ClientOption, ProductOption, RegionOption } from '../types'

const defaultStartDate = startOfMonth(new Date())
const defaultEndDate = new Date()

export const useAnalyticsFilters = () => {
  // Filter options from API
  const [availableFilters, setAvailableFilters] = useState<AvailableFilters>({
    clients: [],
    regions: [],
    products: []
  })
  const [filtersLoading, setFiltersLoading] = useState(true)

  // Selected filter values
  // Selected filter values
  const [startDate, setStartDate] = useState<Date | null>(defaultStartDate)
  const [endDate, setEndDate] = useState<Date | null>(defaultEndDate)
  const [selectedClients, setSelectedClients] = useState<ClientOption[]>([])
  const [selectedRegions, setSelectedRegions] = useState<RegionOption[]>([])
  const [selectedProducts, setSelectedProducts] = useState<ProductOption[]>([])
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>([])

  // Handle date range change (from template's selectsRange picker)
  // Handle date range change (from template's selectsRange picker)
  const handleDateRangeChange = useCallback((dates: [Date | null, Date | null]) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }, [])

  // Filter clients based on selected regions (Cascading Logic)
  const filteredClientOptions = availableFilters.clients.filter(client => {
    if (selectedRegions.length === 0) return true

    return client.region_id && selectedRegions.some(r => r.id === client.region_id)
  })

  // Load filter options on mount
  useEffect(() => {
    const loadFilters = async () => {
      try {
        setFiltersLoading(true)
        const data = await analyticsService.getFilters()
        setAvailableFilters(data)
      } catch (error) {
        console.error('Error loading filters:', error)
      } finally {
        setFiltersLoading(false)
      }
    }
    loadFilters()
  }, [])

  // Build the ReportFilters object from current selection
  const buildFilters = useCallback((): ReportFilters => {
    const filters: ReportFilters = {
      start_date: startDate ? format(startDate, 'yyyy-MM-dd') : '',
      end_date: endDate ? format(endDate, 'yyyy-MM-dd') : ''
    }

    if (selectedClients.length > 0) {
      filters.client_ids = selectedClients.map(c => c.id)
    }
    if (selectedRegions.length > 0) {
      filters.region_ids = selectedRegions.map(r => r.id)
    }
    if (selectedProducts.length > 0) {
      filters.product_skus = selectedProducts.map(p => p.sku)
    }
    if (selectedRoutes.length > 0) {
      filters.routes = selectedRoutes
    }

    return filters
  }, [startDate, endDate, selectedClients, selectedRegions, selectedProducts, selectedRoutes])

  return {
    // Filter options
    availableFilters,
    filtersLoading,

    // Date state
    startDate,
    endDate,
    handleDateRangeChange,

    // Selection state
    selectedClients,
    setSelectedClients,
    filteredClientOptions,
    selectedRegions,
    setSelectedRegions,
    selectedProducts,
    setSelectedProducts,
    selectedRoutes,
    setSelectedRoutes,

    // Builder
    buildFilters
  }
}
