// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'

// ** Third Party Imports
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  TooltipProps
} from 'recharts'

// ** Axios Import
import axios from 'src/configs/axios'

interface TopProductItem {
  product_id: number
  product_name: string
  total_quantity: number
  total_amount_usd: number
  total_amount_bs: number
}

interface Props {
  filters: any
}

const COLORS = [
  '#7367F0', '#28C76F', '#FF9F43', '#00CFE8', '#EA5455',
  '#9F87FF', '#FF6F91', '#845EC2', '#00C9A7', '#FFC75F'
]

const truncateLabel = (label: string, maxLen = 20): string =>
  label.length > maxLen ? `${label.substring(0, maxLen)}...` : label

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload as any

    return (
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 2,
          borderRadius: 1,
          boxShadow: 3,
          border: '1px solid',
          borderColor: 'divider',
          maxWidth: 250
        }}
      >
        <Typography variant='subtitle2' sx={{ mb: 1 }}>{item.product_name}</Typography>
        <Typography variant='body2'>Cantidad: {item.total_quantity.toLocaleString()} unidades</Typography>
        <Typography variant='body2'>USD: ${item.total_amount_usd.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</Typography>
        <Typography variant='body2'>Bs: {item.total_amount_bs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</Typography>
      </Box>
    )
  }

  return null
}

const TopProductsChart = ({ filters }: Props) => {
  // ** States
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<TopProductItem[]>([])

  // ** Fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (!filters.start_date || !filters.end_date) return

      setLoading(true)
      try {
        const response = await axios.post('/analytics/reports/top-products', {
          ...filters,
          limit: 10
        })

        if (response.data.success) {
          setData(response.data.data)
        }
      } catch (error) {
        console.error('Error fetching top products:', error)
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [filters])

  const chartData = data.map(item => ({
    ...item,
    shortName: truncateLabel(item.product_name)
  }))

  return (
    <Card>
      <CardHeader
        title='🏆 Top Productos'
        subheader={loading ? 'Cargando...' : `${data.length} productos más vendidos`}
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
              <BarChart
                data={chartData}
                layout='vertical'
                margin={{ left: 10, right: 30, top: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray='3 3' horizontal={false} />
                <XAxis
                  type='number'
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => v.toLocaleString()}
                />
                <YAxis
                  dataKey='shortName'
                  type='category'
                  width={150}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey='total_quantity' radius={[0, 4, 4, 0]} barSize={24}>
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default TopProductsChart
