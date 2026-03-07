// ** Sales by Product per Month — Multi-line chart
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  TooltipProps
} from 'recharts'

import { SalesByProductItem } from '../../types'

interface Props {
  data: SalesByProductItem[]
  loading: boolean
}

const MONTHS = ['', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const COLORS = [
  '#7367F0', '#28C76F', '#FF9F43', '#00CFE8', '#EA5455',
  '#9F87FF', '#FF6F91', '#845EC2', '#00C9A7', '#FFC75F'
]

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
          borderColor: 'divider',
          maxWidth: 300
        }}
      >
        <Typography variant='subtitle2' sx={{ mb: 1 }}>{label}</Typography>
        {payload.map((entry, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.3 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: entry.color }} />
            <Typography variant='body2' noWrap>
              {entry.name}: {entry.value?.toLocaleString()} uds
            </Typography>
          </Box>
        ))}
      </Box>
    )
  }

  return null
}

const SalesByProductChart = ({ data, loading }: Props) => {
  // Transform: pivot data so each month is a row with product columns
  const monthMap = new Map<string, any>()
  const productNames = new Set<string>()

  data.forEach(item => {
    const key = `${item.year}-${String(item.month).padStart(2, '0')}`
    const label = `${MONTHS[item.month]} ${item.year}`

    if (!monthMap.has(key)) {
      monthMap.set(key, { name: label, sortKey: key })
    }

    const row = monthMap.get(key)!
    row[item.product_name] = (row[item.product_name] || 0) + item.total_quantity
    productNames.add(item.product_name)
  })

  const chartData = Array.from(monthMap.values()).sort((a, b) => a.sortKey.localeCompare(b.sortKey))

  // Limit to top 8 products by total quantity
  const productTotals: Record<string, number> = {}
  data.forEach(item => {
    productTotals[item.product_name] = (productTotals[item.product_name] || 0) + item.total_quantity
  })
  const topProducts = Object.entries(productTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([name]) => name)

  return (
    <Card>
      <CardHeader
        title='📦 Ventas por Producto / Mes'
        subheader={loading ? 'Cargando...' : `${topProducts.length} productos principales`}
        subheaderTypographyProps={{ sx: { color: theme => `${theme.palette.text.disabled} !important` } }}
      />
      <CardContent>
        {loading ? (
          <Skeleton variant='rectangular' height={400} sx={{ borderRadius: 1 }} />
        ) : data.length === 0 ? (
          <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography color='text.secondary'>No hay datos para el rango seleccionado</Typography>
          </Box>
        ) : (
          <Box sx={{ height: 400 }}>
            <ResponsiveContainer>
              <LineChart data={chartData} margin={{ left: 10, right: 10, top: 5 }}>
                <CartesianGrid strokeDasharray='3 3' stroke='#e0e0e0' />
                <XAxis dataKey='name' tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => v.toLocaleString()} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {topProducts.map((name, index) => (
                  <Line
                    key={name}
                    type='monotone'
                    dataKey={name}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default SalesByProductChart
