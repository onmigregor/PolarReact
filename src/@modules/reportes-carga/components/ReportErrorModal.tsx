import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Paper,
  Divider
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import { IBulkImportLog } from '../types/reportesCarga.types'

interface ReportErrorModalProps {
  open: boolean
  record: IBulkImportLog | null
  onClose: () => void
}

const ReportErrorModal: React.FC<ReportErrorModalProps> = ({ open, record, onClose }) => {
  if (!record) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Icon icon='tabler:alert-circle' fontSize={24} color='error' />
        <Typography variant='h6' color='error'>
          Detalles del Fallo #{record.id}
        </Typography>
      </DialogTitle>
      <Divider />

      <DialogContent>
        <Typography variant='body2' sx={{ mb: 2, fontWeight: 600 }}>
          Archivo: {record.filename}
        </Typography>

        <Paper
          variant='outlined'
          sx={{
            p: 3,
            backgroundColor: 'error.light',
            color: 'error.contrastText',
            borderColor: 'error.main',
            borderRadius: 2,
            maxHeight: 250,
            overflowY: 'auto'
          }}
        >
          <Typography
            variant='caption'
            component='pre'
            sx={{
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              color: 'error.main',
              m: 0
            }}
          >
            {record.error_log || 'Ocurrió un error no especificado durante la importación.'}
          </Typography>
        </Paper>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant='contained' color='secondary'>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ReportErrorModal
