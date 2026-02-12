// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'

// ** Custom Components Imports
// ** Custom Components Imports
import GenericTable, { Column } from 'src/@core/components/generic-table'
import PageHeader from 'src/@core/components/page-header'
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Hooks & Services
import { useDataTable } from 'src/hooks/useDataTable'
import companyRouteService from './services/companyRouteService'
import regionService from 'src/pages/regions/services/regionService'

// ** Types
import { CompanyRouteType } from './types'
import { RegionType } from 'src/pages/regions/types'

// ** Dialogs
import DeleteConfirmDialog from 'src/pages/regions/components/DeleteConfirmDialog'

// ** Third Party Imports
import toast from 'react-hot-toast'

const CompanyRoutesList = () => {
  // ** State
  const [openDelete, setOpenDelete] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState<CompanyRouteType | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [regions, setRegions] = useState<RegionType[]>([])
  const [routeFilter, setRouteFilter] = useState<string>('')

  // ** Hook for Data Table
  const {
    data,
    total,
    loading,
    page,
    rowsPerPage,
    searchQuery,
    handleChangePage,
    handleChangeRowsPerPage,
    handleSearchChange,
    handleFilterChange,
    refresh
  } = useDataTable<CompanyRouteType>({
    fetchData: companyRouteService.getAll
  })

  // ** Fetch regions for filter
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await regionService.getAll({ per_page: 100 })
        setRegions(response.data)
      } catch (error) {
        console.error('Error fetching regions:', error)
      }
    }
    fetchRegions()
  }, [])

  // ** Handlers
  const handleDeleteClick = (route: CompanyRouteType) => {
    setSelectedRoute(route)
    setOpenDelete(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedRoute) return
    setDeleteLoading(true)
    try {
      await companyRouteService.destroy(selectedRoute.id)
      toast.success('Compañía eliminada correctamente')
      setOpenDelete(false)
      refresh()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al eliminar la compañía')
    } finally {
      setDeleteLoading(false)
    }
  }

  const onRouteFilterChange = (val: string) => {
    setRouteFilter(val)
    handleFilterChange({ region_id: val }) // Filter by region_id as originally used in backend
  }

  // ** Table Columns
  const columns: Column<CompanyRouteType>[] = [
    {
      id: 'code',
      label: 'Código',
      render: (row: CompanyRouteType) => (
        <Typography variant='body2' sx={{ fontWeight: 500 }}>
          {row.code}
        </Typography>
      )
    },
    {
      id: 'name',
      label: 'Nombre / RIF',
      render: (row: CompanyRouteType) => (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='body2' sx={{ fontWeight: 500 }}>
            {row.name}
          </Typography>
          <Typography variant='caption' color='text.secondary'>
            {row.rif}
          </Typography>
        </Box>
      )
    },
    {
      id: 'route_name',
      label: 'Ruta',
      render: (row: CompanyRouteType) => (
        <Typography variant='body2'>
          {row.route_name || '-'}
        </Typography>
      )
    },
    {
      id: 'region',
      label: 'Región',
      render: (row: CompanyRouteType) => (
        <Typography variant='body2'>
          {row.region?.citName || '-'}
        </Typography>
      )
    },
    {
      id: 'db_name',
      label: 'BD',
      render: (row: CompanyRouteType) => (
        <Typography variant='caption' sx={{ fontFamily: 'monospace' }}>
          {row.db_name}
        </Typography>
      )
    },
    {
      id: 'actions',
      label: 'Acciones',
      align: 'center',
      render: (row: CompanyRouteType) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Tooltip title='Editar'>
            <IconButton size='small' component={Link} href={`/company-routes/edit/${row.id}`} color='info'>
              <Icon icon='tabler:edit' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Eliminar'>
            <IconButton size='small' color='error' onClick={() => handleDeleteClick(row)}>
              <Icon icon='tabler:trash' />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  return (
    <>
      <PageHeader
        title={<Typography variant='h4'>Compañías (Rutas)</Typography>}
        subtitle={<Typography sx={{ color: 'text.secondary' }}>Gestión de rutas y bases de datos por compañía</Typography>}
        action={
          <Button variant='contained' component={Link} href='/company-routes/add' startIcon={<Icon icon='tabler:plus' />}>
            Nueva Compañía
          </Button>
        }
      />

      <Card sx={{ mt: 6 }}>
        <GenericTable
          columns={columns as any}
          data={data}
          total={total}
          loading={loading}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          headerAction={
            <Box sx={{ display: 'flex', alignItems: { xs: 'stretch', md: 'center' }, gap: 4, flexDirection: { xs: 'column', md: 'row' }, width: '100%' }}>
              <Box sx={{ width: { xs: '100%', md: 300 }, flexShrink: 0 }}>
                <CustomTextField
                  select
                  fullWidth
                  size='small'
                  label='Filtrar por Región'
                  value={routeFilter}
                  onChange={e => onRouteFilterChange(e.target.value)}
                  SelectProps={{ displayEmpty: true }}
                >
                  <MenuItem value=''>Todas las regiones</MenuItem>
                  {regions.map(region => (
                     <MenuItem key={region.id} value={region.id}>
                       {region.citName}
                     </MenuItem>
                  ))}
                </CustomTextField>
              </Box>
            </Box>
          }
        />
      </Card>

      <DeleteConfirmDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        regionName={selectedRoute?.name}
      />
    </>
  )
}

CompanyRoutesList.acl = {
  action: 'read',
  subject: 'regions' // Reuse regions subject for now or use a specific one if defined
}

export default CompanyRoutesList
