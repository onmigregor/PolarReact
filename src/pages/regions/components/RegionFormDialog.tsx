// ** Region Form Dialog — for both Add and Edit
import { useEffect } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Types
import { RegionType, RegionFormData } from '../types'

interface RegionFormDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: RegionFormData, id?: number) => Promise<void>
  region?: RegionType | null
  mode: 'add' | 'edit'
}

const showErrors = (field: string, valueLen: number, min: number) => {
  if (valueLen === 0) {
    return `El campo ${field} es requerido`
  } else if (valueLen > 0 && valueLen < min) {
    return `El campo ${field} debe tener al menos ${min} caracteres`
  } else {
    return ''
  }
}

const schema = yup.object().shape({
  citCode: yup
    .string()
    .min(2, obj => showErrors('Código Ciudad', obj.value.length, obj.min))
    .required('El código de ciudad es requerido'),
  citName: yup
    .string()
    .min(3, obj => showErrors('Ciudad', obj.value.length, obj.min))
    .required('El nombre de la ciudad es requerido'),
  staCode: yup
    .string()
    .min(2, obj => showErrors('Código Estado', obj.value.length, obj.min))
    .required('El código de estado es requerido')
})

const defaultValues: RegionFormData = {
  citCode: '',
  citName: '',
  staCode: ''
}

const RegionFormDialog = ({ open, onClose, onSubmit, region, mode }: RegionFormDialogProps) => {
  // ** Hook
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  // ** Effects
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && region) {
        reset({
          citCode: region.citCode,
          citName: region.citName,
          staCode: region.staCode
        })
      } else {
        reset(defaultValues)
      }
    }
  }, [open, mode, region, reset])

  const handleClose = () => {
    reset()
    onClose()
  }

  const onFormSubmit = async (data: RegionFormData) => {
    try {
      await onSubmit(data, mode === 'edit' ? region?.id : undefined)
      reset(defaultValues)
      handleClose()
    } catch {
      // Error handled by parent toast
    }
  }

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          handleClose()
        }
      }}
      aria-labelledby='region-form-dialog-title'
      maxWidth='sm'
      fullWidth
    >
      <form noValidate autoComplete='off' onSubmit={handleSubmit(onFormSubmit)}>
        <DialogTitle id='region-form-dialog-title' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Icon icon={mode === 'add' ? 'tabler:plus' : 'tabler:edit'} fontSize={22} />
          {mode === 'add' ? 'Agregar Región' : 'Editar Región'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={4} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <Controller
                name='citCode'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    autoFocus
                    fullWidth
                    label='Código Ciudad'
                    placeholder='Ej: CCS'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.citCode)}
                    {...(errors.citCode && { helperText: errors.citCode.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='staCode'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    label='Código Estado'
                    placeholder='Ej: DC'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.staCode)}
                    {...(errors.staCode && { helperText: errors.staCode.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='citName'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    label='Ciudad'
                    placeholder='Ej: Caracas'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.citName)}
                    {...(errors.citName && { helperText: errors.citName.message })}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 6, pb: 4 }}>
          <Button
            variant='tonal'
            color='secondary'
            onClick={handleClose}
            disabled={isSubmitting}
            startIcon={<Icon icon='tabler:x' />}
          >
            Cancelar
          </Button>
          <Button
            type='submit'
            variant='contained'
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={18} color='inherit' /> : <Icon icon='tabler:checks' />}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default RegionFormDialog
