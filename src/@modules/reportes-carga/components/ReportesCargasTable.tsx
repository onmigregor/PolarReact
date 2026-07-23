import React from 'react'
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material'
import GenericTable, { Column } from 'src/@core/components/generic-table'
import Icon from 'src/@core/components/icon'
import { IBulkImportLog } from '../types/reportesCarga.types'

interface ReportesCargasTableProps {
  data: IBulkImportLog[]
  total: number
  loading: boolean
  page: number
  rowsPerPage: number
  searchQuery: string
  onPageChange: (event: unknown, newPage: number) => void
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onSearchChange: (value: string) => void
  onViewSummary: (record: IBulkImportLog) => void
  onViewError: (record: IBulkImportLog) => void
  onRetryProcedures: (record: IBulkImportLog) => void
  headerAction?: React.ReactNode
}

const MODULE_BADGE_MAP: Record<string, { label: string; color: 'success' | 'info' | 'primary' | 'secondary' | 'warning' | 'error' | 'default' }> = {
  products: { label: 'Productos', color: 'success' },
  customers: { label: 'Clientes', color: 'info' },
  companies: { label: 'Empresas', color: 'secondary' },
  promotions: { label: 'Promociones', color: 'warning' },
  discounts: { label: 'Descuentos', color: 'warning' },
  generals: { label: 'Generales', color: 'default' },
  invoices: { label: 'Facturas', color: 'primary' },
  products_price: { label: 'Precios', color: 'success' },
  planes_dinamicos: { label: 'Planes Dinámicos', color: 'info' },
  equipos_adc: { label: 'Equipos ADC', color: 'error' }
}

const ReportesCargasTable: React.FC<ReportesCargasTableProps> = ({
  data,
  total,
  loading,
  page,
  rowsPerPage,
  searchQuery,
  onPageChange,
  onRowsPerPageChange,
  onSearchChange,
  onViewSummary,
  onViewError,
  onRetryProcedures,
  headerAction
}) => {
  const columns: Column<IBulkImportLog>[] = [
    {
      id: 'id',
      label: '#',
      minWidth: 60,
      render: (row: IBulkImportLog) => (
        <Typography variant='body2' sx={{ fontWeight: 600 }}>
          #{row.id}
        </Typography>
      )
    },
    {
      id: 'type',
      label: 'Módulo',
      minWidth: 120,
      render: (row: IBulkImportLog) => {
        const badgeInfo = MODULE_BADGE_MAP[row.type] || { label: row.type, color: 'default' }
        
return <Chip size='small' label={badgeInfo.label} color={badgeInfo.color as any} variant='outlined' />
      }
    },
    {
      id: 'filename',
      label: 'Archivo Original',
      minWidth: 200,
      render: (row: IBulkImportLog) => (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='body2' sx={{ fontWeight: 600, wordBreak: 'break-all' }}>
            {row.filename}
          </Typography>
          {row.user?.email && (
            <Typography variant='caption' color='text.secondary'>
              {row.user.email}
            </Typography>
          )}
        </Box>
      )
    },
    {
      id: 'status',
      label: 'Estado Carga',
      minWidth: 120,
      render: (row: IBulkImportLog) => {
        const statusMap: Record<string, { label: string; color: 'warning' | 'info' | 'success' | 'error' }> = {
          pending: { label: 'Pendiente', color: 'warning' },
          processing: { label: 'Procesando...', color: 'info' },
          completed: { label: 'Completado', color: 'success' },
          failed: { label: 'Fallido', color: 'error' }
        }
        const st = statusMap[row.status] || { label: row.status, color: 'info' }

        return <Chip size='small' label={st.label} color={st.color} />
      }
    },
    {
      id: 'sync_status',
      label: 'Sincronización',
      minWidth: 130,
      render: (row: IBulkImportLog) => {
        if (!row.sync_status) return <Typography variant='caption' color='text.secondary'>N/A</Typography>

        const syncMap: Record<string, { label: string; color: 'info' | 'success' | 'error' }> = {
          syncing: { label: 'Sincronizando...', color: 'info' },
          synced: { label: 'Sincronizado', color: 'success' },
          sync_failed: { label: 'Error Sinc', color: 'error' }
        }
        const sy = syncMap[row.sync_status] || { label: row.sync_status, color: 'info' }

        return <Chip size='small' label={sy.label} color={sy.color} variant='filled' />
      }
    },
    {
      id: 'procedures_status',
      label: 'Procedimientos',
      minWidth: 130,
      render: (row: IBulkImportLog) => {
        if (row.type !== 'invoices') return <Typography variant='caption' color='text.secondary'>N/A</Typography>
        if (!row.procedures_status) return <Typography variant='caption' color='text.secondary'>N/A</Typography>

        const procMap: Record<string, { label: string; color: 'success' | 'error' | 'warning' }> = {
          completado: { label: 'Ejecutados', color: 'success' },
          fallido: { label: 'Error Proc', color: 'error' },
          pendiente: { label: 'Pendiente', color: 'warning' }
        }
        const pr = procMap[row.procedures_status] || { label: row.procedures_status, color: 'warning' }

        return <Chip size='small' label={pr.label} color={pr.color} />
      }
    },
    {
      id: 'progress',
      label: 'Progreso',
      minWidth: 90,
      align: 'center',
      render: (row: IBulkImportLog) => (
        <Typography variant='body2' sx={{ fontWeight: 600 }}>
          {row.progress ?? 0}%
        </Typography>
      )
    },
    {
      id: 'created_at',
      label: 'Fecha / Hora',
      minWidth: 150,
      render: (row: IBulkImportLog) => (
        <Typography variant='caption' color='text.secondary'>
          {row.created_at ? new Date(row.created_at).toLocaleString('es-ES') : '-'}
        </Typography>
      )
    },
    {
      id: 'actions',
      label: 'Acciones',
      minWidth: 160,
      align: 'center',
      render: (row: IBulkImportLog) => (
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
          {row.status === 'completed' && (
            <Tooltip title='Ver Reporte'>
              <IconButton size='small' color='success' onClick={() => onViewSummary(row)}>
                <Icon icon='tabler:chart-bar' fontSize={20} />
              </IconButton>
            </Tooltip>
          )}

          {row.status === 'failed' && (
            <Tooltip title='Ver Error'>
              <IconButton size='small' color='error' onClick={() => onViewError(row)}>
                <Icon icon='tabler:alert-triangle' fontSize={20} />
              </IconButton>
            </Tooltip>
          )}

          {row.type === 'invoices' && (row.procedures_status === 'fallido' || row.sync_status === 'sync_failed') && (
            <Tooltip title='Re-ejecutar Procedures'>
              <IconButton size='small' color='warning' onClick={() => onRetryProcedures(row)}>
                <Icon icon='tabler:refresh' fontSize={20} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )
    }
  ]

  return (
    <GenericTable
      title='Historial de Cargas Masivas'
      columns={columns as any}
      data={data}
      total={total}
      loading={loading}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      headerAction={headerAction}
    />
  )
}

export default ReportesCargasTable
