// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

// ** Third Party Imports
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  TooltipProps
} from 'recharts'

// ** Axios Import
import axios from 'src/configs/axios'

interface SalesByRouteItem {
  client_name: string
  route: string
  total_transactions: number
  total_billed_bs: number
  total_billed_usd: number
}

interface Props {
  startDate: string
  endDate: string
}

const COLORS = [
  '#7367F0', '#28C76F', '#FF9F43', '#00CFE8', '#EA5455',
  '#9F87FF', '#FF6F91', '#845EC2', '#00C9A7', '#FFC75F'
]

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
          borderColor: 'divider'
        }}
      >
        <Typography variant='subtitle2'>{item.client_name} — {item.route}</Typography>
        <Typography variant='body2'>Transacciones: {item.total_transactions.toLocaleString()}</Typography>
        <Typography variant='body2'>USD: ${item.total_billed_usd.toLocaleString('es-VE', { minimumFractionDigits: 2 })}</Typography>
      </Box>
    )
  }

  return null
}

const RADIAN = Math.PI / 180
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.05) return null

  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text x={x} y={y} fill='#fff' textAnchor='middle' dominantBaseline='central' fontSize={12} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

const SalesByRouteChart = ({ startDate, endDate }: Props) => {
  // ** States
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<SalesByRouteItem[]>([])

  // ** Fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (!startDate || !endDate) return

      setLoading(true)
      try {
        const response = await axios.post('/analytics/reports/sales-by-route', {
          start_date: startDate,
          end_date: endDate
        })

        if (response.data.success) {
          setData(response.data.data)
        }
      } catch (error) {
        console.error('Error fetching sales by route:', error)
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [startDate, endDate])

  const totalUsd = data.reduce((sum, item) => sum + item.total_billed_usd, 0)

  return (
    <Card>
      <CardHeader
        title='🚛 Ventas por Ruta'
        subheader={loading ? 'Cargando...' : `${data.length} rutas | $${totalUsd.toLocaleString('es-VE', { minimumFractionDigits: 2 })} USD total`}
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
          <>
            {/* Donut */}
            <Box sx={{ height: 280, mb: 2 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data}
                    dataKey='total_billed_usd'
                    nameKey='route'
                    cx='50%'
                    cy='50%'
                    innerRadius={70}
                    outerRadius={120}
                    label={renderCustomLabel}
                    labelLine={false}
                  >
                    {data.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            {/* Legend Table */}
            <TableContainer>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>Cliente / Ruta</TableCell>
                    <TableCell align='right'>Transacciones</TableCell>
                    <TableCell align='right'>USD</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: COLORS[index % COLORS.length] }} />
                          <Typography variant='body2'>{item.client_name} — {item.route}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align='right'>
                        <Typography variant='body2'>{item.total_transactions.toLocaleString()}</Typography>
                      </TableCell>
                      <TableCell align='right'>
                        <Typography variant='body2' fontWeight={600}>
                          ${item.total_billed_usd.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default SalesByRouteChart
