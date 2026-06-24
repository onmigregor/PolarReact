// ** Analytics Dashboard Page
import { useState, useCallback } from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Module Components
import AnalyticsFilters from 'src/@modules/analytics/components/filters/AnalyticsFilters'
import SalesTrendChart from 'src/@modules/analytics/components/charts/SalesTrendChart'
import TopProductsChart from 'src/@modules/analytics/components/charts/TopProductsChart'
import SalesByProductChart from 'src/@modules/analytics/components/charts/SalesByProductChart'
import SalesByRouteChart from 'src/@modules/analytics/components/charts/SalesByRouteChart'
import PortfolioVariationChart from 'src/@modules/analytics/components/charts/PortfolioVariationChart'

// ** Module Hooks & Services
import { useAnalyticsFilters } from 'src/@modules/analytics/hooks/useAnalyticsFilters'
import analyticsService from 'src/@modules/analytics/services/analyticsService'

// ** Module Types
import {
  SalesTrendItem,
  TopProductItem,
  SalesByProductItem,
  SalesByRouteItem,
  ReportMeta
} from 'src/@modules/analytics/types'

const AnalyticsPage = () => {
  // Filter hook
  const {
    availableFilters,
    filtersLoading,
    startDate,
    endDate,
    handleDateRangeChange,
    
    // Selection state
    selectedClients,
    setSelectedClients,
    filteredClientOptions,

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

    buildFilters
  } = useAnalyticsFilters()

  // Report data state
  const [loading, setLoading] = useState(false)
  const [hasQueried, setHasQueried] = useState(false)
  const [salesTrend, setSalesTrend] = useState<SalesTrendItem[]>([])
  const [topProducts, setTopProducts] = useState<TopProductItem[]>([])
  const [salesByProduct, setSalesByProduct] = useState<SalesByProductItem[]>([])
  const [salesByRoute, setSalesByRoute] = useState<SalesByRouteItem[]>([])
  const [portfolioVariation, setPortfolioVariation] = useState<any[]>([])
  const [portfolioTotals, setPortfolioTotals] = useState<any | null>(null)
  const [meta, setMeta] = useState<ReportMeta | null>(null)

  // Fetch all reports
  const handleApplyFilters = useCallback(async () => {
    const filters = buildFilters()
    setLoading(true)
    setHasQueried(true)

    try {
      // Fetch all reports in parallel
      const [trendRes, topRes, productRes, routeRes, portfolioRes] = await Promise.all([
        analyticsService.getSalesTrend(filters),
        analyticsService.getTopProducts(filters),
        analyticsService.getSalesByProduct(filters),
        analyticsService.getSalesByRoute(filters),
        analyticsService.getPortfolioVariation()
      ])

      setSalesTrend(trendRes.data)
      setTopProducts(topRes.data)
      setSalesByProduct(productRes.data)
      setSalesByRoute(routeRes.data)
      setPortfolioVariation(portfolioRes.data.territories)
      setPortfolioTotals(portfolioRes.data.totals)
      setMeta(trendRes.meta)
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }, [buildFilters])

  return (
    <DatePickerWrapper>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant='h4' sx={{ fontWeight: 600 }}>
            📊 Analytics
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Reportes de ventas consolidados de todas las distribuidoras
          </Typography>
        </Box>

        {/* Filters Bar */}
        <AnalyticsFilters
          availableFilters={availableFilters}
          filtersLoading={filtersLoading}
          startDate={startDate}
          endDate={endDate}
          onDateRangeChange={handleDateRangeChange}
          
          selectedClients={selectedClients}
          onClientsChange={setSelectedClients}
          filteredClientOptions={filteredClientOptions}

          selectedRoutes={selectedRoutes}
          onRoutesChange={setSelectedRoutes}

          selectedFamilies={selectedFamilies}
          onFamiliesChange={setSelectedFamilies}
          selectedCategories={selectedCategories}
          onCategoriesChange={setSelectedCategories}
          filteredCategoryOptions={filteredCategoryOptions}
          
          selectedBrands={selectedBrands}
          onBrandsChange={setSelectedBrands}
          selectedSegments={selectedSegments}
          onSegmentsChange={setSelectedSegments}
          
          selectedProducts={selectedProducts}
          onProductsChange={setSelectedProducts}
          filteredProductOptions={filteredProductOptions}
          
          selectedFqCodes={selectedFqCodes}
          onFqCodesChange={setSelectedFqCodes}
          selectedVendorGroups={selectedVendorGroups}
          onVendorGroupsChange={setSelectedVendorGroups}
          selectedOffices={selectedOffices}
          onOfficesChange={setSelectedOffices}
          selectedTerritories={selectedTerritories}
          onTerritoriesChange={setSelectedTerritories}

          onApplyFilters={handleApplyFilters}
          loading={loading}
        />

        {/* Error alerts */}
        {meta && meta.errors.length > 0 && (
          <Alert severity='warning' sx={{ mb: 4 }}>
            <AlertTitle>Advertencia</AlertTitle>
            {meta.errors.length} cliente(s) no pudieron ser consultados:
            {meta.errors.map((err, i) => (
              <Typography key={i} variant='body2'>• {err.client}: {err.error}</Typography>
            ))}
          </Alert>
        )}

        {/* Meta info */}
        {meta && !loading && (
          <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
            {meta.clients_queried} cliente(s) consultados
          </Typography>
        )}

        {/* Prompt to query if not yet */}
        {!hasQueried && !loading && (
          <Alert severity='info' sx={{ mb: 4 }}>
            Selecciona las fechas y filtros deseados, luego haz clic en <strong>Consultar</strong> para ver los reportes.
          </Alert>
        )}

        {/* Charts Grid */}
        <Grid container spacing={4}>
          {/* Sales Trend — Full width */}
          <Grid item xs={12}>
            <SalesTrendChart data={salesTrend} loading={loading && hasQueried} />
          </Grid>

          {/* Top Products + Sales by Route — Side by side */}
          <Grid item xs={12} md={6}>
            <TopProductsChart data={topProducts} loading={loading && hasQueried} />
          </Grid>
          <Grid item xs={12} md={6}>
            <SalesByRouteChart data={salesByRoute} loading={loading && hasQueried} />
          </Grid>

          {/* Portfolio Variation — Side by side with Sales by Product */}
          <Grid item xs={12} md={6}>
            <PortfolioVariationChart data={portfolioVariation} totals={portfolioTotals} loading={loading && hasQueried} />
          </Grid>

          {/* Sales by Product — Full width */}
          <Grid item xs={12}>
            <SalesByProductChart data={salesByProduct} loading={loading && hasQueried} />
          </Grid>
        </Grid>
      </Box>
    </DatePickerWrapper>
  )
}

AnalyticsPage.acl = {
  action: 'read',
  subject: 'analytics'
}

export default AnalyticsPage
