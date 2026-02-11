// ** Sales Trend Chart — LineChart with Area
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  TooltipProps,
  Area,
  AreaChart
} from 'recharts'

import { SalesTrendItem } from '../../types'

interface Props {
  data: SalesTrendItem[]
  loading: boolean
}

const MONTHS = ['', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const formatCurrency = (value: number) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`

  return `$${value.toFixed(0)}`
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 2,
          borderRadius: 1,
          boxShadow: 3,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Typography variant='subtitle2' sx={{ mb: 1 }}>{label}</Typography>
        {payload.map((entry, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: entry.color }} />
            <Typography variant='body2'>
              {entry.name}: {entry.name === 'Transacciones'
                ? entry.value?.toLocaleString()
                : `$${entry.value?.toLocaleString('es-VE', { minimumFractionDigits: 2 })}`
              }
            </Typography>
          </Box>
        ))}
      </Box>
    )
  }

  return null
}

const SalesTrendChart = ({ data, loading }: Props) => {
  const chartData = data.map(item => ({
    name: `${MONTHS[item.month]} ${item.year}`,
    'Facturado USD': item.total_billed_usd,
    'Facturado Bs': item.total_billed_bs,
    Transacciones: item.total_transactions,
    Pendiente: item.total_pending
  }))

  // Calculate totals for header
  const totalUsd = data.reduce((sum, item) => sum + item.total_billed_usd, 0)
  const totalTransactions = data.reduce((sum, item) => sum + item.total_transactions, 0)

  return (
    <Card>
      <CardHeader
        title='📈 Tendencia de Ventas'
        subheader={loading ? 'Cargando...' : `${totalTransactions.toLocaleString()} transacciones | ${formatCurrency(totalUsd)} USD total`}
        subheaderTypographyProps={{ sx: { color: theme => `${theme.palette.text.disabled} !important` } }}
      />
      <CardContent>
        {loading ? (
          <Skeleton variant='rectangular' height={350} sx={{ borderRadius: 1 }} />
        ) : data.length === 0 ? (
          <Box sx={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography color='text.secondary'>No hay datos para el rango seleccionado</Typography>
          </Box>
        ) : (
          <Box sx={{ height: 350 }}>
            <ResponsiveContainer>
              <AreaChart data={chartData} margin={{ left: 10, right: 10, top: 5 }}>
                <defs>
                  <linearGradient id='colorUsd' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='#7367F0' stopOpacity={0.3} />
                    <stop offset='95%' stopColor='#7367F0' stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id='colorPending' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='#FF4C51' stopOpacity={0.3} />
                    <stop offset='95%' stopColor='#FF4C51' stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray='3 3' stroke='#e0e0e0' />
                <XAxis dataKey='name' tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type='monotone'
                  dataKey='Facturado USD'
                  stroke='#7367F0'
                  strokeWidth={2.5}
                  fill='url(#colorUsd)'
                />
                <Area
                  type='monotone'
                  dataKey='Pendiente'
                  stroke='#FF4C51'
                  strokeWidth={2}
                  fill='url(#colorPending)'
                  strokeDasharray='5 5'
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default SalesTrendChart
