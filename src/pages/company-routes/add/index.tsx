// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'
import CompanyRouteForm from '../components/CompanyRouteForm'

// ** Services & Types
import companyRouteService from '../services/companyRouteService'
import { CompanyRouteFormData } from '../types'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import toast from 'react-hot-toast'

const CompanyRouteAdd = () => {
  // ** Hooks
  const router = useRouter()

  const handleFormSubmit = async (formData: CompanyRouteFormData) => {
    try {
      await companyRouteService.store(formData)
      toast.success('Compañía creada exitosamente')
      router.push('/company-routes')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al crear la compañía')
    }
  }

  return (
    <Box>
      <PageHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              variant='tonal'
              color='secondary'
              onClick={() => router.back()}
              sx={{ mr: 4, px: 2, minWidth: 0 }}
            >
              <Icon icon='tabler:chevron-left' />
            </Button>
            <Typography variant='h4'>Agregar Nueva Compañía</Typography>
          </Box>
        }
        subtitle={
          <Typography sx={{ color: 'text.secondary', ml: 12 }}>
            Configuración general y de ruta para la nueva compañía
          </Typography>
        }
      />
      <Box sx={{ mt: 6 }}>
        <CompanyRouteForm onSubmit={handleFormSubmit} />
      </Box>
    </Box>
  )
}

CompanyRouteAdd.acl = {
  action: 'create',
  subject: 'regions'
}

export default CompanyRouteAdd
