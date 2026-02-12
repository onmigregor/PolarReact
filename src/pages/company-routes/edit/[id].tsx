// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'
import CompanyRouteForm from '../components/CompanyRouteForm'

// ** Services & Types
import companyRouteService from '../services/companyRouteService'
import { CompanyRouteType, CompanyRouteFormData } from '../types'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import toast from 'react-hot-toast'

const CompanyRouteEdit = () => {
  // ** Hooks
  const router = useRouter()
  const { id } = router.query

  // ** State
  const [data, setData] = useState<CompanyRouteType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await companyRouteService.getById(id as string)
          setData(response.data)
        } catch (error: any) {
          toast.error('Error al cargar la información de la compañía')
          router.push('/company-routes')
        } finally {
          setLoading(false)
        }
      }
    }
    fetchData()
  }, [id, router])

  const handleFormSubmit = async (formData: CompanyRouteFormData) => {
    if (!id) return
    try {
      await companyRouteService.update(id as string, formData)
      toast.success('Compañía actualizada exitosamente')
      router.push('/company-routes')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al actualizar la compañía')
    }
  }

  if (loading) {
    return (
      <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDir: 'column', justifyContent: 'center' }}>
        <CircularProgress sx={{ mb: 4 }} />
        <Typography>Cargando información...</Typography>
      </Box>
    )
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
            <Typography variant='h4'>Editar Compañía: {data?.name}</Typography>
          </Box>
        }
        subtitle={
          <Typography sx={{ color: 'text.secondary', ml: 12 }}>
            Actualiza la configuración de la compañía y su ruta asignada
          </Typography>
        }
      />
      <Box sx={{ mt: 6 }}>
        <CompanyRouteForm data={data} onSubmit={handleFormSubmit} />
      </Box>
    </Box>
  )
}

CompanyRouteEdit.acl = {
  action: 'update',
  subject: 'regions'
}

export default CompanyRouteEdit
