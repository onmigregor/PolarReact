// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { UserType } from '../types'

interface UserDeleteDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  user: UserType | null
}

const UserDeleteDialog = ({ open, onClose, onConfirm, user }: UserDeleteDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby='user-delete-dialog-title'
      maxWidth='xs'
      fullWidth
    >
      <DialogTitle id='user-delete-dialog-title' sx={{ textAlign: 'center', pt: 10 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
          <Icon icon='tabler:alert-triangle' color='error' fontSize='4rem' />
        </Box>
        <Typography variant='h5' component='span'>
          ¿Estás seguro de eliminar este usuario?
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center', pb: 10 }}>
        <Typography variant='body1'>
          Estás a punto de eliminar al usuario <strong>{user?.name}</strong>.
          Esta acción no se puede deshacer.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 10 }}>
        <Button variant='tonal' color='secondary' onClick={onClose}>
          Cancelar
        </Button>
        <Button variant='contained' color='error' onClick={onConfirm}>
          Eliminar Usuario
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UserDeleteDialog
