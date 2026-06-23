// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { useTheme } from '@mui/material/styles'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Axios Import
import axios from 'src/configs/axios'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import CustomAvatar from 'src/@core/components/mui/avatar'

interface TrendItem {
  month: string
  raw_month: string
  smart_fq: number
  sap_polar: number
}

interface Totals {
  smart_fq: number
  sap_polar: number
  variation_num: number
  variation_pct: number
}

const ClientsTrendChart = () => {
  // ** Hooks
  const theme = useTheme()

  // ** States
  const [loading, setLoading] = useState(false)
  const [totals, setTotals] = useState<Totals>({
    smart_fq: 0,
    sap_polar: 0,
    variation_num: 0,
    variation_pct: 0
  })
  const [trendData, setTrendData] = useState<TrendItem[]>([])

  // ** Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await axios.get('/analytics/reports/clients-trend')

        if (response.data.success && response.data.data) {
          setTotals(response.data.data.totals)
          setTrendData(response.data.data.trend)
        }
      } catch (error) {
        console.error('Error fetching clients trend:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // ** Chart configurations
  const categories = trendData.map(d => d.month)
  const seriesSmartFq = trendData.map(d => d.smart_fq)
  const seriesSapPolar = trendData.map(d => d.sap_polar)

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
      dropShadow: {
        top: 14,
        blur: 4,
        left: 0,
        enabled: true,
        opacity: 0.12,
        color: theme.palette.primary.main
      }
    },
    tooltip: {
      shared: true,
      y: [
        {
          formatter: (val: number) => `${val.toLocaleString('es-VE')} clientes`
        },
        {
          formatter: (val: number) => `${val.toLocaleString('es-VE')} clientes`
        }
      ]
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left'
    },
    markers: {
      size: 4,
      strokeWidth: 0
    },
    stroke: {
      curve: 'smooth',
      width: [4, 4]
    },
    grid: {
      show: true,
      padding: { top: -12, bottom: -8 },
      borderColor: theme.palette.divider,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } }
    },
    colors: [theme.palette.primary.main, theme.palette.success.main],
    fill: {
      type: ['gradient', 'gradient'],
      opacity: [1, 1],
      gradient: {
        type: 'vertical',
        opacityFrom: 0.35,
        opacityTo: 0.05,
        stops: [0, 95, 100]
      }
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      categories: categories,
      labels: {
        style: {
          colors: theme.palette.text.disabled,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize as string
        }
      }
    },
    yaxis: {
      title: { text: 'Clientes', style: { color: theme.palette.text.disabled } },
      labels: {
        formatter: (val: number) => val.toFixed(0),
        style: {
          colors: theme.palette.text.disabled,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize as string
        }
      }
    }
  }

  const series = [
    {
      name: 'Smart FQ (Clientes sin Código CEP)',
      type: 'area',
      data: seriesSmartFq
    },
    {
      name: 'SAP Polar (Clientes con Código)',
      type: 'area',
      data: seriesSapPolar
    }
  ]

  return (
    <Card>
      <CardHeader
        title='Tendencia de Cartera de Clientes'
        subheader={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', mt: 1 }}>
            {/* SAP Polar */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CustomAvatar skin='light' variant='rounded' color='success' sx={{ width: 34, height: 34 }}>
                <Icon fontSize='1.25rem' icon='tabler:database' />
              </CustomAvatar>
              <Box>
                <Typography variant='body2' sx={{ color: 'text.disabled' }}>SAP Polar (Clientes con Código)</Typography>
                <Typography variant='h6'>{totals.sap_polar.toLocaleString('es-VE')}</Typography>
              </Box>
            </Box>

            {/* Smart FQ */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CustomAvatar skin='light' variant='rounded' color='warning' sx={{ width: 34, height: 34 }}>
                <Icon fontSize='1.25rem' icon='tabler:users' />
              </CustomAvatar>
              <Box>
                <Typography variant='body2' sx={{ color: 'text.disabled' }}>Smart FQ (Clientes sin Código CEP)</Typography>
                <Typography variant='h6'>{totals.smart_fq.toLocaleString('es-VE')}</Typography>
              </Box>
            </Box>

            {/* Variación */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CustomAvatar 
                skin='light' 
                variant='rounded' 
                color='info' 
                sx={{ width: 34, height: 34 }}
              >
                <Icon fontSize='1.25rem' icon='tabler:arrows-left-right' />
              </CustomAvatar>
              <Box>
                <Typography variant='body2' sx={{ color: 'text.disabled' }}>Variación (Diferencia)</Typography>
                <Typography variant='h6' sx={{ color: 'text.primary' }}>
                  {totals.variation_num.toLocaleString('es-VE')} ({totals.variation_pct}%)
                </Typography>
              </Box>
            </Box>
          </Box>
        }
      />
      <CardContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
            <CircularProgress />
          </Box>
        ) : trendData.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
            <Typography variant='body2' color='text.disabled'>
              No hay datos históricos de cartera
            </Typography>
          </Box>
        ) : (
          <ReactApexcharts type='area' height={300} options={options} series={series} />
        )}
      </CardContent>
    </Card>
  )
}

export default ClientsTrendChart
