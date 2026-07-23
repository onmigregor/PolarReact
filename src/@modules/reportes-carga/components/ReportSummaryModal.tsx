import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Paper,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import { IBulkImportLog, TenantProceduresMap } from '../types/reportesCarga.types'

interface ReportSummaryModalProps {
  open: boolean
  record: IBulkImportLog | null
  onClose: () => void
}

const ReportSummaryModal: React.FC<ReportSummaryModalProps> = ({ open, record, onClose }) => {
  if (!record) return null

  const summary = record.summary || {}
  const rawProcLog = record.procedures_log

  let procLogMap: TenantProceduresMap | null = null
  if (typeof rawProcLog === 'object' && rawProcLog !== null) {
    procLogMap = rawProcLog as TenantProceduresMap
  } else if (typeof rawProcLog === 'string' && rawProcLog.trim().startsWith('{')) {
    try {
      procLogMap = JSON.parse(rawProcLog)
    } catch (e) {
      procLogMap = null
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth scroll='paper'>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-[#between]' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Icon icon='tabler:file-description' fontSize={24} color='success' />
          <Typography variant='h6'>Resumen de Carga #{record.id}</Typography>
        </Box>
        <Typography variant='caption' color='text.secondary'>
          {record.filename}
        </Typography>
      </DialogTitle>
      <Divider />

      <DialogContent dividers>
        {/* Sección 1: Métricas de Carga por Entidad */}
        <Typography variant='subtitle2' sx={{ mb: 3, fontWeight: 700, textTransform: 'uppercase' }}>
          Métricas Procesadas
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {Object.keys(summary).length === 0 && (
            <Grid item xs={12}>
              <Typography variant='body2' color='text.secondary'>
                No hay resumen de métricas detallado.
              </Typography>
            </Grid>
          )}

          {Object.entries(summary).map(([key, data]) => (
            <Grid item xs={12} sm={6} key={key}>
              <Paper variant='outlined' sx={{ p: 3, borderRadius: 2, backgroundColor: 'background.default' }}>
                <Typography variant='caption' sx={{ fontWeight: 700, textTransform: 'uppercase', color: 'primary.main', display: 'block', mb: 2 }}>
                  {key}
                </Typography>
                {typeof data === 'object' && data !== null ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant='body2'>Procesados:</Typography>
                      <Typography variant='body2' sx={{ fontWeight: 700, color: 'success.main' }}>
                        {data.processed ?? 0}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant='body2'>Omitidos:</Typography>
                      <Typography variant='body2' sx={{ fontWeight: 700, color: 'warning.main' }}>
                        {data.skipped ?? 0}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant='body2'>Duplicados:</Typography>
                      <Typography variant='body2' sx={{ fontWeight: 700, color: 'text.secondary' }}>
                        {data.duplicates_removed ?? 0}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Typography variant='body2'>{String(data)}</Typography>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Sección 2: Estado de Sincronización Automática */}
        {record.sync_status && (
          <Paper variant='outlined' sx={{ p: 3, mb: 4, borderRadius: 2, borderColor: record.sync_status === 'synced' ? 'success.main' : 'error.main' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant='subtitle2' sx={{ fontWeight: 700 }}>
                Resultado de Sincronización Automática
              </Typography>
              <Chip
                size='small'
                label={record.sync_status === 'synced' ? 'Sincronizado' : record.sync_status === 'sync_failed' ? 'Error' : 'Sincronizando...'}
                color={record.sync_status === 'synced' ? 'success' : record.sync_status === 'sync_failed' ? 'error' : 'info'}
              />
            </Box>
            {record.sync_log && (
              <Typography variant='caption' component='pre' sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', color: 'text.secondary' }}>
                {typeof record.sync_log === 'object' ? JSON.stringify(record.sync_log, null, 2) : String(record.sync_log)}
              </Typography>
            )}
          </Paper>
        )}

        {/* Sección 3: Procedimientos de Inventario (Tenants) */}
        {record.type === 'invoices' && (record.procedures_status || procLogMap) && (
          <Paper variant='outlined' sx={{ p: 3, borderRadius: 2, borderColor: record.procedures_status === 'completado' ? 'success.main' : 'error.main' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant='subtitle2' sx={{ fontWeight: 700 }}>
                Ejecución de Procedimientos de Inventario (Tenants)
              </Typography>
              <Chip
                size='small'
                label={record.procedures_status === 'completado' ? 'Ejecutados' : record.procedures_status === 'fallido' ? 'Falla en Procedures' : 'Pendiente'}
                color={record.procedures_status === 'completado' ? 'success' : record.procedures_status === 'fallido' ? 'error' : 'warning'}
              />
            </Box>

            {procLogMap ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {Object.entries(procLogMap).map(([tenantDb, details]) => (
                  <Paper key={tenantDb} variant='outlined' sx={{ p: 2, backgroundColor: 'background.paper' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant='body2' sx={{ fontWeight: 700 }}>
                        BD Tenant: {tenantDb}
                      </Typography>
                      <Chip
                        size='small'
                        label={details.success ? 'OK' : 'ERROR'}
                        color={details.success ? 'success' : 'error'}
                        variant='outlined'
                      />
                    </Box>
                    {details.logs && details.logs.length > 0 && (
                      <List dense disablePadding sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                        {details.logs.map((logLine, idx) => (
                          <ListItem key={idx} disablePadding sx={{ py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 24 }}>
                              <Icon
                                icon={logLine.includes('Error') ? 'tabler:alert-triangle' : 'tabler:check'}
                                fontSize={14}
                                color={logLine.includes('Error') ? 'error' : 'success'}
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={logLine}
                              primaryTypographyProps={{
                                fontSize: '0.75rem',
                                fontFamily: 'monospace',
                                color: logLine.includes('Error') ? 'error.main' : 'text.primary'
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </Paper>
                ))}
              </Box>
            ) : (
              <Typography variant='caption' color='text.secondary'>
                {String(rawProcLog || 'Sin detalle disponible.')}
              </Typography>
            )}
          </Paper>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant='contained' color='secondary'>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ReportSummaryModal
