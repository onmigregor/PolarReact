// ** Custom hook for managing analytics filter state
import { useState, useEffect, useCallback } from 'react'
import { format, subMonths } from 'date-fns'
import analyticsService from '../services/analyticsService'
import { ReportFilters, AvailableFilters, ClientOption, ProductOption } from '../types'

const defaultStartDate = subMonths(new Date(), 3)
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
  const [selectedProducts, setSelectedProducts] = useState<ProductOption[]>([])
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>([])

  // Handle date range change (from template's selectsRange picker)
  // Handle date range change (from template's selectsRange picker)
  const handleDateRangeChange = useCallback((dates: [Date | null, Date | null]) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }, [])

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
    if (selectedProducts.length > 0) {
      filters.product_skus = selectedProducts.map(p => p.sku)
    }
    if (selectedRoutes.length > 0) {
      filters.routes = selectedRoutes
    }

    return filters
  }, [startDate, endDate, selectedClients, selectedProducts, selectedRoutes])

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
    selectedProducts,
    setSelectedProducts,
    selectedRoutes,
    setSelectedRoutes,

    // Builder
    buildFilters
  }
}
