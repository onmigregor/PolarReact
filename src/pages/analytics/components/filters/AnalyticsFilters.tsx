// ** Analytics Filters Component — using template's DateRange picker style
import { forwardRef } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

// ** Third Party Imports
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { ClientOption, ProductOption, AvailableFilters } from '../../types'

interface AnalyticsFiltersProps {
  availableFilters: AvailableFilters
  filtersLoading: boolean
  startDate: Date | null
  endDate: Date | null
  selectedClients: ClientOption[]
  selectedProducts: ProductOption[]
  onDateRangeChange: (dates: [Date | null, Date | null]) => void
  onClientsChange: (clients: ClientOption[]) => void
  onProductsChange: (products: ProductOption[]) => void
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
  selectedClients,
  selectedProducts,
  onDateRangeChange,
  onClientsChange,
  onProductsChange,
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
        sx={{ minWidth: 250 }}
      />
    )
  })

  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant='subtitle2' sx={{ mb: 3, color: 'text.secondary' }}>
          Filtros de Reporte
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            alignItems: 'center'
          }}
        >
          {/* Date Range Picker — template style with 2 months */}
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

          {/* Client Multi-Select */}
          <Autocomplete
            multiple
            size='small'
            options={availableFilters.clients}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={selectedClients}
            onChange={(_, value) => onClientsChange(value)}
            loading={filtersLoading}
            limitTags={2}
            disableCloseOnSelect
            noOptionsText='Sin opciones'
            loadingText='Cargando...'
            renderInput={(params) => (
              <CustomTextField
                {...params}
                label='Clientes'
                placeholder={selectedClients.length === 0 ? 'Todos' : ''}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {filtersLoading ? <CircularProgress size={18} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  )
                }}
              />
            )}
            sx={{ minWidth: 250, flex: 1 }}
          />

          {/* Product Multi-Select */}
          <Autocomplete
            multiple
            size='small'
            options={availableFilters.products}
            getOptionLabel={(option) => `${option.name} (${option.sku})`}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={selectedProducts}
            onChange={(_, value) => onProductsChange(value)}
            loading={filtersLoading}
            limitTags={2}
            disableCloseOnSelect
            noOptionsText='Sin opciones'
            loadingText='Cargando...'
            renderInput={(params) => (
              <CustomTextField
                {...params}
                label='Productos'
                placeholder={selectedProducts.length === 0 ? 'Todos' : ''}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {filtersLoading ? <CircularProgress size={18} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  )
                }}
              />
            )}
            sx={{ minWidth: 250, flex: 1 }}
          />

          {/* Apply Button */}
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
      </CardContent>
    </Card>
  )
}

export default AnalyticsFilters
