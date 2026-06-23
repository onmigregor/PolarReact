// ** Master Clients Module — Main Page
import { useState, useEffect } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import GenericTable, { Column } from 'src/@core/components/generic-table'
import PageHeader from 'src/@core/components/page-header'
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Hooks & Services
import { useDataTable } from 'src/hooks/useDataTable'
import masterClientService from 'src/@modules/master-lists/services/masterClientService'

// ** Types
import { MasterClientType, FilterOption } from 'src/@modules/master-lists/types'

const MasterClientsPage = () => {
  // ** State for filters
  const [tp1, setTp1] = useState<string>('')
  const [tp2, setTp2] = useState<string>('')
  const [cit, setCit] = useState<string>('')
  const [hasCep, setHasCep] = useState<boolean>(false)

  // ** Dropdown options state
  const [tp1Options, setTp1Options] = useState<FilterOption[]>([])
  const [tp2Options, setTp2Options] = useState<FilterOption[]>([])
  const [citOptions, setCitOptions] = useState<FilterOption[]>([])

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
    handleFilterChange
  } = useDataTable<MasterClientType>({
    fetchData: masterClientService.getAll
  })

  // ** Load initial filter options on mount
  useEffect(() => {
    const loadInitialFilters = async () => {
      try {
        const response = await masterClientService.getFilters()
        if (response.success && response.data) {
          setTp1Options(response.data.tp1_codes || [])
          setTp2Options(response.data.tp2_codes || [])
          setCitOptions(response.data.cit_codes || [])
        }
      } catch (error) {
        console.error('Error loading filter options:', error)
      }
    }
    loadInitialFilters()
  }, [])

  // ** Dynamic / Dependent filter handlers
  const handleTp1Change = async (value: string) => {
    setTp1(value)
    setTp2('')
    setCit('')
    
    // Update data table filters (reset dependent filters in API query)
    handleFilterChange({ tp1_code: value, tp2_code: '', cit_code: '' })

    try {
      const response = await masterClientService.getFilters({ tp1_code: value })
      if (response.success && response.data) {
        setTp2Options(response.data.tp2_codes || [])
        setCitOptions(response.data.cit_codes || [])
      }
    } catch (error) {
      console.error('Error loading dependent TP2 filters:', error)
    }
  }

  const handleTp2Change = async (value: string) => {
    setTp2(value)
    setCit('')

    // Update data table filters (reset dependent filter in API query)
    handleFilterChange({ tp2_code: value, cit_code: '' })

    try {
      const response = await masterClientService.getFilters({ tp1_code: tp1, tp2_code: value })
      if (response.success && response.data) {
        setCitOptions(response.data.cit_codes || [])
      }
    } catch (error) {
      console.error('Error loading dependent CIT filters:', error)
    }
  }

  const handleCitChange = (value: string) => {
    setCit(value)
    handleFilterChange({ cit_code: value })
  }

  const handleHasCepChange = (checked: boolean) => {
    setHasCep(checked)
    handleFilterChange({ has_cep: checked })
  }

  // ** Table Column Definitions
  const columns: Column<MasterClientType>[] = [
    {
      id: 'cep',
      label: 'Cód. Cliente (CEP)',
      minWidth: 140,
      render: row => (
        <Typography variant='body2' sx={{ fontWeight: 600, color: row.cep ? 'text.primary' : 'text.disabled' }}>
          {row.cep || 'Sin Código'}
        </Typography>
      )
    },
    {
      id: 'cliente',
      label: 'Nombre / Razón Social',
      minWidth: 220,
      render: row => (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='body2' sx={{ fontWeight: 500 }}>
            {row.cliente || row.cus_name || 'Sin Nombre'}
          </Typography>
          {(row.cus_business_name && row.cus_business_name !== row.cliente) && (
            <Typography variant='caption' color='text.secondary'>
              {row.cus_business_name}
            </Typography>
          )}
        </Box>
      )
    },
    {
      id: 'cus_tax_id1',
      label: 'RIF',
      minWidth: 130,
      render: row => (
        <Typography variant='body2'>
          {row.cus_tax_id1 || 'N/A'}
        </Typography>
      )
    },
    {
      id: 'ruta',
      label: 'Ruta',
      minWidth: 110,
      render: row => (
        <Typography variant='body2'>
          {row.ruta || 'S/R'}
        </Typography>
      )
    },
    {
      id: 'grupo_vendedor',
      label: 'Grupo Vendedor',
      minWidth: 140,
      render: row => (
        <Typography variant='body2'>
          {row.grupo_vendedor || '-'}
        </Typography>
      )
    },
    {
      id: 'zona_fq',
      label: 'Zona / Cód. FQ',
      minWidth: 140,
      render: row => (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='body2'>
            {row.zona_venta || '-'}
          </Typography>
          {row.codigo_fq && (
            <Typography variant='caption' color='text.secondary'>
              FQ: {row.codigo_fq}
            </Typography>
          )}
        </Box>
      )
    },
    {
      id: 'oficina',
      label: 'Oficina',
      minWidth: 120,
      render: row => (
        <Typography variant='body2'>
          {row.oficina || '-'}
        </Typography>
      )
    },
    {
      id: 'territorio',
      label: 'Territorio',
      minWidth: 120,
      render: row => (
        <Typography variant='body2'>
          {row.territorio || '-'}
        </Typography>
      )
    },
    {
      id: 'direccion',
      label: 'Dirección Física',
      minWidth: 250,
      render: row => (
        <Typography variant='body2' noWrap title={row.direccion || ''} sx={{ maxWidth: 250, textOverflow: 'ellipsis', overflow: 'hidden' }}>
          {row.direccion || '-'}
        </Typography>
      )
    },
    {
      id: 'coordenadas',
      label: 'Coordenadas (Lat, Lng)',
      minWidth: 180,
      render: row => (
        <Typography variant='body2' sx={{ fontFamily: 'monospace' }}>
          {(row.latitud || row.longitud) ? `${row.latitud || '?'}, ${row.longitud || '?'}` : '-'}
        </Typography>
      )
    },
    {
      id: 'cedula_coordinador',
      label: 'CI Coordinador (PV)',
      minWidth: 160,
      render: row => (
        <Typography variant='body2'>
          {row.cedula_coordinador || '-'}
        </Typography>
      )
    },
    {
      id: 'company_route_name',
      label: 'Cuenta / Sucursal Tenant',
      minWidth: 200,
      render: row => (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='body2'>
            {row.company_route_name || '-'}
          </Typography>
          {row.company_route_db && (
            <Typography variant='caption' sx={{ fontFamily: 'monospace' }} color='text.secondary'>
              {row.company_route_db}
            </Typography>
          )}
        </Box>
      )
    },
    {
      id: 'tp2_code',
      label: 'Clase 2 (Sucursal)',
      minWidth: 150,
      render: row => (
        <Typography variant='body2'>
          {row.tp2_code || '-'}
        </Typography>
      )
    },
    {
      id: 'cit_code',
      label: 'Clase 3 (Ciudad)',
      minWidth: 140,
      render: row => (
        <Typography variant='body2'>
          {row.cit_code || '-'}
        </Typography>
      )
    },
    {
      id: 'contact',
      label: 'Contacto',
      minWidth: 180,
      render: row => (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {row.cus_phone && (
            <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Icon icon='tabler:phone' fontSize={14} />
              {row.cus_phone}
            </Typography>
          )}
          {row.cus_email && (
            <Typography variant='caption' color='text.secondary' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Icon icon='tabler:mail' fontSize={12} />
              {row.cus_email}
            </Typography>
          )}
          {!row.cus_phone && !row.cus_email && (
            <Typography variant='caption' color='text.disabled'>
              No disponible
            </Typography>
          )}
        </Box>
      )
    }
  ]

  return (
    <Box>
      {/* Page Header */}
      <PageHeader
        title={
          <Typography variant='h4' sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Icon icon='tabler:database' fontSize={28} />
            Clientes Maestros
          </Typography>
        }
        subtitle={
          <Typography variant='body2' color='text.secondary'>
            Listado consolidado de clientes oficiales del Maestro Polar
          </Typography>
        }
      />

      {/* Main Table Card */}
      <Card sx={{ mt: 4 }}>
        <GenericTable
          columns={columns as any}
          data={data}
          loading={loading}
          total={total}
          page={page}
          rowsPerPage={rowsPerPage}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          headerAction={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
              {/* Selector Clase 1 */}
              <Box sx={{ width: 140 }}>
                <CustomTextField
                  select
                  fullWidth
                  size='small'
                  label='Clase 1'
                  value={tp1}
                  onChange={e => handleTp1Change(e.target.value)}
                  SelectProps={{ displayEmpty: true }}
                >
                  <MenuItem value=''>Todas</MenuItem>
                  {tp1Options.map(opt => (
                    <MenuItem key={opt.code} value={opt.code}>
                      {opt.name}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Box>

              {/* Selector Clase 2 */}
              <Box sx={{ width: 180 }}>
                <CustomTextField
                  select
                  fullWidth
                  size='small'
                  label='Clase 2 (Sucursal)'
                  value={tp2}
                  disabled={!tp1 && tp2Options.length === 0}
                  onChange={e => handleTp2Change(e.target.value)}
                  SelectProps={{ displayEmpty: true }}
                >
                  <MenuItem value=''>Todas</MenuItem>
                  {tp2Options.map(opt => (
                    <MenuItem key={opt.code} value={opt.code}>
                      {opt.name}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Box>

              {/* Selector Clase 3 */}
              <Box sx={{ width: 180 }}>
                <CustomTextField
                  select
                  fullWidth
                  size='small'
                  label='Clase 3 (Ciudad)'
                  value={cit}
                  disabled={!tp2 && citOptions.length === 0}
                  onChange={e => handleCitChange(e.target.value)}
                  SelectProps={{ displayEmpty: true }}
                >
                  <MenuItem value=''>Todas</MenuItem>
                  {citOptions.map(opt => (
                    <MenuItem key={opt.code} value={opt.code}>
                      {opt.name}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Box>

              {/* Checkbox Sin Código CEP */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={hasCep}
                    onChange={e => handleHasCepChange(e.target.checked)}
                    name='hasCep'
                    color='primary'
                  />
                }
                label={<Typography variant='body2'>Sin Código CEP</Typography>}
                sx={{ ml: 2, mr: 0 }}
              />
            </Box>
          }
        />
      </Card>
    </Box>
  )
}

MasterClientsPage.acl = {
  action: 'read',
  subject: 'regions'
}

export default MasterClientsPage
