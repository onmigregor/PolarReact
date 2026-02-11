// ** Regions Module — Main Page
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party
import toast from 'react-hot-toast'

// ** Module Imports
import regionService from './services/regionService'
import RegionFormDialog from './components/RegionFormDialog'
import DeleteConfirmDialog from './components/DeleteConfirmDialog'
import { RegionType, RegionFormData } from './types'

// ** Hook & Generic Component
import { useDataTable } from 'src/hooks/useDataTable'
import GenericTable, { Column } from 'src/@core/components/generic-table'

const RegionsPage = () => {
  // ** Hooks
  const { data, total, loading, page, rowsPerPage, searchQuery, handleSearchChange, paginationProps, refresh } =
    useDataTable<RegionType>({
      fetchData: regionService.getAll
    })

  // Dialog state
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [formDialogMode, setFormDialogMode] = useState<'add' | 'edit'>('add')
  const [selectedRegion, setSelectedRegion] = useState<RegionType | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteRegion, setDeleteRegion] = useState<RegionType | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // ** Column Definitions
  const columns: Column<RegionType>[] = [
    {
      id: 'index',
      label: '#',
      minWidth: 60,
      align: 'center',
      render: (_, index) => (
        <Typography variant='body2' sx={{ color: 'text.secondary' }}>
          {page * rowsPerPage + index + 1}
        </Typography>
      )
    },
    {
      id: 'citCode',
      label: 'Código Ciudad',
      minWidth: 140,
      render: row => (
        <Typography variant='body2' sx={{ fontWeight: 500 }}>
          {row.citCode}
        </Typography>
      )
    },
    { id: 'citName', label: 'Ciudad', minWidth: 200 },
    { id: 'staCode', label: 'Código Estado', minWidth: 140 },
    {
      id: 'actions',
      label: 'Acciones',
      minWidth: 120,
      align: 'center',
      render: row => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Tooltip title='Editar'>
            <IconButton size='small' color='info' onClick={() => handleOpenEdit(row)}>
              <Icon icon='tabler:edit' fontSize={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Eliminar'>
            <IconButton size='small' color='error' onClick={() => handleOpenDelete(row)}>
              <Icon icon='tabler:trash' fontSize={20} />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  // ** Add
  const handleOpenAdd = () => {
    setFormDialogMode('add')
    setSelectedRegion(null)
    setFormDialogOpen(true)
  }

  // ** Edit
  const handleOpenEdit = (region: RegionType) => {
    setFormDialogMode('edit')
    setSelectedRegion(region)
    setFormDialogOpen(true)
  }

  // ** Save (create or update)
  const handleFormSubmit = async (data: RegionFormData, id?: number) => {
    try {
      if (id) {
        const response = await regionService.update(id, data)
        toast.success(response.message || 'Región actualizada exitosamente')
      } else {
        const response = await regionService.store(data)
        toast.success(response.message || 'Región creada exitosamente')
      }
      refresh()
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Error al guardar la región'
      toast.error(message)
      throw error // Let the dialog know it failed
    }
  }

  // ** Delete
  const handleOpenDelete = (region: RegionType) => {
    setDeleteRegion(region)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deleteRegion) return

    setDeleteLoading(true)
    try {
      const response = await regionService.destroy(deleteRegion.id)
      toast.success(response.message || 'Región eliminada exitosamente')
      setDeleteDialogOpen(false)
      setDeleteRegion(null)
      refresh()
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Error al eliminar la región'
      toast.error(msg)
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant='h4' sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Icon icon='tabler:map-pin' fontSize={28} />
            Regiones
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Gestión de regiones del sistema
          </Typography>
        </Box>
        <Button variant='contained' startIcon={<Icon icon='tabler:plus' />} onClick={handleOpenAdd}>
          Agregar Región
        </Button>
      </Box>

      {/* Table Card */}
      <GenericTable
        title='Listado de Regiones'
        columns={columns}
        data={data}
        loading={loading}
        total={total}
        page={page}
        rowsPerPage={rowsPerPage}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onPageChange={paginationProps.onPageChange}
        onRowsPerPageChange={paginationProps.onRowsPerPageChange}
      />

      {/* Add/Edit Dialog */}
      <RegionFormDialog
        open={formDialogOpen}
        onClose={() => setFormDialogOpen(false)}
        onSubmit={handleFormSubmit}
        region={selectedRegion}
        mode={formDialogMode}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false)
          setDeleteRegion(null)
        }}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        regionName={deleteRegion?.citName}
      />
    </Box>
  )
}

RegionsPage.acl = {
  action: 'read',
  subject: 'regions'
}

export default RegionsPage
