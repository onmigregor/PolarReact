// ** Custom hook for managing analytics filter state
import { useState, useEffect, useCallback } from 'react'
import { format, startOfMonth } from 'date-fns'
import analyticsService from '../services/analyticsService'
import {
  ReportFilters,
  AvailableFilters,
  ClientOption,
  ProductOption,
  RegionOption,
  FamilyOption,
  CategoryOption,
  BrandOption,
  SegmentOption
} from '../types'

const defaultStartDate = startOfMonth(new Date())
const defaultEndDate = new Date()

export const useAnalyticsFilters = () => {
  // Filter options from API
  const [availableFilters, setAvailableFilters] = useState<AvailableFilters>({
    clients: [],
    regions: [],
    products: [],
    families: [],
    categories: [],
    brands: [],
    segments: []
  })
  const [filtersLoading, setFiltersLoading] = useState(true)

  // Selected filter values
  const [startDate, setStartDate] = useState<Date | null>(defaultStartDate)
  const [endDate, setEndDate] = useState<Date | null>(defaultEndDate)
  const [selectedClients, setSelectedClients] = useState<ClientOption[]>([])
  const [selectedRegions, setSelectedRegions] = useState<RegionOption[]>([])
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>([])
  
  // Advanced Products Filters
  const [selectedFamilies, setSelectedFamilies] = useState<FamilyOption[]>([])
  const [selectedCategories, setSelectedCategories] = useState<CategoryOption[]>([])
  const [selectedBrands, setSelectedBrands] = useState<BrandOption[]>([])
  const [selectedSegments, setSelectedSegments] = useState<SegmentOption[]>([])
  const [selectedProducts, setSelectedProducts] = useState<ProductOption[]>([])

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

  // Filter categories based on selected families
  const filteredCategoryOptions = availableFilters.categories.filter(category => {
    if (selectedFamilies.length === 0) return true
    
return selectedFamilies.some(f => f.id === category.cl1_code)
  })

  // Filter products based on selected hierarchy filters
  const filteredProductOptions = availableFilters.products.filter(product => {
    const matchesFamily = selectedFamilies.length === 0 || selectedFamilies.some(f => f.id === product.cl1_code)
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.some(c => c.id === product.cl2_code)
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.some(b => b.id === product.brand_code)
    const matchesSegment = selectedSegments.length === 0 || selectedSegments.some(s => s.id === product.segment_code)
    
return matchesFamily && matchesCategory && matchesBrand && matchesSegment
  })

  // Load filter options on mount
  useEffect(() => {
    const loadFilters = async () => {
      try {
        setFiltersLoading(true)
        const data = await analyticsService.getFilters()

        // Ensure defaults if API does not return them yet
        setAvailableFilters({
          clients: data.clients || [],
          regions: data.regions || [],
          products: data.products || [],
          families: data.families || [],
          categories: data.categories || [],
          brands: data.brands || [],
          segments: data.segments || []
        })
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
    if (selectedRoutes.length > 0) {
      filters.routes = selectedRoutes
    }
    
    if (selectedFamilies.length > 0) {
      filters.cl1_codes = selectedFamilies.map(f => f.id)
    }
    if (selectedCategories.length > 0) {
      filters.cl2_codes = selectedCategories.map(c => c.id)
    }
    if (selectedBrands.length > 0) {
      filters.brand_codes = selectedBrands.map(b => b.id)
    }
    if (selectedSegments.length > 0) {
      filters.segment_codes = selectedSegments.map(s => s.id)
    }
    if (selectedProducts.length > 0) {
      filters.product_skus = selectedProducts.map(p => p.sku)
    }

    return filters
  }, [
    startDate, endDate, selectedClients, selectedRegions, selectedRoutes,
    selectedFamilies, selectedCategories, selectedBrands, selectedSegments, selectedProducts
  ])

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
    selectedRoutes,
    setSelectedRoutes,
    
    // Product Filters
    selectedFamilies,
    setSelectedFamilies,
    selectedCategories,
    setSelectedCategories,
    filteredCategoryOptions,
    selectedBrands,
    setSelectedBrands,
    selectedSegments,
    setSelectedSegments,
    selectedProducts,
    setSelectedProducts,
    filteredProductOptions,

    // Builder
    buildFilters
  }
}
