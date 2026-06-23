// ** React Imports
import { useMemo, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'


// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Types
import { 
  AvailableFilters, 
  ClientOption, 
  FamilyOption, 
  CategoryOption, 
  BrandOption, 
  SegmentOption, 
  ProductOption,
  RouteOption,
  GenericOption
} from 'src/@modules/analytics/types'

interface Props {
  selectedMonth: string
  onMonthChange: (value: string, startDate: string, endDate: string) => void
  availableFilters: AvailableFilters
  filtersLoading: boolean
  
  selectedClients: ClientOption[]
  onClientsChange: (clients: ClientOption[]) => void
  filteredClientOptions: ClientOption[]
  
  selectedFamilies: FamilyOption[]
  onFamiliesChange: (families: FamilyOption[]) => void
  selectedCategories: CategoryOption[]
  onCategoriesChange: (categories: CategoryOption[]) => void
  filteredCategoryOptions: CategoryOption[]

  selectedRoutes: RouteOption[]
  onRoutesChange: (routes: RouteOption[]) => void
  
  selectedBrands: BrandOption[]
  onBrandsChange: (brands: BrandOption[]) => void
  selectedSegments: SegmentOption[]
  onSegmentsChange: (segments: SegmentOption[]) => void
  
  selectedProducts: ProductOption[]
  onProductsChange: (products: ProductOption[]) => void
  filteredProductOptions: ProductOption[]

  selectedFqCodes?: GenericOption[]
  onFqCodesChange?: (fq: GenericOption[]) => void
  selectedVendorGroups?: GenericOption[]
  onVendorGroupsChange?: (vg: GenericOption[]) => void
  selectedOffices?: GenericOption[]
  onOfficesChange?: (offices: GenericOption[]) => void
  selectedTerritories?: GenericOption[]
  onTerritoriesChange?: (territories: GenericOption[]) => void
}

interface MonthOption {
  label: string
  value: string // format: YYYY-MM
  startDate: string
  endDate: string
}

const generateMonthOptions = (): MonthOption[] => {
  const options: MonthOption[] = []
  const now = new Date()

  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const year = date.getFullYear()
    const month = date.getMonth() // 0-indexed

    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ]

    const label = `${monthNames[month]} ${year}`
    const value = `${year}-${String(month + 1).padStart(2, '0')}`

    // Start date: first day of the month
    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`

    // End date: for current month, use today; for past months, use last day
    let endDate: string
    if (i === 0) {
      // Current month: only up to today
      const today = new Date()
      endDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    } else {
      // Past months: last day of the month
      const lastDay = new Date(year, month + 1, 0).getDate()
      endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
    }

    options.push({ label, value, startDate, endDate })
  }

  return options
}

const AnalyticsFilterHeader = ({
  selectedMonth,
  onMonthChange,
  availableFilters,
  filtersLoading,
  selectedClients,
  onClientsChange,
  filteredClientOptions,
  selectedFamilies,
  onFamiliesChange,
  selectedCategories,
  onCategoriesChange,
  filteredCategoryOptions,
  selectedRoutes,
  onRoutesChange,
  selectedBrands,
  onBrandsChange,
  selectedSegments,
  onSegmentsChange,
  selectedProducts,
  onProductsChange,
  filteredProductOptions,
  selectedFqCodes,
  onFqCodesChange,
  selectedVendorGroups,
  onVendorGroupsChange,
  selectedOffices,
  onOfficesChange,
  selectedTerritories,
  onTerritoriesChange
}: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const monthOptions = useMemo(() => generateMonthOptions(), [])

  const handleChange = (newValue: string) => {
    const selected = monthOptions.find(m => m.value === newValue)
    if (selected) {
      onMonthChange(newValue, selected.startDate, selected.endDate)
    }
  }

  return (
    <Card>
      <CardHeader 
        title='Resumen Comercial' 
        sx={{ pb: 0 }} 
        action={
          <Button
            variant='outlined'
            onClick={() => setIsOpen(true)}
            startIcon={<Icon icon='tabler:adjustments-horizontal' />}
          >
            Más Filtros
          </Button>
        }
      />
      <CardContent>
        <Grid container spacing={4} alignItems='flex-end'>
          {/* Selector de Mes */}
          <Grid item xs={12} md={3}>
            <CustomTextField
              select
              fullWidth
              value={selectedMonth}
              onChange={e => handleChange(e.target.value)}
              size='small'
              label='Mes'
              SelectProps={{ displayEmpty: true }}
            >
              {monthOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </CustomTextField>
          </Grid>

          {/* Selector de Rutas */}
          <Grid item xs={12} md={3}>
            <Autocomplete
              multiple
              size='small'
              options={availableFilters.routes || []}
              getOptionLabel={(option) => `${option.name} - ${option.db_name}`}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={selectedRoutes}
              onChange={(_, value) => onRoutesChange(value)}
              loading={filtersLoading}
              limitTags={1}
              disableCloseOnSelect
              noOptionsText='Sin opciones'
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  label='Rutas'
                  placeholder={selectedRoutes.length === 0 ? 'Todas' : ''}
                />
              )}
            />
          </Grid>

          {/* Selector de Familias */}
          <Grid item xs={12} md={3}>
            <Autocomplete
              multiple
              size='small'
              options={availableFilters.families || []}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={selectedFamilies}
              onChange={(_, value) => onFamiliesChange(value)}
              loading={filtersLoading}
              limitTags={1}
              disableCloseOnSelect
              noOptionsText='Sin opciones'
              renderInput={(params) => (
                <CustomTextField {...params} label='Familias' placeholder={selectedFamilies.length === 0 ? 'Todas' : ''} />
              )}
            />
          </Grid>

        </Grid>
      </CardContent>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} maxWidth='md' fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Más Filtros Generales</span>
          <IconButton onClick={() => setIsOpen(false)}>
            <Icon icon='tabler:x' />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={4} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple
                size='small'
                options={availableFilters.fq_codes || []}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={selectedFqCodes || []}
                onChange={(_, value) => onFqCodesChange && onFqCodesChange(value)}
                loading={filtersLoading}
                limitTags={1}
                disableCloseOnSelect
                noOptionsText='Sin opciones'
                renderInput={(params) => (
                  <CustomTextField {...params} label='Código FQ' placeholder={!selectedFqCodes?.length ? 'Todos' : ''} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple
                size='small'
                options={availableFilters.vendor_groups || []}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={selectedVendorGroups || []}
                onChange={(_, value) => onVendorGroupsChange && onVendorGroupsChange(value)}
                loading={filtersLoading}
                limitTags={1}
                disableCloseOnSelect
                noOptionsText='Sin opciones'
                renderInput={(params) => (
                  <CustomTextField {...params} label='Grupo de Vendedor' placeholder={!selectedVendorGroups?.length ? 'Todos' : ''} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple
                size='small'
                options={availableFilters.offices || []}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={selectedOffices || []}
                onChange={(_, value) => onOfficesChange && onOfficesChange(value)}
                loading={filtersLoading}
                limitTags={1}
                disableCloseOnSelect
                noOptionsText='Sin opciones'
                renderInput={(params) => (
                  <CustomTextField {...params} label='Oficina' placeholder={!selectedOffices?.length ? 'Todas' : ''} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple
                size='small'
                options={availableFilters.territories || []}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={selectedTerritories || []}
                onChange={(_, value) => onTerritoriesChange && onTerritoriesChange(value)}
                loading={filtersLoading}
                limitTags={1}
                disableCloseOnSelect
                noOptionsText='Sin opciones'
                renderInput={(params) => (
                  <CustomTextField {...params} label='Territorio' placeholder={!selectedTerritories?.length ? 'Todos' : ''} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple
                size='small'
                options={availableFilters.brands || []}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={selectedBrands}
                onChange={(_, value) => onBrandsChange(value)}
                loading={filtersLoading}
                limitTags={1}
                disableCloseOnSelect
                noOptionsText='Sin opciones'
                renderInput={(params) => (
                  <CustomTextField {...params} label='Marcas' placeholder={selectedBrands.length === 0 ? 'Todas' : ''} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple
                size='small'
                options={availableFilters.segments || []}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={selectedSegments}
                onChange={(_, value) => onSegmentsChange(value)}
                loading={filtersLoading}
                limitTags={1}
                disableCloseOnSelect
                noOptionsText='Sin opciones'
                renderInput={(params) => (
                  <CustomTextField {...params} label='Segmentos' placeholder={selectedSegments.length === 0 ? 'Todos' : ''} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple
                size='small'
                options={filteredCategoryOptions || []}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={selectedCategories}
                onChange={(_, value) => onCategoriesChange(value)}
                loading={filtersLoading}
                limitTags={1}
                disableCloseOnSelect
                noOptionsText='Sin opciones'
                renderInput={(params) => (
                  <CustomTextField {...params} label='Categorías' placeholder={selectedCategories.length === 0 ? 'Todas' : ''} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple
                size='small'
                options={filteredClientOptions}
                getOptionLabel={option => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={selectedClients}
                onChange={(_, value) => onClientsChange(value)}
                loading={filtersLoading}
                limitTags={1}
                disableCloseOnSelect
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    label='Clientes (Se requiere elegir Rutas antes)'
                    placeholder={!selectedRoutes?.length ? 'Seleccione ruta(s) primero...' : 'Todos'}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {filtersLoading ? <CircularProgress size={16} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      )
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                size='small'
                options={filteredProductOptions || []}
                getOptionLabel={(option) => `${option.name} (${option.sku})`}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={selectedProducts}
                onChange={(_, value) => onProductsChange(value)}
                loading={filtersLoading}
                limitTags={3}
                disableCloseOnSelect
                noOptionsText='Sin opciones'
                renderInput={(params) => (
                  <CustomTextField 
                    {...params} 
                    label='Productos Específicos' 
                    placeholder={selectedProducts.length === 0 ? 'Todos' : ''} 
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={() => setIsOpen(false)}>Listo</Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default AnalyticsFilterHeader
export { generateMonthOptions }
