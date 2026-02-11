import { ReactNode, ChangeEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import Skeleton from '@mui/material/Skeleton'
import Divider from '@mui/material/Divider'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

export interface Column<T> {
  id: string
  label: string
  minWidth?: number
  align?: 'left' | 'center' | 'right'
  render?: (row: T, index: number) => ReactNode
}

interface GenericTableProps<T> {
  title?: string
  columns: Column<T>[]
  data: T[]
  loading: boolean
  total: number
  page: number
  rowsPerPage: number
  searchQuery: string
  onPageChange: (event: unknown, newPage: number) => void
  onRowsPerPageChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSearchChange: (value: string) => void
  headerAction?: ReactNode
  maxHeight?: number | string
}

const GenericTable = <T extends { id: string | number }>({
  title,
  columns,
  data,
  loading,
  total,
  page,
  rowsPerPage,
  searchQuery,
  onPageChange,
  onRowsPerPageChange,
  onSearchChange,
  headerAction,
  maxHeight = 500
}: GenericTableProps<T>) => {
  const renderSkeletonRows = () => {
    return Array.from({ length: rowsPerPage }).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        {columns.map(column => (
          <TableCell key={column.id} align={column.align}>
            <Skeleton variant='text' width='80%' />
          </TableCell>
        ))}
      </TableRow>
    ))
  }

  return (
    <Card>
      <CardHeader
        title={title}
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <CustomTextField
              size='small'
              placeholder='Buscar...'
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              sx={{ minWidth: 250 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Icon icon='tabler:search' fontSize={20} />
                  </InputAdornment>
                )
              }}
            />
            {headerAction}
          </Box>
        }
      />
      <Divider sx={{ m: '0 !important' }} />
      <TableContainer component={Paper} sx={{ maxHeight }}>
        <Table stickyHeader aria-label='generic table'>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  sx={{ minWidth: column.minWidth, fontWeight: 600 }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              renderSkeletonRows()
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align='center' sx={{ py: 8 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Icon icon='tabler:database-off' fontSize={40} />
                    <Typography color='text.secondary'>
                      {searchQuery ? 'No se encontraron resultados' : 'No hay datos registrados'}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <TableRow hover tabIndex={-1} key={row.id}>
                  {columns.map(column => (
                    <TableCell key={column.id} align={column.align || 'left'}>
                      {column.render ? (
                        column.render(row, index)
                      ) : (
                        <Typography variant='body2'>{(row as any)[column.id]}</Typography>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component='div'
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        labelRowsPerPage='Filas por página:'
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      />
    </Card>
  )
}

export default GenericTable
