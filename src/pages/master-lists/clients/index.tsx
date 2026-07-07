// ** Master Clients Module — Main Page
import { useState, useEffect } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'

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
  const [codigoFq, setCodigoFq] = useState<string>('')
  const [grupoVendedor, setGrupoVendedor] = useState<string>('')
  const [oficina, setOficina] = useState<string>('')
  const [territorio, setTerritorio] = useState<string>('')

  // ** Modal State
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false)

  // ** Dropdown options state
  const [tp1Options, setTp1Options] = useState<FilterOption[]>([])
  const [tp2Options, setTp2Options] = useState<FilterOption[]>([])
  const [citOptions, setCitOptions] = useState<FilterOption[]>([])
  const [fqOptions, setFqOptions] = useState<FilterOption[]>([])
  const [vgOptions, setVgOptions] = useState<FilterOption[]>([])
  const [officeOptions, setOfficeOptions] = useState<FilterOption[]>([])
  const [territoryOptions, setTerritoryOptions] = useState<FilterOption[]>([])

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
          setFqOptions(response.data.fq_codes || [])
          setVgOptions(response.data.vendor_groups || [])
          setOfficeOptions(response.data.offices || [])
          setTerritoryOptions(response.data.territories || [])
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

  const handleCodigoFqChange = (value: string) => {
    setCodigoFq(value)
    handleFilterChange({ codigo_fq: value })
  }

  const handleGrupoVendedorChange = (value: string) => {
    setGrupoVendedor(value)
    handleFilterChange({ grupo_vendedor: value })
  }

  const handleOficinaChange = (value: string) => {
    setOficina(value)
    handleFilterChange({ oficina: value })
  }

  const handleTerritorioChange = (value: string) => {
    setTerritorio(value)
    handleFilterChange({ territorio: value })
  }

  const handleResetAllFilters = () => {
    setTp1('')
    setTp2('')
    setCit('')
    setCodigoFq('')
    setGrupoVendedor('')
    setOficina('')
    setTerritorio('')
    handleFilterChange({
      tp1_code: '',
      tp2_code: '',
      cit_code: '',
      codigo_fq: '',
      grupo_vendedor: '',
      oficina: '',
      territorio: ''
    })
    setIsFilterModalOpen(false)
  }

  // ** Table Column Definitions (Strictly structured to the 10 requested columns)
  const columns: Column<MasterClientType>[] = [
    {
      id: 'cep',
      label: 'Código Cep',
      minWidth: 130,
      render: row => (
        <Typography variant='body2' sx={{ fontWeight: 600, color: row.cep ? 'text.primary' : 'text.disabled' }}>
          {row.cep || 'Sin Código'}
        </Typography>
      )
    },
    {
      id: 'cliente',
      label: 'Nombre',
      minWidth: 180,
      render: row => (
        <Typography variant='body2' sx={{ fontWeight: 500 }}>
          {row.cliente || row.cus_name || 'Sin Nombre'}
        </Typography>
      )
    },
    {
      id: 'cus_business_name',
      label: 'Razón Social',
      minWidth: 180,
      render: row => (
        <Typography variant='body2'>
          {row.cus_business_name || '-'}
        </Typography>
      )
    },
    {
      id: 'cus_tax_id1',
      label: 'Rif',
      minWidth: 120,
      render: row => (
        <Typography variant='body2'>
          {row.cus_tax_id1 || 'N/A'}
        </Typography>
      )
    },
    {
      id: 'tp2_code',
      label: 'Tipo de cliente',
      minWidth: 140,
      render: row => (
        <Typography variant='body2'>
          {row.tp2_code || '-'}
        </Typography>
      )
    },
    {
      id: 'direccion',
      label: 'Dirección física',
      minWidth: 220,
      render: row => (
        <Typography variant='body2' noWrap title={row.direccion || ''} sx={{ maxWidth: 220, textOverflow: 'ellipsis', overflow: 'hidden' }}>
          {row.direccion || '-'}
        </Typography>
      )
    },
    {
      id: 'telefono',
      label: 'Teléfono',
      minWidth: 140,
      render: row => (
        <Typography variant='body2'>
          {row.cus_phone || '-'}
        </Typography>
      )
    },
    {
      id: 'zona_venta',
      label: 'Zona de venta',
      minWidth: 140,
      render: row => (
        <Typography variant='body2'>
          {row.zona_venta || '-'}
        </Typography>
      )
    },
    {
      id: 'oficina',
      label: 'Oficina',
      minWidth: 130,
      render: row => (
        <Typography variant='body2'>
          {row.oficina || '-'}
        </Typography>
      )
    },
    {
      id: 'territorio',
      label: 'Territorio',
      minWidth: 130,
      render: row => (
        <Typography variant='body2'>
          {row.territorio || '-'}
        </Typography>
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

              {/* Botón de Más Filtros */}
              <Button
                variant='outlined'
                startIcon={<Icon icon='tabler:adjustments-horizontal' />}
                onClick={() => setIsFilterModalOpen(true)}
              >
                Más Filtros
              </Button>
            </Box>
          }
        />
      </Card>

      {/* Modal de Filtros Adicionales */}
      <Dialog open={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} maxWidth='md' fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant='h6' sx={{ fontWeight: 600 }}>Más Filtros Generales</Typography>
          <IconButton onClick={() => setIsFilterModalOpen(false)}>
            <Icon icon='tabler:x' />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={4} sx={{ mt: 1, mb: 1 }}>
            {/* Clase 1 */}
            <Grid item xs={12} sm={6} md={4}>
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
            </Grid>

            {/* Clase 2 */}
            <Grid item xs={12} sm={6} md={4}>
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
            </Grid>

            {/* Clase 3 */}
            <Grid item xs={12} sm={6} md={4}>
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
            </Grid>

            {/* Código FQ */}
            <Grid item xs={12} sm={6} md={4}>
              <CustomTextField
                select
                fullWidth
                size='small'
                label='Código FQ'
                value={codigoFq}
                onChange={e => handleCodigoFqChange(e.target.value)}
                SelectProps={{ displayEmpty: true }}
              >
                <MenuItem value=''>Todos</MenuItem>
                {fqOptions.map(opt => (
                  <MenuItem key={opt.code} value={opt.code}>
                    {opt.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>

            {/* Grupo de Vendedor */}
            <Grid item xs={12} sm={6} md={4}>
              <CustomTextField
                select
                fullWidth
                size='small'
                label='Grupo de Vendedor'
                value={grupoVendedor}
                onChange={e => handleGrupoVendedorChange(e.target.value)}
                SelectProps={{ displayEmpty: true }}
              >
                <MenuItem value=''>Todos</MenuItem>
                {vgOptions.map(opt => (
                  <MenuItem key={opt.code} value={opt.code}>
                    {opt.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>

            {/* Oficina */}
            <Grid item xs={12} sm={6} md={4}>
              <CustomTextField
                select
                fullWidth
                size='small'
                label='Oficina'
                value={oficina}
                onChange={e => handleOficinaChange(e.target.value)}
                SelectProps={{ displayEmpty: true }}
              >
                <MenuItem value=''>Todas</MenuItem>
                {officeOptions.map(opt => (
                  <MenuItem key={opt.code} value={opt.code}>
                    {opt.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>

            {/* Territorio */}
            <Grid item xs={12} sm={6} md={4}>
              <CustomTextField
                select
                fullWidth
                size='small'
                label='Territorio'
                value={territorio}
                onChange={e => handleTerritorioChange(e.target.value)}
                SelectProps={{ displayEmpty: true }}
              >
                <MenuItem value=''>Todos</MenuItem>
                {territoryOptions.map(opt => (
                  <MenuItem key={opt.code} value={opt.code}>
                    {opt.name}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ pb: 5, px: 6 }}>
          <Button variant='contained' onClick={() => setIsFilterModalOpen(false)}>
            Aplicar Filtros
          </Button>
          <Button variant='tonal' color='secondary' onClick={handleResetAllFilters}>
            Limpiar Filtros
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

MasterClientsPage.acl = {
  action: 'read',
  subject: 'regions'
}

export default MasterClientsPage
