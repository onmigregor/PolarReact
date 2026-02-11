// ** Delete Confirmation Dialog
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import CircularProgress from '@mui/material/CircularProgress'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

interface DeleteConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  loading: boolean
  regionName?: string
}

const DeleteConfirmDialog = ({ open, onClose, onConfirm, loading, regionName }: DeleteConfirmDialogProps) => {
  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      aria-labelledby='delete-dialog-title'
      aria-describedby='delete-dialog-description'
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          onClose()
        }
      }}
    >
      <DialogTitle id='delete-dialog-title' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Icon icon='tabler:alert-triangle' fontSize={22} color='error' />
        Confirmar Eliminación
      </DialogTitle>
      <DialogContent>
        <DialogContentText id='delete-dialog-description'>
          ¿Está seguro de que desea eliminar la región
          {regionName ? <strong> "{regionName}"</strong> : ''}?
          Esta acción no se puede deshacer.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 6, pb: 4 }}>
        <Button
          variant='tonal'
          color='secondary'
          onClick={onClose}
          disabled={loading}
          startIcon={<Icon icon='tabler:x' />}
        >
          Cancelar
        </Button>
        <Button
          variant='contained'
          color='error'
          onClick={onConfirm}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={18} color='inherit' /> : <Icon icon='tabler:trash' />}
        >
          {loading ? 'Eliminando...' : 'Eliminar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteConfirmDialog
