// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import CleaveWrapper from 'src/@core/styles/libs/react-cleave'

// ** CleaveJS Imports
import Cleave from 'cleave.js/react'
import 'cleave.js/dist/addons/cleave-phone.us'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Types & Services
import { CompanyRouteType, CompanyRouteFormData } from '../types'
import regionService from 'src/pages/regions/services/regionService'
import { RegionType } from 'src/pages/regions/types'

interface CompanyRouteFormProps {
  data?: CompanyRouteType | null
  onSubmit: (data: CompanyRouteFormData) => Promise<void>
  loading?: boolean
}

const schema = yup.object().shape({
  code: yup.string().required('El código es requerido'),
  name: yup.string().required('El nombre es requerido'),
  rif: yup.string().required('El RIF es requerido'),
  fiscal_address: yup.string().required('La dirección fiscal es requerida'),
  description: yup.string().nullable(),
  region_id: yup.number().typeError('La región es requerida').required('La región es requerida'),
  db_name: yup.string().required('El nombre de la base de datos es requerido'),
  route_name: yup.string().nullable()
})

const defaultValues: CompanyRouteFormData = {
  code: '',
  name: '',
  rif: '',
  fiscal_address: '',
  description: '',
  region_id: '',
  db_name: '',
  route_name: ''
}

const CompanyRouteForm = ({ data, onSubmit, loading }: CompanyRouteFormProps) => {
  // ** States
  const [regions, setRegions] = useState<RegionType[]>([])
  const [fetchingRegions, setFetchingRegions] = useState(false)

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

  // ** Fetch Regions
  useEffect(() => {
    const fetchRegions = async () => {
      setFetchingRegions(true)
      try {
        const response = await regionService.getAllRegions()
        setRegions(response.data)
      } catch (error) {
        console.error('Error fetching regions:', error)
      } finally {
        setFetchingRegions(false)
      }
    }
    fetchRegions()
  }, [])

  // ** Effect for edit mode
  useEffect(() => {
    if (data) {
      reset({
        code: data.code,
        name: data.name,
        rif: data.rif,
        fiscal_address: data.fiscal_address,
        description: data.description || '',
        region_id: data.region?.id ? Number(data.region.id) : '',
        db_name: data.db_name,
        route_name: data.route_name || ''
      })
    }
  }, [data, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={6}>
        {/* Card 1: Información General */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Información General' />
            <CardContent>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='code'
                    control={control}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <CustomTextField
                        fullWidth
                        label='Código'
                        placeholder='Ej: R-001'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.code)}
                        {...(errors.code && { helperText: errors.code.message })}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name='rif'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Box>
                        <InputLabel sx={{ mb: 2, fontSize: '.875rem', color: 'text.secondary' }}>RIF</InputLabel>
                        <CleaveWrapper>
                          <Cleave
                            placeholder='J-12345678-9'
                            options={{ blocks: [1, 8, 1], delimiter: '-', uppercase: true }}
                            value={value}
                            onChange={onChange}
                            className='form-control' // Class name might not be needed due to styled component
                          />
                        </CleaveWrapper>
                        {errors.rif && (
                          <Typography variant='caption' sx={{ color: 'error.main', mt: 1, display: 'block' }}>
                            {errors.rif.message}
                          </Typography>
                        )}
                      </Box>
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name='name'
                    control={control}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <CustomTextField
                        fullWidth
                        label='Nombre de la Compañía'
                        placeholder='Ej: Compañía ABC'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.name)}
                        {...(errors.name && { helperText: errors.name.message })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name='fiscal_address'
                    control={control}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <CustomTextField
                        fullWidth
                        multiline
                        rows={2}
                        label='Dirección Fiscal'
                        placeholder='Dirección completa'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.fiscal_address)}
                        {...(errors.fiscal_address && { helperText: errors.fiscal_address.message })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name='description'
                    control={control}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <CustomTextField
                        fullWidth
                        multiline
                        rows={2}
                        label='Descripción'
                        placeholder='Opcional...'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.description)}
                        {...(errors.description && { helperText: errors.description.message })}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 2: Información de Ruta */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Información de Ruta' />
            <CardContent>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name='region_id'
                    control={control}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <CustomTextField
                        select
                        fullWidth
                        label='Región'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.region_id)}
                        {...(errors.region_id && { helperText: errors.region_id.message })}
                        SelectProps={{
                          displayEmpty: true,
                          disabled: fetchingRegions
                        }}
                      >
                        <MenuItem value='' disabled>
                          {fetchingRegions ? 'Cargando...' : 'Selecciona una región'}
                        </MenuItem>
                        {regions.map(region => (
                          <MenuItem key={region.id} value={region.id}>
                            {region.citName} ({region.citCode})
                          </MenuItem>
                        ))}
                      </CustomTextField>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name='db_name'
                    control={control}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <CustomTextField
                        fullWidth
                        label='Base de Datos'
                        placeholder='Ej: polar_db_001'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.db_name)}
                        {...(errors.db_name && { helperText: errors.db_name.message })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name='route_name'
                    control={control}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <CustomTextField
                        fullWidth
                        label='Nombre de Ruta'
                        placeholder='Ej: RUTA-NORTE'
                        value={value}
                        onBlur={onBlur}
                        onChange={e => onChange(e.target.value.toUpperCase())}
                        error={Boolean(errors.route_name)}
                        {...(errors.route_name && { helperText: errors.route_name.message })}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Form Actions */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
            <Button
              type='submit'
              variant='contained'
              disabled={isSubmitting || loading}
              startIcon={isSubmitting || loading ? <CircularProgress size={18} color='inherit' /> : <Icon icon='tabler:checks' />}
            >
              {isSubmitting || loading ? 'Guardando...' : 'Guardar Compañía'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  )
}

export default CompanyRouteForm
