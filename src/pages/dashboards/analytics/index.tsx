// ** React Imports
import { useState, useMemo } from 'react'

// ** MUI Import
import Grid from '@mui/material/Grid'

// ** Demo Component Imports
import AnalyticsFilterHeader, { generateMonthOptions } from 'src/views/dashboards/analytics/AnalyticsFilterHeader'
import SalesTrendChart from 'src/views/dashboards/analytics/SalesTrendChart'
import TopProductsChart from 'src/views/dashboards/analytics/TopProductsChart'
import SalesByRouteChart from 'src/views/dashboards/analytics/SalesByRouteChart'
import TopGroupsByLitersChart from 'src/views/dashboards/analytics/TopGroupsByLitersChart'
import TopGroupsByKilosChart from 'src/views/dashboards/analytics/TopGroupsByKilosChart'
import ClientsByTenantChart from 'src/views/dashboards/analytics/ClientsByTenantChart'
import ClientsTrendChart from 'src/views/dashboards/analytics/ClientsTrendChart'
import PortfolioVariationChart from 'src/views/dashboards/analytics/PortfolioVariationChart'

// ** Hook Import
import { useAnalyticsFilters } from 'src/@modules/analytics/hooks/useAnalyticsFilters'

// ** Custom Component Import
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import RechartsWrapper from 'src/@core/styles/libs/recharts'

const AnalyticsDashboard = () => {
  // ** Hooks
  const {
    availableFilters,
    filtersLoading,
    selectedClients,
    setSelectedClients,
    filteredClientOptions,
    selectedRoutes,
    setSelectedRoutes,
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
    selectedFqCodes,
    setSelectedFqCodes,
    selectedVendorGroups,
    setSelectedVendorGroups,
    selectedOffices,
    setSelectedOffices,
    selectedTerritories,
    setSelectedTerritories,
    handleDateRangeChange,
    buildFilters
  } = useAnalyticsFilters()

  // ** States
  const monthOptions = useMemo(() => generateMonthOptions(), [])
  const [selectedMonth, setSelectedMonth] = useState(monthOptions[0]?.value || '')

  const handleMonthChange = (newValue: string, start: string, end: string) => {
    setSelectedMonth(newValue)
    handleDateRangeChange([new Date(start + 'T00:00:00'), new Date(end + 'T00:00:00')])
  }

  return (
    <ApexChartWrapper>
      <RechartsWrapper>
        <KeenSliderWrapper>
          <Grid container spacing={6}>

            {/* Filter Header */}
            <Grid item xs={12}>
              <AnalyticsFilterHeader
                selectedMonth={selectedMonth}
                onMonthChange={handleMonthChange}
                availableFilters={availableFilters}
                filtersLoading={filtersLoading}
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
              />
            </Grid>

            {/* Sales Trend Chart (Full Width) */}
            <Grid item xs={12}>
              <SalesTrendChart filters={buildFilters()} />
            </Grid>

            {/* Clients Trend Chart (Full Width) */}
            <Grid item xs={12}>
              <ClientsTrendChart />
            </Grid>

            {/* Top Products & Sales by Route (Two Columns) */}
            <Grid item xs={12} md={6}>
              <TopProductsChart filters={buildFilters()} />
            </Grid>
            <Grid item xs={12} md={6}>
              <SalesByRouteChart filters={buildFilters()} />
            </Grid>

            {/* Grupos por Litros y por Kilos */}
            <Grid item xs={12} md={6}>
              <TopGroupsByLitersChart filters={buildFilters()} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TopGroupsByKilosChart filters={buildFilters()} />
            </Grid>

            {/* Clientes por Tenant y Variación de Cartera */}
            <Grid item xs={12} md={6}>
              <ClientsByTenantChart />
            </Grid>
            <Grid item xs={12} md={6}>
              <PortfolioVariationChart />
            </Grid>

          </Grid>
        </KeenSliderWrapper>
      </RechartsWrapper>
    </ApexChartWrapper>
  )
}

export default AnalyticsDashboard
