// ** React Imports
import { useState, useMemo } from 'react'

// ** MUI Import
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

// ** Demo Component Imports
import AnalyticsFilterHeader, { generateMonthOptions } from 'src/views/dashboards/analytics/AnalyticsFilterHeader'
import SalesTrendChart from 'src/views/dashboards/analytics/SalesTrendChart'
import TopProductsChart from 'src/views/dashboards/analytics/TopProductsChart'
import SalesByRouteChart from 'src/views/dashboards/analytics/SalesByRouteChart'

import AnalyticsProject from 'src/views/dashboards/analytics/AnalyticsProject'
import AnalyticsOrderVisits from 'src/views/dashboards/analytics/AnalyticsOrderVisits'
import AnalyticsTotalEarning from 'src/views/dashboards/analytics/AnalyticsTotalEarning'
import AnalyticsSourceVisits from 'src/views/dashboards/analytics/AnalyticsSourceVisits'
import AnalyticsEarningReports from 'src/views/dashboards/analytics/AnalyticsEarningReports'
import AnalyticsSupportTracker from 'src/views/dashboards/analytics/AnalyticsSupportTracker'
import AnalyticsSalesByCountries from 'src/views/dashboards/analytics/AnalyticsSalesByCountries'
import AnalyticsMonthlyCampaignState from 'src/views/dashboards/analytics/AnalyticsMonthlyCampaignState'
import AnalyticsWebsiteAnalyticsSlider from 'src/views/dashboards/analytics/AnalyticsWebsiteAnalyticsSlider'

// ** Custom Component Import
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import RechartsWrapper from 'src/@core/styles/libs/recharts'
import CardStatsWithAreaChart from 'src/@core/components/card-statistics/card-stats-with-area-chart'

const AnalyticsDashboard = () => {
  // ** States
  const monthOptions = useMemo(() => generateMonthOptions(), [])
  const [selectedMonth, setSelectedMonth] = useState(monthOptions[0]?.value || '')

  // Initialize with the first month option (current month)
  const [startDate, setStartDate] = useState(monthOptions[0]?.startDate || '')
  const [endDate, setEndDate] = useState(monthOptions[0]?.endDate || '')

  const handleMonthChange = (newValue: string, start: string, end: string) => {
    setSelectedMonth(newValue)
    setStartDate(start)
    setEndDate(end)
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
              />
            </Grid>

            {/* Sales Trend Chart (Full Width) */}
            <Grid item xs={12}>
              <SalesTrendChart startDate={startDate} endDate={endDate} />
            </Grid>

            {/* Top Products & Sales by Route (Two Columns) */}
            <Grid item xs={12} md={6}>
              <TopProductsChart startDate={startDate} endDate={endDate} />
            </Grid>
            <Grid item xs={12} md={6}>
              <SalesByRouteChart startDate={startDate} endDate={endDate} />
            </Grid>

            {/* Divider */}
            <Grid item xs={12}>
              <Divider sx={{ my: 4 }}>
                <Typography variant='caption' sx={{ color: 'text.disabled', textTransform: 'uppercase' }}>
                  Otras Métricas
                </Typography>
              </Divider>
            </Grid>

            {/* Original Analytics Components */}
            <Grid item xs={12} lg={6}>
              <AnalyticsWebsiteAnalyticsSlider />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <AnalyticsOrderVisits />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <CardStatsWithAreaChart
                stats='97.5k'
                chartColor='success'
                avatarColor='success'
                title='Revenue Generated'
                avatarIcon='tabler:credit-card'
                chartSeries={[{ data: [6, 35, 25, 61, 32, 84, 70] }]}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <AnalyticsEarningReports />
            </Grid>
            <Grid item xs={12} md={6}>
              <AnalyticsSupportTracker />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <AnalyticsSalesByCountries />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <AnalyticsTotalEarning />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <AnalyticsMonthlyCampaignState />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <AnalyticsSourceVisits />
            </Grid>
            <Grid item xs={12} lg={8}>
              <AnalyticsProject />
            </Grid>
          </Grid>
        </KeenSliderWrapper>
      </RechartsWrapper>
    </ApexChartWrapper>
  )
}

export default AnalyticsDashboard
