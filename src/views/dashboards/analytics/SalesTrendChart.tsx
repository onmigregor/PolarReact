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

interface DailySalesData {
  date: string
  total_transactions: number
  total_billed_bs: number
  total_billed_usd: number
  total_pending: number
}

interface Props {
  startDate: string
  endDate: string
}

const SalesTrendChart = ({ startDate, endDate }: Props) => {
  // ** Hooks
  const theme = useTheme()

  // ** States
  const [loading, setLoading] = useState(false)
  const [salesData, setSalesData] = useState<DailySalesData[]>([])

  // ** Fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (!startDate || !endDate) return

      setLoading(true)
      try {
        const response = await axios.post('/analytics/reports/daily-sales-trend', {
          start_date: startDate,
          end_date: endDate
        })

        if (response.data.success) {
          setSalesData(response.data.data)
        }
      } catch (error) {
        console.error('Error fetching daily sales trend:', error)
        setSalesData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [startDate, endDate])

  // ** Derived stats
  const totalTransactions = salesData.reduce((sum, d) => sum + d.total_transactions, 0)
  const totalUSD = salesData.reduce((sum, d) => sum + d.total_billed_usd, 0)

  // ** Chart data
  const categories = salesData.map(d => {
    const day = new Date(d.date + 'T00:00:00').getDate()

    return String(day)
  })

  const seriesUSD = salesData.map(d => Number(d.total_billed_usd?.toFixed(2) || 0))
  const seriesTransactions = salesData.map(d => d.total_transactions)

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
          formatter: (val: number) => `$${val.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`
        },
        {
          formatter: (val: number) => `${val.toLocaleString('es-VE')}`
        }
      ]
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left'
    },
    markers: {
      size: 1,
      strokeWidth: 0
    },
    stroke: {
      curve: 'smooth',
      width: [4, 3]
    },
    grid: {
      show: true,
      padding: { top: -12, bottom: -8 },
      borderColor: theme.palette.divider,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } }
    },
    colors: [theme.palette.primary.main, theme.palette.info.main],
    fill: {
      type: ['gradient', 'solid'],
      opacity: [1, 0.3],
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
    yaxis: [
      {
        title: { text: 'USD ($)', style: { color: theme.palette.text.disabled } },
        labels: {
          formatter: (val: number) => `$${val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val.toFixed(0)}`,
          style: {
            colors: theme.palette.text.disabled,
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.body2.fontSize as string
          }
        }
      },
      {
        opposite: true,
        title: { text: 'Transacciones', style: { color: theme.palette.text.disabled } },
        labels: {
          formatter: (val: number) => val.toFixed(0),
          style: {
            colors: theme.palette.text.disabled,
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.body2.fontSize as string
          }
        }
      }
    ]
  }

  const series = [
    {
      name: 'Ventas USD',
      type: 'area',
      data: seriesUSD
    },
    {
      name: 'Transacciones',
      type: 'line',
      data: seriesTransactions
    }
  ]

  return (
    <Card>
      <CardHeader
        title='Tendencia de Ventas'
        subheader={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CustomAvatar skin='light' variant='rounded' color='info' sx={{ width: 30, height: 30 }}>
                <Icon fontSize='1.125rem' icon='tabler:shopping-cart' />
              </CustomAvatar>
              <Box>
                <Typography variant='body2' sx={{ color: 'text.disabled' }}>Transacciones</Typography>
                <Typography variant='h6'>{totalTransactions.toLocaleString('es-VE')}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CustomAvatar skin='light' variant='rounded' color='success' sx={{ width: 30, height: 30 }}>
                <Icon fontSize='1.125rem' icon='tabler:currency-dollar' />
              </CustomAvatar>
              <Box>
                <Typography variant='body2' sx={{ color: 'text.disabled' }}>Total USD</Typography>
                <Typography variant='h6'>${totalUSD.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</Typography>
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
        ) : salesData.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
            <Typography variant='body2' color='text.disabled'>
              No hay datos para el período seleccionado
            </Typography>
          </Box>
        ) : (
          <ReactApexcharts type='line' height={300} options={options} series={series} />
        )}
      </CardContent>
    </Card>
  )
}

export default SalesTrendChart
