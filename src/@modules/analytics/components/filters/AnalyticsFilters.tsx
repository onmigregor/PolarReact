// ** Analytics Filters Component
import { forwardRef } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'

// ** Third Party Imports
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { 
  ClientOption, 
  ProductOption, 
  FamilyOption,
  CategoryOption,
  BrandOption,
  SegmentOption,
  AvailableFilters 
} from '../../types'

interface AnalyticsFiltersProps {
  availableFilters: AvailableFilters
  filtersLoading: boolean
  startDate: Date | null
  endDate: Date | null
  onDateRangeChange: (dates: [Date | null, Date | null]) => void
  
  selectedClients: ClientOption[]
  onClientsChange: (clients: ClientOption[]) => void

  selectedRoutes: string[]
  onRoutesChange: (routes: string[]) => void

  selectedFamilies: FamilyOption[]
  onFamiliesChange: (families: FamilyOption[]) => void
  selectedCategories: CategoryOption[]
  onCategoriesChange: (categories: CategoryOption[]) => void
  filteredCategoryOptions: CategoryOption[]
  
  selectedBrands: BrandOption[]
  onBrandsChange: (brands: BrandOption[]) => void
  selectedSegments: SegmentOption[]
  onSegmentsChange: (segments: SegmentOption[]) => void
  
  selectedProducts: ProductOption[]
  onProductsChange: (products: ProductOption[]) => void
  filteredProductOptions: ProductOption[]
  
  onApplyFilters: () => void
  loading: boolean
}

interface PickerProps {
  label?: string
  end: Date | number | null
  start: Date | number | null
}

const AnalyticsFilters = ({
  availableFilters,
  filtersLoading,
  startDate,
  endDate,
  onDateRangeChange,
  selectedClients,
  onClientsChange,

  selectedRoutes,
  onRoutesChange,
  selectedFamilies,
  onFamiliesChange,
  selectedCategories,
  onCategoriesChange,
  filteredCategoryOptions,
  selectedBrands,
  onBrandsChange,
  selectedSegments,
  onSegmentsChange,
  selectedProducts,
  onProductsChange,
  filteredProductOptions,
  onApplyFilters,
  loading
}: AnalyticsFiltersProps) => {
  // Custom input matching template's PickersRange.tsx style
  const CustomInput = forwardRef((props: PickerProps, ref) => {
    const startFormatted = props.start ? format(props.start, 'dd/MM/yyyy') : ''
    const endFormatted = props.end ? ` - ${format(props.end, 'dd/MM/yyyy')}` : ''
    const value = `${startFormatted}${endFormatted}`

    return (
      <CustomTextField
        inputRef={ref}
        label={props.label || ''}
        {...props}
        value={value}
        sx={{ width: '100%' }}
      />
    )
  })



  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant='subtitle2' sx={{ color: 'text.secondary', fontWeight: 600 }}>
            Filtros Generales
          </Typography>
          <Button
            variant='contained'
            onClick={onApplyFilters}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color='inherit' /> : <Icon icon='tabler:search' />}
            sx={{ minWidth: 140, height: 40 }}
          >
            {loading ? 'Cargando...' : 'Consultar'}
          </Button>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <DatePicker
              selectsRange
              monthsShown={2}
              endDate={endDate}
              selected={startDate}
              startDate={startDate}
              shouldCloseOnSelect={false}
              id='analytics-date-range'
              onChange={(dates: any) => onDateRangeChange(dates)}
              customInput={
                <CustomInput
                  label='Rango de Fechas'
                  start={startDate as Date | number}
                  end={endDate as Date | number}
                />
              }
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Autocomplete
              multiple
              size='small'
              options={availableFilters.clients || []}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={selectedClients}
              onChange={(_, value) => onClientsChange(value)}
              loading={filtersLoading}
              limitTags={1}
              disableCloseOnSelect
              noOptionsText='Sin opciones'
              loadingText='Cargando...'
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  label='Clientes'
                  placeholder={selectedClients.length === 0 ? 'Todos' : ''}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
             {/* Note: if backend provides distinct routes, we could use that. For now we accept free input or basic routes */}
            <Autocomplete
              multiple
              freeSolo
              size='small'
              options={[]}
              value={selectedRoutes}
              onChange={(_, value) => onRoutesChange(value as string[])}
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  label='Rutas (ej. R-001)'
                  placeholder={selectedRoutes.length === 0 ? 'Todas' : ''}
                />
              )}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Icon icon='tabler:filter' />
            <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>Filtros Avanzados (Productos)</Typography>
          </Box>
          <Grid container spacing={4}>
                <Grid item xs={12} sm={6} md={3}>
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

                <Grid item xs={12} sm={6} md={3}>
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

                <Grid item xs={12} sm={6} md={3}>
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

                <Grid item xs={12} sm={6} md={3}>
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

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
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
                        helperText='Seleccione productos individuales (opcional, los productos se filtran automáticamente por los filtros superiores)'
                      />
                    )}
                  />
                </Grid>
              </Grid>
        </Box>
      </CardContent>
    </Card>
  )
}

export default AnalyticsFilters
