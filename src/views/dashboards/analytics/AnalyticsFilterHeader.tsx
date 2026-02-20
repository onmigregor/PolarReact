// ** React Imports
import { useMemo } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Types
import { AvailableFilters, ClientOption, RegionOption } from 'src/pages/analytics/types'

interface Props {
  selectedMonth: string
  onMonthChange: (value: string, startDate: string, endDate: string) => void
  availableFilters: AvailableFilters
  filtersLoading: boolean
  selectedRegions: RegionOption[]
  onRegionsChange: (regions: RegionOption[]) => void
  selectedClients: ClientOption[]
  onClientsChange: (clients: ClientOption[]) => void
  filteredClientOptions: ClientOption[]
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
  selectedRegions,
  onRegionsChange,
  selectedClients,
  onClientsChange,
  filteredClientOptions
}: Props) => {
  const monthOptions = useMemo(() => generateMonthOptions(), [])

  const handleChange = (newValue: string) => {
    const selected = monthOptions.find(m => m.value === newValue)
    if (selected) {
      onMonthChange(newValue, selected.startDate, selected.endDate)
    }
  }

  return (
    <Card>
      <CardHeader title='Resumen Comercial' sx={{ pb: 0 }} />
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

          {/* Selector de Regiones */}
          <Grid item xs={12} md={3}>
            <Autocomplete
              multiple
              size='small'
              options={availableFilters.regions}
              getOptionLabel={option => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={selectedRegions}
              onChange={(_, value) => onRegionsChange(value)}
              loading={filtersLoading}
              limitTags={1}
              disableCloseOnSelect
              renderInput={params => (
                <CustomTextField
                  {...params}
                  label='Regiones'
                  placeholder='Todas'
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

          {/* Selector de Clientes */}
          <Grid item xs={12} md={3}>
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
                  label='Clientes'
                  placeholder='Todos'
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
        </Grid>
      </CardContent>
    </Card>
  )
}

export default AnalyticsFilterHeader
export { generateMonthOptions }
