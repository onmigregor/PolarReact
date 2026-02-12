// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

// ** Types
import { PageHeaderProps } from './types'

const PageHeader = (props: PageHeaderProps) => {
  // ** Props
  const { title, subtitle, action } = props

  return (
    <Grid item xs={12}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          {title}
          {subtitle || null}
        </Box>
        {action || null}
      </Box>
    </Grid>
  )
}

export default PageHeader
