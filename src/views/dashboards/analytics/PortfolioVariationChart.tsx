// ** Portfolio Variation Chart — Recharts Donut + Table (Self-fetching)
import { useEffect, useState } from 'react'
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

interface TerritoryItem {
  territory: string
  db_name: string
  sap: number
  smart_fq: number
  variation: number
  percentage: number
}

interface PortfolioTotals {
  sap: number
  smart_fq: number
  variation: number
  total: number
}

const COLORS = [
  '#7367F0', '#28C76F', '#FF9F43', '#00CFE8', '#EA5455',
  '#9F87FF', '#FF6F91', '#845EC2', '#00C9A7', '#FFC75F'
]

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload as TerritoryItem

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
        <Typography variant='subtitle2' sx={{ fontWeight: 600, mb: 1 }}>{item.territory}</Typography>
        <Typography variant='body2' sx={{ color: 'primary.main' }}>SAP (Oficiales): {item.sap.toLocaleString()}</Typography>
        <Typography variant='body2' sx={{ color: 'success.main' }}>Smart FQ (Locales): {item.smart_fq.toLocaleString()}</Typography>
        <Typography variant='body2' sx={{ fontWeight: 500 }}>Variación: {item.variation.toLocaleString()}</Typography>
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

const PortfolioVariationChart = () => {
  // ** States
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<TerritoryItem[]>([])
  const [totals, setTotals] = useState<PortfolioTotals | null>(null)

  // ** Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await axios.post('/analytics/reports/portfolio-variation')

        if (response.data.success) {
          setData(response.data.data.territories || [])
          setTotals(response.data.data.totals || null)
        }
      } catch (error) {
        console.error('Error fetching portfolio variation:', error)
        setData([])
        setTotals(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const displayTotal = totals ? totals.total : 0
  const displaySap = totals ? totals.sap : 0
  const displaySmart = totals ? totals.smart_fq : 0

  return (
    <Card>
      <CardHeader
        title='💼 Cartera SAP vs Smart FQ por Territorio'
        subheader={loading ? 'Cargando...' : `Totales: ${displayTotal.toLocaleString()} Clientes | SAP: ${displaySap.toLocaleString()} | Smart FQ: ${displaySmart.toLocaleString()}`}
        subheaderTypographyProps={{ sx: { color: theme => `${theme.palette.text.disabled} !important` } }}
      />
      <CardContent>
        {loading ? (
          <Skeleton variant='rectangular' height={350} sx={{ borderRadius: 1 }} />
        ) : data.length === 0 ? (
          <Box sx={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography color='text.secondary'>No hay datos de cartera disponibles</Typography>
          </Box>
        ) : (
          <>
            {/* Donut Chart */}
            <Box sx={{ height: 280, mb: 2 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data}
                    dataKey='sap' // Use SAP count as slice weight
                    nameKey='territory'
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

            {/* Variation Legend Table */}
            <TableContainer>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>Territorio</TableCell>
                    <TableCell align='right'>SAP (Clientes)</TableCell>
                    <TableCell align='right'>Smart FQ (Clientes)</TableCell>
                    <TableCell align='right'>Variación</TableCell>
                    <TableCell align='right'>Participación (%)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: COLORS[index % COLORS.length] }} />
                            <Typography variant='body2' sx={{ textTransform: 'uppercase' }}>
                              {item.territory} ({item.db_name})
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align='right'>
                          <Typography variant='body2'>{item.sap.toLocaleString()}</Typography>
                        </TableCell>
                        <TableCell align='right'>
                          <Typography variant='body2'>{item.smart_fq.toLocaleString()}</Typography>
                        </TableCell>
                        <TableCell align='right'>
                          <Typography variant='body2' fontWeight={600}>
                            {item.variation.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align='right'>
                          <Typography variant='body2' color='text.secondary'>
                            {item.percentage}%
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default PortfolioVariationChart
