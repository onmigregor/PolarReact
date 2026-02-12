// ** React Imports
import { useMemo } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box' // Box component
import Card from '@mui/material/Card' // Card component
import CardHeader from '@mui/material/CardHeader' // CardHeader component
import MenuItem from '@mui/material/MenuItem'    // MenuItem component

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

interface Props {
  selectedMonth: string
  onMonthChange: (value: string, startDate: string, endDate: string) => void
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

const AnalyticsFilterHeader = ({ selectedMonth, onMonthChange }: Props) => {
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
        action={
          <Box sx={{ width: { xs: '100%', md: 300 }, flexShrink: 0 }}>
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
          </Box>
        }
      />
    </Card>
  )
}

export default AnalyticsFilterHeader
export { generateMonthOptions }
