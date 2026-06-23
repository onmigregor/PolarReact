// ** Custom hook for managing analytics filter state
import { useState, useEffect, useCallback } from 'react'
import { format, startOfMonth } from 'date-fns'
import analyticsService from '../services/analyticsService'
import {
  ReportFilters,
  AvailableFilters,
  ClientOption,
  RouteOption,
  ProductOption,
  RegionOption,
  FamilyOption,
  CategoryOption,
  BrandOption,
  SegmentOption,
  GenericOption
} from '../types'

const defaultStartDate = startOfMonth(new Date())
const defaultEndDate = new Date()

export const useAnalyticsFilters = () => {
  // Filter options from API
  const [availableFilters, setAvailableFilters] = useState<AvailableFilters>({
    routes: [],
    regions: [],
    products: [],
    families: [],
    categories: [],
    brands: [],
    segments: [],
    fq_codes: [],
    vendor_groups: [],
    offices: [],
    territories: []
  })
  const [filtersLoading, setFiltersLoading] = useState(true)

  // Selected filter values
  const [startDate, setStartDate] = useState<Date | null>(defaultStartDate)
  const [endDate, setEndDate] = useState<Date | null>(defaultEndDate)
  const [selectedClients, setSelectedClients] = useState<ClientOption[]>([])
  const [selectedRegions, setSelectedRegions] = useState<RegionOption[]>([])
  const [selectedRoutes, setSelectedRoutes] = useState<RouteOption[]>([])
  const [dynamicClients, setDynamicClients] = useState<ClientOption[]>([])
  
  // Advanced Products Filters
  const [selectedFamilies, setSelectedFamilies] = useState<FamilyOption[]>([])
  const [selectedCategories, setSelectedCategories] = useState<CategoryOption[]>([])
  const [selectedBrands, setSelectedBrands] = useState<BrandOption[]>([])
  const [selectedSegments, setSelectedSegments] = useState<SegmentOption[]>([])
  const [selectedProducts, setSelectedProducts] = useState<ProductOption[]>([])

  // Geo / Franchise Filters
  const [selectedFqCodes, setSelectedFqCodes] = useState<GenericOption[]>([])
  const [selectedVendorGroups, setSelectedVendorGroups] = useState<GenericOption[]>([])
  const [selectedOffices, setSelectedOffices] = useState<GenericOption[]>([])
  const [selectedTerritories, setSelectedTerritories] = useState<GenericOption[]>([])

  // Handle date range change (from template's selectsRange picker)
  const handleDateRangeChange = useCallback((dates: [Date | null, Date | null]) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }, [])

  // Filter clients based on selected regions (Cascading Logic)
  const filteredClientOptions = dynamicClients

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
    const matchesSegment = selectedSegments.length === 0 || selectedSegments.some(s => s.id === product.cl3_code)
    
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
          routes: data.routes || [],
          regions: data.regions || [],
          products: data.products || [],
          families: data.families || [],
          categories: data.categories || [],
          brands: data.brands || [],
          segments: data.segments || [],
          fq_codes: data.fq_codes || [],
          vendor_groups: data.vendor_groups || [],
          offices: data.offices || [],
          territories: data.territories || []
        })
      } catch (error) {
        console.error('Error loading filters:', error)
      } finally {
        setFiltersLoading(false)
      }
    }
    loadFilters()
  }, [])

  // Fetch dynamic clients when selectedRoutes change
  useEffect(() => {
    const fetchClients = async () => {
      if (selectedRoutes.length === 0) {
        setDynamicClients([])

        // Filter out any selected clients since no routes are selected
        setSelectedClients([])

        return
      }
      try {
        const routeIds = selectedRoutes.map(r => r.id)
        const response = await analyticsService.getClientsByRoutes(routeIds)
        setDynamicClients(response || [])
      } catch (error) {
        console.error('Error fetching clients for routes:', error)
      }
    }
    
    fetchClients()
  }, [selectedRoutes])

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
      filters.routes = selectedRoutes.map(r => r.id)
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
      filters.cl3_codes = selectedSegments.map(s => s.id)
    }
    if (selectedProducts.length > 0) {
      filters.product_skus = selectedProducts.map(p => p.sku)
    }
    if (selectedFqCodes.length > 0) {
      filters.fq_codes = selectedFqCodes.map(f => f.id)
    }
    if (selectedVendorGroups.length > 0) {
      filters.vendor_groups = selectedVendorGroups.map(v => v.id)
    }
    if (selectedOffices.length > 0) {
      filters.offices = selectedOffices.map(o => o.id)
    }
    if (selectedTerritories.length > 0) {
      filters.territories = selectedTerritories.map(t => t.id)
    }

    return filters
  }, [
    startDate, endDate, selectedClients, selectedRegions, selectedRoutes,
    selectedFamilies, selectedCategories, selectedBrands, selectedSegments, selectedProducts,
    selectedFqCodes, selectedVendorGroups, selectedOffices, selectedTerritories
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

    // Geo / Franchise
    selectedFqCodes,
    setSelectedFqCodes,
    selectedVendorGroups,
    setSelectedVendorGroups,
    selectedOffices,
    setSelectedOffices,
    selectedTerritories,
    setSelectedTerritories,

    // Builder
    buildFilters
  }
}
