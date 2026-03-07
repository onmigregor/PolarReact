// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import FormHelperText from '@mui/material/FormHelperText'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Types & Services
import { UserType, RoleType } from '../types'
import userService from '../services/userService'

interface UserFormDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: any, id?: number) => Promise<void>
  user?: UserType | null
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
  name: yup
    .string()
    .min(3, obj => showErrors('Nombre', obj.value.length, obj.min))
    .required('El nombre es requerido'),
  email: yup.string().email('Email inválido').required('El email es requerido'),
  password: yup.string().when('mode', {
    is: (mode: string) => mode === 'add',
    then: schema => schema.min(8, obj => showErrors('Contraseña', obj.value.length, obj.min)).required('La contraseña es requerida'),
    otherwise: schema => schema.nullable().transform(value => (value === '' ? null : value)).test('min-if-not-null', 'Mínimo 8 caracteres', function(value) {
      if (!value) return true

      return value.length >= 8
    })
  }),
  password_confirmation: yup.string().when('password', {
    is: (val: string) => val && val.length > 0,
    then: schema => schema.oneOf([yup.ref('password')], 'Las contraseñas no coinciden').required('Confirma tu contraseña'),
    otherwise: schema => schema.nullable().transform(value => (value === '' ? null : value))
  }),
  roles: yup.number().required('El rol es requerido'),
  active: yup.boolean()
})

const defaultValues = {
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  roles: '' as any,
  active: true
}

const UserFormDialog = ({ open, onClose, onSubmit, user, mode }: UserFormDialogProps) => {
  // ** State
  const [roles, setRoles] = useState<RoleType[]>([])
  const [loadingRoles, setLoadingRoles] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // ** Hook
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema),
    context: { mode }
  })

  // ** Fetch Roles
  useEffect(() => {
    const fetchRoles = async () => {
      setLoadingRoles(true)
      try {
        const data = await userService.getRoles()
        setRoles(data)
      } catch (error) {
        console.error('Error fetching roles:', error)
      } finally {
        setLoadingRoles(false)
      }
    }
    fetchRoles()
  }, [])

  // ** Effects
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && user) {
        reset({
          name: user.name,
          email: user.email,
          password: '',
          password_confirmation: '',
          roles: user.roles[0]?.id || '',
          active: user.active
        })
      } else {
        reset(defaultValues)
      }
      setShowPassword(false)
    }
  }, [open, mode, user, reset])

  const handleClose = () => {
    reset()
    onClose()
  }

  const onFormSubmit = async (data: any) => {
    const payload = {
      ...data,
      roles: data.roles ? [data.roles] : []
    }
    try {
      await onSubmit(payload, mode === 'edit' ? user?.id : undefined)
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
      aria-labelledby='user-form-dialog-title'
      maxWidth='md'
      fullWidth
    >
      <form noValidate autoComplete='off' onSubmit={handleSubmit(onFormSubmit)}>
        <DialogTitle id='user-form-dialog-title' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Icon icon={mode === 'add' ? 'tabler:user-plus' : 'tabler:user-edit'} fontSize={22} />
          {mode === 'add' ? 'Agregar Nuevo Usuario' : 'Editar Usuario'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={4} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <Controller
                name='name'
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    autoFocus
                    fullWidth
                    label='Nombre Completo'
                    placeholder='Ej: Juan Pérez'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.name)}
                    {...(errors.name && { helperText: errors.name.message })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='email'
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    label='Correo Electrónico'
                    placeholder='ejemplo@correo.com'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.email)}
                    {...(errors.email && { helperText: errors.email.message })}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='roles'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <FormControl fullWidth error={Boolean(errors.roles)}>
                    <InputLabel id='roles-select-label'>Rol</InputLabel>
                    <Select
                      labelId='roles-select-label'
                      id='roles-select'
                      value={value}
                      label='Rol'
                      onChange={onChange}
                    >
                      {loadingRoles ? (
                        <MenuItem disabled>
                          <CircularProgress size={20} sx={{ mr: 2 }} /> Cargando roles...
                        </MenuItem>
                      ) : (
                        roles.map(role => (
                          <MenuItem key={role.id} value={role.id}>
                            {role.name}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                    {errors.roles && <FormHelperText>{errors.roles.message as string}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Active Switch in Form */}
            <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
              <Controller
                name='active'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <FormControlLabel
                    control={<Switch checked={value} onChange={onChange} color='primary' />}
                    label={value ? 'Usuario Activo' : 'Usuario Inactivo'}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='password'
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    label={mode === 'add' ? 'Contraseña' : 'Nueva Contraseña (opcional)'}
                    placeholder='••••••••'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.password)}
                    {...(errors.password && { helperText: errors.password.message })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <Icon icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='password_confirmation'
                control={control}
                render={({ field: { value, onChange, onBlur } }) => (
                  <CustomTextField
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    label='Confirmar Contraseña'
                    placeholder='••••••••'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.password_confirmation)}
                    {...(errors.password_confirmation && { helperText: errors.password_confirmation.message })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <Icon icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 6, pb: 6 }}>
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
            startIcon={isSubmitting ? <CircularProgress size={18} color='inherit' /> : <Icon icon='tabler:device-floppy' />}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default UserFormDialog
