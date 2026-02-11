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
import AnalyticsFilters from './components/filters/AnalyticsFilters'
import SalesTrendChart from './components/charts/SalesTrendChart'
import TopProductsChart from './components/charts/TopProductsChart'
import SalesByProductChart from './components/charts/SalesByProductChart'
import SalesByRouteChart from './components/charts/SalesByRouteChart'

// ** Module Hooks & Services
import { useAnalyticsFilters } from './hooks/useAnalyticsFilters'
import analyticsService from './services/analyticsService'

// ** Module Types
import {
  SalesTrendItem,
  TopProductItem,
  SalesByProductItem,
  SalesByRouteItem,
  ReportMeta
} from './types'

const AnalyticsPage = () => {
  // Filter hook
  const {
    availableFilters,
    filtersLoading,
    startDate,
    endDate,
    selectedClients,
    selectedProducts,
    handleDateRangeChange,
    setSelectedClients,
    setSelectedProducts,
    buildFilters
  } = useAnalyticsFilters()

  // Report data state
  const [loading, setLoading] = useState(false)
  const [hasQueried, setHasQueried] = useState(false)
  const [salesTrend, setSalesTrend] = useState<SalesTrendItem[]>([])
  const [topProducts, setTopProducts] = useState<TopProductItem[]>([])
  const [salesByProduct, setSalesByProduct] = useState<SalesByProductItem[]>([])
  const [salesByRoute, setSalesByRoute] = useState<SalesByRouteItem[]>([])
  const [meta, setMeta] = useState<ReportMeta | null>(null)

  // Fetch all reports
  const handleApplyFilters = useCallback(async () => {
    const filters = buildFilters()
    setLoading(true)
    setHasQueried(true)

    try {
      // Fetch all 4 reports in parallel
      const [trendRes, topRes, productRes, routeRes] = await Promise.all([
        analyticsService.getSalesTrend(filters),
        analyticsService.getTopProducts(filters),
        analyticsService.getSalesByProduct(filters),
        analyticsService.getSalesByRoute(filters)
      ])

      setSalesTrend(trendRes.data)
      setTopProducts(topRes.data)
      setSalesByProduct(productRes.data)
      setSalesByRoute(routeRes.data)
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
        selectedClients={selectedClients}
        selectedProducts={selectedProducts}
        onDateRangeChange={handleDateRangeChange}
        onClientsChange={setSelectedClients}
        onProductsChange={setSelectedProducts}
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
