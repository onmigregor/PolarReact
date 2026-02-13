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

interface ClientsByTenantItem {
  company_route_name: string
  total_clients: number
}

const COLORS = [
  '#7367F0', '#28C76F', '#FF9F43', '#00CFE8', '#EA5455',
  '#9F87FF', '#FF6F91', '#845EC2', '#00C9A7', '#FFC75F'
]

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload as ClientsByTenantItem

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
        <Typography variant='subtitle2'>{item.company_route_name}</Typography>
        <Typography variant='body2'>Clientes: {item.total_clients.toLocaleString()}</Typography>
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

const ClientsByTenantChart = () => {
  // ** States
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<ClientsByTenantItem[]>([])
  const [totalClients, setTotalClients] = useState(0)

  // ** Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await axios.get('/analytics/reports/clients-by-tenant')

        if (response.data.success) {
          setData(response.data.data)
          setTotalClients(response.data.meta?.total_clients ?? 0)
        }
      } catch (error) {
        console.error('Error fetching clients by tenant:', error)
        setData([])
        setTotalClients(0)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <Card>
      <CardHeader
        title='👥 Clientes por Tenant'
        subheader={loading ? 'Cargando...' : `${data.length} tenants | ${totalClients.toLocaleString()} clientes total`}
        subheaderTypographyProps={{ sx: { color: theme => `${theme.palette.text.disabled} !important` } }}
      />
      <CardContent>
        {loading ? (
          <Skeleton variant='rectangular' height={350} sx={{ borderRadius: 1 }} />
        ) : data.length === 0 ? (
          <Box sx={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography color='text.secondary'>No hay datos de clientes. Ejecuta master-client:sync.</Typography>
          </Box>
        ) : (
          <>
            {/* Donut */}
            <Box sx={{ height: 280, mb: 2 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data}
                    dataKey='total_clients'
                    nameKey='company_route_name'
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
                    <TableCell>Tenant</TableCell>
                    <TableCell align='right'>Clientes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: COLORS[index % COLORS.length] }} />
                          <Typography variant='body2'>{item.company_route_name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align='right'>
                        <Typography variant='body2' fontWeight={600}>
                          {item.total_clients.toLocaleString()}
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

export default ClientsByTenantChart
