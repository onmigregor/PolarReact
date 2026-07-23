import React from 'react'
import {
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Button,
  Box,
  SelectChangeEvent
} from '@mui/material'
import Icon from 'src/@core/components/icon'

export interface MODULE_OPTION {
  key: string
  label: string
}

export const MODULE_OPTIONS: MODULE_OPTION[] = [
  { key: 'products', label: '📦 Productos' },
  { key: 'customers', label: '👥 Clientes' },
  { key: 'companies', label: '🏢 Empresas' },
  { key: 'promotions', label: '🎟️ Promociones' },
  { key: 'discounts', label: '🏷️ Descuentos' },
  { key: 'generals', label: '⚙️ Generales' },
  { key: 'invoices', label: '📄 Facturas' },
  { key: 'products_price', label: '💲 Precios' },
  { key: 'planes_dinamicos', label: '🗺️ Planes Dinámicos' },
  { key: 'equipos_adc', label: '📡 Equipos ADC' }
]

interface ReportesCargasFiltersProps {
  selectedTypes: string[]
  startDate: string
  endDate: string
  search: string
  onTypesChange: (types: string[]) => void
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
  onSearchChange: (search: string) => void
  onReset: () => void
}

const ReportesCargasFilters: React.FC<ReportesCargasFiltersProps> = ({
  selectedTypes,
  startDate,
  endDate,
  search,
  onTypesChange,
  onStartDateChange,
  onEndDateChange,
  onSearchChange,
  onReset
}) => {
  const handleTypeSelectChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value
    onTypesChange(typeof value === 'string' ? value.split(',') : value)
  }

  return (
    <Card sx={{ mb: 6 }}>
      <CardContent>
        <Grid container spacing={4} alignItems='center'>
          {/* Multi-Select de Módulos */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size='small'>
              <InputLabel id='modules-multiselect-label'>Seleccionar Reportes / Módulos</InputLabel>
              <Select
                labelId='modules-multiselect-label'
                id='modules-multiselect'
                multiple
                value={selectedTypes}
                onChange={handleTypeSelectChange}
                label='Seleccionar Reportes / Módulos'
                renderValue={selected => {
                  if (selected.length === 0) return 'Todos los Módulos'
                  if (selected.length === MODULE_OPTIONS.length) return 'Todos los Módulos'
                  
return MODULE_OPTIONS.filter(o => selected.includes(o.key))
                    .map(o => o.label)
                    .join(', ')
                }}
              >
                {MODULE_OPTIONS.map(option => (
                  <MenuItem key={option.key} value={option.key}>
                    <Checkbox checked={selectedTypes.indexOf(option.key) > -1} />
                    <ListItemText primary={option.label} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Fecha Inicio */}
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              size='small'
              type='date'
              label='Fecha Inicio'
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={e => onStartDateChange(e.target.value)}
            />
          </Grid>

          {/* Fecha Fin */}
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              size='small'
              type='date'
              label='Fecha Fin'
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={e => onEndDateChange(e.target.value)}
            />
          </Grid>

          {/* Buscador de Nombre de Archivo */}
          <Grid item xs={12} sm={8} md={3}>
            <TextField
              fullWidth
              size='small'
              label='Buscar por Archivo'
              placeholder='Ej. Facturas_2026...'
              value={search}
              onChange={e => onSearchChange(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                    <Icon icon='tabler:search' fontSize={20} />
                  </Box>
                )
              }}
            />
          </Grid>

          {/* Botón Limpiar */}
          <Grid item xs={12} sm={4} md={1}>
            <Button fullWidth variant='tonal' color='secondary' size='medium' onClick={onReset}>
              Limpiar
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ReportesCargasFilters
