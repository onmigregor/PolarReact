// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import GenericTable, { Column } from 'src/@core/components/generic-table'
import PageHeader from 'src/@core/components/page-header'

// ** Hooks & Services
import { useDataTable } from 'src/hooks/useDataTable'
import userService from './services/userService'

// ** Types
import { UserType, UserFormData } from './types'

// ** Dialogs
import UserFormDialog from './components/UserFormDialog'
import UserDeleteDialog from './components/UserDeleteDialog'

// ** Third Party Imports
import toast from 'react-hot-toast'

const UsersPage = () => {
  // ** State
  const [openForm, setOpenForm] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [mode, setMode] = useState<'add' | 'edit'>('add')

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
    refresh
  } = useDataTable<UserType>({
      fetchData: userService.getUsers
    })

  // ** Handlers
  const handleAdd = () => {
    setMode('add')
    setSelectedUser(null)
    setOpenForm(true)
  }

  const handleEdit = (user: UserType) => {
    setMode('edit')
    setSelectedUser(user)
    setOpenForm(true)
  }

  const handleDeleteClick = (user: UserType) => {
    setSelectedUser(user)
    setOpenDelete(true)
  }

  const handleToggleStatus = async (user: UserType) => {
    try {
      await userService.toggleStatus(user.id)
      toast.success('Estado actualizado correctamente')
      refresh() // Refresh table
    } catch (error) {
      toast.error('Error al actualizar el estado')
    }
  }

  const handleFormSubmit = async (formData: UserFormData, id?: number) => {
    try {
      if (mode === 'add') {
        await userService.createUser(formData)
        toast.success('Usuario creado con éxito')
      } else if (id) {
        await userService.updateUser(id, formData)
        toast.success('Usuario actualizado con éxito')
      }
      refresh()
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Error al procesar la solicitud'
      toast.error(msg)
      throw error // Re-throw to keep dialog open if needed
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedUser) return
    try {
      await userService.deleteUser(selectedUser.id)
      toast.success('Usuario eliminado correctamente')
      setOpenDelete(false)
      refresh()
    } catch (error) {
      toast.error('Error al eliminar el usuario')
    }
  }

  // ** Table Columns
  const columns: Column<UserType>[] = [
    {
      id: 'name',
      label: 'Nombre',
      render: (row: UserType) => (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='body1' sx={{ fontWeight: 500 }}>
            {row.name}
          </Typography>
          <Typography variant='caption' color='text.secondary'>
            {row.email}
          </Typography>
        </Box>
      )
    },
    {
      id: 'roles',
      label: 'Roles',
      render: (row: UserType) => (
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {row.roles.map(role => (
            <Chip key={role.id} label={role.name} size='small' color='info' variant='outlined' />
          ))}
        </Box>
      )
    },
    {
      id: 'active',
      label: 'Estado',
      render: (row: UserType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Switch
            size='small'
            checked={row.active}
            onChange={() => handleToggleStatus(row)}
            color='primary'
          />
          <Typography variant='body2' sx={{ ml: 1, color: row.active ? 'success.main' : 'text.disabled' }}>
            {row.active ? 'Activo' : 'Inactivo'}
          </Typography>
        </Box>
      )
    },
    {
      id: 'actions',
      label: 'Acciones',
      render: (row: UserType) => (
        <Box sx={{ display: 'flex' }}>
          <IconButton size='small' color='primary' onClick={() => handleEdit(row)}>
            <Icon icon='tabler:edit' />
          </IconButton>
          <IconButton size='small' color='error' onClick={() => handleDeleteClick(row)}>
            <Icon icon='tabler:trash' />
          </IconButton>
        </Box>
      )
    }
  ]

  return (
    <>
      <PageHeader
        title={<Typography variant='h4'>Gestión de Usuarios</Typography>}
        subtitle={<Typography sx={{ color: 'text.secondary' }}>Administra los accesos y roles de tu equipo</Typography>}
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
            <Button variant='contained' startIcon={<Icon icon='tabler:plus' />} onClick={handleAdd}>
              Nuevo Usuario
            </Button>
          }
        />
      </Card>

      <UserFormDialog
        open={openForm}
        mode={mode}
        user={selectedUser}
        onClose={() => setOpenForm(false)}
        onSubmit={handleFormSubmit}
      />

      <UserDeleteDialog
        open={openDelete}
        user={selectedUser}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}

UsersPage.acl = {
  action: 'read',
  subject: 'admin'
}

export default UsersPage
